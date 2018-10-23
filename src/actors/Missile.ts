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