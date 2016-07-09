var PlatformerGame = PlatformerGame || {};

//loading the game assets
PlatformerGame.Preload = function(){};

PlatformerGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.game.load.spritesheet('logo-tiles', 'assets/images/logo-tiles.png', 17, 16);
    this.game.load.spritesheet('tiles', 'assets/images/castle_tileset_part1.png', 32, 32);
    this.load.tilemap('level1', 'assets/tilemaps/level.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('sky', 'assets/images/sky_new.png');
    this.game.load.image('star', 'assets/images/star.png');
    this.game.load.spritesheet('dude', 'assets/images/runningman.png', 30, 32);
    this.game.load.spritesheet('barrel', 'assets/images/barrel.png', 20, 20);
    this.game.load.image('chopper', 'assets/images/chopper.png');
    this.game.load.image('backgroundtile', 'assets/images/backgroundtile.png');
    this.game.load.audio('music', 'assets/audio/music.ogg');
    this.game.load.audio('chopper', 'assets/audio/chopper.mp3');

  },
  create: function() {
    this.state.start('Logo');
  }
};
