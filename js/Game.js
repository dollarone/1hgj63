var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    create: function() {

        //  A simple background for our game

        //this.sky = this.game.add.tileSprite(0, 0, 3300, 700, 'backgroundtile');
        this.sky = this.game.add.sprite(0, 0, 'sky');
        this.sky.scale.setTo(4, 1.1);

        this.map = this.game.add.tilemap('level1');

        this.map.addTilesetImage('castle_tileset_part1', 'tiles');

        this.backgroundLayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');
        //this.foregroundLayer = this.map.createLayer('foregroundLayer');

        this.map.setCollisionBetween(1, 10000, true, 'blockedLayer');

        // make the world boundaries fit the ones in the tiled map
        this.blockedLayer.resizeWorld();
        var result = this.findObjectsByType('exit', this.map, 'objectLayer');
        this.exit = this.game.add.sprite(result[0].x, result[0].y, 'chopper');
  

        this.playerStart = this.findObjectsByType('playerStart', this.map, 'objectLayer');
        this.player = this.game.add.sprite(this.playerStart[0].x, this.playerStart[0].y, 'dude');
        this.player.frame = 0; 

        //  We need to enable physics on the player
        this.game.physics.arcade.enable(this.player);
        //this.game.camera.setSize(this.game.world.width, this.game.world.height);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0;
        this.player.body.gravity.y = 400;
        this.player.anchor.setTo(0.5);

        this.player.body.setSize(22, 28, 2, 2);
        this.player.body.collideWorldBounds = false;

        this.game.camera.follow(this.player);

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [1,2,3,4,5,6,7,8], 10, true);
        this.player.animations.add('right', [1,2,3,4,5,6,7,8], 10, true);

        //  Finally some stars to collect
        this.stars = this.game.add.group();

        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;


        this.music = this.game.add.audio('music');
        this.music.loop = true;
        this.music.play();
        this.choppersound = this.game.add.audio('chopper');
        
        this.choppersound.play(false, 1);


        this.exit.anchor.setTo(0,0.5);
        this.exit.scale.setTo(2);
        this.game.physics.arcade.enable(this.exit);
        this.exit.body.setSize(20, 20, 35, 5);

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.timer = 0;
        this.winnar = false;

        this.showDebug = false;
        for (var i = 0; i < 10; i++)
        {
            //this.createStar();
        }

        this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.rKey.onDown.add(this.reset, this);

        this.scoreText = this.game.add.text(40, 10, '', { fontSize: '32px', fill: '#fff' });
        this.scoreText.fixedToCamera = true;
        this.startTime = this.game.time.now;

    },

        reset: function() {
            this.music.stop();
            this.choppersound.stop();
        this.state.restart();
    },
createStar: function() {

                //  Here we'll create 12 of them evenly spaced apart
            //  Create a star inside of the 'stars' group
            var star = this.stars.create(this.game.rnd.integerInRange(this.player.x-200,this.player.x+300), -20, 'barrel');

            //  Let gravity do its thing
            star.body.gravity.y = 300;
            star.animations.add('roll', [0,1,2,3], 10, true);
            star.animations.play("roll");
            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.3;
            star.body.velocity.x = this.game.rnd.integerInRange(-100,100);
            star.dangerous = true;
        },



    update: function() {

        //console.log("player" + this.player.x);
        this.timer++;

        if (this.winnar) {
            this.exit.y--;
            this.player.y--;
            this.player.animations.stop();
            this.player.frame = 0;
            this.player.body.velocity.x = 0;
            return;
        }

            this.timeSpent = this.game.time.now - this.startTime;
            this.scoreText.text = "Time spent: " + parseFloat( (this.timeSpent / 1000)).toFixed(1) + "s";

        if (this.timer % 70 == 0) {
            this.createStar();
        }

        if (this.timer % 643 == 0) {
            for (var i = 0; i < 4; i++) {
                this.createStar();
            }
        }


        //  Collide the player and the stars with the platforms
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.stars, this.blockedLayer);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.game.physics.arcade.overlap(this.player, this.exit, this.win, null, this);
        this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.scale.setTo(-1, 1);
            this.player.body.velocity.x = -250;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.scale.setTo(1, 1);
            this.player.body.velocity.x = 250;

            this.player.animations.play('right');
        }        else
        {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 0;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.blocked.down)
        {
            this.player.body.velocity.y = -250;
        }

        if (this.player.y > this.game.world.height) {
            this.death();
        }

    },
    collectStar : function(player, star) {

        // Removes the star from the screen
        star.kill();
        if (star.dangerous) {
            this.death();
        }


    },

    death: function() {
        this.player.x = this.playerStart[0].x;
        this.player.y = this.playerStart[0].y;
        this.player.frame = 1; 
        this.choppersound.stop();
        this.choppersound.play(false, 1);
        this.startTime = this.game.time.now;
        this.stars.forEach(function(barrel) {
            barrel.kill();
        });
        this.timer = 0;
    },

    win: function() {
        this.winnar = true;
        this.player.body.gravity.y = 0;
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;
        this.player.frame = 0;

    },

    // find objects in a tiled layer that contains a property called "type" equal to a value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if (element.properties.type === type) {
                // phaser uses top left - tiled bottom left so need to adjust:
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, 'objects');
        sprite.frame = parseInt(element.properties.frame);

        // copy all of the sprite's properties
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },


    render: function() {

        if (this.showDebug) {
            this.game.debug.body(this.player);
        }
    },

};
