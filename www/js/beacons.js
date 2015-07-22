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

var beaconsList = [
    { place_id: "PalcoTerraCPRec4", description: "Palco Terra", place_type: "stage", stage_slug : "PalcoTerraCPRec4", major: 125, minor: 17304 },
    { place_id: "PalcoTerraCPRec4", description: "Palco Terra", place_type: "stage", stage_slug : "PalcoTerraCPRec4", major: 125, minor: 18106 },
    { place_id: "PalcoLuaCPRec4", description: "Palco Lua", place_type: "stage", stage_slug : "PalcoLuaCPRec4", major: 125, minor: 15446 },
    { place_id: "PalcoMarteCPRec4", description: "Palco Marte", place_type: "stage", stage_slug : "PalcoMarteCPRec4", major: 125, minor: 15890 },
    { place_id: "PalcoJupiterCPRecife", description: "Palco Jupiter", place_type: "stage", stage_slug : "PalcoJupiterCPRecife", major: 125, minor: 19059 },
    { place_id: "PalcoSaturnoCPRec4", description: "Placo Saturno", place_type: "stage", stage_slug : "PalcoSaturnoCPRec4", major: 125, minor: 19035 },
    { place_id: "PalcoVenusCPRec4", description: "Palco Venus", place_type: "stage", stage_slug : "PalcoVenusCPRec4", major: 125, minor: 15362 },
    { place_id: "Workshop1CienciaCPRecife4", description: "Workshop I Ciência", place_type: "stage", stage_slug : "Workshop1CienciaCPRecife4", major: 125, minor: 18569 },
    { place_id: "Workshop2inovacaoCPRecife4", description: "Workshop II Inovaçãoo", place_type: "stage", stage_slug : "Workshop2inovacaoCPRecife4", major: 125, minor: 17400 },
    { place_id: "freeplay", description: "FreePlay", place_type: "other", stage_slug : "", major: 125, minor: 15976 },
    { place_id: "chillout27", description: "Chillout 27", place_type: "other", stage_slug : "", major: 125, minor: 16357 },
    { place_id: "chillout28", description: "Chillout 28", place_type: "other", stage_slug : "", major: 125, minor: 18063 },
    { place_id: "postomedico", description: "Posto Médico", place_type: "saude", stage_slug : "", major: 125, minor: 2631 },
    { place_id: "arenasebrae", description: "Arena SEBRAE", place_type: "arena", stage_slug : "", major: 125, minor: 16257 },
    { place_id: "arenanassau", description: "Arena Nassau", place_type: "arena", stage_slug : "", major: 125, minor: 17332 },
    { place_id: "3coracoes", description: "3 Corações", place_type: "stand", stage_slug : "", major: 213, minor: 13048 },
    { place_id: "vivo", description: "VIVO", place_type: "stand", stage_slug : "", major: 213, minor: 964 },
    { place_id: "acessopublicodireito", description: "Acesso público da direita", place_type: "acesso", stage_slug : "", major: 213, minor: 2032 },
    { place_id: "acessopublicoesquerdo", description: "Acesso público da esquerda", place_type: "acesso", stage_slug : "", major: 213, minor: 603 },
    { place_id: "chillout29", description: "Chillout 29", place_type: "other", stage_slug : "", major: 213, minor: 1954 },
    { place_id: "chillout30", description: "Chillout 30", place_type: "other", stage_slug : "", major: 213, minor: 2364 },
    { place_id: "ovni1", description: "OVNI 1", place_type: "ovni", stage_slug : "", major: 213, minor: 11672 },
    { place_id: "ovni2", description: "OVNI 2", place_type: "ovni", stage_slug : "", major: 213, minor: 1944 },
    { place_id: "ovni3", description: "OVNI 3", place_type: "ovni", stage_slug : "", major: 213, minor: 959 },
    { place_id: "ovni4", description: "OVNI 4", place_type: "ovni", stage_slug : "", major: 213, minor: 558 },
    { place_id: "camping1", description: "Saída do Camping", place_type: "camping", stage_slug : "", major: 213, minor: 1005 },
    { place_id: "camping2", description: "Entrada do Camping", place_type: "camping", stage_slug : "", major: 213, minor: 1984 },
    { place_id: "nicbr", description: "NIC.br", place_type: "stand", stage_slug : "", major: 213, minor: 13006 },
    { place_id: "transrecife", description: "Transforma Recife", place_type: "stand", stage_slug : "", major: 213, minor: 1972 },
    { place_id: "catering1", description: "Pegatinas Catering", place_type: "catering", stage_slug : "", major: 213, minor: 65397 },
    { place_id: "catering2", description: "Acesso Catering", place_type: "catering", stage_slug : "", major: 213, minor: 597 },
    { place_id: "chillout31", description: "Chillout 31", place_type: "other", stage_slug : "", major: 213, minor: 988 },
    { place_id: "imprensa1", description: "Pegatinas imprensa", place_type: "imprensa", stage_slug : "", major: 213, minor: 1753 },
    { place_id: "imprensa2", description: "Sala de imprensa", place_type: "imprensa", stage_slug : "", major: 213, minor: 1965 },
    { place_id: "chuveiros1", description: "Acesso chuveiros", place_type: "other", stage_slug : "", major: 213, minor: 2355 },
    { place_id: "InclusaoDigitalIICPRecife4", description: "Inclusão Digital II", place_type: "stage", stage_slug : "InclusaoDigitalIICPRecife4", major: 7, minor: 45002 },
    { place_id: "vip", description: "Área VIP", place_type: "other", stage_slug : "", major: 125, minor: 16980 },
    { place_id: "InclusaoDigitalICPRecife4", description: "Inclusão Digital I", place_type: "stage", stage_slug : "InclusaoDigitalICPRecife4", major: 7, minor: 44333 },
    { place_id: "mezanino", description: "Entrada para o mezanino", place_type: "other", stage_slug : "", major: 7, minor: 44659 },
    { place_id: "PalcoStartupMakersCampCPRecife4", description: "Palco Startup&Makers", place_type: "stage", stage_slug : "PalcoStartupMakersCampCPRecife4", major: 125, minor: 17580 },
    { place_id: "startups", description: "Startups", place_type: "startups", stage_slug : "", major: 125, minor: 18617 },
    { place_id: "sebraeopen", description: "SEBRAE Open", place_type: "other", stage_slug : "", major: 125, minor: 19336 },
    { place_id: "cbn", description: "CBN", place_type: "stand", stage_slug : "", major: 125, minor: 14303 },
    { place_id: "exgeek", description: "Exposição Geek", place_type: "expo", stage_slug : "", major: 125, minor: 18966 },
    { place_id: "cesar", description: "CESAR", place_type: "stand", stage_slug : "", major: 125, minor: 18947 },
    { place_id: "simuladores", description: "Simuladores", place_type: "other", stage_slug : "", major: 213, minor: 2389 },
    { place_id: "prefeitura", description: "Prefeitura de Recife", place_type: "other", stage_slug : "", major: 213, minor: 2319 },
    { place_id: "WorkshopStartupMakersCampCPRecife4", description: "Workshop Startup&Makers", place_type: "stage", stage_slug : "WorkshopStartupMakersCampCPRecife4", major: 213, minor: 1013 },
    { place_id: "credenciamento", description: "Credenciamento", place_type: "other", stage_slug : "", major: 213, minor: 2024 },
    { place_id: "cpfuture", description: "Campus Future", place_type: "other", stage_slug : "", major: 213, minor: 2601 },
    { place_id: "bigeyes1", description: "Pequeno teste 1", place_type: "stage", stage_slug: "teste", major: 213, minor: 2646 },
    { place_id: "bigeyes2", description: "Pequeno teste 2", place_type: "stage", stage_slug: "teste", major: 213, minor: 17780 },
    { place_id: "bigeyes3", description: "Pequeno teste 3", place_type: "stage", stage_slug: "teste", major: 213, minor: 17156 }
];