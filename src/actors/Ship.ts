import * as ex from "excalibur";
import { gameSheet, Resources, explosionSpriteSheet } from "../resources";
import Config from "../config";
import { Bullet } from "./Bullet";
import { Baddie } from "./Baddie";

type FireFunction = (engine: ex.Engine) => void;
const throttle = function(func: FireFunction, throttle: number): FireFunction {
    var lastTime = Date.now();
    var throttle = throttle;
    return function() {
       var currentTime = Date.now();
       if(currentTime - lastTime > throttle){
          var val = func.apply(this, Array.prototype.slice.call(arguments,0));
          lastTime = currentTime;
          return val;
       }
    }
 }

export class Ship extends ex.Actor {
    private flipBarrel = false;
    private throttleFire: FireFunction;
    private hp = Config.totalHp;
    private explode: ex.Animation;
    constructor(x, y, width, height) {
        super({
            x: x,
            y: x,
            width: width,
            height: height,
            collisionType: ex.CollisionType.Passive
        });
    }

    onInitialize(engine: ex.Engine) {
        this.throttleFire = throttle(this.fire, Config.playerFireThrottle);
        this.on('precollision', this.onPreCollision);

        // Keyboard
        engine.input.keyboard.on('press', (evt) => this.handleKeyEvent(engine, evt));
        engine.input.keyboard.on('release', (evt: ex.Input.KeyEvent) => { 
            if(evt.key !== ex.Input.Keys.Space) {
                this.vel = ex.Vector.Zero.clone()
            }
         });

        // Pointer
        engine.input.pointers.primary.on('down', (evt: ex.Input.PointerDownEvent) => this.handlePointerEvent(engine, evt));
        engine.input.pointers.primary.on('up', () => this.vel = ex.Vector.Zero.clone());

        // Get animation
        const anim = gameSheet.getAnimationByIndices(engine, [0, 1, 2], 100);
        anim.scale = new ex.Vector(4, 4);
        this.addDrawing("default", anim);

        this.explode = explosionSpriteSheet.getAnimationForAll(engine, 40);
        this.explode.scale = new ex.Vector(3, 3);
    }

    onPreCollision(evt: ex.PreCollisionEvent) {
        if(evt.other instanceof Baddie || ex.Util.contains(Baddie.Bullets, evt.other)){
            Resources.hitSound.play();
            this.actions.blink(300, 300, 3);
            this.hp -= Config.enemyDamage;

            // healthBar.width = Config.healthBarWidth * (this.hp / Config.totalHp);
         }
    }

    onPostUpdate(engine: ex.Engine, delta: number) {
        if (this.hp <= 0) {
            // update game to display game over
            // gameOver = true;
            this.explode.play(this.x, this.y);
            Resources.explodeSound.play();
            this.kill();
         }

        // Keep player in the viewport
       if(this.x < 0) this.x = 0;
       if(this.y < 0) this.y = 0;
       if(this.x > engine.drawWidth - this.getWidth()) this.x = (engine.drawWidth - this.getWidth());
       if(this.y > engine.drawHeight - this.getHeight()) this.y = (engine.drawHeight - this.getHeight());
    }

    private fire = (engine: ex.Engine) => {
        let bullet = new Bullet(this.x + (this.flipBarrel?-40:40), this.y - 20, 0, Config.playerBulletVelocity, this);
        this.flipBarrel = !this.flipBarrel;
        Resources.laserSound.play();
        engine.add(bullet);
    }

    handlePointerEvent = (engine: ex.Engine, evt: ex.Input.PointerDownEvent) => {

        let dir = evt.worldPos.sub(this.pos);
        let distance = dir.magnitude();
        if (distance > 50) {
            this.vel = dir.scale(Config.playerSpeed/distance);
        } else {
            this.throttleFire(engine);
        }
    }

