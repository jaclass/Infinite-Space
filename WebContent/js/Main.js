var game = new Phaser.Game(1067, 600, Phaser.CANVAS, 'phaser-example', Phaser.AUTO);


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
var roundEndTimer;
var isRoundEnd = true;
var enemyBullets2;
var enemyBullets3;
var control="";
var arrow = document.getElementById('arr');
var difficulty = 1;
arr.style.display="none";
var enemyFactory = {
	// generate enemy in random at the beginning of round
	generateRandomEnemy: function(){
		if(round%7==0){ // Boss round		
			enemyFactory.generateEnemyBoss(game.world.centerX-80, 0);
			return ;
		}
		var enemyNum = Math.min(game.rnd.integerInRange(round, round+2),8);
		
		// generate positions of enemys
		var positions = [];
		while(positions.length < enemyNum){
		    var r = game.rnd.integerInRange(0, 10);
		    if(positions.indexOf(r) === -1) 
		    	positions.push(r);
		}
		for(var i=0;i<enemyNum;i++){
			positions[i] = positions[i]*60 + game.rnd.integerInRange(0, 15);
		}
		
		// randomly generate enemy
		for(var i=0;i<enemyNum;i++){
			if(round<5){	//only enemy type: 1,2,3
				let seed = game.rnd.integerInRange(1, 3);
				switch(seed){
					case 1:	// type one
						this.generateEnemyOne(1060,positions[i]);
						break;
					case 2: // type two
						this.generateEnemyTwo(1060,positions[i],150,150);
						break;
					case 3: // type three
						this.generateEnemyThree(1060,positions[i]);
						break;
					default:
						break;
				}
			}else{	// all types
				let seed = game.rnd.integerInRange(1, 5);
				switch(seed){
					case 1:	// type one
						this.generateEnemyOne(1060,positions[i]);
						break;
					case 2: // type two
						this.generateEnemyTwo(1060,positions[i],150,150);
						break;
					case 3: // type three
						this.generateEnemyThree(1060,positions[i]);
						break;
					case 4: // type three
						this.generateEnemyFour(1060,positions[i]);
						break;
					case 5: // type three
						this.generateEnemyFive(1060,positions[i]);
						break;
					default:
						break;
				}
			}
		}

		
		
	},

	generateEnemyOne: function(x, y){
		enemies.push(new EnemyOne(game, spaceship, enemyBullets, x, y)); 
	},
	generateEnemyTwo: function(x, y, vx, vy){
		enemies.push(new EnemyTwo(game, spaceship, enemyBullets, x, y, vx, vy)); 
	},
	generateEnemyThree: function(x, y){
		enemies.push(new EnemyThree(game, spaceship, x, y)); 
	},
	generateEnemyFour: function(x, y){
		enemies.push(new EnemyFour(game, spaceship, enemyBullets, x, y)); 
	},
	generateEnemyFive: function(x, y){
		enemies.push(new EnemyFive(game, spaceship, enemyBullets, x, y)); 
	},
	generateEnemyBoss: function(x, y){
		enemies.push(new EnemyBoss(game, spaceship,enemyBullets,enemyBullets2,enemyBullets3, x, y)); 
	},
}

