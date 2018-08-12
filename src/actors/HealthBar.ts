import * as ex from "excalibur";
import Config from "../config";

export class HealthBar extends ex.Label {

    constructor() {
        super({
            color: ex.Color.Green,
            collisionType: ex.CollisionType.PreventCollision,
        });
    }
    
    onInitialize(engine: ex.Engine) {
        this.text = 'HP ';
        this.scale = new ex.Vector(3, 3);
        this.x = 20;
        this.y = engine.drawHeight - Config.healthBarHeight - 20;
        this.setWidth(Config.healthBarWidth);
        this.setHeight(Config.healthBarHeight);
        
    }

    onPostDraw(ctx: CanvasRenderingContext2D) {
       ctx.fillStyle = this.color.toString();
       ctx.strokeStyle = this.color.toString();
       ctx.fillRect(this.x + 50, this.y - this.getHeight(), this.getWidth(), this.getHeight());
       ctx.strokeRect(this.x + 50, this.y - this.getHeight(), Config.healthBarWidth, this.getHeight());
    }

}


// var HealthBarOld = ex.Label.extend({
//     init: function(){
//        this.preventCollisions = true;
//        this.text = "HP ";
//        this.font = Config.font;
//        this.scale = 3;
//        this.x = 20;
//        this.y = game.height - Config.healthBarHeight - 20;
//        this.width = Config.healthBarWidth;
//        this.height = Config.healthBarHeight;
//        this.color = Color.Green;
//     },
//     draw : function(ctx, delta){
//        this.super.draw.call(this, ctx, delta);
 
//        ctx.fillStyle = this.color.toString();
//        ctx.strokeStyle = this.color.toString();
//        ctx.fillRect(this.x + 50, this.y - this.height, this.width, this.height);
//        ctx.strokeRect(this.x + 50, this.y - this.height, Config.healthBarWidth, this.height);
//     }
//  });