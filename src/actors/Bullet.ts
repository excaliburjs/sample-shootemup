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