/***** Enemy Type One ******/
EnemyOne = function(game, player, bullets, x, y){
	this.game = game;
    this.health = 6*difficulty;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1100;
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
    enemyShining(this.enemy);
    if (this.health <= 0)
    {
        this.alive = false;
        this.enemy.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(this.enemy.body.x, this.enemy.body.y);
        explosion.play('kaboom', 30, false, true);
        var seed = game.rnd.integerInRange(1, Math.min(trophyrate+(round-1),8));
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
EnemyTwo = function(game, player, bullets, x, y, vx, vy){
	this.game = game;
    this.health = 2*difficulty;
    this.player = player;
    this.alive = true;
    this.enemy = game.add.sprite(x, y, 'enemy_two');
    this.enemy.anchor.setTo(0.5, 0.5);
    this.enemy.father = this;
    this.bullets = bullets;
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 1);
    this.enemy.body.velocity.set(vx, vy);
}

EnemyTwo.prototype.damage = function() {
    this.health -= damage;
    enemyShining(this.enemy);
    if (this.health <= 0)
    {
        this.alive = false;
        this.enemy.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(this.enemy.body.x, this.enemy.body.y);
        explosion.play('kaboom', 30, false, true);
        enemyFourFire(this.enemy.body.x, this.enemy.body.y, this.bullets, 200);
        var seed = game.rnd.integerInRange(1, Math.min(trophyrate+(round-1),8));
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

/***** Enemy Type Three ******/
EnemyThree = function(game, player, x, y){
	this.game = game;
    this.health = 2*difficulty;
    this.player = player;
    this.alive = true;
    this.enemy = game.add.sprite(x, y, 'enemy_three');
    this.enemy.anchor.setTo(0.5, 0.5);
    this.enemy.father = this;
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 1);
}

EnemyThree.prototype.damage = function() {
    this.health -= damage;
    enemyShining(this.enemy);
    if (this.health <= 0)
    {
        this.alive = false;
        this.enemy.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(this.enemy.body.x, this.enemy.body.y);
        explosion.play('kaboom', 30, false, true);
        var seed = game.rnd.integerInRange(1, Math.min(trophyrate+(round-1),8));
        if(seed==1){
         generateTrophy(this.enemy.body.x, this.enemy.body.y);
        }
        return true;
    }
    return false;
}

EnemyThree.prototype.update = function() {
	 if(life==0){
		 this.enemy.body.velocity.set(0, 0);
		 return;
	 }
	 this.game.physics.arcade.moveToObject(this.enemy, this.player, 200); 
}
/**************************/

/***** Enemy Type Four ******/
EnemyFour = function(game, player, bullets, x, y){
	this.game = game;
    this.health = 8*difficulty;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1500;
    this.nextFire = 0;
    this.alive = true;
    this.enemy = game.add.sprite(x, y, 'enemy_four');
    this.enemy.anchor.setTo(0.5, 0.5);
    this.enemy.father = this;
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 1);
}

EnemyFour.prototype.damage = function() {
    this.health -= damage;
    enemyShining(this.enemy);
    // shoot only be being attacked by player
    enemyFourFire(this.enemy.x, this.enemy.y, this.bullets, 300);
    if (this.health <= 0)
    {
        this.alive = false;
        this.enemy.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(this.enemy.body.x, this.enemy.body.y);
        explosion.play('kaboom', 30, false, true);
        var seed = game.rnd.integerInRange(1, Math.min(trophyrate+(round-1),8));
        if(seed==1){
        	generateTrophy(this.enemy.body.x, this.enemy.body.y);
        }
        return true;
    }
    return false;
}

EnemyFour.prototype.update = function() {
	if(life==0){
		 this.enemy.body.velocity.set(0, 0);
		 return;
	 }
	this.game.physics.arcade.moveToObject(this.enemy, this.player, 140); 
	this.enemy.rotation = game.physics.arcade.angleBetween(this.enemy, spaceship);
}
/**************************/

/***** Enemy Type Five ******/
EnemyFive = function(game, player, bullets, x, y){
	this.game = game;
    this.health = 12*difficulty;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1500;
    this.nextFire = 0;
    this.alive = true;
    this.enemy = game.add.sprite(x, y, 'enemy_five');
    this.enemy.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
    this.enemy.play('fly');
    this.enemy.anchor.setTo(0.5, 0.5);
    this.enemy.father = this;
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 1);
}

EnemyFive.prototype.damage = function() {
    this.health -= damage;
    enemyShining(this.enemy);
    if (this.health <= 0)
    {
        this.alive = false;
        
        var explosion = explosions.getFirstExists(false);
        explosion.reset(this.enemy.body.x, this.enemy.body.y);
        explosion.play('kaboom', 30, false, true);

        enemyFactory.generateEnemyTwo(this.enemy.body.x,this.enemy.body.y, 150, -150);
        enemyFactory.generateEnemyTwo(this.enemy.body.x,this.enemy.body.y, -150, 150);
        enemyFactory.generateEnemyTwo(this.enemy.body.x,this.enemy.body.y, -150, -150);
        
        this.enemy.kill();
        var seed = game.rnd.integerInRange(1, Math.min(trophyrate+(round-1),8));
        if(seed==1){
        	generateTrophy(this.enemy.body.x, this.enemy.body.y);
        }
        return true;
    }
    return false;
}

EnemyFive.prototype.update = function() {
	if(life==0){
		 this.enemy.body.velocity.set(0, 0);
		 return;
	 }
	 this.game.physics.arcade.moveToObject(this.enemy, this.player, 100); 
}
/**************************/


