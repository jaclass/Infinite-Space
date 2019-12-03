var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', Phaser.AUTO);


var spaceship;
var weapon;
var cursors;
var fireButton;
var trophies;
var speed=5;
var life=3;
var firerate=1;
var damage=1;
var pause=false;
var round=1;
var states={};
var bmpText;
var explosions;
var trophyrate = 1;
var enemyBullets
var firingTimer1 = 0;
var invTime;
var invDuration=500;
var enemies=[];

var enemyFactory = {
	generateRandomEnemy: function(){
		this.generateEnemyOne(800, 200);
		this.generateEnemyOne(800, 400);
		this.generateEnemyTwo(800, 300);
	},

	generateEnemyOne: function(x, y){
		enemies.push(new EnemyOne(game, spaceship, enemyBullets, x, y)); 
	},
	
	generateEnemyTwo: function(x, y){
		enemies.push(new EnemyTwo(game, spaceship, x, y)); 
	}
}

/***** Enemy Type One ******/
EnemyOne = function(game, player, bullets, x, y){
	this.game = game;
    this.health = 6;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 800;
    this.nextFire = y;
    this.alive = true;
    this.enemy = game.add.sprite(x, y, 'enemy_one');
    this.enemy.anchor.setTo(0.5, 0.5);
    this.enemy.father = this;
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 1);
    this.enemy.body.velocity.set(150, 0);
}

EnemyOne.prototype.damage = function() {
    this.health -= damage;
    if (this.health <= 0)
    {
        this.alive = false;
        this.enemy.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(this.enemy.body.x, this.enemy.body.y);
        explosion.play('kaboom', 30, false, true);
        var seed = game.rnd.integerInRange(1, trophyrate+(round-1));
        if(seed==1){
        	generateTrophy(this.enemy.body.x, this.enemy.body.y);
        }
        return true;
    }
    return false;
}

EnemyOne.prototype.update = function() {
	if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
        this.nextFire = this.game.time.now + this.fireRate;
        enemyFire(this.enemy.x, this.enemy.y+10, this.player, this.bullets, 300);
    }
}
/**************************/



/***** Enemy Type Two ******/
EnemyTwo = function(game, player, x, y){
	this.game = game;
    this.health = 2;
    this.player = player;
    this.alive = true;
    this.enemy = game.add.sprite(x, y, 'enemy_two');
    this.enemy.anchor.setTo(0.5, 0.5);
    this.enemy.father = this;
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 1);
    this.enemy.body.velocity.set(150, 150);
}

EnemyTwo.prototype.damage = function() {
    this.health -= damage;
    if (this.health <= 0)
    {
        this.alive = false;
        this.enemy.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(this.enemy.body.x, this.enemy.body.y);
        explosion.play('kaboom', 30, false, true);
        var seed = game.rnd.integerInRange(1, trophyrate+(round-1));
        if(seed==1){
        	generateTrophy(this.enemy.body.x, this.enemy.body.y);
        }
        return true;
    }
    return false;
}

EnemyTwo.prototype.update = function() {
	return ;
}
/**************************/



function enemyFire(target_x, target_y, player, bullets, bulletSpeed){
	var bullet = bullets.getFirstDead();
    bullet.reset(target_x, target_y);
    this.game.physics.arcade.moveToObject(bullet, player, bulletSpeed);
}



