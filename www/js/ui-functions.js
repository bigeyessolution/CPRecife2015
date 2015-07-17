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
    
    $(".animateMe .ui-collapsible-heading-toggle").click(function (e) {
        var current = $(this).closest(".ui-collapsible");             
        if (current.hasClass("ui-collapsible-collapsed")) {
            //collapse all others and then expand this one
            $(".ui-collapsible").not(".ui-collapsible-collapsed").find(".ui-collapsible-heading-toggle").click();
            $(".ui-collapsible-content", current).slideDown(500);
        } else {
            $(".ui-collapsible-content", current).slideUp(500);
        }
    });
    
    $('.btn-to-top').hide();
}

function populateMagistrais () {
    var magistrais = [
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
        { name: "Lorrana Scarpioni", img: "lorrana_scarpioni-m.png" }, 
        { name: "Mario Chapela", img: "mario_chapela.jpg" },
        { name: "Moacy Alves Jr", img: "moacy_alves_jr.jpg" },
        { name: "Neil Harbisson", img: "neil_harbisson-m.jpg" },
        { name: "NIC Br", img: "nic_br.jpg" },
        { name: "Paulo Henrique Santana", img: "paulo_henrique_santana.jpg" },
        { name: "Rodrigo Medeiros", img: "rodrigo_medeiros.jpg" },
        { name: "Sergio Sacani", img: "sergio_sacani.jpg" }
    ]
    
    $.each(magistrais, function (key, speaker) {
        var img_src = 'img/speakers/' + speaker.img;
        
        $('<img src="' + img_src + '"></br><h2>' + speaker.name + '</h2></br>')
            .appendTo(".cp-speakers");
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
    
    ApiCache.updateCache('schedule'); /*Ver um jeito de mudar isso*/
    
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

function populateSchedulePage (cacheId, data) {    
    for (var index = 0; index < data.length; index ++) {
        var aux = data[index].date.split(" ");
        var aux_date = aux[0].split("-");
        
        if( aux_date[2] != _dayFilter ) continue;
                
        var aux_hour = aux[1].split(":");
        
        var date = new Date (data[index].date);
        
//        var h = date.getHours().toString();
//        var m = date.getMinutes() < 10 ? "0" + date.getMinutes().toString(): date.getMinutes().toString();
        
        $("<li><h3>" + data[index].title + "</h3><p>" + aux_hour[0] + ":" + aux_hour[1] + "</p></li>")
        .appendTo(getListIdToStage(data[index].stage_slug));
    }
    
    $(".be-schedule-list").listview("refresh");
}