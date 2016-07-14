/// <reference path="../typings/phaser/phaser.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts" />

module YourTurn {
    "use strict";
    if (typeof cordova === 'undefined') {
        window.onload = function () {
            var game = new EntryPoint();
        }
    }
}