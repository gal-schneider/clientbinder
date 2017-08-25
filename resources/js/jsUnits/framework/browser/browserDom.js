(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) {

    var browserDom = function(pDocument, pWindow, utils, Occasions, logger){
        var TAGS_ENUM = {
            FORM: "form",
            INPUT: "input"
        };

        var EVENTS_DEFINITIONS_ENUM = {
            BODY_LOADED: "BODY_LOADED"
        };

        var occasions = Occasions.getInstance();

        // Depricated
        function createElement(tagName, attributes, parentElem, text){
            var element;
            if (tagName && attributes) {
                element = pDocument.createElement(tagName);

                for (var ii = 0; ii < attributes.length; ii++) {
                    element.setAttribute(attributes[ii].attName, attributes[ii].attValue);
                }

                if (text) {
                    element.innerHTML = text;
                }

                if (parentElem){
                    parentElem.appendChild(element);
                }
            } else {
                //TODO: add logger
            }

            return element;
        }


        function addElement(tagName, attributes, parentElem, text){
            var element;
            if (tagName && attributes) {
                element = pDocument.createElement(tagName);

                for (var attribute in attributes) {
                    element.setAttribute(attribute, attributes[attribute]);
                }

                if (text) {
                    element.innerHTML = text;
                }

                if (parentElem){
                    parentElem.appendChild(element);
                }
            } else {
                //TODO: add logger
            }

            return element;
        }

        function setAttributeById(id, attrName, value) {
            var elem = pDocument.getElementById(id);
            if (elem) {
                elem.setAttribute(attrName, value);
            }else {
                //TODO: log
            }
        }


        function addClassNameFromElement(element, val) {
            if (element) {
                element.className = element.className + " " + val;
            }
        }

        function addClassName(id, val) {
            var elem = pDocument.getElementById(id);
            addClassNameFromElement(elem, val);
        }

        function removeClassNameFromElement(elem, className) {
            if (elem) {
                elem.className = elem.className.replace(className, "");
                if (elem.className === "" || elem.className === " "){
                    elem.removeAttribute("class");
                } else {
                    elem.className = utils.string.trim(elem.className);
                }
            }

        }

        function removeClassName(id, val) {
            var elem = pDocument.getElementById(id);
            removeClassNameFromElement(elem, val);
        }

        function removeElement(parentElement, childElement){
            parentElement.removeChild(childElement);
        }

        function getElementById(id){
            return pDocument.getElementById(id);
        }

        function getElementsByClassName(className){
            if (pDocument.getElementsByClassName){
                return pDocument.getElementsByClassName(className);
            } else if (pDocument.querySelectorAll) { // Fallback for IE8
                return pDocument.querySelectorAll("." + className);
            } else {
                return [];
            }
        }

        function getBody(){
            return pDocument.body;
        }


        function getHead(){
            return pDocument.getElementsByTagName('head')[0];
        }

        function removeElementByChild(element, child) {
            element.removeChild(child);
        }

        function removeElementByChildId(element, childId) {
            if (element && element.hasChildNodes()) {
                var children = element.children;
                for (var ii = 0; ii < children.length; ii++) {
                    if (children[ii].getAttribute("id") === childId) {
                        element.removeChild(children[ii]);
                    }
                }
            }
        }

        function removeElementById(elementId, childId) {
            removeElementByChildId(pDocument.getElementById(elementId), childId);
        }

        function listenToBodyLoad(callback, context){
            occasions.afterPassed(EVENTS_DEFINITIONS_ENUM.BODY_LOADED, callback, context);
        }

        function appendChild(element, childElement){
            element.appendChild(childElement);
        }

        function setValueById(id, value) {
            var elem = pDocument.getElementById(id);
            if (elem) {
                elem.innerHTML = value;
            }else {
                //TODO: log
            }
        }

        function handleOnLoad(){
            if (pWindow.attachEvent) {
                logger.info("browserDom >> handleOnLoad >> attachEvent is true");
                pWindow.attachEvent('onload', function () {
                    logger.info("browserDom >> handleOnLoad >>  attachEvent onload");
                    occasions.trigger(EVENTS_DEFINITIONS_ENUM.BODY_LOADED);
                });
            } else {
                logger.info("browserDom >> handleOnLoad >>  attachEvent is false");
                pWindow.addEventListener('DOMContentLoaded', function () {
                    logger.info("browserDom >> handleOnLoad >>  attachEvent DOMContentLoaded");
                    occasions.trigger(EVENTS_DEFINITIONS_ENUM.BODY_LOADED);
                }, false);
                pWindow.addEventListener('load', function () {
                    logger.info("browserDom >> handleOnLoad >>  addEventListener load");
                    occasions.trigger(EVENTS_DEFINITIONS_ENUM.BODY_LOADED);
                }, false);
            }

            if (!getBody()){
                logger.info("handleOnLoad getBody() is false");
                pWindow.onload = function() {
                    logger.info("browserDom >> handleOnLoad >>  onload");
                    occasions.trigger(EVENTS_DEFINITIONS_ENUM.BODY_LOADED);
                };
            } else {
                logger.info("browserDom >> handleOnLoad >>  getBody() is true");
                occasions.trigger(EVENTS_DEFINITIONS_ENUM.BODY_LOADED);
            }

        }

        function getElementByXPath(xPath){
            
        }


        function init(){
            handleOnLoad();
        }

        init();

        return {
            TAGS_ENUM: TAGS_ENUM,
            addClassName: addClassName,
            addClassNameFromElement: addClassNameFromElement,
            removeClassName: removeClassName,
            removeClassNameFromElement: removeClassNameFromElement,
            setAttributeById: setAttributeById,
            removeElement: removeElement,
            createElement: createElement, // Depricated use add Element
            addElement: addElement,
            getElementById: getElementById,
            getElementsByClassName: getElementsByClassName,
            getBody: getBody,
            getHead: getHead,
            removeElementById: removeElementById,
            listenToBodyLoad: listenToBodyLoad,
            appendChild: appendChild,
            setValueById: setValueById,
            removeElementByChildId: removeElementByChildId,
            removeElementByChild: removeElementByChild,
            getElementByXPath: getElementByXPath
        }
    }

    unitsInitiator.register("browserDom", browserDom, ["pDocument", "pWindow", "utils", "Occasions", "logger"]);
})(window.unitsInitiator);