/***** Enemy Type Boss ******/
EnemyBoss = function(game, player,bullets,bullets2,bullets3, x, y){
	this.game = game;
    this.health = 40*difficulty;
    this.player = player;
    this.cnt=10;
    this.cnt2=10;
    this.bullets = bullets;
    this.bullets2=bullets2;
    this.bullets3=bullets3;
    this.alive = true;
    this.enemy = game.add.sprite(x, y, 'boss');
    this.enemy.father = this;
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 1);
}
EnemyBoss.prototype.state=1;
EnemyBoss.prototype.stop=false;
EnemyBoss.prototype.damage = function() {
    this.health -= damage;
    enemyShining(this.enemy);
    if (this.health <= 0)
    {
        this.alive = false;
        this.enemy.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(this.enemy.body.x+85, this.enemy.body.y+110);
        explosion.play('kaboom', 30, false, true);
        var seed = game.rnd.integerInRange(1, trophyrate+(round-1));
        if(seed==1){
        	generateTrophy(this.enemy.body.x, this.enemy.body.y);
        }
        return true;
    }
    return false;
}

EnemyBoss.prototype.update = function() {
	 if(life==0){
		 this.enemy.body.velocity.set(0, 0);
		 return;
	 }
	 if(this.state==1)
	 {
		 this.targetx=500;
		 this.targety=140;
		 if(this.cnt==0)
		 {
		 	 enemyMultiFire(this.enemy.body.x+70, this.enemy.body.y+100, this.bullets, 200);
		 	 this.cnt=30;
		 }
		 else this.cnt--;
		 if(this.cnt2==0)
		 {
			 var bullet = this.bullets3.getFirstDead();
		     bullet.reset(this.enemy.body.position.x, this.enemy.body.position.y+108);
		     bullet.rotation = game.physics.arcade.angleBetween(bullet, spaceship);
		     this.game.physics.arcade.moveToObject(bullet,this.player, 300);
		     bullet = this.bullets3.getFirstDead();
		     bullet.reset(this.enemy.body.position.x+74*2, this.enemy.body.position.y+108);
		     bullet.rotation = game.physics.arcade.angleBetween(bullet, spaceship);
		     this.game.physics.arcade.moveToObject(bullet,this.player, 300);
		 	 this.cnt2=45;
		 }
		 else this.cnt2--;
		 if(Math.abs(this.enemy.body.position.x-this.targetx)<=10&&Math.abs(this.enemy.body.position.y-this.targety)<=10)
		 {
			this.stop=true;
			this.enemy.body.velocity.set(0, 0);
			var timer = game.time.create(false);
			timer.add(1500,function(){
				 this.state=2;
				 this.stop=false;
		    },this);
			timer.start();
		 }
	 }
	 else if(this.state==2)
	 {
		 if(this.cnt==0)
		 {
		 	 enemyMultiFire(this.enemy.body.x+70, this.enemy.body.y+100, this.bullets, 200);
		 	 this.cnt=30;
		 }
		 else this.cnt--;
		 this.targetx=400;
		 this.targety=100;
		 if(Math.abs(this.enemy.body.position.x-this.targetx)<=10&&Math.abs(this.enemy.body.position.y-this.targety)<=10)
		 {
			 this.enemy.body.velocity.set(0, 0);
			 this.stop=true;
			 var timer = game.time.create(false);
			 timer.add(1500,function(){
			 	 this.state=3;
			 	this.stop=false;
		     },this);
			 timer.start();
		 }
	 }
	 else if(this.state==3)
	 {
		 this.targetx=600;
		 this.targety=80;
		 if(this.cnt==0)
		 {
			 var bullet = this.bullets2.getFirstDead();
		     bullet.reset(this.enemy.body.position.x+74, this.enemy.body.position.y+108);
		     //console.log(Math.abs(this.enemy.body.position.x-this.targetx))
		     this.game.physics.arcade.moveToXY(bullet,this.enemy.body.position.x+74, this.enemy.body.position.y+208, 1000);
		     if(this.state==3)
		    {
		    	 if(Math.abs(this.enemy.body.position.x-this.targetx)>=60)
		    	{
		    		 bullet.body.velocity.x=100;
		    	}
		    	else bullet.body.velocity.x=100*(-this.enemy.body.position.x+this.targetx)/60;
		    }
		     //console.log(bullet.body.velocity.x);
			 //enemyFire(this.enemy.body.x+70, this.enemy.body.y+100, this.player, this.bullets, 300);
		 	 //enemyMultiFire(this.enemy.body.x+70, this.enemy.body.y+100, this.bullets, 200);
		 	 this.cnt=0;
		 }
		 else this.cnt--;
		 if(this.cnt2==0)
		 {
			 var bullet = this.bullets3.getFirstDead();
		     bullet.reset(this.enemy.body.position.x, this.enemy.body.position.y+108);
		     this.game.physics.arcade.moveToObject(bullet,this.player, 300);
		     bullet.rotation = game.physics.arcade.angleBetween(bullet, spaceship);
		     bullet = this.bullets3.getFirstDead();
		     bullet.reset(this.enemy.body.position.x+74*2, this.enemy.body.position.y+108);
		     this.game.physics.arcade.moveToObject(bullet,this.player, 300);
		     bullet.rotation = game.physics.arcade.angleBetween(bullet, spaceship);
		 	 this.cnt2=45;
		 }
		 else this.cnt2--;
		 if(Math.abs(this.enemy.body.position.x-this.targetx)<=10&&Math.abs(this.enemy.body.position.y-this.targety)<=10)
		 {
			 this.stop=true;
			 this.enemy.body.velocity.set(0, 0);
			 var timer = game.time.create(false);
			 timer.add(1500,function(){
			 	 this.state=1;
			 	this.stop=false;
		     },this);
			 timer.start();
		 }
	 }
	 if(!this.stop)
		 this.game.physics.arcade.moveToXY(this.enemy, this.targetx,this.targety,100);
	 //this.game.physics.arcade.moveToObject(this.enemy, this.player, 200); 
}
/**************************/

