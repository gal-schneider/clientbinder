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
