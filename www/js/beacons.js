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
var lastPlaceId = '';
var region = false;

function beaconsInit() {
    
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
        startMonitoring ();
        startRanging ();
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
    console.log('Beacons: ' + JSON.stringify(result.beacons));
    
}

function didDetermineState (result) {
    console.log('Monitoring state:' + JSON.stringify(result));
}
/**
 * @param beacons {array} [{ major, minor }, { major, minor }, ...]
 */
function findCampusPartyPlace (beacon) {
    for (var index in beaconsList) {
        var placeBeacon = beaconsList[index];
        
        if (placeBeacon.major == beacon.major &&
            placeBeacon.minor == beacon.minor) {
            
            if (placeBeacon.place_id == lastPlaceId) return;
            
            lastPlaceId = placeBeacon.place_id;
            
            console.log("Você está aqui: " + JSON.stringify(placeBeacon));
            
            if (placeBeacon.place_type == 'stage') {                
                var schedule = getStageInfo(placeBeacon.stage_slug);
                
                addBeaconNotification(schedule);
                
                navigator.notification.alert(
                    'Tá rolando uma palestra massa aqui: ' + schedule.title, 
                    function(){}, 
                    'Ei você!', 'OK');
            }
            
            //gaPlugin
            
            if (urlToSendBeaconsInfo) {
                $.post(urlToSendBeaconsInfo, placeBeacon);
            }
        }
    }
}

function nearestBeacon (beacons) {
    
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