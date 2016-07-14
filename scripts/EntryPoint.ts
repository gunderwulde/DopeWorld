module YourTurn {
    export class EntryPoint extends Phaser.Game {
        cordova: boolean;

        constructor() {
            super(720, 1280, Phaser.CANVAS, 'content', {
                create: () => {
                    this.cordova = typeof (<any>window).cordova !== 'undefined';
                    //  This sets a limit on the up-scale
                    this.scale.maxWidth = window.innerWidth * window.devicePixelRatio;
                    this.scale.maxHeight = window.innerHeight * window.devicePixelRatio;
                    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                    this.scale.windowConstraints.bottom = "visual";
                    this.scale.pageAlignHorizontally = true;
        //            this.scale.aspectRatio = 720 / 1280;
                    this.input.maxPointers = 1;
                    this.stage.disableVisibilityChange = true;
                    
                    this.state.start("Game", true, false);
                }
            });

            this.state.add("Game", Game );
        }
    }
}