states.Main = function(game){};
states.Stop = function(game){};
states.Stop.prototype={
		preload: function() {
	    this.load.image('bullet', 'assets/sprites/shmup-bullet.png');
	    this.load.image('life', 'assets/sprites/thrust_ship.png');
	    this.load.image('speed', 'assets/sprites/thrust_ship.png');
	    this.load.image('firerate', 'assets/sprites/thrust_ship.png');
	    this.load.image('damage', 'assets/sprites/thrust_ship.png');
	    this.load.image('one', 'assets/sprites/shmup-bullet.png');
	    this.load.image('ship', 'assets/sprites/thrust_ship.png');
	    this.load.image('enemy_one','assets/sprites/enemy_ship_1.png');
	    this.load.spritesheet('trophy', 'assets/sprites/bluemetal_20x20x4.png', 20, 20);
	    this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
	    cursors = this.input.keyboard.addKeys( 
	    		{ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D,'enter': Phaser.KeyCode.ENTER } 
	    );
	},
	create: function() {
		document.getElementById('stop').style.display='none';
		this.add.sprite(200, 100, 'life');
		for(var i=0;i<life;i++)
			this.add.sprite(220+10*i, 112, 'one');
		this.add.sprite(400, 100, 'speed');
		for(var i=0;i<speed-4;i++)
			this.add.sprite(420+10*i, 112, 'one');
		this.add.sprite(200, 160, 'firerate');
		for(var i=0;i<firerate;i++)
			this.add.sprite(220+10*i, 172, 'one');
		this.add.sprite(400, 160, 'damage');
		for(var i=0;i<damage;i++)
			this.add.sprite(420+10*i, 172, 'one');
		var title1 = this.add.bitmapText(this.world.centerX-100, 40, 'carrier_command','PAUSED',22);
		this.add.sprite(200, 306, 'ship');
		bmpText = this.add.bitmapText(this.world.centerX-160, this.world.centerY+10, 'carrier_command','Restart game!',22);
	},
	
	update:function() {
		if (cursors.enter.isDown){
			game.state.start('Main');
		}
	},
	
	render: function() {
	}
}
states.Start = function(game){};
states.Start.prototype={
		preload: function() {
	    this.load.image('bullet', 'assets/sprites/shmup-bullet.png');
	    this.load.image('ship', 'assets/sprites/thrust_ship.png');
	    this.load.image('enemy_one','assets/sprites/enemy_ship_1.png');
	    this.load.spritesheet('trophy', 'assets/sprites/bluemetal_20x20x4.png', 20, 20);
	    this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
	    cursors = this.input.keyboard.addKeys( 
	    		{ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D,'enter': Phaser.KeyCode.ENTER });
	},
	create: function() {
		this.add.sprite(200, 300, 'ship');
		var title1 = this.add.bitmapText(this.world.centerX-100, this.world.centerY-100, 'carrier_command','Infinite',22);
		var title2 = this.add.bitmapText(this.world.centerX-60, this.world.centerY-60, 'carrier_command','Space',22);
		bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY+10, 'carrier_command','Press Enter!',22);
		bmpText.anchor.setTo(0.5);
	},
	
	update:function() { 
		if (cursors.enter.isDown){
			game.state.start('Main');
		}
	},
	
	render: function() {
	}
}
states.Main.prototype={
	preload: function() {
	    this.load.image('bullet', 'assets/sprites/shmup-bullet.png');
	    this.load.image('enemy_bullet', 'assets/sprites/enemy-bullet.png');
	    this.load.image('ship', 'assets/sprites/thrust_ship.png');
	    this.load.image('enemy_one','assets/sprites/enemy_ship_1.png');
	    this.load.spritesheet('trophy', 'assets/sprites/bluemetal_20x20x4.png', 20, 20);
	    this.load.spritesheet('kaboom', 'assets/games/explode.png', 128, 128);
	    this.load.spritesheet('enemy_two', 'assets/sprites/invader32x32x4.png', 32, 32);
	    this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
	    
	},
	create: function() {
		document.getElementById('stop').onclick= function()
		{
			pause=true;
		}
		pause=false;
	    //  Creates 30 bullets, using the 'bullet' graphic
	    weapon = this.add.weapon(30, 'bullet');
	    document.getElementById('stop').innerText="Stop";
	    document.getElementById('stop').style.display='inline';
	    
	    // Set the features of weapon
	    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
	    weapon.bulletLifespan = 2000;
	    weapon.bulletSpeed = 600;
	    weapon.fireRate = 600;
	    weapon.bulletWorldWrap = false;
	    
	    // Set the enemy's bullets
	    enemyBullets = game.add.group();
	    enemyBullets.enableBody = true;
	    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
	    enemyBullets.createMultiple(100, 'enemy_bullet');
	    
	    enemyBullets.setAll('anchor.x', 0.5);
	    enemyBullets.setAll('anchor.y', 0.5);
	    enemyBullets.setAll('outOfBoundsKill', true);
	    enemyBullets.setAll('checkWorldBounds', true);
	    
	    // Set the features of spaceship
	    spaceship = this.add.sprite(400, 300, 'ship');
	    spaceship.anchor.set(0.5);
	    this.physics.arcade.enable(spaceship);
	    spaceship.body.drag.set(70);
	    spaceship.body.maxVelocity.set(200);
	    this.world.setBounds(0,0,800,600);
	    spaceship.body.collideWorldBounds = true;
	    
	    //  Tell the Weapon to track the 'player' Sprite
	    //  With no offsets from the position
	    //  But the 'true' argument tells the weapon to track sprite rotation
	    weapon.trackSprite(spaceship, 0, 0, true);
	    directions = this.input.keyboard.createCursorKeys();
	    
	    // Round Text hint
	    bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY-200, 'carrier_command','Round '+round,33);
		bmpText.anchor.setTo(0.5);
		bmpText.lifespan = 1000;
	    
	    
	    // Bonus Trophies
	    trophies =  this.add.physicsGroup(Phaser.Physics.ARCADE);
	    
	    // explosions group
	    explosions = game.add.group();
	    explosions.createMultiple(30, 'kaboom');
	    explosions.forEach(setupInvader, this);
	    
	    
	    enemyFactory.generateRandomEnemy();
	    
	    
	    // add keys for move
	    cursors = this.input.keyboard.addKeys( 
	    		{ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D,'enter': Phaser.KeyCode.ENTER } 
	    );
	    
	    
	
	},
	
	update:function() {
		var isAlive = 0;
		//enemy type one's update
		for (var i = 0; i < enemies.length; i++)
	    {
	        if (enemies[i].alive)
	        {
	        	isAlive++;
	            // when the bullet hits enemy
	            this.physics.arcade.overlap(weapon.bullets, enemies[i].enemy, enemy_bullet_collision, null, this);
	            // when the enemy collide player
	            this.physics.arcade.overlap(enemies[i].enemy, spaceship, player_enemy_collision, null, this);
	            enemies[i].update();
	        }
	    }
		
		// get the bonus trophy
		this.physics.arcade.overlap(spaceship, trophies, player_trophy_collision, null, this);
			
		
		// when the bullet hits player
		this.physics.arcade.overlap(enemyBullets, spaceship, player_bullet_collision, null, this);
		
		
		// game operations
		if (cursors.up.isDown){
			spaceship.y -= speed;
		}
		
		if (cursors.down.isDown){
			spaceship.y += speed;
		}
		
		if (cursors.left.isDown){
			spaceship.x -= speed;
		}
		
		if (cursors.right.isDown){
			spaceship.x += speed;
		}
		
		if(directions.up.isDown){
			spaceship.angle= -90;
			weapon.fire();
		}
		
		if(directions.down.isDown){
			spaceship.angle= 90;
			weapon.fire();
		}
		
		if(directions.right.isDown){
			spaceship.angle= 0;
			weapon.fire();
		}
		
		if(directions.left.isDown){
			spaceship.angle= 180;
			weapon.fire();
		}
		if (cursors.enter.isDown){
			//game.state.start('Stop');
		}
		if(pause)
		{
			game.state.start('Stop');
		}
		this.world.wrap(spaceship, 16);
		

		
		
		
		
		//next round
		if(trophies.countLiving()==0 && isAlive==0){
			round++;
			bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY-200, 'carrier_command','Round '+round,33);
			bmpText.anchor.setTo(0.5);
			bmpText.lifespan = 600;
			enemies.length = 0;
			enemyFactory.generateRandomEnemy();
		}
	},
	
	render: function() {
	
	    weapon.debug();
	
	}
}


