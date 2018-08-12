import * as ex from "excalibur";
import { Resources, gameSheet } from "../resources";
import { Bullet } from "./Bullet";

export class Missile extends ex.Actor {
    constructor() {
        super({
            x: 0,
            y: 0,
            width: 60,
            height: 20
        });

        this.on('precollision', this.onPreCollision);
        this.on('exitviewport', () => {
            Resources.rocketSound.stop();
            this.kill();
        });
    }

    onInitialize(engine: ex.Engine) {
        const anim = gameSheet.getAnimationByIndices(engine, [13, 14, 15], 50);
        anim.scale = new ex.Vector(3, 3);

    }

    onPreCollision(evt: ex.PreCollisionEvent) {
        if(!(evt.other instanceof Bullet)){
            Resources.rocketSound.stop();
            Resources.explodeSound.play();
            this.kill();
         }
    }
}


// var MissileOld = Actor.extend({
//     init : function() {
//        var anim = gameSheet.getAnimationByIndices(game, [13, 14, 15], 50);
//        anim.loop = true;
//        this.setHeight(60);
//        this.setWidth(20);
//        this.setCenterDrawing(true);
//        this.addDrawing("default", anim);
//        anim.setScale(3);
//        rocketSound.play();
 
//        this.addEventListener('collision', function(evt){
//           if(evt.other !== this.owner && !(evt.other instanceof Bullet)){
//              rocketSound.stop();
//              explodeSound.play();
//              this.kill();
//           }
//        });
//     },
//     update : function(engine, delta){
//        this.super.update.call(this, engine, delta);
 
//        // Clean up if bullets leave the viewport
//        if(this.x > engine.width || 
//           this.x < 0 || 
//           this.y > engine.height || 
//           this.y < 0){
//           rocketSound.stop();
//           this.kill(); 
//        }
//     }
//  });