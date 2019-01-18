// Main Game Logic
import * as ex from 'excalibur';
import Config from './config';
import { Resources, loader } from './resources';
import { Game } from './game';

const game = new ex.Engine({
    backgroundColor: ex.Color.Black
});
game.backgroundColor = ex.Color.Black;
game.setAntialiasing(false);

// Setup game scene
game.add('game', new Game());
game.goToScene('game');

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