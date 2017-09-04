var pSetTimeout = pSetTimeout || setTimeout; 
var basicUnits = basicUnits || { 
pDocument: document, 
pWindow: window, 
pNavigator: navigator, 
pXMLHttpRequest:  typeof XMLHttpRequest !== "undefined" ? XMLHttpRequest : undefined, 
pActiveXObject: typeof ActiveXObject !== "undefined" ? ActiveXObject : undefined, 
pJSON: JSON, 
pDecodeURIComponent: decodeURIComponent, 
pEscape: escape, 
pUnescape: unescape, 
pDate: Date, 
pObject: Object, 
pSetTimeout: setTimeout, 
pConsole: window.console ? (window.console.log ? window.console : {log: function(){}}) : {log: function(){}}, 
dictionary: Dictionary 
}; 
var unitsInitiator = (function(pSetTimeout, basicUnits, document, window, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout){ 
var initiatedUnits = {}; // Ready to use units 
var waitingToBeInitiatedUnits = {}; 
function isAllDependentOnUnitsInitiated(dependentOnUnitsNamesArray, isLog){ 
for (var ii = 0; ii < dependentOnUnitsNamesArray.length; ii++){ 
if (!initiatedUnits.hasOwnProperty(dependentOnUnitsNamesArray[ii]) || 
(initiatedUnits.hasOwnProperty(dependentOnUnitsNamesArray[ii]) && !initiatedUnits[dependentOnUnitsNamesArray[ii]].initiated)){ 
if (isLog && console && console.log){ 
console.log("Dependency unit " + dependentOnUnitsNamesArray[ii] + " ."); 
} 
return false; 
} 
} 
return true; 
} 
function buildDependentOnUnitsArray(dependentOnUnitsNamesArray){ 
var result = []; 
for (var ii = 0; ii < dependentOnUnitsNamesArray.length; ii++){ 
result[ii] = initiatedUnits[dependentOnUnitsNamesArray[ii]].unit; 
} 
return result; 
} 
function initiateWaitingUnits(isLog){ 
var isUnitInitiated = false; 
for (var unitName in waitingToBeInitiatedUnits){ 
if (isLog && console && console.log) { 
console.log("unitName " + unitName + " is waiting for:"); 
} 
var dependentOnUnitsNamesArray = waitingToBeInitiatedUnits[unitName].dependentOnUnitsNamesArray; 
if (isAllDependentOnUnitsInitiated(dependentOnUnitsNamesArray, isLog)) { 
var dependentOnUnitsArray = buildDependentOnUnitsArray(dependentOnUnitsNamesArray); 
initiatedUnits[unitName] = {unit: waitingToBeInitiatedUnits[unitName].unitDefinition.apply({}, dependentOnUnitsArray), initiated: true}; 
delete waitingToBeInitiatedUnits[unitName]; 
isUnitInitiated = true; 
} 
} 
if (isUnitInitiated){ 
initiateWaitingUnits(); 
} 
} 
function register(unitName, unitDefinition, dependentOnUnitsNamesArray){ // dependentOnUnitsArray is [unitName1, unitName2] for example ["domFacade", "navigatorFacade"] 
if (isAllDependentOnUnitsInitiated(dependentOnUnitsNamesArray)){ 
var dependentOnUnitsArray = buildDependentOnUnitsArray(dependentOnUnitsNamesArray); 
initiatedUnits[unitName] = {unit: unitDefinition.apply({}, dependentOnUnitsArray), initiated: true}; 
initiateWaitingUnits(); 
} else { 
waitingToBeInitiatedUnits[unitName] = {unitDefinition: unitDefinition, dependentOnUnitsNamesArray: dependentOnUnitsNamesArray}; 
} 
} 
function hasProperty(obj){ 
for (var prop in obj) { 
return true; 
} 
return false; 
} 
function onInitializationTimeout(){ 
initiateWaitingUnits(false); 
} 
function registerBasicUnit(unitName, unit){ // dependentOnUnitsArray is [unitName1, unitName2] for example ["domFacade", "navigatorFacade"] 
initiatedUnits[unitName] = {unit: unit, initiated: true}; 
} 
function registerAllBasicUnitsUnits(basicUnits){ 
for (var unitName in basicUnits) { 
registerBasicUnit(unitName, basicUnits[unitName], []); 
} 
} 
function CheckAfterTimeoutThatNoUnitWaitForInitialization(){ 
pSetTimeout(onInitializationTimeout, 5000); 
} 
function init(basicUnits){ 
registerAllBasicUnitsUnits(basicUnits); 
CheckAfterTimeoutThatNoUnitWaitForInitialization(); 
} 
init(basicUnits); 
return { 
register: register 
} 
})(pSetTimeout, basicUnits); 
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) { 
var browserDeviceDefinition = function(pNavigator, browserType) { 
//-------------------------------------------------- 
// Based on device from lpTag.device 
//-------------------------------------------------- 
var FAMILY_TYPE_ENUM = { 
DESKTOP: 0, 
TABLET: 1, 
MOBILE: 2 
}; 
//            var FAMILY_TYPE_STRING_ENUM = ['Desktop', 'Tablet', 'Mobile']; 
var OS_TYPE_ENUM = { 
WINDOW: 0, 
MAC: 1, 
LINUX: 2, 
IOS: 3, 
ANDROID: 4 
}; 
//            var osTypeString = ['Windows', 'Mac OSX', 'Linux', 'iOS', 'Android']; 
var userAgent = pNavigator.userAgent; 
var mobileAgent = ( userAgent.match(/(Windows Phone|iPhone|iPod|mobile|Mobile|IEMobile)/g) ? true : false ); 
var tabletAgent = ( userAgent.match(/(Tablet PC|iPad|Tablet|tablet)/g) ? true : false ); 
var touchAgent = ( userAgent.match(/(Touch)/g) ? true : false ); 
var macOSX = ( userAgent.match(/(Mac OS)/g) ? true : false ); 
var linux = ( userAgent.match(/(Linux)/g) ? true : false ); 
var iOS = ( userAgent.match(/(iPhone|iPod|iPad)/g) ? true : false ); 
var android = ( userAgent.match(/(android|Android)/g) ? true : false ); 
var deviceFamily = getDeviceFamily(); 
var deviceOS = getDeviceOS(); 
/** 
* Will identify the device family once on load and exposes the correct enum value. 
* @returns FAMILY_TYPE_ENUM 
*/ 
function family() { 
return deviceFamily; 
} 
/** 
* Will identify the device OS once on load and exposes the correct enum value. 
* @returns OS_TYPE_ENUM 
*/ 
function os() { 
return deviceOS; 
} 
//            /** 
//             * Return the OS name identified. 
//             */ 
//            function osName() { 
//                return osTypeString[deviceOS]; 
//            } 
//            /** 
//             * Return the device family name identified. 
//             */ 
//            function familyName() { 
//                return FAMILY_TYPE_STRING_ENUM[deviceFamily]; 
//            } 
function getDeviceFamily() { 
var deviceFamily = FAMILY_TYPE_ENUM.DESKTOP; 
if (mobileAgent && !tabletAgent) { 
deviceFamily = FAMILY_TYPE_ENUM.MOBILE; 
} else if ((tabletAgent || android) && !browserType.isIE()) { 
deviceFamily = FAMILY_TYPE_ENUM.TABLET; 
} else if (tabletAgent && browserType.isIE() && touchAgent) { 
deviceFamily = FAMILY_TYPE_ENUM.TABLET; 
} 
return deviceFamily; 
} 
function getDeviceOS() { 
var deviceOS = OS_TYPE_ENUM.WINDOW; 
if (macOSX && !mobileAgent) { 
deviceOS = OS_TYPE_ENUM.MAC; 
} else if (android) { 
deviceOS = OS_TYPE_ENUM.ANDROID; 
} else if (iOS) { 
deviceOS = OS_TYPE_ENUM.IOS; 
} else if (linux) { 
deviceOS = OS_TYPE_ENUM.LINUX; 
} 
return deviceOS; 
} 
/** 
* will be called only with the OS and family enum to prevent tempering. 
* @private 
*/ 
function cloneEnum(obj) { 
var resObj = {}; 
for (var key in obj) { 
resObj[key] = obj[key]; 
} 
return resObj; 
} 
function isMobile(){ 
return family() === FAMILY_TYPE_ENUM.MOBILE; 
} 
function isTablet(){ 
return family() === FAMILY_TYPE_ENUM.TABLET; 
} 
return { 
isMobile: isMobile, 
isTablet: isTablet 
}; 
}; 
unitsInitiator.register("browserDevice", browserDeviceDefinition, ["pNavigator","browserType"]); 
})(window.unitsInitiator); 
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
ECHO is off.
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
(function(unitsInitiator, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) { 
var browserStorageDefinition = function(pDocument, pEscape, pUnescape, pDate, utils){ 
// TODO (Gal) : do not get pEscape, pUnescape, the units which uses this unit should use them and supply a ready to use parameters 
/** 
* 
* if pDocument has a property "cookie" with a value, or a value can be created on a cookie - returns true 
*/ 
function isEnabled() { 
var enabled = false; 
if ("cookie" in pDocument){ 
if (pDocument.cookie.length > 0){ 
enabled = true; 
} else { 
var TEST = "test"; 
pDocument.cookie = TEST; 
if (pDocument.cookie.indexOf(TEST) > -1){ 
enabled = true; 
} 
} 
} 
return enabled; 
} 
/** 
* 
*  returns the text after <name=> up to the ; char. 
* if name doesn't exist it returns "" 
* if name is "" or undefined it returns null 
*/ 
function get(name) { 
var start = pDocument.cookie.indexOf(name + "="); 
if (name === "" || utils.isUndefined(name) || start === -1) { 
return null; 
} 
var len = start + name.length + 1; 
if (( !start ) && ( name != pDocument.cookie.substring(0, name.length) )) { 
return null; 
} 
var end = pDocument.cookie.indexOf(";", len); 
if (end == -1) { 
end = pDocument.cookie.length; 
} 
return pUnescape(pDocument.cookie.substring(len, end)); 
} 
/** 
* Sets "<name>=<value escaped using pEscape>;expires=<expires converted to GMT using pDate.toGMTString in date format>;path=/" in the injected pDocument.cookie 
*/ 
function set(name, value, daysToExpire) { 
if (name === "" || utils.isUndefined(name)){ 
return; 
} 
// set time, it's in milliseconds 
var today = new pDate(); 
today.setTime(today.getTime()); 
/* 
if the expires variable is set, make the correct 
expires time, the current script below will set 
it for x number of days, to make it for hours, 
delete * 24, for minutes, delete * 60 * 24 
*/ 
if (daysToExpire) { 
daysToExpire = daysToExpire * 1000 * 60 * 60 * 24; 
} 
var expires_date = new pDate(today.getTime() + (daysToExpire)); 
var escapedValue = ""; 
if (!utils.isUndefined(value)){ 
escapedValue = pEscape(value); 
} 
pDocument.cookie = name + "=" + escapedValue + 
( ( daysToExpire ) ? ";expires=" + expires_date.toGMTString() : "" ) + 
";path=/"; 
} 
/** 
* remove the cookie by setting the value of the <name> to "", and set the cookie expiration date to yesterday 
*/ 
function remove(name) { 
set(name, undefined, -1); //TODO (yoavp) check the process because it adds parameters to the string when removing wrong key 
} 
return { 
isEnabled: isEnabled, 
get: get, 
set: set, 
remove: remove 
}; 
}; 
ECHO is off.
unitsInitiator.register("browserStorage", browserStorageDefinition, ["pDocument", "pEscape", "pUnescape", "pDate", "utils"]); 
})(window.unitsInitiator); 
(function(unitsInitiator) { 
var browserType = function(pDocument, pNavigator, logger){ 
//-------------------------------------------------- 
// Based on device from lpTag.device 
//-------------------------------------------------- 
function isIE8(){ 
return pDocument.getElementById("ie8"); 
} 
function initIsIE() { 
var not_true = false; 
var docMode = pDocument.documentMode; 
var isIE = /*@cc_on!@*/not_true; // If conditional compilation works, then we have IE 11-. 
if (!isIE) { 
/// If document.documentMode is a number, then it is a read-only property, and so we have IE 8+. 
// Try to force this property to be a string. 
try { 
pDocument.documentMode = ""; 
} 
catch(ex) { 
// Nothing to do, fallback will be checked later 
} 
isIE = "number" === typeof pDocument.documentMode; 
// Switch back the value to be unobtrusive for non-IE browsers. 
try { 
pDocument.documentMode = docMode; 
} 
catch(ex) { 
// Nothing to do, fallback will be checked later 
} 
} 
if (!isIE && pNavigator && pNavigator.userAgent) { 
// Otherwise, if Trident exists in the user agent string, then we have IE 8+. 
isIE = "Netscape" === pNavigator.appName && 
/Trident\/.*rv:([0-9]{1,}[.0-9]{0,})/.test(pNavigator.userAgent); 
} 
// Otherwise, we have a non-IE browser. 
return isIE; 
} 
return { 
isIE8: isIE8, 
isIE: initIsIE 
}; 
}         
ECHO is off.
unitsInitiator.register("browserType", browserType, ["pDocument", "pNavigator", "logger"]); 
})(window.unitsInitiator); 
ECHO is off.
(function(unitsInitiator, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) { 
var browserUrlDefinition = function(pWindow, pDocument, pDecodeURIComponent, pEscape, pObject){ 
var queryParamsFromUrl = {}; 
function buildQueryParam(params) { 
var str = ""; 
for (var param in params) { 
str += "&" + param + "=" + params[param]; 
} 
if (str != "") { 
str = "?" + str.substring(1); 
} 
return str; 
} 
function parseQueryString() { 
var loc = (pWindow ? pWindow.location : pDocument.location); 
if (loc) { 
var newUrl = loc.search.split('#')[0]; 
var search = newUrl.split('?'); 
if(search.length === 2) { 
var args = search[1].split("&"); 
for (var ii = 0; ii < args.length; ii++){ 
var param = args[ii].split("="); 
if (param.length > 1 && param[1].length > 0) { 
if (param[0] === "usrId"){ 
try { 
queryParamsFromUrl[param[0]] = pDecodeURIComponent(pEscape(pDecodeURIComponent(pDecodeURIComponent(pEscape(param[1]))))); 
} catch (ex){ 
queryParamsFromUrl[param[0]] = pDecodeURIComponent(param[1]); 
} 
} else { 
queryParamsFromUrl[param[0]] = pDecodeURIComponent(param[1]); 
} 
} 
} 
} 
} 
} 
function getQueryStringParameterValue (name, defaultValue) { 
var param = defaultValue; 
if (queryParamsFromUrl) { 
param = queryParamsFromUrl[name]; 
var STRING_CLASS = '[object String]'; 
// TODO (Gal): move it to utils.isString 
if (!(typeof param == 'string' || pObject.prototype.toString.call(param) == STRING_CLASS) || 0 === param.length) { 
param = defaultValue; 
} 
} 
return param; 
} 
function addParameterFromQueryString(params, paramKey){ 
var paramValue = getQueryStringParameterValue(paramKey); 
if (paramValue != undefined && paramValue != null && paramValue != "") { 
params[paramKey] = paramValue; 
} 
return params; 
} 
function getAllQueryParams(){ 
return queryParamsFromUrl; 
} 
function getPathname(){ 
return pWindow.location.pathname; 
} 
function getHost(){ 
return pWindow.location.host; 
} 
function getDomain(){ 
return getProtocol() + "://" + getHost() + "/"; 
} 
function addHash(newUrl, afterHash) { 
if (afterHash) { 
return newUrl + "#" + afterHash; 
} 
else { 
return newUrl; 
} 
} 
function loadUrl(newUrl) { 
pWindow.location.href = newUrl; 
} 
function getProtocol(){ 
if (pDocument.location.toString().indexOf('https:') == 0){ 
return "https"; 
} else { 
return "http"; 
} 
} 
/////////////////////////////// 
//TODO:(daniel) Should we use the #?? 
////////////////////////////// 
function replaceParam(url, paramName, paramValue){ 
var searchHash = url.split("#"); 
var beforeHash = searchHash[0]; 
var afterHash = searchHash[1]; 
var pattern = new RegExp('('+paramName+'=).*?(&|$)'); 
var newUrl = beforeHash; 
if(beforeHash.search(pattern)>=0){ // Parameter exists, so replace it 
newUrl = beforeHash.replace(pattern,'$1' +   paramValue +  '$2'); 
} 
else{ // New parameter, so add it 
newUrl = newUrl + (newUrl.indexOf('?')>0 ? '&' : '?') + paramName + '='  + paramValue ; 
} 
return addHash(newUrl, afterHash); 
} 
function replaceUrlParam(paramName, paramValue){ 
var url = pWindow.location.href; 
var searchHash = url.split("#"); 
var beforeHash = searchHash[0]; 
var afterHash = searchHash[1]; 
var pattern = new RegExp('('+paramName+'=).*?(&|$)'); 
var newUrl = beforeHash; 
if(beforeHash.search(pattern) >= 0){ // Parameter exists, so replace it 
newUrl = beforeHash.replace(pattern,'$1' +   paramValue +  '$2'); 
} else{ // New parameter, so add it 
newUrl = newUrl + (newUrl.indexOf('?')>0 ? '&' : '?') + paramName + '='  + paramValue ; 
} 
loadUrl(addHash(newUrl, afterHash)); 
} 
parseQueryString(); 
return { 
buildQueryParam: buildQueryParam, 
getQueryStringParameterValue: getQueryStringParameterValue, 
addParameterFromQueryString: addParameterFromQueryString, 
getAllQueryParams: getAllQueryParams, 
replaceUrlParam: replaceUrlParam, 
replaceParam: replaceParam, 
loadUrl: loadUrl, 
getPathname: getPathname, 
getProtocol: getProtocol, 
getDomain: getDomain 
} 
}; 
unitsInitiator.register("browserUrl", browserUrlDefinition, ["pWindow", "pDocument", "pDecodeURIComponent", "pEscape", "pObject"]); 
ECHO is off.
})(window.unitsInitiator); 
ECHO is off.
(function(unitsInitiator, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) { 
var browserWindow = function(pWindow) { 
function getGlobal(name){ 
return pWindow[name]; 
} 
function addGlobal(name, obj){ 
pWindow[name] = obj; 
} 
function openWindow(url, windowName, windowFeatures){ 
pWindow.open(url, windowName, windowFeatures); 
} 
function scrollTo(x, y){ 
pWindow.scrollTo(x, y); 
} 
return { 
getGlobal: getGlobal, 
addGlobal: addGlobal, 
openWindow: openWindow, 
scrollTo: scrollTo 
}; 
} 
unitsInitiator.register("browserWindow", browserWindow, ["pWindow"]); 
})(window.unitsInitiator); 
// Gets action (URL) and fields, creates a form element and submit it 
// Maybe even not need to add the form to a parent element 
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout, console) { 
var FormDefinition = function(browserDom, logger) { 
return function theConstractor(options) { 
if (this.constructor !== theConstractor) { 
return new theConstractor(options); 
} 
var form; 
function submit() { 
if (form){ 
try { 
browserDom.removeElementByChild(browserDom.getBody(), form); 
} catch (ex){ 
logger.debug("Form > submit > can not remove form from body ex=" + ex + ", form=" + form + ", body=" + browserDom.getBody()); 
} 
} 
form = browserDom.createElement(browserDom.TAGS_ENUM.FORM, [{"attName": "action", "attValue": options.action}, 
{"attName": "method", "attValue": "post"}, 
{"attName": "target", "attValue": "_top"}, 
{"attName": "style", "attValue": "display: none"}], browserDom.getBody()); 
for (var name in options.fields){ 
browserDom.createElement(browserDom.TAGS_ENUM.INPUT, [{"attName": "name", "attValue": name}, 
{"attName": "value", "attValue": options.fields[name]}], form); 
} 
form.submit(); 
} 
return { 
submit: submit 
}; 
}; 
} 
unitsInitiator.register("Form", FormDefinition, ["browserDom"]); 
})(window.unitsInitiator); 
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) { 
var ConfigurationDefinition = function(JsonRequest, Occasions) { 
var EVENTS_DEFINITIONS_ENUM = { 
CONF_LOADED: "CONF_LOADED" 
}; 
var InstanceClass = function() { 
var occasions = Occasions.getInstance(); 
(function theConstructor(options) { 
loadConf(options); 
})(arguments[0]); 
function listenToConfigurationLoaded(callback){ 
occasions.afterPassed(EVENTS_DEFINITIONS_ENUM.CONF_LOADED, callback); 
} 
function onConfLoaded(conf) { 
occasions.trigger(EVENTS_DEFINITIONS_ENUM.CONF_LOADED, conf); 
} 
function loadConf(options) { 
var url = "./conf/authentication-conf.json"; 
if (options && options.url){ 
url = options.url; 
} 
JsonRequest.getInstance({ 
url: url, 
success: onConfLoaded, 
error: function (status) {} 
}); 
} 
return { 
listenToConfigurationLoaded: listenToConfigurationLoaded 
}; 
}; 
var singleton = new InstanceClass(); 
function getInstance(){ 
return singleton; 
} 
function getClass(){ 
return InstanceClass; 
} 
return { 
getInstance: getInstance, 
getClass: getClass 
}; 
}; 
unitsInitiator.register("Configuration", ConfigurationDefinition, ["JsonRequest", "Occasions"]); 
})(window.unitsInitiator); 
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
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout, console) { 
var loggerDefinition = function(LoggerConfiguration, pConsole, browserStorage) { 
var LOG_NAME = "lgnLog"; 
var LOG_LEVEL_ENUM = { 
NONE: 0, 
ERROR: 1, 
INFO: 2, 
DEBUG: 3 
}; 
var LOG_METHOD_ENUM = { 
CONSOLE: 0, 
COOKIE: 1 
}; 
var loggerConfiguration = LoggerConfiguration.getInstance(); 
var logLevel = LOG_LEVEL_ENUM.NONE; 
var logMethod = LOG_METHOD_ENUM.CONSOLE; 
function isLogLevelEnabled(requestedLogLevel){ 
return logLevel >= requestedLogLevel; 
} 
function log(message, messagelevel){ 
try { 
if (isLogLevelEnabled(messagelevel) && pConsole && pConsole.log){ 
if (logMethod === LOG_METHOD_ENUM.COOKIE){ 
var logStr = browserStorage.get(LOG_NAME); 
browserStorage.set(LOG_NAME, logStr + "\n" + message); 
} else { 
pConsole.log(message); 
} 
} 
} catch (ex){ 
// igrnore exception 
} 
} 
function info(message){ 
log(message, LOG_LEVEL_ENUM.INFO); 
} 
function error(message){ 
log("ERROR: " + message, LOG_LEVEL_ENUM.ERROR); 
} 
function debug(message){ 
log(message, LOG_LEVEL_ENUM.DEBUG); 
} 
function isLogLevelEnabled(requestedLogLevel){ 
return logLevel >= requestedLogLevel; 
} 
function isInfoEnabled(){ 
return isLogLevelEnabled(LOG_LEVEL_ENUM.INFO); 
} 
function isDebugEnabled(){ 
return isLogLevelEnabled(LOG_LEVEL_ENUM.DEBUG); 
} 
function onConfLoaded(conf){ 
if (conf.logLevel){ 
logLevel = LOG_LEVEL_ENUM[conf.logLevel]; 
} 
if (conf.logMethod){ 
logMethod = LOG_METHOD_ENUM[conf.logMethod]; 
} 
} 
function init(){ 
if (logMethod === LOG_METHOD_ENUM.COOKIE) { 
browserStorage.set(LOG_NAME, "Logger Start"); 
} 
loggerConfiguration.listenToConfigurationLoaded(onConfLoaded); 
} 
init(); 
return { 
info: info, 
error: error, 
debug: debug, 
isInfoEnabled: isInfoEnabled, 
isDebugEnabled: isDebugEnabled 
} 
}; 
unitsInitiator.register("logger", loggerDefinition, ["LoggerConfiguration", "pConsole", "browserStorage"]); 
})(window.unitsInitiator); 
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) { 
var loggerConfigurationDefinition = function(Configuration) { 
var URL = "./conf/authentication-logger-conf.json"; 
var InstanceClass = function() { 
var ConfigurationClass = Configuration.getClass(); 
return new ConfigurationClass({ 
url: URL 
}); 
}; 
var singleton = new InstanceClass(); 
function getInstance(){ 
return singleton; 
} 
return { 
getInstance: getInstance 
}; 
}; 
unitsInitiator.register("LoggerConfiguration", loggerConfigurationDefinition, ["Configuration"]); 
})(window.unitsInitiator); 
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
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) { 
var JsonRequestDefinition = function(Request, pJSON) { 
function getInstance(options){ 
var oldSuccess = options.success; 
options.success = function(event){ 
if (event && event.data){ 
var json = pJSON.parse(event.data.responseText); 
oldSuccess(json); 
} 
}; 
return Request.getInstance(options); 
} 
return { 
getInstance: getInstance 
}; 
}; 
unitsInitiator.register("JsonRequest", JsonRequestDefinition, ["Request", "pJSON"]); 
})(window.unitsInitiator); 
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object) { 
ECHO is off.
var RequestDefinition = function(pXMLHttpRequest, pActiveXObject, pConsole, Occasions) { 
var EVENTS_DEFINITIONS_ENUM = { 
SUCCESS: "SUCCESS", 
ERROR: "ERROR" 
}; 
var theClass = function() { 
var occasions = Occasions.getInstance(); 
var retryTimes = 0; 
ECHO is off.
(function theConstructor(options) { 
occasions.afterPassed(EVENTS_DEFINITIONS_ENUM.SUCCESS, options.success); 
occasions.afterPassed(EVENTS_DEFINITIONS_ENUM.ERROR, options.error); 
setTimeout(function(){ 
submit(options.url); 
},  
5); 
setTimeout(confLoadingTimeout, 5000); 
})(arguments[0]); 
function submit(url) { 
retryTimes += 1; 
var xhr = (("undefined" !== typeof pXMLHttpRequest) 
? new pXMLHttpRequest() 
: new pActiveXObject("Microsoft.XMLHTTP")); 
xhr.open("get", url, true); 
xhr.onreadystatechange = function () { 
var status; 
var data; 
// http://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate 
if (4 === xhr.readyState) { // 'DONE' 
status = xhr.status; 
if (200 === status) { 
try { 
occasions.trigger(EVENTS_DEFINITIONS_ENUM.SUCCESS, {responseText: xhr.responseText}); 
} 
catch(err) { 
if (retryTimes < 4){ 
submit(url) 
} else { 
occasions.trigger(EVENTS_DEFINITIONS_ENUM.ERROR, {err: err}); 
} 
} 
} 
else { 
if (retryTimes < 4){ 
submit(url) 
} else { 
occasions.trigger(EVENTS_DEFINITIONS_ENUM.ERROR, {status: status}); 
} 
} 
} 
}; 
xhr.send(); 
} 
function confLoadingTimeout(){ 
if (!occasions.isPassed(EVENTS_DEFINITIONS_ENUM.SUCCESS) && pConsole && pConsole.log){ 
pConsole.log("configuration> confLoadingTimeout > FAIL"); 
} 
} 
}; 
function getInstance(options){ 
return new theClass(options); 
} 
return { 
/** 
* @param options = { 
*    containerId: the id of the HTML elements that contains this view, 
*     rememberMeEnabled: Is the remember me checkbox in the view can be changed, 
*     model = { 
*        siteId: The init value of the site field, 
*        userId: The init value of the user field, 
*        rememberMe: The init value in the remember me checkbox 
*     } 
* } 
*/ 
getInstance: getInstance 
}; 
}; 
unitsInitiator.register("Request", RequestDefinition, ["pXMLHttpRequest", "pActiveXObject", "pConsole", "Occasions"]); 
})(window.unitsInitiator); 
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) { 
var collectionUtils = function(pSetTimeout){ 
function forEach(array, action, context){ 
if (array !== null && array instanceof Array){ 
doAction(array, 0, action, context); 
} 
} 
function doAction(array, index, action, context){ 
action(array[index], context); 
pSetTimeout(function(){ 
doAction(array, index++, action, context); 
},0); 
} 
return { 
forEach: forEach 
}; 
}; 
unitsInitiator.register("collectionUtils", collectionUtils, ["pSetTimeout"]); 
})(window.unitsInitiator); 
(function(unitsInitiator, window, document, navigator, XMLHttpRequest, ActiveXObject, JSON, decodeURIComponent, escape, unescape, Date, Object, setTimeout) { 
var utils = function(){ 
var string = function() { 
function trim(str) { 
return str && str.replace(/^\s+|\s+$/g, ''); 
} 
return { 
trim: trim 
}; 
}(); 
function isUndefined(value){ 
return typeof value == "undefined"; 
} 
function isExist(value){ 
return !isUndefined(value) && value && value !== ""; 
} 
return { 
string: string, 
isUndefined: isUndefined, 
/** 
* Not undifined and not null and not "" (empty string) 
*/ 
isExist: isExist 
} 
} 
unitsInitiator.register("utils", utils, []); 
})(window.unitsInitiator); 
name=Eclipse Platform 
id=org.eclipse.platform 
version=4.7.0 
-startup 
plugins/org.eclipse.equinox.launcher_1.4.0.v20161219-1356.jar 
--launcher.library 
C:\Users\roni\.p2\pool\plugins\org.eclipse.equinox.launcher.win32.win32.x86_64_1.1.500.v20170531-1133 
-product 
org.eclipse.epp.package.java.product 
-showsplash 
org.eclipse.epp.package.common 
--launcher.defaultAction 
openFile 
--launcher.appendVmargs 
-vmargs 
-Dosgi.requiredJavaVersion=1.8 
-Dosgi.instance.area.default=@user.home/eclipse-workspace 
-XX:+UseG1GC 
-XX:+UseStringDeduplication 
-Dosgi.requiredJavaVersion=1.8 
-Xms256m 
-Xmx1024m 
-Declipse.p2.max.threads=10 
-Doomph.update.url=http://download.eclipse.org/oomph/updates/milestone/latest 
-Doomph.redirection.index.redirection=index:/->http://git.eclipse.org/c/oomph/org.eclipse.oomph.git/plain/setups/ 
#This configuration file was written by: org.eclipse.oomph.p2.internal.core.AgentImpl 
#Wed Aug 02 00:11:10 IDT 2017 
org.eclipse.update.reconcile=false 
eclipse.p2.profile=C__Users_roni_eclipse_java-oxygen_eclipse 
osgi.instance.area.default=@user.home/workspace 
osgi.framework=file\:/C\:/Users/roni/.p2/pool/plugins/org.eclipse.osgi_3.12.0.v20170512-1932.jar 
equinox.use.ds=true 
eclipse.buildId=4.7.0.I20170612-0950 
ds.delayed.keepInstances=true 
osgi.bundles=reference\:file\:org.eclipse.equinox.simpleconfigurator_1.2.0.v20170110-1705.jar@1\:start 
org.eclipse.equinox.simpleconfigurator.configUrl=file\:org.eclipse.equinox.simpleconfigurator/bundles.info 
eclipse.product=org.eclipse.platform.ide 
osgi.splashPath=file\:/C\:/Users/roni/.p2/pool/plugins/org.eclipse.platform_4.7.0.v20170612-0950 
osgi.framework.extensions=reference\:file\:org.eclipse.osgi.compatibility.state_1.1.0.v20170516-1513.jar 
eclipse.application=org.eclipse.ui.ide.workbench 
eclipse.p2.data.area=file\:/C\:/Users/roni/.p2/ 
osgi.bundles.defaultStartLevel=4 
eclipse.preferences.version=1 
showOpenFavoritesNotification=false 
eclipse.preferences.version=1 
gc_enabled=false 
MAX_RECENT_WORKSPACES=10 
RECENT_WORKSPACES=D\:\\GAL\\eclipse-workspace\\clientbinder\nD\:\\GAL\\eclipse-workspace\\korenSaas\nD\:\\GAL\\eclipse-workspace 
RECENT_WORKSPACES_PROTOCOL=3 
SHOW_RECENT_WORKSPACES=false 
SHOW_WORKSPACE_SELECTION_DIALOG=true 
eclipse.preferences.version=1 
name=Eclipse Platform 
id=org.eclipse.platform 
version=4.7.0 
-startup 
plugins/org.eclipse.equinox.launcher_1.4.0.v20161219-1356.jar 
--launcher.library 
C:\Users\roni\.p2\pool\plugins\org.eclipse.equinox.launcher.win32.win32.x86_64_1.1.500.v20170531-1133 
-product 
org.eclipse.epp.package.java.product 
-showsplash 
org.eclipse.epp.package.common 
--launcher.defaultAction 
openFile 
--launcher.appendVmargs 
-vmargs 
-Dosgi.requiredJavaVersion=1.8 
-Dosgi.instance.area.default=@user.home/eclipse-workspace 
-XX:+UseG1GC 
-XX:+UseStringDeduplication 
-Dosgi.requiredJavaVersion=1.8 
-Xms256m 
-Xmx1024m 
-Declipse.p2.max.threads=10 
-Doomph.update.url=http://download.eclipse.org/oomph/updates/milestone/latest 
-Doomph.redirection.index.redirection=index:/->http://git.eclipse.org/c/oomph/org.eclipse.oomph.git/plain/setups/ 
#This configuration file was written by: org.eclipse.oomph.p2.internal.core.AgentImpl 
#Wed Aug 02 00:11:10 IDT 2017 
org.eclipse.update.reconcile=false 
eclipse.p2.profile=C__Users_roni_eclipse_java-oxygen_eclipse 
osgi.instance.area.default=@user.home/workspace 
osgi.framework=file\:/C\:/Users/roni/.p2/pool/plugins/org.eclipse.osgi_3.12.0.v20170512-1932.jar 
equinox.use.ds=true 
eclipse.buildId=4.7.0.I20170612-0950 
ds.delayed.keepInstances=true 
osgi.bundles=reference\:file\:org.eclipse.equinox.simpleconfigurator_1.2.0.v20170110-1705.jar@1\:start 
org.eclipse.equinox.simpleconfigurator.configUrl=file\:org.eclipse.equinox.simpleconfigurator/bundles.info 
eclipse.product=org.eclipse.platform.ide 
osgi.splashPath=file\:/C\:/Users/roni/.p2/pool/plugins/org.eclipse.platform_4.7.0.v20170612-0950 
osgi.framework.extensions=reference\:file\:org.eclipse.osgi.compatibility.state_1.1.0.v20170516-1513.jar 
eclipse.application=org.eclipse.ui.ide.workbench 
eclipse.p2.data.area=file\:/C\:/Users/roni/.p2/ 
osgi.bundles.defaultStartLevel=4 
eclipse.preferences.version=1 
showOpenFavoritesNotification=false 
eclipse.preferences.version=1 
gc_enabled=false 
MAX_RECENT_WORKSPACES=10 
RECENT_WORKSPACES=D\:\\GAL\\eclipse-workspace\\clientbinder\nD\:\\GAL\\eclipse-workspace\\korenSaas\nD\:\\GAL\\eclipse-workspace 
RECENT_WORKSPACES_PROTOCOL=3 
SHOW_RECENT_WORKSPACES=false 
SHOW_WORKSPACE_SELECTION_DIALOG=true 
eclipse.preferences.version=1 
#safe table 
#Wed Aug 02 00:46:50 IDT 2017 
.contributors=0 
.table=0 
.mainData=0 
.namespaces=0 
.orphans=0 
.extraData=0 
.contributions=0 
.crc0b10a8f5.v1 
#safe table 
#Wed Aug 02 00:46:51 IDT 2017 
.contributors=1 
.table=1 
.mainData=1 
.namespaces=1 
.orphans=1 
.extraData=1 
.contributions=1 
.crce4957633.v1 
#encoding=UTF-8 
#version=1 
ch.qos.logback.classic,1.0.7.v20121108-1250,file:/C:/Users/roni/.p2/pool/plugins/ch.qos.logback.classic_1.0.7.v20121108-1250.jar,4,false 
ch.qos.logback.core,1.0.7.v20121108-1250,file:/C:/Users/roni/.p2/pool/plugins/ch.qos.logback.core_1.0.7.v20121108-1250.jar,4,false 
ch.qos.logback.slf4j,1.0.7.v201505121915,file:/C:/Users/roni/.p2/pool/plugins/ch.qos.logback.slf4j_1.0.7.v201505121915.jar,4,false 
com.google.gson,2.7.0.v20170129-0911,file:/C:/Users/roni/.p2/pool/plugins/com.google.gson_2.7.0.v20170129-0911.jar,4,false 
com.google.guava,21.0.0.v20170206-1425,file:/C:/Users/roni/.p2/pool/plugins/com.google.guava_21.0.0.v20170206-1425.jar,4,false 
com.google.guava,15.0.0.v201403281430,file:/C:/Users/roni/.p2/pool/plugins/com.google.guava_15.0.0.v201403281430.jar,4,false 
com.google.inject,3.0.0.v201312141243,file:/C:/Users/roni/.p2/pool/plugins/com.google.inject_3.0.0.v201312141243.jar,4,false 
com.google.inject.multibindings,3.0.0.v201402270930,file:/C:/Users/roni/.p2/pool/plugins/com.google.inject.multibindings_3.0.0.v201402270930.jar,4,false 
com.gradleware.tooling.client,0.19.0.v20170412105839,file:/C:/Users/roni/.p2/pool/plugins/com.gradleware.tooling.client_0.19.0.v20170412105839.jar,4,false 
com.gradleware.tooling.model,0.19.0.v20170412105839,file:/C:/Users/roni/.p2/pool/plugins/com.gradleware.tooling.model_0.19.0.v20170412105839.jar,4,false 
com.gradleware.tooling.utils,0.19.0.v20170412105839,file:/C:/Users/roni/.p2/pool/plugins/com.gradleware.tooling.utils_0.19.0.v20170412105839.jar,4,false 
com.ibm.icu,58.2.0.v20170418-1837,file:/C:/Users/roni/.p2/pool/plugins/com.ibm.icu_58.2.0.v20170418-1837.jar,4,false 
com.jcraft.jsch,0.1.54.v20170116-1932,file:/C:/Users/roni/.p2/pool/plugins/com.jcraft.jsch_0.1.54.v20170116-1932.jar,4,false 
com.sun.el,2.2.0.v201303151357,file:/C:/Users/roni/.p2/pool/plugins/com.sun.el_2.2.0.v201303151357.jar,4,false 
com.sun.jna,4.1.0.v20170410-1117,file:/C:/Users/roni/.p2/pool/plugins/com.sun.jna_4.1.0.v20170410-1117.jar,4,false 
com.sun.jna.platform,4.1.0.v20170410-1117,file:/C:/Users/roni/.p2/pool/plugins/com.sun.jna.platform_4.1.0.v20170410-1117.jar,4,false 
javaewah,1.1.6.v20160919-1400,file:/C:/Users/roni/.p2/pool/plugins/javaewah_1.1.6.v20160919-1400.jar,4,false 
javax.annotation,1.2.0.v201602091430,file:/C:/Users/roni/.p2/pool/plugins/javax.annotation_1.2.0.v201602091430.jar,4,false 
javax.el,2.2.0.v201303151357,file:/C:/Users/roni/.p2/pool/plugins/javax.el_2.2.0.v201303151357.jar,4,false 
javax.inject,1.0.0.v20091030,file:/C:/Users/roni/.p2/pool/plugins/javax.inject_1.0.0.v20091030.jar,4,false 
javax.servlet,3.1.0.v201410161800,file:/C:/Users/roni/.p2/pool/plugins/javax.servlet_3.1.0.v201410161800.jar,4,false 
javax.servlet.jsp,2.2.0.v201112011158,file:/C:/Users/roni/.p2/pool/plugins/javax.servlet.jsp_2.2.0.v201112011158.jar,4,false 
javax.xml,1.3.4.v201005080400,file:/C:/Users/roni/.p2/pool/plugins/javax.xml_1.3.4.v201005080400.jar,4,false 
org.apache.ant,1.10.1.v20170504-0840,file:/C:/Users/roni/.p2/pool/plugins/org.apache.ant_1.10.1.v20170504-0840,4,false 
org.apache.batik.css,1.8.0.v20170214-1941,file:/C:/Users/roni/.p2/pool/plugins/org.apache.batik.css_1.8.0.v20170214-1941.jar,4,false 
org.apache.batik.util,1.8.0.v20170214-1941,file:/C:/Users/roni/.p2/pool/plugins/org.apache.batik.util_1.8.0.v20170214-1941.jar,4,false 
org.apache.batik.util.gui,1.8.0.v20170214-1941,file:/C:/Users/roni/.p2/pool/plugins/org.apache.batik.util.gui_1.8.0.v20170214-1941.jar,4,false 
org.apache.commons.codec,1.9.0.v20170208-1614,file:/C:/Users/roni/.p2/pool/plugins/org.apache.commons.codec_1.9.0.v20170208-1614.jar,4,false 
org.apache.commons.compress,1.6.0.v201310281400,file:/C:/Users/roni/.p2/pool/plugins/org.apache.commons.compress_1.6.0.v201310281400.jar,4,false 
org.apache.commons.httpclient,3.1.0.v201012070820,file:/C:/Users/roni/.p2/pool/plugins/org.apache.commons.httpclient_3.1.0.v201012070820.jar,4,false 
org.apache.commons.io,2.2.0.v201405211200,file:/C:/Users/roni/.p2/pool/plugins/org.apache.commons.io_2.2.0.v201405211200.jar,4,false 
org.apache.commons.jxpath,1.3.0.v200911051830,file:/C:/Users/roni/.p2/pool/plugins/org.apache.commons.jxpath_1.3.0.v200911051830.jar,4,false 
org.apache.commons.lang,2.6.0.v201404270220,file:/C:/Users/roni/.p2/pool/plugins/org.apache.commons.lang_2.6.0.v201404270220.jar,4,false 
org.apache.commons.lang3,3.1.0.v201403281430,file:/C:/Users/roni/.p2/pool/plugins/org.apache.commons.lang3_3.1.0.v201403281430.jar,4,false 
org.apache.commons.logging,1.1.1.v201101211721,file:/C:/Users/roni/.p2/pool/plugins/org.apache.commons.logging_1.1.1.v201101211721.jar,4,false 
org.apache.commons.math,2.1.0.v201105210652,file:/C:/Users/roni/.p2/pool/plugins/org.apache.commons.math_2.1.0.v201105210652.jar,4,false 
org.apache.commons.pool,1.6.0.v201204271246,file:/C:/Users/roni/.p2/pool/plugins/org.apache.commons.pool_1.6.0.v201204271246.jar,4,false 
org.apache.felix.gogo.command,0.10.0.v201209301215,file:/C:/Users/roni/.p2/pool/plugins/org.apache.felix.gogo.command_0.10.0.v201209301215.jar,4,false 
org.apache.felix.gogo.runtime,0.10.0.v201209301036,file:/C:/Users/roni/.p2/pool/plugins/org.apache.felix.gogo.runtime_0.10.0.v201209301036.jar,4,false 
org.apache.felix.gogo.shell,0.10.0.v201212101605,file:/C:/Users/roni/.p2/pool/plugins/org.apache.felix.gogo.shell_0.10.0.v201212101605.jar,4,false 
org.apache.felix.scr,2.0.10.v20170501-2007,file:/C:/Users/roni/.p2/pool/plugins/org.apache.felix.scr_2.0.10.v20170501-2007.jar,4,false 
org.apache.httpcomponents.httpclient,4.5.2.v20170210-0925,file:/C:/Users/roni/.p2/pool/plugins/org.apache.httpcomponents.httpclient_4.5.2.v20170210-0925.jar,4,false 
org.apache.httpcomponents.httpclient.win,4.5.2.v20170410-1149,file:/C:/Users/roni/.p2/pool/plugins/org.apache.httpcomponents.httpclient.win_4.5.2.v20170410-1149.jar,4,false 
org.apache.httpcomponents.httpcore,4.4.6.v20170210-0925,file:/C:/Users/roni/.p2/pool/plugins/org.apache.httpcomponents.httpcore_4.4.6.v20170210-0925.jar,4,false 
org.apache.jasper.glassfish,2.2.2.v201501141630,file:/C:/Users/roni/.p2/pool/plugins/org.apache.jasper.glassfish_2.2.2.v201501141630.jar,4,false 
org.apache.log4j,1.2.15.v201012070815,file:/C:/Users/roni/.p2/pool/plugins/org.apache.log4j_1.2.15.v201012070815.jar,4,false 
org.apache.lucene.analyzers-common,6.1.0.v20161115-1612,file:/C:/Users/roni/.p2/pool/plugins/org.apache.lucene.analyzers-common_6.1.0.v20161115-1612.jar,4,false 
org.apache.lucene.analyzers-smartcn,6.1.0.v20161115-1612,file:/C:/Users/roni/.p2/pool/plugins/org.apache.lucene.analyzers-smartcn_6.1.0.v20161115-1612.jar,4,false 
org.apache.lucene.core,6.1.0.v20161115-1612,file:/C:/Users/roni/.p2/pool/plugins/org.apache.lucene.core_6.1.0.v20161115-1612.jar,4,false 
org.apache.lucene.core,3.5.0.v20120725-1805,file:/C:/Users/roni/.p2/pool/plugins/org.apache.lucene.core_3.5.0.v20120725-1805.jar,4,false 
org.apache.lucene.misc,6.1.0.v20161115-1612,file:/C:/Users/roni/.p2/pool/plugins/org.apache.lucene.misc_6.1.0.v20161115-1612.jar,4,false 
org.apache.lucene.queryparser,6.1.0.v20161115-1612,file:/C:/Users/roni/.p2/pool/plugins/org.apache.lucene.queryparser_6.1.0.v20161115-1612.jar,4,false 
org.apache.maven.resolver.api,1.0.3.v20170405-0725,file:/C:/Users/roni/.p2/pool/plugins/org.apache.maven.resolver.api_1.0.3.v20170405-0725.jar,4,false 
org.apache.maven.resolver.connector.basic,1.0.3.v20170405-0725,file:/C:/Users/roni/.p2/pool/plugins/org.apache.maven.resolver.connector.basic_1.0.3.v20170405-0725.jar,4,false 
org.apache.maven.resolver.impl,1.0.3.v20170405-0725,file:/C:/Users/roni/.p2/pool/plugins/org.apache.maven.resolver.impl_1.0.3.v20170405-0725.jar,4,false 
org.apache.maven.resolver.spi,1.0.3.v20170405-0725,file:/C:/Users/roni/.p2/pool/plugins/org.apache.maven.resolver.spi_1.0.3.v20170405-0725.jar,4,false 
org.apache.maven.resolver.transport.file,1.0.3.v20170405-0725,file:/C:/Users/roni/.p2/pool/plugins/org.apache.maven.resolver.transport.file_1.0.3.v20170405-0725.jar,4,false 
org.apache.maven.resolver.transport.http,1.0.3.v20170405-0725,file:/C:/Users/roni/.p2/pool/plugins/org.apache.maven.resolver.transport.http_1.0.3.v20170405-0725.jar,4,false 
org.apache.maven.resolver.util,1.0.3.v20170405-0725,file:/C:/Users/roni/.p2/pool/plugins/org.apache.maven.resolver.util_1.0.3.v20170405-0725.jar,4,false 
org.apache.solr.client.solrj,3.5.0.v20150506-0844,file:/C:/Users/roni/.p2/pool/plugins/org.apache.solr.client.solrj_3.5.0.v20150506-0844.jar,4,false 
org.apache.ws.commons.util,1.0.1.v20100518-1140,file:/C:/Users/roni/.p2/pool/plugins/org.apache.ws.commons.util_1.0.1.v20100518-1140.jar,4,false 
org.apache.xerces,2.9.0.v201101211617,file:/C:/Users/roni/.p2/pool/plugins/org.apache.xerces_2.9.0.v201101211617.jar,4,false 
org.apache.xml.resolver,1.2.0.v201005080400,file:/C:/Users/roni/.p2/pool/plugins/org.apache.xml.resolver_1.2.0.v201005080400.jar,4,false 
org.apache.xml.serializer,2.7.1.v201005080400,file:/C:/Users/roni/.p2/pool/plugins/org.apache.xml.serializer_2.7.1.v201005080400.jar,4,false 
org.apache.xmlrpc,3.0.0.v20100427-1100,file:/C:/Users/roni/.p2/pool/plugins/org.apache.xmlrpc_3.0.0.v20100427-1100.jar,4,false 
org.eclipse.aether.maven,3.1.0.v20140706-2237,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.aether.maven_3.1.0.v20140706-2237.jar,4,false 
org.eclipse.ant.core,3.5.0.v20170509-2149,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ant.core_3.5.0.v20170509-2149.jar,4,false 
org.eclipse.ant.launching,1.2.0.v20170509-2157,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ant.launching_1.2.0.v20170509-2157.jar,4,false 
org.eclipse.ant.ui,3.7.0.v20170412-1054,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ant.ui_3.7.0.v20170412-1054.jar,4,false 
org.eclipse.buildship.branding,2.0.2.v20170420-0909,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.buildship.branding_2.0.2.v20170420-0909.jar,4,false 
org.eclipse.buildship.core,2.0.2.v20170420-0909,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.buildship.core_2.0.2.v20170420-0909.jar,4,false 
org.eclipse.buildship.stsmigration,2.0.2.v20170420-0909,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.buildship.stsmigration_2.0.2.v20170420-0909.jar,4,false 
org.eclipse.buildship.ui,2.0.2.v20170420-0909,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.buildship.ui_2.0.2.v20170420-0909.jar,4,false 
org.eclipse.compare,3.7.100.v20170303-1847,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.compare_3.7.100.v20170303-1847.jar,4,false 
org.eclipse.compare.core,3.6.100.v20170516-0820,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.compare.core_3.6.100.v20170516-0820.jar,4,false 
org.eclipse.compare.win32,1.2.0.v20170517-0839,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.compare.win32_1.2.0.v20170517-0839.jar,4,false 
org.eclipse.core.commands,3.9.0.v20170530-1048,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.commands_3.9.0.v20170530-1048.jar,4,false 
org.eclipse.core.contenttype,3.6.0.v20170207-1037,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.contenttype_3.6.0.v20170207-1037.jar,4,false 
org.eclipse.core.databinding,1.6.100.v20170515-1119,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.databinding_1.6.100.v20170515-1119.jar,4,false 
org.eclipse.core.databinding.beans,1.4.0.v20170210-0856,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.databinding.beans_1.4.0.v20170210-0856.jar,4,false 
org.eclipse.core.databinding.observable,1.6.100.v20170515-1119,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.databinding.observable_1.6.100.v20170515-1119.jar,4,false 
org.eclipse.core.databinding.property,1.6.100.v20170515-1119,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.databinding.property_1.6.100.v20170515-1119.jar,4,false 
org.eclipse.core.expressions,3.6.0.v20170207-1037,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.expressions_3.6.0.v20170207-1037.jar,4,false 
org.eclipse.core.externaltools,1.1.0.v20170113-2056,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.externaltools_1.1.0.v20170113-2056.jar,4,false 
org.eclipse.core.filebuffers,3.6.100.v20170203-1130,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.filebuffers_3.6.100.v20170203-1130.jar,4,false 
org.eclipse.core.filesystem,1.7.0.v20170406-1337,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.filesystem_1.7.0.v20170406-1337.jar,4,false 
org.eclipse.core.filesystem.win32.x86_64,1.4.0.v20140124-1940,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.filesystem.win32.x86_64_1.4.0.v20140124-1940.jar,4,false 
org.eclipse.core.jobs,3.9.0.v20170322-0013,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.jobs_3.9.0.v20170322-0013.jar,4,false 
org.eclipse.core.net,1.3.100.v20170516-0820,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.net_1.3.100.v20170516-0820.jar,4,false 
org.eclipse.core.net.win32.x86_64,1.1.0.v20160323-1650,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.net.win32.x86_64_1.1.0.v20160323-1650.jar,4,false 
org.eclipse.core.resources,3.12.0.v20170417-1558,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.resources_3.12.0.v20170417-1558.jar,4,false 
org.eclipse.core.resources.win32.x86_64,3.5.100.v20170516-0925,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.resources.win32.x86_64_3.5.100.v20170516-0925.jar,4,false 
org.eclipse.core.runtime,3.13.0.v20170207-1030,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.runtime_3.13.0.v20170207-1030.jar,4,true 
org.eclipse.core.variables,3.4.0.v20170113-2056,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.core.variables_3.4.0.v20170113-2056.jar,4,false 
org.eclipse.debug.core,3.11.0.v20170605-1534,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.debug.core_3.11.0.v20170605-1534.jar,4,false 
org.eclipse.debug.ui,3.12.0.v20170605-1534,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.debug.ui_3.12.0.v20170605-1534.jar,4,false 
org.eclipse.draw2d,3.10.100.201606061308,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.draw2d_3.10.100.201606061308.jar,4,false 
org.eclipse.e4.core.commands,0.12.100.v20170513-0428,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.core.commands_0.12.100.v20170513-0428.jar,4,false 
org.eclipse.e4.core.contexts,1.6.0.v20170322-1144,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.core.contexts_1.6.0.v20170322-1144.jar,4,false 
org.eclipse.e4.core.di,1.6.100.v20170421-1418,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.core.di_1.6.100.v20170421-1418.jar,4,false 
org.eclipse.e4.core.di.annotations,1.6.0.v20170119-2002,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.core.di.annotations_1.6.0.v20170119-2002.jar,4,false 
org.eclipse.e4.core.di.extensions,0.15.0.v20170228-1728,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.core.di.extensions_0.15.0.v20170228-1728.jar,4,false 
org.eclipse.e4.core.di.extensions.supplier,0.15.0.v20170407-0928,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.core.di.extensions.supplier_0.15.0.v20170407-0928.jar,4,false 
org.eclipse.e4.core.services,2.1.0.v20170407-0928,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.core.services_2.1.0.v20170407-0928.jar,4,false 
org.eclipse.e4.emf.xpath,0.2.0.v20160630-0728,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.emf.xpath_0.2.0.v20160630-0728.jar,4,false 
org.eclipse.e4.ui.bindings,0.12.0.v20170312-2302,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.bindings_0.12.0.v20170312-2302.jar,4,false 
org.eclipse.e4.ui.css.core,0.12.100.v20170526-1635,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.css.core_0.12.100.v20170526-1635.jar,4,false 
org.eclipse.e4.ui.css.swt,0.13.0.v20170516-1617,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.css.swt_0.13.0.v20170516-1617.jar,4,false 
org.eclipse.e4.ui.css.swt.theme,0.11.0.v20170312-2302,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.css.swt.theme_0.11.0.v20170312-2302.jar,4,false 
org.eclipse.e4.ui.di,1.2.100.v20170414-1137,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.di_1.2.100.v20170414-1137.jar,4,false 
org.eclipse.e4.ui.dialogs,1.1.100.v20170104-1425,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.dialogs_1.1.100.v20170104-1425.jar,4,false 
org.eclipse.e4.ui.model.workbench,2.0.0.v20170228-1842,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.model.workbench_2.0.0.v20170228-1842.jar,4,false 
org.eclipse.e4.ui.services,1.3.0.v20170307-2032,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.services_1.3.0.v20170307-2032.jar,4,false 
org.eclipse.e4.ui.widgets,1.2.0.v20160630-0736,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.widgets_1.2.0.v20160630-0736.jar,4,false 
org.eclipse.e4.ui.workbench,1.5.0.v20170412-0908,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.workbench_1.5.0.v20170412-0908.jar,4,false 
org.eclipse.e4.ui.workbench.addons.swt,1.3.1.v20170319-1442,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.workbench.addons.swt_1.3.1.v20170319-1442.jar,4,false 
org.eclipse.e4.ui.workbench.renderers.swt,0.14.100.v20170612-1255,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.workbench.renderers.swt_0.14.100.v20170612-1255.jar,4,false 
org.eclipse.e4.ui.workbench.swt,0.14.100.v20170519-1601,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.workbench.swt_0.14.100.v20170519-1601.jar,4,false 
org.eclipse.e4.ui.workbench3,0.14.0.v20160630-0740,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.e4.ui.workbench3_0.14.0.v20160630-0740.jar,4,false 
org.eclipse.ecf,3.8.0.v20170104-0657,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ecf_3.8.0.v20170104-0657.jar,4,false 
org.eclipse.ecf.filetransfer,5.0.0.v20160817-1024,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ecf.filetransfer_5.0.0.v20160817-1024.jar,4,false 
org.eclipse.ecf.identity,3.8.0.v20161203-2153,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ecf.identity_3.8.0.v20161203-2153.jar,4,false 
org.eclipse.ecf.provider.filetransfer,3.2.300.v20161203-1840,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ecf.provider.filetransfer_3.2.300.v20161203-1840.jar,4,false 
org.eclipse.ecf.provider.filetransfer.httpclient4,1.1.200.v20170314-0133,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ecf.provider.filetransfer.httpclient4_1.1.200.v20170314-0133.jar,4,false 
org.eclipse.ecf.provider.filetransfer.httpclient4.ssl,1.1.0.v20160817-1024,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ecf.provider.filetransfer.httpclient4.ssl_1.1.0.v20160817-1024.jar,4,false 
org.eclipse.ecf.provider.filetransfer.ssl,1.0.0.v20160817-1024,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ecf.provider.filetransfer.ssl_1.0.0.v20160817-1024.jar,4,false 
org.eclipse.ecf.ssl,1.2.0.v20160817-1024,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ecf.ssl_1.2.0.v20160817-1024.jar,4,false 
org.eclipse.eclemma.core,3.0.0.201706140232,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.eclemma.core_3.0.0.201706140232.jar,4,false 
org.eclipse.eclemma.doc,3.0.0.201706140232,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.eclemma.doc_3.0.0.201706140232.jar,4,false 
org.eclipse.eclemma.ui,3.0.0.201706140232,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.eclemma.ui_3.0.0.201706140232.jar,4,false 
org.eclipse.egit,4.8.0.201706111038-r,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.egit_4.8.0.201706111038-r.jar,4,false 
org.eclipse.egit.core,4.8.0.201706111038-r,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.egit.core_4.8.0.201706111038-r.jar,4,false 
org.eclipse.egit.doc,4.8.0.201706111038-r,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.egit.doc_4.8.0.201706111038-r.jar,4,false 
org.eclipse.egit.mylyn.ui,4.8.0.201706111038-r,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.egit.mylyn.ui_4.8.0.201706111038-r.jar,4,false 
org.eclipse.egit.ui,4.8.0.201706111038-r,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.egit.ui_4.8.0.201706111038-r.jar,4,false 
org.eclipse.emf.common,2.13.0.v20170609-0707,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.emf.common_2.13.0.v20170609-0707.jar,4,false 
org.eclipse.emf.common.ui,2.12.0.v20170609-0928,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.emf.common.ui_2.12.0.v20170609-0928.jar,4,false 
org.eclipse.emf.databinding,1.3.0.v20170609-0928,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.emf.databinding_1.3.0.v20170609-0928.jar,4,false 
org.eclipse.emf.ecore,2.13.0.v20170609-0707,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.emf.ecore_2.13.0.v20170609-0707.jar,4,false 
org.eclipse.emf.ecore.change,2.11.0.v20170609-0707,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.emf.ecore.change_2.11.0.v20170609-0707.jar,4,false 
org.eclipse.emf.ecore.edit,2.9.0.v20170609-0928,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.emf.ecore.edit_2.9.0.v20170609-0928.jar,4,false 
org.eclipse.emf.ecore.xmi,2.13.0.v20170609-0707,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.emf.ecore.xmi_2.13.0.v20170609-0707.jar,4,false 
org.eclipse.emf.edit,2.12.0.v20170609-0928,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.emf.edit_2.12.0.v20170609-0928.jar,4,false 
org.eclipse.emf.edit.ui,2.13.0.v20170609-0928,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.emf.edit.ui_2.13.0.v20170609-0928.jar,4,false 
org.eclipse.epp.logging.aeri.core,2.0.5.v20170613-1207,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.epp.logging.aeri.core_2.0.5.v20170613-1207.jar,4,false 
org.eclipse.epp.logging.aeri.ide,2.0.5.v20170613-1207,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.epp.logging.aeri.ide_2.0.5.v20170613-1207.jar,4,false 
org.eclipse.epp.mpc.core,1.6.0.v20170614-1943,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.epp.mpc.core_1.6.0.v20170614-1943.jar,4,false 
org.eclipse.epp.mpc.core.win32,1.6.0.v20170511-1445,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.epp.mpc.core.win32_1.6.0.v20170511-1445.jar,4,false 
org.eclipse.epp.mpc.help.ui,1.6.0.v20170516-1025,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.epp.mpc.help.ui_1.6.0.v20170516-1025.jar,4,false 
org.eclipse.epp.mpc.ui,1.6.0.v20170616-0843,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.epp.mpc.ui_1.6.0.v20170616-0843.jar,4,false 
org.eclipse.epp.package.common,4.7.0.20170620-1800,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.epp.package.common_4.7.0.20170620-1800,4,false 
org.eclipse.epp.package.java,4.7.0.20170620-1800,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.epp.package.java_4.7.0.20170620-1800,4,false 
org.eclipse.equinox.app,1.3.400.v20150715-1528,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.app_1.3.400.v20150715-1528.jar,4,false 
org.eclipse.equinox.bidi,1.1.0.v20160728-1031,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.bidi_1.1.0.v20160728-1031.jar,4,false 
org.eclipse.equinox.common,3.9.0.v20170207-1454,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.common_3.9.0.v20170207-1454.jar,2,true 
org.eclipse.equinox.concurrent,1.1.0.v20130327-1442,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.concurrent_1.1.0.v20130327-1442.jar,4,false 
org.eclipse.equinox.console,1.1.300.v20170512-2111,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.console_1.1.300.v20170512-2111.jar,4,false 
org.eclipse.equinox.ds,1.5.0.v20170307-1429,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.ds_1.5.0.v20170307-1429.jar,2,true 
org.eclipse.equinox.event,1.4.0.v20170105-1446,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.event_1.4.0.v20170105-1446.jar,2,true 
org.eclipse.equinox.frameworkadmin,2.0.300.v20160504-1450,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.frameworkadmin_2.0.300.v20160504-1450.jar,4,false 
org.eclipse.equinox.frameworkadmin.equinox,1.0.800.v20170524-1345,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.frameworkadmin.equinox_1.0.800.v20170524-1345.jar,4,false 
org.eclipse.equinox.http.jetty,3.4.0.v20170503-2025,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.http.jetty_3.4.0.v20170503-2025.jar,4,false 
org.eclipse.equinox.http.registry,1.1.400.v20150715-1528,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.http.registry_1.1.400.v20150715-1528.jar,4,false 
org.eclipse.equinox.http.servlet,1.4.0.v20170524-1452,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.http.servlet_1.4.0.v20170524-1452.jar,4,false 
org.eclipse.equinox.jsp.jasper,1.0.500.v20150119-1358,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.jsp.jasper_1.0.500.v20150119-1358.jar,4,false 
org.eclipse.equinox.jsp.jasper.registry,1.0.300.v20130327-1442,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.jsp.jasper.registry_1.0.300.v20130327-1442.jar,4,false 
org.eclipse.equinox.launcher,1.4.0.v20161219-1356,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.launcher_1.4.0.v20161219-1356.jar,4,false 
org.eclipse.equinox.launcher.win32.win32.x86_64,1.1.500.v20170531-1133,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.launcher.win32.win32.x86_64_1.1.500.v20170531-1133,4,false 
org.eclipse.equinox.p2.artifact.repository,1.1.600.v20170511-1106,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.artifact.repository_1.1.600.v20170511-1106.jar,4,false 
org.eclipse.equinox.p2.console,1.0.600.v20170511-1106,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.console_1.0.600.v20170511-1106.jar,4,false 
org.eclipse.equinox.p2.core,2.4.100.v20160419-0834,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.core_2.4.100.v20160419-0834.jar,4,false 
org.eclipse.equinox.p2.director,2.3.300.v20160504-1450,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.director_2.3.300.v20160504-1450.jar,4,false 
org.eclipse.equinox.p2.director.app,1.0.500.v20160419-0834,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.director.app_1.0.500.v20160419-0834.jar,4,false 
org.eclipse.equinox.p2.directorywatcher,1.1.100.v20150423-1455,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.directorywatcher_1.1.100.v20150423-1455.jar,4,false 
org.eclipse.equinox.p2.discovery,1.0.400.v20160504-1450,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.discovery_1.0.400.v20160504-1450.jar,4,false 
org.eclipse.equinox.p2.discovery.compatibility,1.0.200.v20131211-1531,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.discovery.compatibility_1.0.200.v20131211-1531.jar,4,false 
org.eclipse.equinox.p2.engine,2.5.0.v20170319-2002,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.engine_2.5.0.v20170319-2002.jar,4,false 
org.eclipse.equinox.p2.extensionlocation,1.2.300.v20160419-0834,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.extensionlocation_1.2.300.v20160419-0834.jar,4,false 
org.eclipse.equinox.p2.garbagecollector,1.0.300.v20160504-1450,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.garbagecollector_1.0.300.v20160504-1450.jar,4,false 
org.eclipse.equinox.p2.jarprocessor,1.0.500.v20160504-1450,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.jarprocessor_1.0.500.v20160504-1450.jar,4,false 
org.eclipse.equinox.p2.metadata,2.3.200.v20170511-1106,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.metadata_2.3.200.v20170511-1106.jar,4,false 
org.eclipse.equinox.p2.metadata.repository,1.2.400.v20170511-1106,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.metadata.repository_1.2.400.v20170511-1106.jar,4,false 
org.eclipse.equinox.p2.operations,2.4.300.v20170511-1106,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.operations_2.4.300.v20170511-1106.jar,4,false 
org.eclipse.equinox.p2.publisher,1.4.200.v20170511-1216,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.publisher_1.4.200.v20170511-1216.jar,4,false 
org.eclipse.equinox.p2.publisher.eclipse,1.2.200.v20170511-1216,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.publisher.eclipse_1.2.200.v20170511-1216.jar,4,false 
org.eclipse.equinox.p2.reconciler.dropins,1.1.400.v20160504-1450,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.reconciler.dropins_1.1.400.v20160504-1450.jar,4,true 
org.eclipse.equinox.p2.repository,2.3.300.v20170511-1216,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.repository_2.3.300.v20170511-1216.jar,4,false 
org.eclipse.equinox.p2.repository.tools,2.1.400.v20170511-1216,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.repository.tools_2.1.400.v20170511-1216.jar,4,false 
org.eclipse.equinox.p2.touchpoint.eclipse,2.1.500.v20170516-0526,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.touchpoint.eclipse_2.1.500.v20170516-0526.jar,4,false 
org.eclipse.equinox.p2.touchpoint.natives,1.2.200.v20170511-1216,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.touchpoint.natives_1.2.200.v20170511-1216.jar,4,false 
org.eclipse.equinox.p2.transport.ecf,1.1.300.v20161004-0244,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.transport.ecf_1.1.300.v20161004-0244.jar,4,false 
org.eclipse.equinox.p2.ui,2.5.0.v20170505-1031,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.ui_2.5.0.v20170505-1031.jar,4,false 
org.eclipse.equinox.p2.ui.discovery,1.0.300.v20170418-0708,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.ui.discovery_1.0.300.v20170418-0708.jar,4,false 
org.eclipse.equinox.p2.ui.importexport,1.1.300.v20170511-1216,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.ui.importexport_1.1.300.v20170511-1216.jar,4,false 
org.eclipse.equinox.p2.ui.sdk,1.0.500.v20170511-1216,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.ui.sdk_1.0.500.v20170511-1216.jar,4,false 
org.eclipse.equinox.p2.ui.sdk.scheduler,1.3.100.v20170418-0708,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.ui.sdk.scheduler_1.3.100.v20170418-0708.jar,4,false 
org.eclipse.equinox.p2.updatechecker,1.1.400.v20170106-2125,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.updatechecker_1.1.400.v20170106-2125.jar,4,false 
org.eclipse.equinox.p2.updatesite,1.0.600.v20160504-1450,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.p2.updatesite_1.0.600.v20160504-1450.jar,4,false 
org.eclipse.equinox.preferences,3.7.0.v20170126-2132,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.preferences_3.7.0.v20170126-2132.jar,4,false 
org.eclipse.equinox.registry,3.7.0.v20170222-1344,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.registry_3.7.0.v20170222-1344.jar,4,false 
org.eclipse.equinox.security,1.2.300.v20170505-1235,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.security_1.2.300.v20170505-1235.jar,4,false 
org.eclipse.equinox.security.ui,1.1.400.v20170505-1235,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.security.ui_1.1.400.v20170505-1235.jar,4,false 
org.eclipse.equinox.security.win32.x86_64,1.0.100.v20130327-1442,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.security.win32.x86_64_1.0.100.v20130327-1442.jar,4,false 
org.eclipse.equinox.simpleconfigurator,1.2.0.v20170110-1705,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.simpleconfigurator_1.2.0.v20170110-1705.jar,1,true 
org.eclipse.equinox.simpleconfigurator.manipulator,2.0.300.v20170515-0721,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.simpleconfigurator.manipulator_2.0.300.v20170515-0721.jar,4,false 
org.eclipse.equinox.util,1.0.500.v20130404-1337,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.equinox.util_1.0.500.v20130404-1337.jar,4,false 
org.eclipse.gef,3.11.0.201606061308,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.gef_3.11.0.201606061308.jar,4,false 
org.eclipse.help,3.8.0.v20160823-1530,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.help_3.8.0.v20160823-1530.jar,4,false 
org.eclipse.help.base,4.2.100.v20170612-0950,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.help.base_4.2.100.v20170612-0950.jar,4,false 
org.eclipse.help.ui,4.1.0.v20170311-0931,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.help.ui_4.1.0.v20170311-0931.jar,4,false 
org.eclipse.help.webapp,3.9.0.v20170113-0643,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.help.webapp_3.9.0.v20170113-0643.jar,4,false 
org.eclipse.jdt,3.13.0.v20170612-0950,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt_3.13.0.v20170612-0950.jar,4,false 
org.eclipse.jdt.annotation,2.1.100.v20170511-1408,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.annotation_2.1.100.v20170511-1408.jar,4,false 
org.eclipse.jdt.annotation,1.1.100.v20160418-1457,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.annotation_1.1.100.v20160418-1457.jar,4,false 
org.eclipse.jdt.apt.core,3.5.0.v20170411-0710,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.apt.core_3.5.0.v20170411-0710.jar,4,false 
org.eclipse.jdt.apt.pluggable.core,1.2.0.v20170322-1054,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.apt.pluggable.core_1.2.0.v20170322-1054.jar,4,false 
org.eclipse.jdt.apt.ui,3.5.0.v20170505-1107,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.apt.ui_3.5.0.v20170505-1107.jar,4,false 
org.eclipse.jdt.compiler.apt,1.3.0.v20170502-0408,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.compiler.apt_1.3.0.v20170502-0408.jar,4,false 
org.eclipse.jdt.compiler.tool,1.2.0.v20170502-0408,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.compiler.tool_1.2.0.v20170502-0408.jar,4,false 
org.eclipse.jdt.core,3.13.0.v20170516-1929,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.core_3.13.0.v20170516-1929.jar,4,false 
org.eclipse.jdt.core.manipulation,1.9.0.v20161219-2145,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.core.manipulation_1.9.0.v20161219-2145.jar,4,false 
org.eclipse.jdt.debug,3.11.0.v20170510-1451,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.debug_3.11.0.v20170510-1451,4,false 
org.eclipse.jdt.debug.ui,3.8.0.v20170516-1058,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.debug.ui_3.8.0.v20170516-1058.jar,4,false 
org.eclipse.jdt.doc.user,3.13.0.v20170608-0925,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.doc.user_3.13.0.v20170608-0925.jar,4,false 
org.eclipse.jdt.junit,3.10.0.v20170208-1347,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.junit_3.10.0.v20170208-1347.jar,4,false 
org.eclipse.jdt.junit.core,3.9.0.v20170316-1142,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.junit.core_3.9.0.v20170316-1142.jar,4,false 
org.eclipse.jdt.junit.runtime,3.4.600.v20160505-0715,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.junit.runtime_3.4.600.v20160505-0715.jar,4,false 
org.eclipse.jdt.junit4.runtime,1.1.600.v20160505-0715,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.junit4.runtime_1.1.600.v20160505-0715.jar,4,false 
org.eclipse.jdt.launching,3.9.0.v20170419-1235,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.launching_3.9.0.v20170419-1235.jar,4,false 
org.eclipse.jdt.ui,3.13.0.v20170511-1354,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jdt.ui_3.13.0.v20170511-1354.jar,4,false 
org.eclipse.jem.util,2.1.200.v201404021757,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jem.util_2.1.200.v201404021757.jar,4,false 
org.eclipse.jetty.continuation,9.4.5.v20170502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jetty.continuation_9.4.5.v20170502.jar,4,false 
org.eclipse.jetty.http,9.4.5.v20170502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jetty.http_9.4.5.v20170502.jar,4,false 
org.eclipse.jetty.io,9.4.5.v20170502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jetty.io_9.4.5.v20170502.jar,4,false 
org.eclipse.jetty.security,9.4.5.v20170502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jetty.security_9.4.5.v20170502.jar,4,false 
org.eclipse.jetty.server,9.4.5.v20170502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jetty.server_9.4.5.v20170502.jar,4,false 
org.eclipse.jetty.servlet,9.4.5.v20170502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jetty.servlet_9.4.5.v20170502.jar,4,false 
org.eclipse.jetty.util,9.4.5.v20170502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jetty.util_9.4.5.v20170502.jar,4,false 
org.eclipse.jface,3.13.0.v20170503-1507,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jface_3.13.0.v20170503-1507.jar,4,false 
org.eclipse.jface.databinding,1.8.100.v20170503-1507,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jface.databinding_1.8.100.v20170503-1507.jar,4,false 
org.eclipse.jface.text,3.12.0.v20170523-1043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jface.text_3.12.0.v20170523-1043.jar,4,false 
org.eclipse.jgit,4.8.0.201706111038-r,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jgit_4.8.0.201706111038-r.jar,4,false 
org.eclipse.jgit.archive,4.8.0.201706111038-r,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jgit.archive_4.8.0.201706111038-r.jar,4,false 
org.eclipse.jsch.core,1.3.0.v20160422-1917,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jsch.core_1.3.0.v20160422-1917.jar,4,false 
org.eclipse.jsch.ui,1.3.0.v20160323-1650,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.jsch.ui_1.3.0.v20160323-1650.jar,4,false 
org.eclipse.ltk.core.refactoring,3.8.0.v20170105-1156,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ltk.core.refactoring_3.8.0.v20170105-1156.jar,4,false 
org.eclipse.ltk.ui.refactoring,3.9.0.v20170412-0825,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ltk.ui.refactoring_3.9.0.v20170412-0825.jar,4,false 
org.eclipse.m2e.archetype.common,1.8.0.20170516-2042,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.archetype.common_1.8.0.20170516-2042,4,false 
org.eclipse.m2e.core,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.core_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.core.ui,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.core.ui_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.discovery,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.discovery_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.editor,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.editor_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.editor.xml,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.editor.xml_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.importer,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.importer_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.jdt,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.jdt_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.jdt.ui,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.jdt.ui_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.launching,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.launching_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.lifecyclemapping.defaults,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.lifecyclemapping.defaults_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.logback.appender,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.logback.appender_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.logback.configuration,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.logback.configuration_1.8.0.20170516-2043.jar,4,true 
org.eclipse.m2e.maven.indexer,1.8.0.20170516-2042,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.maven.indexer_1.8.0.20170516-2042,4,false 
org.eclipse.m2e.maven.runtime,1.8.0.20170516-2042,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.maven.runtime_1.8.0.20170516-2042,4,false 
org.eclipse.m2e.maven.runtime.slf4j.simple,1.8.0.20170516-2042,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.maven.runtime.slf4j.simple_1.8.0.20170516-2042,4,false 
org.eclipse.m2e.model.edit,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.model.edit_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.profiles.core,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.profiles.core_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.profiles.ui,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.profiles.ui_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.refactoring,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.refactoring_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.scm,1.8.0.20170516-2043,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.scm_1.8.0.20170516-2043.jar,4,false 
org.eclipse.m2e.workspace.cli,0.3.1,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.m2e.workspace.cli_0.3.1.jar,4,false 
org.eclipse.mylyn.bugzilla.core,3.23.0.v20170411-2036,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.bugzilla.core_3.23.0.v20170411-2036.jar,4,false 
org.eclipse.mylyn.bugzilla.ide,3.23.0.v20170411-2108,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.bugzilla.ide_3.23.0.v20170411-2108.jar,4,false 
org.eclipse.mylyn.bugzilla.ui,3.23.0.v20170411-2036,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.bugzilla.ui_3.23.0.v20170411-2036.jar,4,false 
org.eclipse.mylyn.builds.core,1.15.0.v20170411-2141,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.builds.core_1.15.0.v20170411-2141.jar,4,false 
org.eclipse.mylyn.builds.ui,1.15.0.v20170411-2141,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.builds.ui_1.15.0.v20170411-2141.jar,4,false 
org.eclipse.mylyn.commons.core,3.23.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.core_3.23.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.identity.core,1.15.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.identity.core_1.15.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.net,3.23.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.net_3.23.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.notifications.core,1.15.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.notifications.core_1.15.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.notifications.feed,1.15.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.notifications.feed_1.15.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.notifications.ui,1.15.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.notifications.ui_1.15.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.repositories.core,1.15.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.repositories.core_1.15.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.repositories.http.core,1.15.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.repositories.http.core_1.15.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.repositories.ui,1.15.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.repositories.ui_1.15.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.screenshots,3.23.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.screenshots_3.23.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.ui,3.23.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.ui_3.23.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.commons.workbench,3.23.0.v20170503-0014,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.workbench_3.23.0.v20170503-0014.jar,4,false 
org.eclipse.mylyn.commons.xmlrpc,3.23.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.commons.xmlrpc_3.23.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.context.core,3.23.0.v20170411-2108,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.context.core_3.23.0.v20170411-2108.jar,4,false 
org.eclipse.mylyn.context.tasks.ui,3.23.0.v20170411-2108,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.context.tasks.ui_3.23.0.v20170411-2108.jar,4,false 
org.eclipse.mylyn.context.ui,3.23.0.v20170414-0629,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.context.ui_3.23.0.v20170414-0629.jar,4,false 
org.eclipse.mylyn.debug.ui,3.23.0.v20170411-2108,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.debug.ui_3.23.0.v20170411-2108.jar,4,false 
org.eclipse.mylyn.discovery.core,3.23.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.discovery.core_3.23.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.discovery.ui,3.23.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.discovery.ui_3.23.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.git.core,1.15.0.v20170411-2003,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.git.core_1.15.0.v20170411-2003.jar,4,false 
org.eclipse.mylyn.git.ui,1.15.0.v20170411-2003,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.git.ui_1.15.0.v20170411-2003.jar,4,false 
org.eclipse.mylyn.help.ui,3.23.0.v20170411-2036,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.help.ui_3.23.0.v20170411-2036.jar,4,false 
org.eclipse.mylyn.hudson.core,1.15.0.v20170411-2141,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.hudson.core_1.15.0.v20170411-2141.jar,4,false 
org.eclipse.mylyn.hudson.ui,1.15.0.v20170411-2141,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.hudson.ui_1.15.0.v20170411-2141.jar,4,false 
org.eclipse.mylyn.ide.ant,3.23.0.v20170411-2108,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.ide.ant_3.23.0.v20170411-2108.jar,4,false 
org.eclipse.mylyn.ide.ui,3.23.0.v20170411-2108,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.ide.ui_3.23.0.v20170411-2108.jar,4,false 
org.eclipse.mylyn.java.tasks,3.23.0.v20170411-2108,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.java.tasks_3.23.0.v20170411-2108.jar,4,false 
org.eclipse.mylyn.java.ui,3.23.0.v20170411-2108,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.java.ui_3.23.0.v20170411-2108.jar,4,false 
org.eclipse.mylyn.monitor.core,3.23.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.monitor.core_3.23.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.monitor.ui,3.23.0.v20170411-1844,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.monitor.ui_3.23.0.v20170411-1844.jar,4,false 
org.eclipse.mylyn.resources.ui,3.23.0.v20170411-2108,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.resources.ui_3.23.0.v20170411-2108.jar,4,false 
org.eclipse.mylyn.tasks.bugs,3.23.0.v20170411-2036,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.tasks.bugs_3.23.0.v20170411-2036.jar,4,false 
org.eclipse.mylyn.tasks.core,3.23.0.v20170602-2017,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.tasks.core_3.23.0.v20170602-2017.jar,4,false 
org.eclipse.mylyn.tasks.index.core,3.23.0.v20170529-2329,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.tasks.index.core_3.23.0.v20170529-2329.jar,4,false 
org.eclipse.mylyn.tasks.index.ui,3.23.0.v20170411-2036,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.tasks.index.ui_3.23.0.v20170411-2036.jar,4,false 
org.eclipse.mylyn.tasks.search,3.23.0.v20170411-2036,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.tasks.search_3.23.0.v20170411-2036.jar,4,false 
org.eclipse.mylyn.tasks.ui,3.23.0.v20170608-2055,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.tasks.ui_3.23.0.v20170608-2055.jar,4,false 
org.eclipse.mylyn.team.ui,3.23.0.v20170411-2108,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.team.ui_3.23.0.v20170411-2108.jar,4,false 
org.eclipse.mylyn.versions.core,1.15.0.v20170411-2003,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.versions.core_1.15.0.v20170411-2003.jar,4,false 
org.eclipse.mylyn.versions.ui,1.15.0.v20170411-2003,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.versions.ui_1.15.0.v20170411-2003.jar,4,false 
org.eclipse.mylyn.wikitext,3.0.6.20170311142502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext_3.0.6.20170311142502.jar,4,false 
org.eclipse.mylyn.wikitext.ant,3.0.6.20170311142502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.ant_3.0.6.20170311142502.jar,4,false 
org.eclipse.mylyn.wikitext.asciidoc,3.0.6.20170311142502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.asciidoc_3.0.6.20170311142502.jar,4,false 
org.eclipse.mylyn.wikitext.asciidoc.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.asciidoc.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.confluence,3.0.6.20170311142502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.confluence_3.0.6.20170311142502.jar,4,false 
org.eclipse.mylyn.wikitext.confluence.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.confluence.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.context.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.context.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.help.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.help.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.html,3.0.6.20170311142502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.html_3.0.6.20170311142502.jar,4,false 
org.eclipse.mylyn.wikitext.markdown,3.0.6.20170311142502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.markdown_3.0.6.20170311142502.jar,4,false 
org.eclipse.mylyn.wikitext.markdown.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.markdown.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.mediawiki,3.0.6.20170311142502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.mediawiki_3.0.6.20170311142502.jar,4,false 
org.eclipse.mylyn.wikitext.mediawiki.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.mediawiki.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.osgi,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.osgi_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.tasks.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.tasks.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.textile,3.0.6.20170311142502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.textile_3.0.6.20170311142502.jar,4,false 
org.eclipse.mylyn.wikitext.textile.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.textile.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.tracwiki,3.0.6.20170311142502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.tracwiki_3.0.6.20170311142502.jar,4,false 
org.eclipse.mylyn.wikitext.tracwiki.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.tracwiki.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.twiki,3.0.6.20170311142502,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.twiki_3.0.6.20170311142502.jar,4,false 
org.eclipse.mylyn.wikitext.twiki.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.twiki.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.mylyn.wikitext.ui,3.0.6.201703111926,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.mylyn.wikitext.ui_3.0.6.201703111926.jar,4,false 
org.eclipse.nebula.widgets.tablecombo,1.0.0.201707111605,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.nebula.widgets.tablecombo_1.0.0.201707111605.jar,4,false 
org.eclipse.oomph.base,1.8.0.v20170318-0624,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.base_1.8.0.v20170318-0624.jar,4,false 
org.eclipse.oomph.base.edit,1.8.0.v20170318-0624,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.base.edit_1.8.0.v20170318-0624.jar,4,false 
org.eclipse.oomph.extractor.lib,1.3.0.v20161116-0647,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.extractor.lib_1.3.0.v20161116-0647.jar,4,false 
org.eclipse.oomph.jreinfo,1.8.0.v20170318-0624,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.jreinfo_1.8.0.v20170318-0624.jar,4,false 
org.eclipse.oomph.jreinfo.ui,1.8.0.v20170327-1117,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.jreinfo.ui_1.8.0.v20170327-1117.jar,4,false 
org.eclipse.oomph.jreinfo.win32.x86_64,1.2.0.v20160426-0508,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.jreinfo.win32.x86_64_1.2.0.v20160426-0508.jar,4,false 
org.eclipse.oomph.p2,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.p2_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.p2.core,1.8.0.v20170410-0909,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.p2.core_1.8.0.v20170410-0909.jar,4,false 
org.eclipse.oomph.p2.doc,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.p2.doc_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.p2.edit,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.p2.edit_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.p2.ui,1.8.0.v20170327-1117,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.p2.ui_1.8.0.v20170327-1117.jar,4,false 
org.eclipse.oomph.predicates,1.8.0.v20170327-1117,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.predicates_1.8.0.v20170327-1117.jar,4,false 
org.eclipse.oomph.predicates.edit,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.predicates.edit_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.preferences,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.preferences_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.resources,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.resources_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.resources.edit,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.resources.edit_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.setup,1.8.0.v20170408-0745,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.setup_1.8.0.v20170408-0745.jar,4,false 
org.eclipse.oomph.setup.core,1.8.0.v20170531-0903,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.setup.core_1.8.0.v20170531-0903.jar,4,false 
org.eclipse.oomph.setup.doc,1.9.0.v20170706-0615,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.setup.doc_1.9.0.v20170706-0615.jar,4,false 
org.eclipse.oomph.setup.edit,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.setup.edit_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.setup.editor,1.8.0.v20170327-1117,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.setup.editor_1.8.0.v20170327-1117.jar,4,false 
org.eclipse.oomph.setup.p2,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.setup.p2_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.setup.p2.edit,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.setup.p2.edit_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.setup.sync,1.8.0.v20170530-1735,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.setup.sync_1.8.0.v20170530-1735.jar,4,false 
org.eclipse.oomph.setup.ui,1.8.0.v20170530-1735,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.setup.ui_1.8.0.v20170530-1735.jar,4,false 
org.eclipse.oomph.setup.ui.questionnaire,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.setup.ui.questionnaire_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.ui,1.8.0.v20170327-1117,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.ui_1.8.0.v20170327-1117.jar,4,false 
org.eclipse.oomph.util,1.8.0.v20170706-0534,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.util_1.8.0.v20170706-0534.jar,4,false 
org.eclipse.oomph.workingsets,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.workingsets_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.workingsets.edit,1.8.0.v20170318-0419,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.workingsets.edit_1.8.0.v20170318-0419.jar,4,false 
org.eclipse.oomph.workingsets.editor,1.8.0.v20170327-1117,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.oomph.workingsets.editor_1.8.0.v20170327-1117.jar,4,false 
org.eclipse.osgi,3.12.0.v20170512-1932,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.osgi_3.12.0.v20170512-1932.jar,-1,true 
org.eclipse.osgi.compatibility.state,1.1.0.v20170516-1513,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.osgi.compatibility.state_1.1.0.v20170516-1513.jar,4,false 
org.eclipse.osgi.services,3.6.0.v20170228-1906,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.osgi.services_3.6.0.v20170228-1906.jar,4,false 
org.eclipse.osgi.util,3.4.0.v20170111-1608,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.osgi.util_3.4.0.v20170111-1608.jar,4,false 
org.eclipse.platform,4.7.0.v20170612-0950,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.platform_4.7.0.v20170612-0950,4,false 
org.eclipse.platform.doc.user,4.7.0.v20170608-0925,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.platform.doc.user_4.7.0.v20170608-0925.jar,4,false 
org.eclipse.rcp,4.7.0.v20170612-0950,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.rcp_4.7.0.v20170612-0950.jar,4,false 
org.eclipse.recommenders.apidocs,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.apidocs_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.apidocs.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.apidocs.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.calls,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.calls_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.calls.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.calls.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.chain.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.chain.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.completion.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.completion.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.constructors,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.constructors_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.constructors.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.constructors.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.coordinates,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.coordinates_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.coordinates.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.coordinates.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.injection,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.injection_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.jayes,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.jayes_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.jayes.io,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.jayes.io_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.jdt,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.jdt_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.models,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.models_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.models.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.models.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.mylyn.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.mylyn.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.net,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.net_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.overrides,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.overrides_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.overrides.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.overrides.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.snipmatch,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.snipmatch_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.snipmatch.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.snipmatch.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.subwords.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.subwords.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.types.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.types.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.utils,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.utils_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.recommenders.utils.rcp,2.4.9.v20170613-1301,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.recommenders.utils.rcp_2.4.9.v20170613-1301.jar,4,false 
org.eclipse.search,3.11.100.v20170515-1603,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.search_3.11.100.v20170515-1603.jar,4,false 
org.eclipse.swt,3.106.0.v20170608-0516,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.swt_3.106.0.v20170608-0516.jar,4,false 
org.eclipse.swt.win32.win32.x86_64,3.106.0.v20170608-0516,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.swt.win32.win32.x86_64_3.106.0.v20170608-0516.jar,4,false 
org.eclipse.team.core,3.8.100.v20170516-0820,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.team.core_3.8.100.v20170516-0820.jar,4,false 
org.eclipse.team.genericeditor.diff.extension,1.0.0.v20170315-1002,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.team.genericeditor.diff.extension_1.0.0.v20170315-1002.jar,4,false 
org.eclipse.team.ui,3.8.1.v20170515-1133,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.team.ui_3.8.1.v20170515-1133.jar,4,false 
org.eclipse.text,3.6.100.v20170203-0814,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.text_3.6.100.v20170203-0814.jar,4,false 
org.eclipse.ui,3.109.0.v20170411-1742,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui_3.109.0.v20170411-1742.jar,4,false 
org.eclipse.ui.browser,3.6.100.v20170418-1342,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.browser_3.6.100.v20170418-1342.jar,4,false 
org.eclipse.ui.cheatsheets,3.5.100.v20170515-0748,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.cheatsheets_3.5.100.v20170515-0748.jar,4,false 
org.eclipse.ui.console,3.7.0.v20170315-0941,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.console_3.7.0.v20170315-0941.jar,4,false 
org.eclipse.ui.editors,3.11.0.v20170202-1823,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.editors_3.11.0.v20170202-1823.jar,4,false 
org.eclipse.ui.externaltools,3.4.0.v20161212-0515,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.externaltools_3.4.0.v20161212-0515.jar,4,false 
org.eclipse.ui.forms,3.7.100.v20170517-1755,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.forms_3.7.100.v20170517-1755.jar,4,false 
org.eclipse.ui.genericeditor,1.0.0.v20170516-0821,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.genericeditor_1.0.0.v20170516-0821.jar,4,false 
org.eclipse.ui.ide,3.13.0.v20170516-1223,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.ide_3.13.0.v20170516-1223.jar,4,false 
org.eclipse.ui.ide.application,1.2.0.v20170512-1452,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.ide.application_1.2.0.v20170512-1452.jar,4,false 
org.eclipse.ui.intro,3.5.100.v20170418-0710,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.intro_3.5.100.v20170418-0710.jar,4,false 
org.eclipse.ui.intro.quicklinks,1.0.100.v20170515-0756,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.intro.quicklinks_1.0.100.v20170515-0756.jar,4,false 
org.eclipse.ui.intro.universal,3.3.100.v20170515-1335,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.intro.universal_3.3.100.v20170515-1335.jar,4,false 
org.eclipse.ui.monitoring,1.1.100.v20170131-1736,file:/C:/Users/roni/.p2/pool/plugins/org.eclipse.ui.monitoring_1.1.100.v20170131-1736.jar,4,false 
