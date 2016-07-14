
//import {default as Dictionary} from './Dictionary';

module YourTurn {
    export class GeoMap{
        zoom:number = 18;
        tiles: Dictionary<string,Phaser.Sprite> = new Dictionary<string,Phaser.Sprite>();
        mapLoader: Phaser.Loader;
        game:Phaser.Game;
        markCenter:Phaser.Sprite;
        center:Coordinates;

        marksLayer:Phaser.Group;
        mapLayer:Phaser.Group;
        url:string = "http://a.tile.stamen.com/terrain/";
        constructor(game:Phaser.Game) {
            this.game = game;
            this.mapLayer = game.add.group();
            this.marksLayer = game.add.group();

            this.game.add.existing(this.mapLayer); 
            this.game.add.existing(this.marksLayer); 

            this.game.world.setBounds(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);            
            this.mapLoader = new  Phaser.Loader(this.game);
            this.mapLoader.onFileComplete.add( this.OnFileComplete, this );
            this.markCenter = new Phaser.Sprite(this.game,360,640,'mark');
            this.markCenter.anchor.setTo(0.5,1);
            this.marksLayer.addChild(this.markCenter);
        }

        Start() {
            if ("geolocation" in navigator)
                var watchID = navigator.geolocation.watchPosition((position)=>{this.OnSuccess(position);}, this.OnError, { enableHighAccuracy: true, maximumAge: 30000, timeout: 30000 });
            if ("compass" in navigator)
                var watchID = navigator.compass.watchHeading(this.OnCompassSuccess, this.OnCompassError);
        }

        OnCompassSuccess(heading) {
        };

        OnCompassError(error) {
            alert('CompassError: ' + error.code);
        };


        OnFileComplete(progress, key ) {
            this.tiles.getValue(key).loadTexture(key);
        }

        firstTime:boolean = true;

        OnError(error:PositionError){
            console.log("geolocation error "+error.message);
        }

        OnSuccess(position){
            // Centra la camara.
            this.center =  position.coords;
            var tlon = this.long2tile(this.center.longitude);
            var tlat = this.lat2tile(this.center.latitude);

            if(this.firstTime){
                this.GetPOIs();
                this.firstTime=false;
            }
            this.markCenter.position.setTo(tlon*256,tlat*256);
            this.game.camera.setPosition(tlon*256-360,tlat*256-640);

            for( var x=-2;x<=2;++x){
                for( var y=-3;y<=3;++y){
                    this.AddTile(y+Math.floor(tlat), x+Math.floor(tlon));
                }
            }
        }

        AddTile(lat,lon){
            var name = this.zoom+"/"+lon+"/"+lat;
            if( !this.tiles.containsKey(name)){
                var spr = new Phaser.Sprite(this.game, lon*256+128, lat*256+128);
                spr.anchor.setTo(0.5, 0.5);
                this.mapLayer.addChild(spr);

                this.tiles.setValue(name,spr);
                this.mapLoader.image(name, this.url+name+".jpg" );
                this.mapLoader.start();
            }
        }

        GetPOIs(token?:string){
            var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.center.latitude+','+this.center.longitude+'&types=point_of_interest&radius=250&sensor=false&key=AIzaSyCkqYsO5e22S0JUk0TqglX02D8SCQvKUNM';
            if(token) url+='&pagetoken='+token;
            $.getJSON(url, (result)=>{this.ParsePois(result);} );
        }

        marks: Dictionary<string,Phaser.Sprite> = new Dictionary<string,Phaser.Sprite>();
        AddMark( id:string, position:Coordinates, key:string){
            if( !this.marks.containsKey(id)){
                var tlon = this.long2tile(position.longitude)*256;
                var tlat = this.lat2tile(position.latitude)*256;
                var m = new Phaser.Sprite(this.game,tlon,tlat,key);
                m.anchor.setTo(0.5,1);
                this.marksLayer.addChild(m);
                this.marks.setValue(id,m);
            }
        }

        ParsePois(result){
            for (var idx in result.results) {
                var p:any = result.results[idx];
                var cord:Coordinates = <Coordinates>{ longitude:p.geometry.location.lng, latitude:p.geometry.location.lat };
                this.AddMark( p.id, cord, 'mark');
            }
            if(result.next_page_token){
                this.GetPOIs(result.next_page_token);
            }
        }

        long2tile(lon) { 
            return (lon+180)/360*Math.pow(2,this.zoom); 
        }

 	    lat2tile(lat) {
            return (1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,this.zoom); 
        }

        tile2long(x,z) {
            return (x/Math.pow(2,z)*360-180);
        }

        tile2lat(y,z) {
            var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
            return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
        }
    }
}