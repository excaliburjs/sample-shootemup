import * as ex from "excalibur";
import Config from "../config";
import { gameSheet } from "../resources";
import { Baddie } from "./Baddie";

export class Bullet extends ex.Actor {
    public owner: ex.Actor;
    constructor(x, y, dx, dy, owner?: ex.Actor) {
        super({
            x: x, 
            y: y,
            vel: new ex.Vector(dx, dy),
            width: Config.bulletSize,
            height: Config.bulletSize,
            collisionType: ex.CollisionType.Passive
        });
        this.owner = owner;
    }
    
    onInitialize(engine: ex.Engine) {
        this.on('precollision', this.onPreCollision);
        // Clean up on exit viewport
        this.on('exitviewport', () => this.killAndRemoveFromBullets());

        const anim = gameSheet.getAnimationByIndices(engine, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100);
        anim.scale = new ex.Vector(2, 2);
        this.addDrawing('default', anim);
    }

    private onPreCollision(evt: ex.PreCollisionEvent) {
        if (!(evt.other instanceof Bullet) && 
            evt.other !== this.owner) {
                this.killAndRemoveFromBullets();
        }
    }

    private killAndRemoveFromBullets() {
        this.kill();
        ex.Util.removeItemFromArray(this, Baddie.Bullets);
    }
}


// var Bullet = Actor.extend({
//     init : function(){
//        this.addEventListener('collision', function(evt){
//           if(evt.other !== this.owner && !(evt.other instanceof Bullet)){
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
//           this.kill(); 
//        }
 
//        // Custom collision for player bullets
//     },/*
//     draw : function(ctx, delta){
//        ctx.fillStyle = this.color.toString();
//        ctx.beginPath();
//        ctx.arc(this.x, this.y, this.width, 0, 2*Math.PI);
//        ctx.closePath();
//        ctx.fill();
 
//     },*/
//     debugDraw : function(ctx, delta){
//        this.super.draw.call(this, ctx, delta);
//        var index = this.parent.children.indexOf(this);
//        ctx.fillStyle = Color.Yellow.toString();
//        ctx.fillText(index, this.x, this.y);
//     }
//  });

//  var getEnemyBulletAnim = function(){
//     var anim = gameSheet.getAnimationByIndices(game, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100);
//     anim.setScale(2);
//     anim.loop = true;   
//     return anim;
//  };
 
//  var enemyFire = function(x, y, velx, vely){
//     var b = new Bullet(x, y, 5, 5);
//     b.color = Color.White;
//     b.dx = velx;
//     b.dy = vely;
//     b.addDrawing("default", getEnemyBulletAnim());
//     b.setCenterDrawing(true);
//     game.addChild(b);
//     return b;
//  };