/**
 * Adds script element to the head element, based on given options
 *
 */
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) {

    var JsonpRequestDefinition = function(EventsManager, browserDom, browserUrl, browserWindow, pSetTimeout, pDate, logger) {

        var EVENTS_DEFINITIONS_ENUM = {
            SUCCESS_RESPONSE: {name: "SUCCESS_RESPONSE", type: EventsManager.EVENT_TYPE_ENUM.ONE_TIME},
            TIMEOUT: {name: "TIMEOUT", type: EventsManager.EVENT_TYPE_ENUM.ONE_TIME}
        };


        var theClass = function(options) {
            var eventsManager = EventsManager.getInstance({ eventDefinitions: EVENTS_DEFINITIONS_ENUM});

            function listenToSuccess(callback){
                eventsManager.listenTo(EVENTS_DEFINITIONS_ENUM.SUCCESS_RESPONSE, callback);
            }

            function listenToTimeout(callback){
                eventsManager.listenTo(EVENTS_DEFINITIONS_ENUM.TIMEOUT, callback);
            }

            function onTimeout(){
                if (!eventsManager.wasTriggered(EVENTS_DEFINITIONS_ENUM.SUCCESS_RESPONSE)){
                    eventsManager.trigger(EVENTS_DEFINITIONS_ENUM.TIMEOUT);
                }
            }

            function init(options) {
                var onResponse = function(data){
                    eventsManager.trigger(EVENTS_DEFINITIONS_ENUM.SUCCESS_RESPONSE, data);
                };
                var responseCallbackName = "lpLoginJsonp" + (new pDate).getTime();
                browserWindow.addGlobal(responseCallbackName, onResponse);
                listenToSuccess(options.onSuccess);
                listenToTimeout(options.onTimeout);
                var src = browserUrl.replaceParam(options.url, options.callbackName, responseCallbackName);
                browserDom.addElement("script", {type: "text/javascript", src: src, id: options.id}, browserDom.getHead());
                pSetTimeout(onTimeout, options.timeout);
            }

            init(options);
        };

        function getInstance(options){
            return new theClass(options);
        }

        return {
            /**
             * Gets options:
             * options.url - A URL to put in the src attribute of the script HTML element
             * options.callbackName - The name of the JSONP callback parameter. If not exists in the options.url, it is added to it.
             * options.onSuccess - A callback to run when script is loaded, which gets the response data
             * options.timeout - A period in miliseconds to wait for response
             * options.onTimeout - A callback to run when script is not loaded after options.timeout
             * options.id - The id of the script (To be uses only for easy finding the script in the HTML)
             */
            getInstance: getInstance
        }
    };

    unitsInitiator.register("JsonpRequest", JsonpRequestDefinition, ["EventsManager", "browserDom", "browserUrl", "browserWindow", "pSetTimeout", "pDate", "logger"]);
})(window.unitsInitiator);