function enemyShining(enemy){
	enemy.alpha = 1;
	game.add.tween(enemy).to( { alpha: 0.5 }, 50, Phaser.Easing.Linear.None, true, 0, 1, true);
}

function enemyFire(target_x, target_y, player, bullets, bulletSpeed){
	var bullet = bullets.getFirstDead();
    bullet.reset(target_x, target_y);
    this.game.physics.arcade.moveToObject(bullet, player, bulletSpeed);
}

function enemyFourFire(target_x, target_y, bullets, bulletSpeed){
	var direction_x = [1, 0, -1, 0];
	var direction_y = [0, -1, 0, 1]; 
	for(var i=0;i<4;i++){
		var bullet = bullets.getFirstDead();
		bullet.reset(target_x, target_y);
		bullet.body.velocity.set(bulletSpeed*direction_x[i], bulletSpeed*direction_y[i]);
	}
}
function enemyMultiFire(target_x, target_y, bullets, bulletSpeed){
	var direction_x = [1, 0, -1, 0];
	var direction_y = [0, -1, 0, 1];
	for(var i=0;i<90;i+=8)
	{
		direction_x[i/8] = 1*Math.cos(i);
		direction_y[i/8] = 1*Math.sin(i);
	}
	for(var i=0;i<11;i++){
		var bullet = bullets.getFirstDead();
		bullet.reset(target_x, target_y);
		bullet.body.velocity.set(bulletSpeed*direction_x[i], bulletSpeed*direction_y[i]);
	}
}


states.Main = function(game){};

