/// <reference path="../typings/phaser/phaser.d.ts"/>
/// <reference path='../typings/cordova/es6-promise.d.ts'/>
/// <reference path="../typings/jquery/jquery.d.ts" />

module YourTurn {
    export module Application {
        export function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }

        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            var game = new YourTurn.EntryPoint();
        }


        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }

    }

    window.onload = function () {
        if (typeof cordova !== 'undefined') {
            Application.initialize();
        }
    }
}
