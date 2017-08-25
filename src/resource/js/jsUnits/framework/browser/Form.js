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
