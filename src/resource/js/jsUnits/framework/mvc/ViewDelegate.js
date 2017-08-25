/**
 * Supplies the infra for rendering the view.
 *
 * The getInstance of this unit must get options object which has createView function.
 * createView function should return
 * The ViewDelegate runs this method when the
 *
 */
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) {

    var ViewDelegateDelegateDefinition = function(ViewCreationDelegate, EventsManager, browserDom, languageLoadingDelegate, Occasions, logger){
        var HIDE_CLASS_NAME = "hide";

        var EVENTS_DEFINITIONS_ENUM = {
            VIEW_RENDERED: "VIEW_RENDERED"
        };

        var getInstance = function theConstractor(options) {
            if (this.constructor !== theConstractor) {
                return new theConstractor(options);
            }

            var publicEventsManager;
            var occasions = Occasions.getInstance();
            var mainElement;

            var addListenerToEvents = {
                rendered: function(callback, context){
                    occasions.afterPassed(EVENTS_DEFINITIONS_ENUM.VIEW_RENDERED, callback, context);
                }
            };

            function listenTo(eventDefinition, callback, context){
                publicEventsManager.listenTo(eventDefinition, callback, context);
            }

            function renderByElements(containerElement, createView, options){
                var viewCreationDelegate = ViewCreationDelegate.getInstance({
                    language: options.language,
                    eventsManager: publicEventsManager,
                    containerElement: containerElement,
                    addListenerToRendered: addListenerToEvents.rendered
                });
                var mainElement = createView(options, viewCreationDelegate);

                if (mainElement) {
                    containerElement.appendChild(mainElement);
                }

                browserDom.removeClassNameFromElement(containerElement, HIDE_CLASS_NAME);
                logger.info("ViewDelegate >> renderByElements >> going to trigger VIEW_RENDERED  >> " + options.viewId);
                occasions.trigger(EVENTS_DEFINITIONS_ENUM.VIEW_RENDERED);

                return mainElement;
            }

             function onBodyDownload(event){

                 var options = event.context.options;
                 var containerElement;

                 logger.info("ViewDelegate >> onBodyDownload >> " + options.viewId);

                 if (options.containerElement){
                     containerElement = options.containerElement;
                 } else {
                     containerElement = browserDom.getElementById(options.containerId);
                 }

                 if (containerElement) {
                     logger.info("ViewDelegate >> onBodyDownload >> containerElement exists >> " + options.viewId);
                     browserDom.addClassNameFromElement(containerElement, HIDE_CLASS_NAME);

                     if (options.createView){
                         logger.info("ViewDelegate >> onBodyDownload >> going to do createView >> " + options.viewId);
                         mainElement = renderByElements(containerElement, options.createView, options);
                     } else {
                         throw "View > render > ERROR > createView not exist";
                     }
                 }
             }

            function init(options) {
                logger.info("ViewDelegate >> init >> " + options.viewId);
                options.eventsDefinitionsEnum = options.eventsDefinitionsEnum || {};
                options.language = languageLoadingDelegate.getSelectedLanguage();
                publicEventsManager = EventsManager.getInstance({ eventDefinitions: options.eventsDefinitionsEnum});

                browserDom.listenToBodyLoad(onBodyDownload, {options: options});
            }

            init(options);

            return {
                listenTo: listenTo,
                listenToRendered: addListenerToEvents.rendered
            }
        };

        return {
            EVENT_TYPE_ENUM: EventsManager.EVENT_TYPE_ENUM,
            getInstance: getInstance
        };
    };

    unitsInitiator.register("ViewDelegate", ViewDelegateDelegateDefinition, ["ViewCreationDelegate", "EventsManager", "browserDom", "languageLoadingDelegate", "Occasions", "logger"]);
})(window.unitsInitiator);

/**
* Created by Gal Schneider on 4/18/2015.
*/


