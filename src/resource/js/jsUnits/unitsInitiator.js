
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


