import * as ex from "excalibur";
import { Resources, gameSheet, explosionSpriteSheet } from "../resources";
import Config from "../config";
import { Bullet } from "./Bullet";
import { animManager } from "./AnimationManager";
import { stats } from "../stats";

export class Baddie extends ex.Actor {
    // All bullets belonging to baddies
    public static Bullets: Bullet[] = [];

    private anim: ex.Animation;
    private explode: ex.Animation;
    private fireTimer: ex.Timer;
    private fireAngle: number = Math.random() * Math.PI * 2;
    constructor(x, y, width, height) {
        super({
            x: x,
            y: y,
            width: width,
            height: height,
            // Passive recieves collision events but does not participate in resolution
            collisionType: ex.CollisionType.Passive 
        });
        // Setup listeners
        this.on('precollision', this.onPreCollision);

    }

    // OnInitialize is called before the 1st actor update
    onInitialize(engine: ex.Engine) {
        // Initialize actor

        // Setup visuals
        this.anim = gameSheet.getAnimationByIndices(engine, [10, 11, 12], 100)
        this.anim.scale = new ex.Vector(4, 4);
        this.addDrawing("default", this.anim);

        this.explode = explosionSpriteSheet.getAnimationForAll(engine, 40);
        this.explode.scale = new ex.Vector(3, 3);
        this.explode.loop = false;

        // Setup patrolling behavior
        this.actions.moveTo(this.x, this.y + 800, Config.enemySpeed)
                    .moveTo(this.x + 800, this.y, Config.enemySpeed)
                    .moveTo(this.x + 800, this.y + 800, Config.enemySpeed)
                    .moveTo(this.x, this.y, Config.enemySpeed)
                    .repeatForever();

        // Setup firing timer, repeats forever
        this.fireTimer = new ex.Timer(() => { this.fire(engine) }, Config.enemyFireInterval, true, -1);
        engine.addTimer(this.fireTimer);

    }

    // Fires before excalibur collision resoulation
    private onPreCollision(evt: ex.PreCollisionEvent) {
        // only kill a baddie if it collides with something that isn't a baddie or a baddie bullet
        if(!(evt.other instanceof Baddie) && 
           !ex.Util.contains(Baddie.Bullets, evt.other)) {
            Resources.explodeSound.play();
            animManager.play(this.explode, this.pos);
            
            stats.score += 100;
            this.fireTimer.cancel();
            this.kill(); 
         }
    }


    private fire(engine: ex.Engine) {
        this.fireAngle += Math.PI/20;
        let bulletVelocity = new ex.Vector(
            Config.enemyBulletVelocity * Math.cos(this.fireAngle),
            Config.enemyBulletVelocity * Math.sin(this.fireAngle));

        let bullet = new Bullet(this.x, this.y, bulletVelocity.x, bulletVelocity.y, this);
        Baddie.Bullets.push(bullet);
        engine.add(bullet);
    }
}

// var Baddie = Actor.extend({
//     init : function(){
//        // Set sprite orientation
//        var sprite = new ex.Sprite(enemyPink, 0, 0, 40, 40);
 
//        var spriteAnim = gameSheet.getAnimationByIndices(game, [10, 11, 12], 100);
//        spriteAnim.loop = true;
//        spriteAnim.setScale(4);
//        this.addDrawing("default", spriteAnim);
//        this.setCenterDrawing(true);
 
//        // Define throttled fire function
//        this.throttledFire = throttle(enemyFire, 200);
 
//        // Build behavior
//        this.moveTo(this.x, this.y + 800, Config.enemySpeed);
//        this.moveTo(this.x + 800, this.y, Config.enemySpeed);
//        this.moveTo(this.x + 800, this.y + 800, Config.enemySpeed);
//        this.moveTo(this.x, this.y, Config.enemySpeed).repeatForever();
 
//        this.angle = 0;
//        this.vel = Config.enemyBulletVelocity;
 
//        // add event listeners
//        this.addEventListener('collision', function(evt){
//           if(!(evt.other.owner instanceof Baddie) && !(evt.other instanceof Baddie)){
//              explodeSound.play();
//              var explodeAnim = spriteSheet.getAnimationForAll(game, 40);
//              explodeAnim.setScale(3);
//              explodeAnim.play(this.x, this.y);
//              score += 100;
//              this.kill(); 
 
//           }
//        });
//     },
//     update : function(engine, delta){
//        this.super.update.call(this, engine, delta);
       
//        this.angle += Math.PI/20;
//        var dx = this.vel * Math.cos(this.angle);
//        var dy = this.vel * Math.sin(this.angle);
//        var b = this.throttledFire(this.getCenter().x, this.getCenter().y+25, dx, dy);
//        if(b){
//           //enemyFireSound.play();
//           b.owner = this;
//        }
//     }
//  });