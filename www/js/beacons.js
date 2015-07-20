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

function didRangeBeacons (result) {
    if (result.beacons.length == 0) { return; }
    
    var beacon = nearestBeacon(result.beacons);
    
    if (beacon === false) { return; }
    
    if (isSameBeacon(lastNearestBeacon, beacon)) { return; }
    
    lastNearestBeacon = beacon;
    
    var place = findCampusPartyPlace (beacon);
    
    console.log('Place: ' + JSON.stringify( place ));
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
            
            //report the device's place
//            if (urlToSendBeaconsInfo) {
//                $.post(urlToSendBeaconsInfo, placeBeacon);
//            }
            
//            if (lastPlacesIds.indexOf(placeBeacon.place_id) > -1) { continue; }
//            
//            lastPlacesIds.push(placeBeacon.place_id);
//            
//            if (placeBeacon.place_type == 'stage') {                
//                var schedule = getStageInfo(placeBeacon.stage_slug);
//                
//                addBeaconNotification(schedule);
//                
//                navigator.notification.alert(
//                    'Olha só o que esttá rolando neste palco: ' + schedule.title, 
//                    function(){}, 'Ei você!', 'OK'
//                );
//            }
            
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

function getStageInfo (stageName) {
    var time = (new Data).getTime();
    
    for (var index = dataSchedule.length; index >=0; index --) {
        var date = new Date (dataSchedule[index].date);
        
        //Percorrendo de trás para frente. O primeiro >= é o evento ocorrendo.
        if (time >= date.getTime()) {
            return dataSchedule[index].date;
        }
    }
    
    return false;
}

function isSameBeacon (beacon1, beacon2) {
    if (typeof beacon1 == 'boolean' || typeof beacon2 == 'boolean') { return false; }
    
    return beacon1.uuid === beacon2.uuid 
        && beacon1.major === beacon2.major 
        && beacon1.minor === beacon2.minor;
}