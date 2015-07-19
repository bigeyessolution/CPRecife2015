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

var delefate = false;
var beaconsList = false;
var beaconsRegions = false;
var urlToSendBeaconsInfo = false;

function beaconsInit () {
    var flagCanStart = false;
    $('#beaconlog').append(typeof cordova.plugins);
    
//    delegate = new cordova.plugins.locationManager.Delegate ();    
//    delegate.didDetermineStateForRegion = didDetermineStateForRegion;
//    delegate.didStartMonitoringForRegion = didStartMonitoringForRegion;
//    delegate.didRangeBeaconsInRegion = digRangeBeaconsInRegion;
    
//    if (device.platform == 'Android') {
//        cordova.plugins.locationManager.isBluetoothEnabled()
//        .then(function(isEnabled){
//            if (!isEnabled) {
//                cordova.plugins.locationManager.enableBluetooth();        
//            }
//        }).fail(console.error).done(function(){ 
//            flagCanStart = cordova.plugins.locationManager.isBluetoothEnabled();
//        });
//    } else if (device.platform == 'iOS') {
//        flagCanStart = cordova.plugins.locationManager.requestAlwaysAuthorization();
//    }
//    
//    $('#beaconlog').append("Baixando os beacons");
    
//    $.getJSON('https://s3.amazonaws.com/cdn.campuse.ro/cprecife.beacon.json', populateBeaconsList)
//    .fail(function () {
//        var tmpData = window.localStorage.getItem('beaconsList');
//
//        tmpData = tmpData ? JSON.parse(tmpData) : false;
//        
//        if (tmpData === false) {
//            beaconsList = false;
//            urlToSendBeaconsInfo = false;
//            
//            return;
//        }
//        
//        for (index in tmpData.beacons) {
//            tmpData.beacons[index].major = parseInt(tmpData.beacons[index].major);
//            tmpData.beacons[index].minor = parseInt(tmpData.beacons[index].minor);
//        }
//        
//        populateBeaconsList(tmpData);
//    }).done(startMonitor);
}

function populateBeaconsList (data) {
    urlToSendBeaconsInfo = data.info_to_url != '' ? data.info_to_url : false;
    
    beaconsList = data.beacons;
    
    window.localStorage.setItem('beaconsList', JSON.stringify(data));
}

function startMonitor () {
    if (beaconsList === false) return;
    
    beaconsRegions = [];
    
    for (index in beaconsList) {
        var beacon = beaconsList[index];

        var region = new cordova.plugins.locationManager.BeaconRegion(
            beacon.id, beacon.uuid, beacon.major, beacon.minor
        );

        beaconsRegions.push(region);

        cordova.plugins.locationManager.startMonitoringForRegion(region);
        cordova.plugins.locationManager.startRangingBeaconsInRegion(region);
    }
}

function stopMonitor () {
    for (index in beaconsRegions) {
        var region = beaconsRegions[index];

        cordova.plugins.locationManager.stopMonitoringForRegion(region).fail(console.error).done();
        cordova.plugins.locationManager.stopRangingBeaconsInRegion(region).fail(console.error).done();
    }

    beaconsRegions = false;
}

function didDetermineStateForRegion (result) {
    $('#beaconlog').append("didDetermineStateForRegion:" + JSON.stringify(result) + '<br>');
}

function didStartMonitoringForRegion (result) {
    $('#beaconlog').append("didStartMonitoringForRegion:" + JSON.stringify(result) + '<br>');
}
function digRangeBeaconsInRegion (result) {
    $('#beaconlog').append("digRangeBeaconsInRegion:" + JSON.stringify(result) + '<br>');
}

function didEnterRegion (result) {
    $('#beaconlog').append("didEnterRegion:" + JSON.stringify(result) + '<br>');
}

function didExitRegion (result) {
    $('#beaconlog').append("didExitRegion:" + JSON.stringify(result) + '<br>');
}