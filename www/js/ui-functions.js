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

var scheduleData = [];
var scheduleDataLastUpdate = 0;
var scheduleTimeToLive = 1800000; /*30 minutes*/
var _listviewNotifications = []; //Notifications to show at Beacons Tab
var _listviewNotificationsId = []; //All notifications

function prepareUI () {
    $("[data-role='navbar']").navbar();
    $("#header-menu").toolbar();
    
    $(".animateMe .ui-collapsible-heading-toggle").click(function (e) {
        var current = $(this).closest(".ui-collapsible");
        
        if (current.hasClass("ui-collapsible-collapsed")) {
            $(".ui-collapsible").not(".ui-collapsible-collapsed")
                    .find(".ui-collapsible-heading-toggle").click();
            $(".ui-collapsible-content", current).slideDown(500);
        } else {
            $(".ui-collapsible-content", current).slideUp(500);
        }
    });
    
    $(document).scroll(function () {
        var activePage = $(":mobile-pagecontainer")
                .pagecontainer("getActivePage").attr("id");
        
        if ($(window).scrollTop() > 100) {
            $('#' + activePage + ' .btn-to-top').fadeIn(500);
        } else {
            $('#' + activePage + ' .btn-to-top').fadeOut(500);
        }
    });
    
    $('.btn-to-top').click(function () {
        $('html, body').animate({ 
            scrollTop: $(":mobile-pagecontainer").offset().top 
        }, 1000);
    }).hide();
    
    $('#search-stage').focusin(function () { 
        $('#page-schedule-by-stage .ui-footer').hide(); 
    }).focusout(function () { 
        $('#page-schedule-by-stage .ui-footer').fadeIn(); 
    });
    
    $(':mobile-pagecontainer').on('pagecontainerbeforechange', 
    function (event, ui) {
        var prevPage = ui.prevPage.attr("id");
        if (prevPage == 'page-schedule-by-stage') { 
            $("#page-schedule-by-stage .ui-collapsible").collapsible("collapse");
        }
    });
    
    $(':mobile-pagecontainer').on('pagecontainershow', 
    function (event, ui) {
        var toPage = ui.toPage.attr("id");
        if (toPage == 'page-schedule-by-stage') {
            $('#page-schedule-by-stage li').hide();
            
            populateSchedule();
        } else if (toPage == 'page-beacon') {
            for (var index=0; index < _listviewNotifications.length; index++) {
                $('<li data-icon="false"><h1>' + _listviewNotifications.title + '</h1></li>')
                    .appendTo('#beacon-notifications');
            }
            
            $("#beacon-notifications").listview("refresh");
        }
        
        /* gaPlugin is crashing in Moto-G 1st generation.
         * see index.js about line 28.
        gaPlugin.trackPage( gaSuccessHandler, gaErrorHandler, toPage);
        */
    });
}

function _getScheduleData (data) {
    scheduleData = data;
    scheduleDataLastUpdate = (new Date()).getTime();

    window.localStorage.setItem('schedule', JSON.stringify(data));
    window.localStorage.setItem('scheduleTimeToLive', scheduleTimeToLive);
}

function updateScheduleData (populateHandler) {
    var now = (new Date).getTime();
    
    if (now - scheduleDataLastUpdate < scheduleTimeToLive) { console.log("Sem download");
        populateHandler();
    } else { console.log("Com download");
        $.getJSON('http://campuse.ro/api/legacy/events/campus-party-recife-2015/schedule/', _getScheduleData)
        .fail(function () {
            var data = window.localStorage.getItem('schedule');

            _getScheduleData(data ? JSON.parse(data) : []);
        }).done(populateHandler);
    }
}

function populateSchedule () {
    function _populateSchedule () {
        $.each(scheduleData, function (index, data) {                                
            var aux = data.date.split(" ");
            var aux_date = aux[0].split("-");

            if( aux_date[2] == _dayFilter ) {
                var aux_hour = aux[1].split(":");

                var date = new Date (data.date);

                $("<li><h3>" 
                  + data.title 
                  + "</h3><p>" + aux_hour[0] + ":" + aux_hour[1] 
                  + "</p></li>"
                 ).appendTo( getListIdToStage(data.stage_slug) );
            }
        });
        
        $('#page-schedule-by-stage li:not(:has(.be-schedule-list:empty))').show();
            
        $(".be-schedule-list").listview("refresh");
    }
    
    updateScheduleData(_populateSchedule);
}

