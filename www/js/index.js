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

var isAppInBackground = false;
var gaPlugin = false;

document.addEventListener('deviceready', function () {
    navigator.splashscreen.show();
    
    prepareUI();

    populateMagistrais();
    
    beaconsInit();
    
    
    if (device.platform == 'Android') {
        cordova.plugins.backgroundMode.setDefaults({
            title:  'Campus Party Recife 2015',
            ticker: 'CPRecife4',
            text:   ''
        })
    } else if (device.platform == 'iOS') {
    }
    
    cordova.plugins.backgroundMode.configure({ silent: false });
    
    cordova.plugins.backgroundMode.enable();
    
    /*
     * crashing. See ui-functions line 85.
    gaPlugin = window.plugins.gaPlugin;
    gaPlugin.init(gaSuccessHandler, gaErrorHandler, "UA-59229933-2", 10);
    */
    
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 1000);
}, false);

document.addEventListener('pause', function () {
    isAppInBackground = true;
    
    
    
});

document.addEventListener('resume', function () {
    isAppInBackground = false;
    
});

function gaSuccessHandler() { }

function gaErrorHandler() { }

$(function () { prepareUI();});