states.Start = function(game){};
states.Start.prototype={
		preload: function() {
		this.load.image('space', 'assets/sprites/Space.png');
	    this.load.image('ship', 'assets/sprites/thrust_ship.png');
	    this.load.image('enemy_one','assets/sprites/enemy_ship_1.png');
	    this.load.spritesheet('trophy', 'assets/sprites/bluemetal_20x20x4.png', 20, 20);
	    this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
	    directions = this.input.keyboard.createCursorKeys();
	    cursors = this.input.keyboard.addKeys( 
	    		{ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D,'enter': Phaser.KeyCode.ENTER });
	},
	create: function() {
		this.add.image(0, 0, 'space');
		this.ship=this.add.sprite(360, this.world.centerY+40, 'ship');
		var title1 = this.add.bitmapText(this.world.centerX-100, this.world.centerY-100, 'carrier_command','Infinite',22);
		var title2 = this.add.bitmapText(this.world.centerX-60, this.world.centerY-60, 'carrier_command','Space',22);
		bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY+10, 'carrier_command','Press Enter!',22);
		this.add.bitmapText(this.world.centerX-100, this.world.centerY+40, 'carrier_command','Easy',22);
		this.add.bitmapText(this.world.centerX-100, this.world.centerY+80, 'carrier_command','Difficult',22);
		bmpText.anchor.setTo(0.5);
		this.down1=false;
		this.down2=false;
	},
	
	update:function() { 
		if (cursors.enter.isDown){
			game.state.start('Main');
		}
		if (directions.up.isDown&&!this.down1){		//switch the difficulty
			this.down1=true;
			this.ship.position.y=(this.ship.position.y-this.world.centerY)%80+40+this.world.centerY;
			difficulty = difficulty==1?1.5:1;
		}
		if (directions.down.isDown&&!this.down2){	//switch the difficulty
			this.down2=true;
			this.ship.position.y=(this.ship.position.y-this.world.centerY)%80+40+this.world.centerY;
			difficulty = difficulty==1?1.5:1;
		}
		if (directions.down.isUp){
			this.down2=false;
		}
		if (directions.up.isUp){
			this.down1=false;
		}
	},
	
	render: function() {
	}
}
states.Main.prototype={
	preload: function() {
	    this.load.image('bullet', 'assets/sprites/bullet.png');
	    this.load.image('space', 'assets/sprites/Space.png');
	    this.load.image('enemy_bullet', 'assets/sprites/enemy-bullet.png');
	    this.load.image('enemy_bullet2', 'assets/sprites/enemy-bullet2.png');
	    this.load.image('enemy_bullet3', 'assets/sprites/enemy-bullet4.png');
	    this.load.image('ship', 'assets/sprites/thrust_ship.png');
	    this.load.image('enemy_one','assets/sprites/enemy_ship_1.png');
	    this.load.image('enemy_two','assets/sprites/space-baddie.png');
	    this.load.image('enemy_four','assets/sprites/enemy_four.png');
	    this.load.spritesheet('trophy', 'assets/sprites/bluemetal_20x20x4.png', 20, 20);
	    this.load.spritesheet('kaboom', 'assets/games/explode.png', 128, 128);
	    this.load.spritesheet('stopbk', 'assets/sprites/stopbk2.png', 560, 400);
	    this.load.spritesheet('life', 'assets/sprites/life.png', 24, 24);
	    this.load.spritesheet('life2', 'assets/sprites/life2.png', 24, 24);
	    this.load.spritesheet('one', 'assets/sprites/one.png', 32, 16);
	    this.load.spritesheet('enemy_three', 'assets/sprites/invader32x32x4.png', 48, 48);
	    this.load.spritesheet('enemy_five', 'assets/sprites/invader56x56x4.png', 86, 86);
	    this.load.image('boss', 'assets/sprites/2.png');
	    this.load.image('chiruno', 'assets/sprites/chiruno3.png');
	    this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
	    
	},
	name:'main',
	stop: function() {
		arr.style.display="inline";
		this.items.push(this.add.sprite(347, 20, 'stopbk'));
		var startx = 397;
		
		this.items.push(this.add.sprite(startx, 103, 'life'));
		for(var i=0;i<life;i++)
			this.items.push(this.add.sprite(startx+20+10*i, 100, 'one'));
		
		this.items.push(this.add.sprite(startx+200, 100, 'speed'));
		for(var i=0;i<speed-4;i++)
			this.items.push(this.add.sprite(startx+200+20+10*i, 100, 'one'));
		
		this.items.push(this.add.sprite(startx, 160, 'firerate'));
		for(var i=0;i<firerate;i++)
			this.items.push(this.add.sprite(startx+20+10*i, 160, 'one'));
		
		this.items.push(this.add.sprite(startx+200, 160, 'damage'));
		for(var i=0;i<damage;i++)
			this.items.push(this.add.sprite(startx+200+20+10*i, 160, 'one'));
		
		this.items.push( this.add.bitmapText(this.world.centerX-70, 40, 'carrier_command','ROUND '+round,22));
		this.items.push(this.add.bitmapText(startx, this.world.centerY+10, 'carrier_command','Back To Game',22));
		this.items.push(this.add.bitmapText(startx, this.world.centerY+50, 'carrier_command','Restart Game',22));
		this.items.push(this.add.bitmapText(startx, this.world.centerY+90, 'carrier_command','Main Menu',22));
		game.paused=true;
	},
	clearstop:function() {
		arr.style.display="none";
		for(item in this.items)
		{
			this.items[item].destroy();
		}
		//game.state.start("Main")
	},
	create: function() {
		this.add.image(0, 0, 'space');
		this.add.image(100 ,50 ,'chiruno');
		pause=false;
		this.items = new Array();
	    //  Creates 30 bullets, using the 'bullet' graphic
	    weapon = this.add.weapon(50, 'bullet');
	    this.heart = new Array();
	    // Set the features of weapon
	    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
	    weapon.bulletLifespan = 2000;
	    weapon.bulletSpeed = 900;
	    weapon.fireRate = 450;
	    weapon.bulletWorldWrap = false;
	    
	    // Set the enemy's bullets
	    enemyBullets = game.add.group();
	    enemyBullets.enableBody = true;
	    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
	    enemyBullets.createMultiple(150, 'enemy_bullet');
	    
	    enemyBullets.setAll('anchor.x', 0.5);
	    enemyBullets.setAll('anchor.y', 0.5);
	    enemyBullets.setAll('outOfBoundsKill', true);
	    enemyBullets.setAll('checkWorldBounds', true);
	    // Set the boss's bullets
	    enemyBullets2 = game.add.group();
	    enemyBullets2.enableBody = true;
	    enemyBullets2.physicsBodyType = Phaser.Physics.ARCADE;
	    enemyBullets2.createMultiple(1500, 'enemy_bullet2');
	    
	    enemyBullets2.setAll('anchor.x', 0.5);
	    enemyBullets2.setAll('anchor.y', 0.5);
	    enemyBullets2.setAll('outOfBoundsKill', true);
	    enemyBullets2.setAll('checkWorldBounds', true);
	    // Set the boss's bullets2
	    enemyBullets3 = game.add.group();
	    enemyBullets3.enableBody = true;
	    enemyBullets3.physicsBodyType = Phaser.Physics.ARCADE;
	    enemyBullets3.createMultiple(1500, 'enemy_bullet3');
	    
	    enemyBullets3.setAll('anchor.x', 0.5);
	    enemyBullets3.setAll('anchor.y', 0.5);
	    enemyBullets3.setAll('outOfBoundsKill', true);
	    enemyBullets3.setAll('checkWorldBounds', true);
	    // Set the features of spaceship
	    spaceship = this.add.sprite(400, 300, 'ship');
	    spaceship.anchor.set(0.5);
	    this.physics.arcade.enable(spaceship);
	    spaceship.body.drag.set(70);
	    spaceship.body.maxVelocity.set(200);
	    this.world.setBounds(0,0,1067,600);
	    spaceship.body.collideWorldBounds = true;
	    spaceship.anchor.setTo(0.5, 0.5);
	    //  Tell the Weapon to track the 'player' Sprite
	    //  With no offsets from the position
	    //  But the 'true' argument tells the weapon to track sprite rotation
	    weapon.trackSprite(spaceship, 0, 0, true);
	    directions = this.input.keyboard.createCursorKeys();
	    
	    
	    
	    
	    // Bonus Trophies
	    trophies =  this.add.physicsGroup(Phaser.Physics.ARCADE);
	    
	    // explosions group
	    explosions = game.add.group();
	    explosions.createMultiple(30, 'kaboom');
	    explosions.forEach(setupInvader, this);
	    
	    // Round Legend
	    bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY-200, 'carrier_command','Round '+round,33);
		bmpText.anchor.setTo(0.5);
		bmpText.lifespan = 1500;
	    
	    //Set the timer before the round begin
	    roundEndTimer = game.time.create(false);
	    roundEndTimer.add(1500,function(){
	    	enemyFactory.generateRandomEnemy();
	    	isRoundEnd = false;
	    },this);
	    roundEndTimer.start();
	    
	    
	    // add keys for move
	    cursors = this.input.keyboard.addKeys( 
	    		{ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D,'enter': Phaser.KeyCode.ENTER} 
	    );
	    
	    
	
	},
	
	update:function() {
		
		for(var i=0;i<this.heart.length;i++)
			this.heart[i].destroy();
		for(var i=0;i<6;i++)
		{	
			if(i<life)
				this.heart.push(this.add.sprite(150+i*24, 64, 'life'));
			else
				this.heart.push(this.add.sprite(150+i*24, 64, 'life2'));
		}
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
		this.physics.arcade.overlap(enemyBullets2, spaceship, player_bullet_collision, null, this);
		this.physics.arcade.overlap(enemyBullets3, spaceship, player_bullet_collision, null, this);
		
		
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
		}
		this.world.wrap(spaceship, 16);
		

		
		
		
		//next round
		if(trophies.countLiving()==0 && isAlive==0 && !isRoundEnd){
			isRoundEnd = true;
			round++;
			if(round%7==0){
				bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY-200, 'carrier_command','BOSS Round ',44);
				game.add.tween(bmpText).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 5, true);
			}else{
				bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY-200, 'carrier_command','Round '+round,33);
			}
			bmpText.anchor.setTo(0.5);
			bmpText.lifespan = 1500;
			enemies.length = 0;
			//enemyFactory.generateRandomEnemy();
			roundEndTimer.add(2400,function(){
		    	enemyFactory.generateRandomEnemy();
		    	isRoundEnd = false;
		    },this);
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
	if(invTime+invDuration>=game.time.now){
		return;
	}
	
	spaceship.alpha = 1;
	game.add.tween(spaceship).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 3, true);
	life--;
	invTime = game.time.now;
	if(life==0){
		//game over
		obj1.kill();
		var explosion = explosions.getFirstExists(false);
	    explosion.reset(obj2.body.x, obj2.body.y);
	    explosion.play('kaboom', 30, false, true);
	}
}

