// Main Game Logic
import * as ex from 'excalibur';
import Config from './config';
import { Resources, loader } from './resources';
import { Ship } from './actors/Ship';
import { HealthBar } from './actors/HealthBar';
import { Baddie } from './actors/Baddie';
import { animManager } from './actors/AnimationManager';
import { stats } from './stats';

const game = new ex.Engine({
    backgroundColor: ex.Color.Black
});
game.backgroundColor = ex.Color.Black;
game.setAntialiasing(false);

game.add(animManager);


const ship = new Ship(game.halfDrawWidth, 800, 80, 80);
game.add(ship);

const healthBar = new HealthBar();
game.add(healthBar);

const scoreLabel = new ex.Label("Score: " + stats.score, 20, 50);
scoreLabel.color = ex.Color.Azure;
scoreLabel.scale = new ex.Vector(3, 3);
scoreLabel.on('preupdate', function(evt){
    this.text = "Score: " + stats.score;
});
game.add(scoreLabel);


const gameOverLabel = new ex.Label("Game Over", game.halfDrawWidth - 250, game.halfDrawHeight);
gameOverLabel.color = ex.Color.Green.clone();
gameOverLabel.scale = new ex.Vector(8,8);
gameOverLabel.actions.blink(1000, 1000, 400).repeatForever();



let baddieTimer = new ex.Timer(() => {
    var bad = new Baddie(Math.random()*1000 + 200, -100, 80, 80);
    game.add(bad);    
}, Config.spawnTime, true, -1);

game.addTimer(baddieTimer);

game.on('preupdate', (evt: ex.PreUpdateEvent) => {
    if (stats.gameOver) {
        game.add(gameOverLabel);
    }
});

// Game events to handle
game.on('hidden', () => {
    console.log('pause');
    game.stop();
});
game.on('visible', () => {
    console.log('start');
    game.start();
});

game.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
    if (evt.key === ex.Input.Keys.D) {
      game.isDebug = !game.isDebug;
    }
});

game.start(loader).then(() => {
   Resources.laserSound.volume = Config.soundVolume;
   Resources.explodeSound.volume = Config.soundVolume;
   Resources.enemyFireSound.volume = Config.soundVolume;
   Resources.powerUp.volume = Config.soundVolume;
   Resources.rocketSound.volume = Config.soundVolume;
   
   console.log("Game Resources Loaded");
});