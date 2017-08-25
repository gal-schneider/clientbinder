(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) {

    var EventsManagerDefinition = function(logger, assert){

        var EVENT_TYPE_ENUM = {
            MANY_TIMES: 1, // The Default. - Like click on element. Means that listenTo this event runs the callback from now on when event happens
            ONE_TIME: 2 // Like document.body loaded. Means that if after event happened (=trigger with this eventNane), calling listenTo this event immediately runs the callback
        };

        var theClass = function(options) {

            var managedEvents = {}; // The current events that this manager manage, one for each property in eventDefinitions that got listenTo. For example { EVT1: {callback: cb1, triggered: true, eventData: eventData1 }, {EVT2: {callback: cb2}} }

            function executeCallbacks(eventDefinition, eventData){
                for (var ii = 0; ii < managedEvents[eventDefinition.name].callbacks.length; ii++){
                    try {
                        if (managedEvents[eventDefinition.name].callbacks[ii].callback){
                            managedEvents[eventDefinition.name].callbacks[ii].callback({
                                data: eventData,
                                context: managedEvents[eventDefinition.name].callbacks[ii].context
                            });
                        }
                    } catch(ex){
                        // Ignore it;
                    }
                }
            }

            /**
             * A unit foo which uses the EventManager should call trigger when the event happens in foo.
             */
            function trigger(eventDefinition, eventData) {
                if (managedEvents[eventDefinition.name]) {
                    if (eventDefinition.type === EVENT_TYPE_ENUM.ONE_TIME){
                        if (!managedEvents[eventDefinition.name].triggered){
                            managedEvents[eventDefinition.name].triggered = true;
                            managedEvents[eventDefinition.name].eventData = eventData;


                            if (managedEvents[eventDefinition.name].callbacks){
                                executeCallbacks(eventDefinition, eventData);
//                                managedEvents[eventDefinition.name].callback({
//                                    data: eventData,
//                                    context: managedEvents[eventDefinition.name].context
//                                });
                            }
                        }
                    } else if ( managedEvents[eventDefinition.name].callbacks){
//                        managedEvents[eventDefinition.name].callback({ data: eventData });
                        executeCallbacks(eventDefinition, eventData);
                    }
                }
            }

            /**
             * A unit foo which uses the EventManager should call listenTo when a it (or another unit which using foo using listenTo method of foo) wants a callback to run when the event is triggered.
             */
            function listenTo(eventDefinition, callback, context) {
                assert.hasValue(eventDefinition, "EventsManager", "init", "eventName");

                if (managedEvents[eventDefinition.name]){
                    if (eventDefinition.type === EVENT_TYPE_ENUM.ONE_TIME && managedEvents[eventDefinition.name].triggered){
                        callback({
                            data: managedEvents[eventDefinition.name].eventData,
                            context: context
                        });
                    } else {
                        if (!managedEvents[eventDefinition.name].callbacks) {
                            managedEvents[eventDefinition.name].callbacks = [];
                        }

                        managedEvents[eventDefinition.name].callbacks.push({
                            callback: callback,
                            context: context
                        });

//                        if (managedEvents[eventDefinition.name].callback) {
//                            var oldCallback = managedEvents[eventDefinition.name].callback;
//                            managedEvents[eventDefinition.name].callback = function (event) {
//                                oldCallback(event);
//                                callback(event);
//                            }
//                        } else {
//                            managedEvents[eventDefinition.name].callback = callback;
//                        }
                    }
                }
            }

            function wasTriggered(eventDefinition){
                return !!managedEvents[eventDefinition.name] && !!managedEvents[eventDefinition.name].triggered;
            }

            function init(options) {
                assert.hasValue(options, "EventsManager", "init", "options");

                for (var eventName in options.eventDefinitions){ // options.eventDefinitions - Hold possible events to manage, for example: { EVT1 : { name: "EVT1", type: tp1}, EVT2: { name: "EVT2", type: tp2} }
                    var eventDefinition = options.eventDefinitions[eventName];
                    managedEvents[eventName] = {
                        name: eventDefinition.name,
                        type: eventDefinition.type
                    };
                }
            }

            init(options);

            return {
                trigger: trigger,
                listenTo: listenTo,
                /**
                 * For ONE_TIME event, returns true is event with given eventName was triggered
                 * For MANY_TIMES event, returns true is event with given eventName was triggered at least once
                 */
                wasTriggered: wasTriggered
            };
        };

        function getInstance(options){
            return new theClass(options);
        }

        return {
            EVENT_TYPE_ENUM: EVENT_TYPE_ENUM,
            getInstance: getInstance
        };
    };

    unitsInitiator.register("EventsManager", EventsManagerDefinition, ["logger", "assert"]);
})(window.unitsInitiator);


