import * as ex from 'excalibur';
import { Ship } from './actors/ship';
import { HealthBar } from './actors/health-bar';

import { stats } from './stats';
import { Baddie } from './actors/baddie';
import Config from './config';

import { animManager } from './actors/animation-manager';

export class Game extends ex.Scene {

    constructor() {
        super();
    }

    onInitialize(engine: ex.Engine) {
        engine.add(animManager);

        const ship = new Ship(engine.halfDrawWidth, 800, 80, 80);
        engine.add(ship);

        const healthBar = new HealthBar();
        engine.add(healthBar);

        const scoreLabel = new ex.Label("Score: " + stats.score, 20, 50);
        scoreLabel.color = ex.Color.Azure;
        scoreLabel.scale = new ex.Vector(3, 3);
        scoreLabel.on('preupdate', function(evt){
            this.text = "Score: " + stats.score;
        });
        engine.add(scoreLabel);


        const gameOverLabel = new ex.Label("Game Over", engine.halfDrawWidth - 250, engine.halfDrawHeight);
        gameOverLabel.color = ex.Color.Green.clone();
        gameOverLabel.scale = new ex.Vector(8,8);
        gameOverLabel.actions.blink(1000, 1000, 400).repeatForever();



        let baddieTimer = new ex.Timer(() => {
            var bad = new Baddie(Math.random()*1000 + 200, -100, 80, 80);
            engine.add(bad);    
        }, Config.spawnTime, true, -1);

        engine.addTimer(baddieTimer);

        engine.on('preupdate', (evt: ex.PreUpdateEvent) => {
            if (stats.gameOver) {
                engine.add(gameOverLabel);
            }
        });

    }

}