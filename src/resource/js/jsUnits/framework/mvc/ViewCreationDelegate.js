/**
 * A stated class, a delegate for View
 * Hold private functions that serves Views which use the View class in createView function
 *
 * Created by Gal Schneider on 4/18/2015.
 */
(function(unitsInitiator, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) {

    var ViewCreationDelegateDefinition = function(browserDom, translator, pSetTimeout){


        var getInstance = function theConstractor(options) {
            if (this.constructor !== theConstractor) {
                return new theConstractor(options);
            }

            function getContainerElement(){
                return options.containerElement;
            }

            function listenTo(eventDefinition, callback, context){
                options.eventsManager.listenTo(eventDefinition, callback, context);
            }


            function trigger(eventDefinition, eventData) {
                options.eventsManager.trigger(eventDefinition, eventData);
            }

            function focusOnField(element) {
//                pSetTimeout(function(){
//                    try {
                        element.focus();
//                    } catch (e) {
//                    }
//                }, 100);

            }

            function removeClassNameFromElement(containerElement, className){
                browserDom.removeClassNameFromElement(containerElement, className);
            }

            function addElement(tagName, attributes, parentElem, dictionaryKey){
                var text = null;
                if (dictionaryKey){
                    text = translator.getTranslatedText(dictionaryKey, options.language);
                }
                return browserDom.addElement(tagName, attributes, parentElem, text);
            }

            function getTranslatedText(textKey){
                return translator.getTranslatedText(textKey, options.language);
            }

            function addListenerToRendered(callback){
                options.addListenerToRendered(callback);
            }

            function init(theOptions) {
                options = theOptions;
            }

            if (options !== "TEST_MODE"){
                init(options);
            }

            return {
                NO_PARENT: null,
                removeClassNameFromElement: removeClassNameFromElement,
                addElement: addElement,
                getTranslatedText: getTranslatedText,
                listenTo: listenTo,
                trigger: trigger,
                focusOnField: focusOnField,
                getContainerElement: getContainerElement,
                addListenerToRendered: addListenerToRendered
            };
        };

        return {
            getInstance: getInstance
        }
    };

    unitsInitiator.register("ViewCreationDelegate", ViewCreationDelegateDefinition, ["browserDom", "translator", "pSetTimeout"]);
})(window.unitsInitiator);