function player_enemy_collision(enemy, spaceship){
	if(invTime+invDuration>=game.time.now){
		return;
	}
	spaceship.alpha = 1;
	game.add.tween(spaceship).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 3, true);
	life--;
	invTime = game.time.now;
	if(life==0){
		//game over
		spaceship.kill();
		var explosion = explosions.getFirstExists(false);
	    explosion.reset(spaceship.body.x, spaceship.body.y);
	    explosion.play('kaboom', 30, false, true);
	}
}
function player_trophy_collision(obj1, obj2){
			
	/* spaceship's abilities that could be improved: speed, firerate, damage */
	var type = this.rnd.integerInRange(1, 4);
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
			if(weapon.fireRate>170){
				weapon.fireRate -= 40;
				firerate++;
			}
			break;
		case 3: // damage up
			bmpText.kill();
			bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY-150, 'carrier_command','Damage Up!',22);
			bmpText.anchor.setTo(0.5);
			bmpText.lifespan = 1000;
			if(damage<5){
				damage+=0.5;
			}
			break;
		case 4: // HP up
			bmpText.kill();
			bmpText = this.add.bitmapText(this.world.centerX, this.world.centerY-150, 'carrier_command','HP Up!',22);
			bmpText.anchor.setTo(0.5);
			bmpText.lifespan = 1000;
			if(life<6){
				life++;
			}
			break;
		default:
			break;
	}
	obj2.kill();
}

document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];  
     if(e && e.keyCode==13&&game.state.getCurrentState().key=='Main'){
    	 if(!game.paused)
		{
			game.paused=true;
			game.state.getCurrentState().stop();
		}
		else
		{
			game.paused=false;
			control=(parseInt(arrow.style.top)-310)/40;
			if(control==2) location.reload();
			game.state.getCurrentState().clearstop();
		}
    }
     else if(e && e.keyCode==38&&game.state.getCurrentState().key=='Main'&&game.paused)
    {
    	 //console.log(arrow.style.top);
    	 arrow.style.top=parseInt(arrow.style.top)-40+'px';
    	 if(parseInt(arrow.style.top)<310) arrow.style.top=parseInt(arrow.style.top)+120+'px';
    }
     else if(e && e.keyCode==40&&game.state.getCurrentState().key=='Main'&&game.paused)
    {
    	 arrow.style.top=parseInt(arrow.style.top)+40+'px';
    	 if(parseInt(arrow.style.top)>390) arrow.style.top=parseInt(arrow.style.top)-120+'px';
    }
}; 
game.state.add('Main',states.Main);
game.state.add('Stop',states.Stop);
game.state.add('Start',states.Start);
game.state.start('Start');
