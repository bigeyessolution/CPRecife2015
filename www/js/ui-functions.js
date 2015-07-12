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


function prepareUI () {
    //Fixing header navbar
    $("[data-role='navbar']").navbar();
    $("#header-menu").toolbar();
    
    $('.btn-to-top').hide();
    
    $("#beacon-on, #beacon-notify, #beacon-off").hide();
}

/**
 * Get the status for #btn-beacon-sensor
 * @returns {Boolean}
 */
function getBtnBeaconStatus () {
    return $('#btn-beacon-sensor').val() === 'on';
}

/**
 * Get the status for #btn-beacon-dev-sensor.
 * @returns {Boolean}
 */
function getBtnBeaconDevStatus () {
    return $('#btn-beacon-dev-sensor').val() === 'on';
}

/**
 * @TODO: Inserir verificação de noficações
 * @returns {undefined}
 */
function showBeaconStausDiv () {
    var divToShow = ProximityMonitor.isMonitoring() ? 
        true /* if list notifications has elements */ ? '#beacon-notify' : '#beacon-on' 
        : '#beacon-off';
        
    $("#beacon-on, #beacon-notify, #beacon-off").hide();
    $(divToShow).fadeIn();
}

function showScheduleByDay (day) {
    $(':mobile-pagecontainer').pagecontainer("change", "#page-schedule-by-stage");
}

function toggleScheduleFilterBar() {
    if ( $('#schedule-filter-bar').hasClass('filter-bar-hidden') ) {
        $('#schedule-filter-bar').removeClass('filter-bar-hidden');
    } else {
        $('#schedule-filter-bar').addClass('filter-bar-hidden');
    }
}

function populateStagesPage (cacheId, data) {
    
}

function populateNewsPage (cacheId, data) {
    
}

function populateSchedulePage (cacheId, data) {
    
}