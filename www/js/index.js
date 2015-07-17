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



function onReady (){
    BigEyesSolutionApp.initialize();

    BigEyesSolutionApp.addjQueryEvent(
        ':mobile-pagecontainer', 'pagecontainerbeforechange', function (event, ui) {
            var prevPage = ui.prevPage.attr("id");

            switch (prevPage) {
                case 'page-schedule':
                    break;
                case 'page-schedule-by-stage':
                    $("#page-schedule-by-stage .ui-collapsible").collapsible("collapse");
                    break;
                case 'page-news':
                    break;
                case 'page-beacon':
                    break;
                case 'page-abount':
                    break;
            }

    });

    BigEyesSolutionApp.addjQueryEvent(
        ':mobile-pagecontainer', 'pagecontainershow', function (event, ui) {
            var prevPage = ui.prevPage.attr("id");
            var toPage = ui.toPage.attr("id");

            switch (toPage) {
                case 'page-schedule':
                    break;
                case 'page-schedule-by-stage':
//                        ApiCache.updateCache('schedule'); //Descomente quando resolver
                    break;
                case 'page-news':
                    break;
                case 'page-beacon':
                    break;
                case 'page-about':
                    break;
            }
    });

    BigEyesSolutionApp.addjQueryEvent('#search-stage', 'focusin', function () { 
        $('#page-schedule-by-stage .ui-footer').hide();
    });

    BigEyesSolutionApp.addjQueryEvent('#search-stage', 'focusout', function () { 
        $('#page-schedule-by-stage .ui-footer').fadeIn();
    });

    BigEyesSolutionApp.addjQueryEvent('.btn-to-top', 'click', function () {
        $('html, body').animate({ scrollTop: $(":mobile-pagecontainer").offset().top }, 1000);
    });

    BigEyesSolutionApp.addjQueryEvent(document, 'scroll', function () {
        var activePage = $(":mobile-pagecontainer").pagecontainer( "getActivePage" ).attr("id");
        if ($(window).scrollTop() > 100) {
            $('#' + activePage + ' .btn-to-top').fadeIn(500);
        } else {
            $('#' + activePage + ' .btn-to-top').fadeOut(500);
        }
    });

    BigEyesSolutionApp.bindEvents();
    
    ApiCache.init();
        
    ApiCache.addUrl('schedule', 'http://campuse.ro/api/legacy/events/campus-party-recife-2015/schedule/', 10 /* 1800000 */, populateSchedulePage);
    
    ApiCache.addUrl('beacons', 'https://s3.amazonaws.com/cdn.campuse.ro/cprecife.beacon.json', 10 /* 3600000 */, 
    function (cacheId, data) {
        var beacons = data.beacons;
        
        BigEyesSolutionApp.setConf("beaconsInfoUrl", data.info_to_url != '' ? data.info_to_url : false);
        ProximityMonitor.init(beacons); 
    });
    
    ApiCache.updateCache('beacons');
    
    ApiCache.updateAllCaches();
};

//document.addEventListener('deviceready', onReady, false);
