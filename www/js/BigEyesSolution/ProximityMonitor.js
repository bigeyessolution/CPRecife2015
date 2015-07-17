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
 * with Campus Party - Recife 2015 App.
 * If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @author Laudivan Freire de Almeida <laudivan@bigeyessolution.com>
 * @type ProximityMonitor
 */
var ProximityMonitor = {
    delegate: false,
    beaconsList: [], // [uuid][major][minor] = data
    beaconRegions: [],
    beaconMonitoring: false,
    beaconRanging: false,
    init: function (data) {
        
        this.delegate = new cordova.plugins.locationManager.Delegate ();
        
        this.delegate.didDetermineStateForRegion = this.didDetermineStateForRegion;
        this.delegate.didStartMonitoringForRegion = this.didStartMonitoringForRegion;
        this.delegate.didRangeBeaconsInRegion = this.digRangeBeaconsInRegion;
        
        if (data) {
            this.setBeaconsList(data);
            
            this.startRangingMonitoring();
        }
    },
    setBeaconsList: function (data) {
        this.beaconsList = data;
    },
    setRegions: function () {
        
    },
    clearBeacons: function () {
        
    },
    didDetermineStateForRegion: function (result) {
        console.log("didDetermineStateForRegion:" + JSON.stringify(result));
    },
    didStartMonitoringForRegion: function (result) {
        console.log("didStartMonitoringForRegion:" + JSON.stringify(result));
    },
    digRangeBeaconsInRegion: function (result) {
        console.log("digRangeBeaconsInRegion:" + JSON.stringify(result));
    },
    didEnterRegion: function (result) {
        console.log("didEnterRegion:" + JSON.stringify(result));
    },
    didExitRegion: function (result) {
        console.log("didExitRegion:" + JSON.stringify(result));
    },
    startRangingMonitoring: function () {
        var flagCanStart = false;
        
        if (device.platform == 'Android') {
            cordova.plugins.locationManager.isBluetoothEnabled()
            .then(function(isEnabled){
                if (!isEnabled) {
                    cordova.plugins.locationManager.enableBluetooth();        
                }
            }).fail(console.error).done(function(){ 
                flagCanStart = cordova.plugins.locationManager.isBluetoothEnabled();
            });
        } else if (device.platform == 'iOS') {
            flagCanStart = cordova.plugins.locationManager.requestAlwaysAuthorization();
        }
        
        this.beaconRegions = [];
        
        for (index in this.beaconsList) {
            var beacon = this.beaconsList[index];
            
            var region = new cordova.plugins.locationManager.BeaconRegion(
                beacon.id, beacon.uuid, beacon.major, beacon.minor
            );
            
            this.beaconRegions.push(region);
            
            cordova.plugins.locationManager.startMonitoringForRegion(region);
            cordova.plugins.locationManager.startRangingBeaconsInRegion(region);
        }
        
        this.beaconMonitoring = true;
    },
    stopRangingMonitoring: function () {
        for (index in this.beaconRegions) {
            var region = this.beaconRegions[index];
            
            cordova.plugins.locationManager.stopMonitoringForRegion(region).fail(console.error).done();
            cordova.plugins.locationManager.stopRangingBeaconsInRegion(region).fail(console.error).done();
        }
        
        this.beaconRegions = [];
        this.beaconMonitoring = false;
    }
}