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

/*
 * see http://evothings.com/hands-on-guide-to-building-a-native-javascript-ibeacon-app-using-cordova/
 */

var delefate = false;
var beaconsList = false;
var beaconsRegions = false;
var urlToSendBeaconsInfo = false;

function beaconsInit() {
    $.getJSON('https://s3.amazonaws.com/cdn.campuse.ro/cprecife.beacon.json', function (data) {
        urlToSendBeaconsInfo = data.info_to_url != '' ? data.info_to_url : false;

        beaconsList = data.beacons;

        window.localStorage.setItem('beaconsList', JSON.stringify(data));
    }).fail(function () {
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
    }).done(startMonitor);
}

function startMonitor() {
    if (beaconsList === false)
        return;

    beaconsRegions = [];

    for (index in beaconsList) {
        var beacon = beaconsList[index];

        var region = new ibeacon.Region( {
            uuid: beacon.uuid,
            major: beacon.major,
            minor: beacon.minor,
            didRangeBeacons: digRangeBeaconsInRegion
        });

        beaconsRegions.push(region);
        
    }
    
    ibeacon.startRangingBeaconsInRegion(beaconsRegions);
    
    $('#beaconlog').append(JSON.stringify(beaconsRegions));
}

function stopMonitor() {
    for (index in beaconsRegions) {
        var region = beaconsRegions[index];

        
    }

    beaconsRegions = false;
}

function didDetermineStateForRegion(result) {
    $('#beaconlog').append("didDetermineStateForRegion:" + JSON.stringify(result.beacons) + '<br>');

}

function didStartMonitoringForRegion(result) {
    $('#beaconlog').append("didStartMonitoringForRegion:" + JSON.stringify(result) + '<br>');
}
function digRangeBeaconsInRegion(result) {
    $('#beaconlog').append("digRangeBeaconsInRegion:" + JSON.stringify(result.beacons) + '<br>');
    console.log(JSON.stringify(region.beacons))
    //updateNearestBeacon(result.beacons);
}

function errorCallBack(error) {
    $('#beaconlog').append(error + '<br>');
}

function getBeaconId(beacon) {
    return beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
}

function isSameBeacon(beacon1, beacon2) {
    return getBeaconId(beacon1) == getBeaconId(beacon2);
}

function saveRegionEvent(eventType, regionId) {
    // Save event.
    mRegionEvents.push({
        type: eventType,
        time: getTimeNow(),
        regionId: regionId
    });
    
    // Truncate if more than ten entries.
    if (mRegionEvents.length > 10) {
        mRegionEvents.shift();
    }
}

function isBeaconNearerThan(beacon1, beacon2) {
    return beacon1.accuracy > 0 && beacon2.accuracy > 0 && beacon1.accuracy < beacon2.accuracy;
}

function updateNearestBeacon(beacons) {
    for (var i = 0; i < beacons.length; ++i) {
        var beacon = beacons[i];

        if (!mNearestBeacon) {
            mNearestBeacon = beacon;
        } else if (isSameBeacon(beacon, mNearestBeacon) ||
                isNearerThan(beacon, mNearestBeacon)) {
            mNearestBeacon = beacon;
        }
    }
}

function displayNearestBeacon() {
    if (!mNearestBeacon) {
        return;
    }

    // Clear element.
    $('#beaconlog').empty();

    // Update element.
    var element = $(
            '<li>'
            + '<strong>Nearest Beacon</strong><br />'
            + 'UUID: ' + mNearestBeacon.uuid + '<br />'
            + 'Major: ' + mNearestBeacon.major + '<br />'
            + 'Minor: ' + mNearestBeacon.minor + '<br />'
            + 'Proximity: ' + mNearestBeacon.proximity + '<br />'
            + 'Distance: ' + mNearestBeacon.accuracy + '<br />'
            + 'RSSI: ' + mNearestBeacon.rssi + '<br />'
            + '</li>'
            );

    $('#beaconlog').append(element);
}

function displayRecentRegionEvent() {
    if (isAppInBackground) {
        // Set notification title.
        var event = mRegionEvents[mRegionEvents.length - 1];
        
        if (!event) {
            return;
        }
        var title = getEventDisplayString(event);

        // Create notification.
        cordova.plugins.notification.local.schedule({
            id: ++mNotificationId,
            title: title});
    } else {
        displayRegionEvents();
    }
}

function displayRegionEvents() {
    // Clear list.
    $('#beaconlog').empty();

    // Update list.
    for (var i = mRegionEvents.length - 1; i >= 0; --i) {
        var event = mRegionEvents[i];
        var title = getEventDisplayString(event);
        var element = $(
            '<li>'
            + '<strong>' + title + '</strong>'
            + '</li>'
        );

        $('#beaconlog').append(element);
    }

    // If the list is empty display a help text.
    if (mRegionEvents.length <= 0) {
        var element = $(
            '<li>'
            + '<strong>'
            + 'Waiting for region events, please move into or out of a beacon region.'
            + '</strong>'
            + '</li>'
        );

        $('#events').append(element);
    }
}

function getEventDisplayString(event) {
    return event.time + ': '
        + mRegionStateNames[event.type] + ' '
        + mRegionData[event.regionId];
}

function getTimeNow() {
    function pad(n) {
        return (n < 10) ? '0' + n : n;
    }

    function format(h, m, s) {
        return pad(h) + ':' + pad(m) + ':' + pad(s);
    }

    var d = new Date();
    return format(d.getHours(), d.getMinutes(), d.getSeconds());
}

function startNearestBeaconDisplayTimer() {
        mNearestBeaconDisplayTimer = setInterval(displayNearestBeacon, 1000);
}

function stopNearestBeaconDisplayTimer() {
        clearInterval(mNearestBeaconDisplayTimer);
        mNearestBeaconDisplayTimer = null;
}