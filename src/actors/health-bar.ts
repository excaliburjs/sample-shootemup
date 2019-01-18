import * as ex from "excalibur";
import Config from "../config";
import { stats } from "../stats";

export class HealthBar extends ex.Actor {

    constructor() {
        super({
            color: ex.Color.Green,
            x: 20,
            y: 0,
            width: 0,
            height: 0,
            anchor: ex.Vector.Zero.clone(),
            collisionType: ex.CollisionType.PreventCollision,
        });
    }
    
    onInitialize(engine: ex.Engine) {
        this.x = 20;
        this.y = engine.drawHeight - Config.healthBarHeight - 20;
        this.setWidth(Config.healthBarWidth);
        this.setHeight(Config.healthBarHeight);
        
    }

    onPreUpdate() {
        this.setWidth(Config.healthBarWidth * (stats.hp / Config.totalHp));
    }

    onPostDraw(ctx: CanvasRenderingContext2D) {
       ctx.strokeStyle = this.color.toString();
       ctx.fillStyle = this.color.toString();
       ctx.lineWidth = 3;
       ctx.font = 'normal 30px sans-serif'
       ctx.fillText("HP:", -5, - this.getHeight());
       ctx.strokeRect(-5, -5, Config.healthBarWidth + 10, this.getHeight() + 10);
    }

}
