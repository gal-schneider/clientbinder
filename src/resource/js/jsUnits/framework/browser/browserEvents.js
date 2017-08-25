(function(unitsInitiator, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) {

    var browserEvents = function(pWindow, pDocument, pSetTimeout){
        var EVENTS_ENUM = {
            CLICK: {key: "CLICK", eventName: "click", ieEventName: "onclick"},
            BLUR: {key: "BLUR",eventName: "blur", ieEventName: "onblur"},
            FOCUS: {key: "FOCUS",eventName: "focus", ieEventName: "onfocus"},
            MOUSE_OUT: {key: "MOUSE_OUT",eventName: "mouseout", ieEventName: "onmouseout"},
            MOUSE_OVER: {key: "MOUSE_OVER",eventName: "mouseover", ieEventName: "onmouseover"},
            KEY_DOWN: {key: "KEY_DOWN",eventName: "keydown", ieEventName: "onkeydown"},
            KEY_PRESS: {key: "KEY_PRESS",eventName: "keypress", ieEventName: "onkeypress"},
            MOUSE_ENTER: {key: "MOUSE_ENTER",eventName: "mouseenter", ieEventName: "onmouseenter"},
            ENTER_PRESSED: {key: "ENTER_PRESSED",eventName: "keydown", ieEventName: "onkeydown"}
        };


        var events = {};

        function listenToWindowOnResize(cb){
            if (pWindow.attachEvent){
                pWindow.attachEvent("onresize", function(){pSetTimeout(cb, 0);});
            }  else {
                pWindow.addEventListener("resize", function(){pSetTimeout(cb, 0);} , true);
            }
        }

        function listenToEvent(eve, elementId, cb) {
                var element = pDocument.getElementById(elementId);
                if (element) {
                    listenToEventOnElement(eve, element, cb);
                }
        }

        function attachEvent(event, element, cb){
            if (element) {
                if (element.attachEvent) {
                    element.attachEvent(event.ieEventName, cb);
                } else {
                    element.addEventListener(event.eventName, cb, false);
                }
            }
        }

        function getKeyCode(evt){
            var keyCode = null;
            if (evt){
                if (evt.which){
                    keyCode = evt.which;
                } else if (evt.keyCode) {
                    keyCode = evt.keyCode;
                }
            }
            return keyCode;
        }

        function isClickTriggeredFromEnter(event){
            // In FireFox enter on button sends also click event, we want to ignore this case
            return (event && event.type === "click" && event.clientX === 0 && event.clientY === 0);
        }

        function listenToEventOnElement(eventDefinition, element, cb, context) {
            if (eventDefinition.key === EVENTS_ENUM.ENTER_PRESSED.key){
                    var newCb = function(event){
                    var keyCode = getKeyCode(event);

                    if (keyCode == 13) {
                        if(event.isPropagationStopped && event.isPropagationStopped()) {
                            return;
                        }

                        if (event.stopPropagation) {
                            event.stopPropagation();
                        } else {
                            event.cancelBubble = true; // IE
                        }
                        cb({
                            data: event,
                            context: context
                        });
                    }

                };

                attachEvent(eventDefinition, element, newCb);

            } else if(EVENTS_ENUM[eventDefinition.key]) {
                var newCb = function(event){
                    if (!isClickTriggeredFromEnter(event)) {
                        cb(event);
                    }

                };

                attachEvent(eventDefinition, element, newCb);
            }
        }

//        function executeCallbacks(eventKey, event, element){
//            if(events[eventKey] && events[eventKey][element]){
//                for (var ii = 0; ii < events[eventKey][element].length; ii++){
//                    try {
//                        if (events[eventKey][element][ii].callback){
//                            events[eventKey][element][ii].callback({
//                                data: {
//                                    domEvent: event
//                                },
//                                context: events[eventKey][element][ii].context
//                            });
//                        }
//                    } catch(ex){
//                        // Ignore it;
//                    }
//                }
//
//            }
//        }

        function onEnterPress(callback) {
            var oldCallback = pDocument.onkeydown;

            pDocument.onkeydown = function (evt) {
                var keyCode = getKeyCode(evt);

                if (keyCode == 13) {
                    if (oldCallback){
                        oldCallback(evt);
                    }
                    callback(evt);
                }
            };
        }

//        function callbacksCompare(a, b){
//            if (!a.order){
//                return -1;
//            } else if (!b.order) {
//                return 1;
//            } else {
//                return a.order - b.order;
//            }
//        }

        function listenToEnterPressedOnElement(element, callback, context){
//            var key = EVENTS_ENUM.ENTER_PRESSED.key;
//            if(!events[key]){
//                events[key] = {};
//                events[key][element] = [];
//            } else {
//                if (!events[key][element]) {
//                    events[key][element] = [];
//                }
//            }
//
//            events[key][element].push({
//                callback: callback,
//                order: order
//            });
//
//            events[key][element].sort(callbacksCompare);
            listenToEventOnElement(EVENTS_ENUM.ENTER_PRESSED, element, callback, context);
        }

        return {
            EVENTS_ENUM: EVENTS_ENUM,
            listenToWindowOnResize: listenToWindowOnResize,
            listen: listenToEvent,
            onEnterPress: onEnterPress,
            listenToEventOnElement: listenToEventOnElement,
            listenToEnterPressedOnElement: listenToEnterPressedOnElement
        }
    };

    unitsInitiator.register("browserEvents", browserEvents, ["pWindow", "pDocument", "pSetTimeout"]);
})(window.unitsInitiator);
