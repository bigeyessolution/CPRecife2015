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
 * Contains all information about the application and controls all events.
 * 
 * @type BigEyesSolutionApp
 */
var BigEyesSolutionApp = {
    //googleAnalytics: window.plugins.gaPlugin,
    backgroundTimer: false,
    i18n: 'pt',
    jQueryEvents: [],
    /**
     * Initialize the
     */
    initialize: function() {
        //Get information about device
        //Get language
//        this.googleAnalytics.init(
//            this.successHandler, this.errorHandler, "UA-59229933-2", 10
//        );

        //if is iOS: window.plugins.webviewcolor.change('#FFFFFF');
    },
    /**
     * Verify if the applications is running with cordova environment.
     * 
     * @returns {Boolean}
     */
    isOnCordova: function () { 
        return typeof cordova !== 'undefined'; 
    },
    /**
     * Add an jQuery Event handler to an object.
     * 
     * @param {String} selector
     * @param {String} events
     * @param {Function} handler
     */
    addjQueryEvent: function (selector, events, handler) {
        this.jQueryEvents.push({ selector: selector, events: events, handler: handler });
    },
    /**
     * Bind all events.
     * @returns {Void}
     */
    bindEvents: function() {
        for (var i = 0; i < this.jQueryEvents.length; i++) {
            var event = this.jQueryEvents[i];
            $(event.selector).on(event.events, event.handler);
        }
        
//        cordova.plugins.backgroundMode.onactivate = this.onBackgroundModeActivate;
//        cordova.plugins.backgroundMode.ondeactivate = this.onBackgroundModeDectivate;
    },
    onDevicePause: function () {
        
    },
    onDeviceResume: function () {
        
    },
    onBackgroundModeActivate: function () {
        
    },
    onBackgroundModeDectivate: function () {
        
    },
    /**
     * Set the localization code.
     * 
     * @param {String} localization
     * @returns {Void}
     */
    setI18n: function (localization) {
        
    },
    /**
     * Return the localization code if setted or false.
     * 
     * @returns {String|Boolean}
     */
    getI18n: function () {
        return this.i18n === '' ? false : this.i18n;
    },
    /**
     * Return if the device is connected.
     * 
     * @TODO to implement connectivity test with cordova
     * @returns {Boolean}
     */
    isConnected: function () {
        return true;
    },
    enableBackgroundMode: function () {
        // Prevent the app from going to sleep in background
        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.setDefaults({
            title:  "Campus Party App",
            ticker: "Proximity monitor",
            text:   ""
        });
    },
    disableBackgroundMode: function () {
        
    },
    successHandler: function (result) {
        
    },
    errorHandler: function (error) {
        
    },
    alert: function (message, title, btntext) {
        
    }
};