function generateTrophy(x, y){
    var trophy = trophies.create(x, y, 'trophy');
    trophy.body.velocity.set(150, 150);
    trophy.animations.add('spin', [0, 1, 2, 3]);
    trophy.play('spin', 20, true);
    trophies.setAll('body.collideWorldBounds', true);
    trophies.setAll('body.bounce.x', 1);
    trophies.setAll('body.bounce.y', 1);
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}


function enemy_bullet_collision (enemy, bullet) {
    bullet.kill();
    enemy.father.damage(); 
}

function player_bullet_collision(obj1, obj2){
	obj2.kill();
	life--;
	if(life==0){
		//game over
		obj1.kill();
		var explosion = explosions.getFirstExists(false);
	    explosion.reset(obj2.body.x, obj2.body.y);
	    explosion.play('kaboom', 30, false, true);
		console.log("Game Over!");
	}
}

function player_enemy_collision(enemy, spaceship){
	life--;
	if(life==0){
		//game over
		spaceship.kill();
		var explosion = explosions.getFirstExists(false);
	    explosion.reset(spaceship.body.x, spaceship.body.y);
	    explosion.play('kaboom', 30, false, true);
		console.log("Game Over!");
	}
}

function player_trophy_collision(obj1, obj2){
			
	/* spaceship's abilities that could be improved: speed, firerate, damage */
	var type = this.rnd.integerInRange(1, 3);
	switch(type){
		case 1:	// speed up
			bmpText.kill();
			bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY-150, 'carrier_command','Speed Up!',22);
			bmpText.anchor.setTo(0.5);
			bmpText.lifespan = 1000;
			if(speed<13){
				speed++;
			}
			break;
		case 2: // fireate up
			bmpText.kill();
			bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY-150, 'carrier_command','Firerate Up!',22);
			bmpText.anchor.setTo(0.5);
			bmpText.lifespan = 1000;
			if(weapon.fireRate>320){
				weapon.fireRate -= 40;
				firerate++;
			}
			break;
		case 3: // damage up
			bmpText.kill();
			bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY-150, 'carrier_command','Damage Up!',22);
			bmpText.anchor.setTo(0.5);
			bmpText.lifespan = 1000;
			if(damage<9){
				damage++;
			}
			break;
		default:
			break;
	}
	obj2.kill();
}


game.state.add('Main',states.Main);
game.state.add('Stop',states.Stop);
game.state.add('Start',states.Start);
game.state.start('Start');