    handleKeyEvent = (engine: ex.Engine, evt: ex.Input.KeyEvent) => {
        let dir = ex.Vector.Zero.clone();

        if (evt.key === ex.Input.Keys.Space) {
            this.throttleFire(engine);
            if (this.vel.x !== 0 || this.vel.y !== 0) {
                dir = this.vel.normalize();
            }
        }
        // Some keys do the same thing
        if (evt.key === ex.Input.Keys.Up ||
            evt.key === ex.Input.Keys.W) {
            dir.y = -1;
        }

        if (evt.key === ex.Input.Keys.Left ||
            evt.key === ex.Input.Keys.A) {
            dir.x = -1;
        }

        if (evt.key === ex.Input.Keys.Right ||
            evt.key === ex.Input.Keys.D) {
            dir.x = 1;
        }

        if (evt.key === ex.Input.Keys.Down ||
            evt.key ===  ex.Input.Keys.S) {
            dir.y = 1;
        }
        

        if (dir.x !== 0 || dir.y !== 0) {
            this.vel = dir.normalize().scale(Config.playerSpeed);
        }
    }
}



// var ShipOld = ex.Actor.extend({
//     init : function(){
//        this.fixed = true;
//        var sprite = new ex.Sprite(fighter, 0, 0, 40, 40);
//        var spriteAnim = gameSheet.getAnimationByIndices(game, [0, 1, 2], 100);
//        spriteAnim.loop = true;
//        spriteAnim.setScale(4);
//        sprite.setScale(3);
//        this.setCenterDrawing(true);
//        sprite.transformAboutPoint(new ex.Vector(60, 60));
//        sprite.setRotation(-Math.PI/2);
//        this.addDrawing("default", spriteAnim);
 
 
//        this.hp = Config.totalHp;
 
//        // Add event listeners
//        this.addEventListener('space', function(){
//           var b = flipFire(this.x + (flipBarrel?80:0), this.y, 0, Config.playerBulletVelocity, Color.Green);         
//           if(b) b.owner = this;
//        });
 
//        this.addEventListener('up', function(){
//           this.dy = -Config.playerSpeed;
//        });
 
//        this.addEventListener('down', function(){
//           this.dy = Config.playerSpeed;
//        });
 
//        this.addEventListener('left', function(){
//           this.dx = -Config.playerSpeed;
//        });
 
//        this.addEventListener('right', function(){
//           this.dx = Config.playerSpeed;
//        });
 
//        this.addEventListener('keyup', function(evt){
//           if(InputKey.Up == evt.key || InputKey.Down == evt.key){
//              this.dy = 0;
//           }
//           if(InputKey.Left == evt.key || InputKey.Right == evt.key){
//              this.dx = 0;
//           }
//        });
 
//        this.addEventListener('keydown', function(evt){
//           if(InputKey.F == evt.key){
//              var m = fireMissile(this.getCenter().x-10, this.getCenter().y - 100);
//              m.owner = this;
//           }
//        });
 
//        this.addEventListener('collision', function(evt){
//           if(evt.other instanceof Baddie || evt.other.owner !== this){
//              hitSound.play();
//              this.blink(3, 1000, 100);
//              this.hp -= Config.enemyDamage;
//              healthBar.width = Config.healthBarWidth * (this.hp / Config.totalHp);           
//           }
//        });
//     },
//     update : function(engine, delta){
//        // Call super update
//        this.super.update.call(this, engine, delta);
 
//        if(this.hp <= 0){
//           // update game to display game over
//           gameOver = true;
//           var explodeAnim = spriteSheet.getAnimationForAll(game, 40);
//           explodeAnim.setScale(3);
//           explodeAnim.play(this.x, this.y);
//           explodeSound.play();
//           this.kill();
//        }
 
//        // Keep player in the viewport
//        if(this.x < 0) this.x = 0;
//        if(this.y < 0) this.y = 0;
//        if(this.x > engine.width - this.getWidth()) this.x = (engine.width - this.getWidth());
//        if(this.y > engine.height - this.getHeight()) this.y = (engine.height - this.getHeight());
 
//        // Custom collision for enemy bullets
//     }
//  });