function populateMagistrais () {
    var magistrais = [
        { name: "Lorrana Scarpioni", img: "lorrana_scarpioni-m.png" },
        { name: "Neil Harbisson", img: "neil_harbisson-m.jpg" },
        { name: "Dado Schneider", img: "dado_schneider-d.jpg" }, 
        { name: "David Ruiz", img: "david_ruiz.jpg" }, 
        { name: "Dino Lincoln", img: "dino_lincoln.jpg" }, 
        { name: "Edney Souza", img: "edney_souza.jpg" }, 
        { name: "Eiran Simis", img: "eiran_simis.jpg" }, 
        { name: "Genesio Gomes", img: "genesio_gomes.png" }, 
        { name: "Guga Gorenstein", img: "guga_gorenstein.jpg" }, 
        { name: "HD Mabuse", img: "hd_mabuse.png" },
        { name: "Henrique Foresti", img: "henrique_foresti.jpg" },
        { name: "Kiev Gama", img: "kiev_gama.png" },
        { name: "Leonardo Leitão", img: "leonardo_leitao.png" }, 
        { name: "Mario Chapela", img: "mario_chapela.jpg" },
        { name: "Moacy Alves Jr", img: "moacy_alves_jr.jpg" },
        { name: "NIC Br", img: "nic_br.jpg" },
        { name: "Paulo Henrique Santana", img: "paulo_henrique_santana.jpg" },
        { name: "Rodrigo Medeiros", img: "rodrigo_medeiros.jpg" },
        { name: "Sergio Sacani", img: "sergio_sacani.jpg" }
    ]
    
    $.each(magistrais, function (key, speaker) {
        var img_src = 'img/speakers/' + speaker.img;
        
        $('<img src="' + img_src + '"><h2>' 
            + speaker.name 
            + '</h2></br>'
        ).appendTo(".cp-speakers");
    });
}

/**
 * Get the status for #btn-beacon-dev-sensor.
 * @returns {Boolean}
 */
function getBtnBeaconDevStatus () { 
    return $('#btn-beacon-dev-sensor').val() === 'on';
}

var _dateFilter = new Date (2015, 07, 23);

function showScheduleByDay (day) {
    _dayFilter = day;
    
    $(".be-schedule-list").empty();
    
    $(':mobile-pagecontainer')
        .pagecontainer("change", "#page-schedule-by-stage");
}

function toggleScheduleFilterBar() {
    if ( $('#schedule-filter-bar').hasClass('filter-bar-hidden') ) {
        $('#schedule-filter-bar').removeClass('filter-bar-hidden');
    } else {
        $('#schedule-filter-bar').addClass('filter-bar-hidden');
    }
}

function getListIdToStage (stage_slug) {
    switch (stage_slug) {
        case 'PalcoVenusCPRec4':
            return '#schedule-list-venus';
        case 'PalcoLuaCPRec4':
            return '#schedule-list-lua';
        case 'PalcoTerraCPRec4':
            return '#schedule-list-terra';
        case 'PalcoMarteCPRec4':
            return '#schedule-list-marte';
        case 'PalcoJupiterCPRecife':
            return '#schedule-list-jupter';
        case 'PalcoSaturnoCPRec4':
            return '#schedule-list-saturno';
        case 'Workshop1CienciaCPRecife4':
            return '#schedule-list-workshop-i';
        case 'Workshop2inovacaoCPRecife4':
            return '#schedule-list-workshop-ii';
        case 'PalcoStartupMakersCampCPRecife4':
            return '#schedule-list-startupmakers';
        case 'WorkshopStartupMakersCampCPRecife4':
            return '#schedule-list-ws-startupmakers';
        case 'InclusaoDigitalICPRecife4':
            return '#schedule-list-digital-inclusion-i';
        case 'InclusaoDigitalIICPRecife4':
            return '#schedule-list-digital-inclusion-ii';
        case 'ConteudosbyComunidadesCPRecife4':
            return '#schedule-list-bycommunity';
    }
}

//function populateSchedulePage (cacheId, data) {
//    for (var index = 0; index < data.length; index ++) {
//        var aux = data[index].date.split(" ");
//        var aux_date = aux[0].split("-");
//        
//        if( aux_date[2] != _dayFilter ) continue;
//                
//        var aux_hour = aux[1].split(":");
//        
//        var date = new Date (data[index].date);
//        
//        $("<li><h3>" + data[index].title 
//            + "</h3><p>" + aux_hour[0] + ":" + aux_hour[1] 
//            + "</p></li>")
//        .appendTo( getListIdToStage(data[index].stage_slug) );
//    }
//    
//    $(".be-schedule-list").listview("refresh");
//}

function addBeaconNotification (schedule) {
    if (_listviewNotificationsId.indexOf[schedule.id] > -1) return false;
    
    _listviewNotifications.unshift(schedule);
    _listviewNotificationsId.unshift(schedule.id);
    
    if(_listviewNotifications.length > 3) {
        _listviewNotifications.pop();
    }
    
    return true;
}