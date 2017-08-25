/**
 *
 */
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) {

    var OccasionsDefinition = function(){

        var theClass = function() {

            var managedEvents = {}; // The current events that this manager manage, one for each property in eventDefinitions that got listenTo. For example { EVT1: {callback: cb1, triggered: true, eventData: eventData1 }, {EVT2: {callback: cb2}} }

            function executeCallbacks(occasionName, eventData){
                for (var ii = 0; ii < managedEvents[occasionName].callbacks.length; ii++){
                    try {
                        if (managedEvents[occasionName].callbacks[ii].callback){
                            managedEvents[occasionName].callbacks[ii].callback({
                                data: eventData,
                                context: managedEvents[occasionName].callbacks[ii].context
                            });
                        }
                    } catch(ex){
                        // Ignore it;
                    }
                }
            }

            function trigger(occasionName, eventData) {
                if (!managedEvents[occasionName]){
                    managedEvents[occasionName] = {};
                }

                if (!managedEvents[occasionName].triggered){
                    managedEvents[occasionName].triggered = true;
                    managedEvents[occasionName].eventData = eventData;


                    if (managedEvents[occasionName].callbacks){
                        executeCallbacks(occasionName, eventData);
                    }
                }
            }

            function addOcassionListener(occasionName, callback, context){
                if (!managedEvents[occasionName]) {
                    managedEvents[occasionName] = {};
                }

                if (!managedEvents[occasionName].callbacks) {
                    managedEvents[occasionName].callbacks = [];
                }

                managedEvents[occasionName].callbacks.push({
                    callback: callback,
                    context: context
                });
            }

            function afterPassed(occasionName, callback, context) {
                if (managedEvents[occasionName]){
                    if (managedEvents[occasionName].triggered){
                        callback({
                            data: managedEvents[occasionName].eventData,
                            context: context
                        });
                    } else {
                        addOcassionListener(occasionName, callback, context);                    }
                } else {
                    addOcassionListener(occasionName, callback, context);                }
            }

            function isPassed(occasionName){
                return !!managedEvents[occasionName] && !!managedEvents[occasionName].triggered;
            }

            return {
                trigger: trigger,
                /**
                 * afterPassed(occasionName, handler, context)
                 * Attach a handler to an occasion by the given occasionName. The handler is executed at most once.
                 * If the occasion already passed (triggered), the handler is executed immediately with the given data of the trigger,
                 * else it is executed when the trigger is invoked.
                 *
                 * @param occasionName - From the occasions list given for the constructor
                 * @param handler - A function to execute after the the occasion with given occasionName passed
                 * The function is: function(occasion){}
                 * and the function parameter occasion is {data: DataObjectGivenByTriggerOfTheOccasion, context: TheGivenContextParameter}
                 * @param context - An object
                 */
                afterPassed: afterPassed,
                isPassed: isPassed
            }
        };

        function getInstance(){
            return new theClass();
        }

        return {
            getInstance: getInstance
        }
    };

    unitsInitiator.register("Occasions", OccasionsDefinition, []);
})(window.unitsInitiator);


