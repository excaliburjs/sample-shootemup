import * as ex from "excalibur";

const fighterFile = require('../res/fighter.png');
const enemyFile = require('../res/enemy.png');
const spriteexplosionFile = require('../res/spriteexplosion.png');
const gameSheetFile = require('../res/gameSheet.png');
const laserFile = require('../res/laser.wav');
const enemyfireFile = require('../res/enemyfire.wav');
const explodeFile = require('../res/explode.wav');
const hitFile = require('../res/hit.wav');
const powerupFile = require('../res/powerup.wav');
const rocketFile = require('../res/rocket.wav');


const Resources = {
    fighter: new ex.Texture(fighterFile),
    enemyPink: new ex.Texture(enemyFile),
    explosion: new ex.Texture(spriteexplosionFile),
    sheet: new ex.Texture(gameSheetFile),
    laserSound: new ex.Sound(laserFile),
    enemyFireSound: new ex.Sound(enemyfireFile),
    explodeSound: new ex.Sound(explodeFile),
    hitSound: new ex.Sound(hitFile),
    powerUp: new ex.Sound(powerupFile),
    rocketSound: new ex.Sound(rocketFile),
}


const explosionSpriteSheet = new ex.SpriteSheet(Resources.explosion, 5, 5, 45, 45);
const gameSheet = new ex.SpriteSheet(Resources.sheet, 10.0, 10.0, 32.0, 32.0);

const loader = new ex.Loader();

for (let res in Resources) {
    loader.addResource(Resources[res]);
}

export { Resources, loader, explosionSpriteSheet, gameSheet };