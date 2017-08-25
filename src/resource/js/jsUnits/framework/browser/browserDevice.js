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