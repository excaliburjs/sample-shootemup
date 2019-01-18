import * as ex from "excalibur";

interface AnimationNode {
    pos: ex.Vector,
    anim: ex.Animation
}

export class AnimationManager extends ex.Actor {
    private animations: AnimationNode[] = [];
    constructor() {
        super({
            x: 0, 
            y: 0, 
            width: 0,
            height: 0,
            collisionType: ex.CollisionType.PreventCollision,
        });
        this.traits.length = 0;
    }
    
    play(animation: ex.Animation, pos: ex.Vector){
        this.animations.push({
            anim: animation,
            pos: pos.clone()
        });
    }

    onPostUpdate() {
        this.animations = this.animations.filter(a => !a.anim.isDone());
    }

    // PostDraw gives the rendering context and the time between frames
    onPostDraw(ctx: CanvasRenderingContext2D/*, delta: number */) {
        for (let node of this.animations) {
            node.anim.draw(ctx, node.pos.x - node.anim.drawWidth / 2, node.pos.y -node.anim.drawHeight / 2);
        }
    }
}


const animManager = new AnimationManager();

export { animManager };