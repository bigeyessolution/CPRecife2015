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

BigEyesSolutionApp.initialize();

BigEyesSolutionApp.addjQueryEvent('#btn-beacon-sensor', 'change', function() {
    ProximityMonitor.enableMonitoring(getBtnBeaconStatus());
    showBeaconStausDiv();
});

BigEyesSolutionApp.addjQueryEvent(
    ':mobile-pagecontainer', 'pagecontainerbeforechange', function (event, ui) {
        var prevPage = ui.prevPage.attr("id");
        
});

BigEyesSolutionApp.addjQueryEvent(
    ':mobile-pagecontainer', 'pagecontainershow', function (event, ui) {
        var prevPage = ui.prevPage.attr("id");
        var toPage = ui.toPage.attr("id");
        
        switch (toPage) {
            case 'page-schedule':
                break;
            case 'page-schedule-by-day':
                break;
            case 'page-news':
                break;
            case 'page-beacon':
                showBeaconStausDiv();
                break;
            case 'page-abount':
                break;
        }
});

/**
 * Execute task when device status is ready.
 * @returns {undefined}
 */
function onDeviceReady () {
    prepareUI();
    
    BigEyesSolutionApp.bindEvents();
    
}

if (BigEyesSolutionApp.isOnCordova()) {
    console.log(BigEyesSolutionApp.isOnCordova());
    document.addEventListener('deviceready', onDeviceReady, false);
} else {
    $(onDeviceReady);
}
