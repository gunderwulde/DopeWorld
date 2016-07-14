
module YourTurn {
    export class Game extends Phaser.State {
        map: GeoMap;
        preload() {
            this.game.load.image('mark', 'images/map_marker.png');
        }

        create() {
/*
            if ("facebookConnectPlugin" in window){
                (<any>window).facebookConnectPlugin.login(["public_profile"], 
                    function loginSuccess(response) {
                        alert(response);
                    },
                    function loginError (error) {
                        alert(error);
                    }
                );
            }
*/
            this.map = new GeoMap(this.game);
            this.map.Start();
        }                    
            
        update() {
        }

        render() {
        }
    }
}