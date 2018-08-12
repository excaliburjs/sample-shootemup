// Main Game Logic
import * as ex from 'excalibur';
import Config from './config';
import { Resources, loader } from './resources';
import { Ship } from './actors/Ship';
import { HealthBar } from './actors/HealthBar';
import { Baddie } from './actors/Baddie';

const game = new ex.Engine({
    backgroundColor: ex.Color.Black
});
game.backgroundColor = ex.Color.Black;
game.setAntialiasing(false);

// Todo separate file
let gameOver = false;
let score = 0;



var ship = new Ship(game.halfDrawWidth, 800, 80, 80);
game.add(ship);

var healthBar = new HealthBar();
game.add(healthBar);

var scoreLabel = new ex.Label("Score: " + score, 20, 50);
scoreLabel.color = ex.Color.Azure;
scoreLabel.scale = new ex.Vector(3, 3);
scoreLabel.on('preupdate', function(evt){
    this.text = "Score: " + score;
});
game.add(scoreLabel);


var gameoverLabel;
var totalElapsed = 0;

let baddieTimer = new ex.Timer(() => {
    var bad = new Baddie(Math.random()*1000 + 200, -100, 80, 80);
    game.add(bad);    
}, Config.spawnTime, true, -1);

game.addTimer(baddieTimer);

game.on('preupdate', (evt: ex.PreUpdateEvent) => {
    if (gameOver && !gameoverLabel) {
      gameoverLabel = new ex.Label("Game Over", game.halfDrawWidth - 250, game.halfDrawHeight);
      gameoverLabel.color = ex.Color.Green;
      gameoverLabel.scale = 8;
      gameoverLabel.actions.blink(1, 1000, 400).repeatForever();
      game.add(gameoverLabel);
    }
});

// Game events to handle
game.on('hidden', () => {
    game.stop();
});
game.on('visible', () => {
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