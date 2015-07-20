/*
 * This file is part of Campus Party - Recife 2015 App.
 * Campus Party - Recife 2015 App is free software: you can redistribute it 
 * and/or modify it under the terms of the GNU General Public License as 
 * published by the Free Software Foundation, either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * Campus Party - Recife 2015 App is distributed in the hope that it will be 
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General 
 * Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along 
 * with Campus Party Recife 2015 App.
 * If not, see <http://www.gnu.org/licenses/>.
 */

//var delefate = false;
var beaconsList = false;
var urlToSendBeaconsInfo = false;
var lastPlacesIds = [];
var lastRegionState = '';
var regionStateIsChanged = false;
var region = false;
var lastNearestBeacon = false;

function beaconsInit() {
    ibeacon.identifier = device.platform + ':' + device.uuid;
    region = new ibeacon.Region( { uuid: '20CAE8A0-A9CF-11E3-A5E2-0800200C9A66' } );
    
    cordova.plugins.notification.local.on("click", function (notification) {
        $(':mobile-pagecontainer').pagecontainer("change", "#page-beacon");
    });
        
    startMonitoring ();
    startRanging ();
    
    $.getJSON('https://s3.amazonaws.com/cdn.campuse.ro/cprecife.beacon.json', function (data) {
        urlToSendBeaconsInfo = data.info_to_url != '' ? data.info_to_url : false;

        beaconsList = data.beacons;
        
        window.localStorage.setItem('beaconsList', JSON.stringify(data));
    }).fail(function() {
        var tmpData = window.localStorage.getItem('beaconsList');

        tmpData = tmpData ? JSON.parse(tmpData) : false;

        if (tmpData === false) {
            beaconsList = false;
            urlToSendBeaconsInfo = false;

            return;
        }

        for (index in tmpData.beacons) {
            tmpData.beacons[index].major = parseInt(tmpData.beacons[index].major);
            tmpData.beacons[index].minor = parseInt(tmpData.beacons[index].minor);
        }

        urlToSendBeaconsInfo = tmpData.info_to_url != '' ? tmpData.info_to_url : false;
        beaconsList = data.beacons;
    }).done(function () {
        
    });
}

function startMonitoring () {
    ibeacon.startMonitoringForRegion({ region: region, didDetermineState: didDetermineState });
}

function stopMonitoring () {
    ibeacon.stopMonitoringForRegion({ region: region });
}

function startRanging () {
    ibeacon.startRangingBeaconsInRegion({ region: region, didRangeBeacons: didRangeBeacons });
}

function stopRanging () {
    ibeacon.stopRangingBeaconsInRegion({ region: region });
}

var _lastPostPosTime = 0;
var _intervalToPostPos = 600000; //10 minutes

function didRangeBeacons (result) {
    if (result.beacons.length == 0) { return; }
    
    var beacon = nearestBeacon(result.beacons);
    
    if (beacon === false) { return; }
    
//    if (isSameBeacon(lastNearestBeacon, beacon)) { return; }
//    lastNearestBeacon = beacon;
    
    var place = findCampusPartyPlace (beacon);
    
    /* Reporting device's place*/
    if (urlToSendBeaconsInfo) { 
        var time = (new Date()).getTime();
        
        if (time - _lastPostPosTime > _intervalToPostPos) {
            _lastPostPosTime = time;
            
            $.post(urlToSendBeaconsInfo, place);
        }
    }
    
    if (place.place_type == 'stage') {
        function _addNotification () {
            var schedule = getStageInfo(place.stage_slug);
            
            if (schedule === false) { return; }
            
            if (addBeaconNotification(schedule)) {
                alertInBeaconPlace(schedule);
                
                if (isAppInBackground === false) {
                    populateBeaconsNotificationList ();
                }
            };
        }
        
        updateScheduleData(_addNotification);
    }
}

function addBeaconNotification (schedule) {
    schedule_id = parseInt(schedule.id);
    if (_listviewNotificationsId.indexOf(schedule_id) > -1) return false;
    
    _listviewNotifications.unshift(schedule);
    _listviewNotificationsId.unshift(schedule_id);
    
    if(_listviewNotifications.length > 3) {
        _listviewNotifications.pop();
    }
    
    return true;
}

function alertInBeaconPlace (schedule) {
    var title = 'Olha só o quê está rolando!';
    var text = 'Ei campusero! Está rolando uma palestra muito interessante no ' + 
        schedule.stage_name + ': ' + schedule.title;
    
    navigator.notification.alert(text, function(){}, title, 'OK');
    
    navigator.vibrate([300, 700, 1000]);
    
    cordova.plugins.notification.local.schedule({
        id: schedule.id,
        title: title,
        text: text
    });
}

function didDetermineState (result) {
    if (result.state !== lastRegionState) {
        lastRegionState = result.state;
        regionStateIsChanged = true;
    } else {
        regionStateIsChanged = false;
    }
}

/**
 * @param beacons {array} [{ major, minor }, { major, minor }, ...]
 */
function findCampusPartyPlace (beacon) {
    for (var index in beaconsList) {
        var placeBeacon = beaconsList[index];
        
        if (placeBeacon.uuid.toLowerCase() == beacon.uuid.toLowerCase() && 
            placeBeacon.major == beacon.major &&
            placeBeacon.minor == beacon.minor) {
            
            return placeBeacon;
        }
    }
    
    return false;
}

function nearestBeacon (beacons) {
    var nBeacon = false;
    var lastProximity = 'far';
    
    for (var index in beacons) {
        var beacon = beacons[index];
        
        if (beacon.proximity == 'far') continue;
        
        if (lastProximity == 'immediate' && beacon.proximity == 'near') continue;
        
        if (nBeacon === false) {
            nBeacon = beacon;
            lastProximity = beacon.proximity;
        } else if ( lastProximity == 'near' && beacon.proximity == 'immediate' ) {
            nBeacon = beacon;
            lastProximity = beacon.proximity;
        } else if (beacon.rssi > 0 && beacon.rssi < nBeacon.rssi) {//both proximity are equals
            nBeacon = beacon;
            lastProximity = beacon.proximity;
        }
    }
    
    return nBeacon;
}

function getStageInfo (stage_slug) {
    var time = (new Date).getTime();
    
    for (var index = scheduleData.length - 1; index >=0; index --) {
        if (scheduleData[index].stage_slug !== stage_slug) { continue; }
        
        var date = getDateFromStage (scheduleData[index].date);
        
        if (time >= date) {
            var max_talk_time = 3600000; // 1 hour
            var time_diff = date + max_talk_time;
                
            return time > time_diff ? false : scheduleData[index];
        }
    }
    
    return false;
}

function getDateFromStage (date_string) {
    var aux = date_string.split(' ');
    var date = aux[0].split('-');
    var clock = aux[1].split(':');
    var dateObj = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]), parseInt(clock[0]), parseInt(clock[1]), 0, 0);
    
    return dateObj.getTime();
}

function isSameBeacon (beacon1, beacon2) {
    if (typeof beacon1 == 'boolean' || typeof beacon2 == 'boolean') { return false; }
    
    return beacon1.uuid.toLowerCase() === beacon2.uuid.toLowerCase()
        && beacon1.major === beacon2.major 
        && beacon1.minor === beacon2.minor;
}