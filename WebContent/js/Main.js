var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', 
						   { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('bullet', 'assets/sprites/shmup-bullet.png');
    game.load.image('ship', 'assets/sprites/thrust_ship.png');
    game.load.image('enemy_one','assets/sprites/enemy_ship_1.png');
    game.load.spritesheet('trophy', 'assets/sprites/bluemetal_20x20x4.png', 20, 20);
    game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
}

var spaceship;
var weapon;
var cursors;
var fireButton;
var trophies;
var speed = 5;
var enemies_one;


function create() {
    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    // Set the features of weapon
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 2000;
    weapon.bulletSpeed = 600;
    weapon.fireRate = 400;
    weapon.bulletWorldWrap = false;
    
    
    // Set the features of spaceship
    spaceship = this.add.sprite(400, 300, 'ship');
    spaceship.anchor.set(0.5);
    game.physics.arcade.enable(spaceship);
    spaceship.body.drag.set(70);
    spaceship.body.maxVelocity.set(200);
    game.world.setBounds(0,0,800,600);
    spaceship.body.collideWorldBounds = true;

    
    //  Tell the Weapon to track the 'player' Sprite
    //  With no offsets from the position
    //  But the 'true' argument tells the weapon to track sprite rotation
    weapon.trackSprite(spaceship, 0, 0, true);
    directions = this.input.keyboard.createCursorKeys();
    
    
    // Bonus Trophies
    trophies =  game.add.physicsGroup(Phaser.Physics.ARCADE);
    for(var i=1;i<=3;i++){
    	var trophy = trophies.create(i*100, 1*100, 'trophy');
    	trophy.body.velocity.set(200, 200);
    	trophy.animations.add('spin', [0, 1, 2, 3]);
        trophy.play('spin', 20, true);
    }
    /*trophy = trophies.create(400, 400, 'trophy');
	trophy.body.velocity.set(200, 200);*/
    trophies.setAll('body.collideWorldBounds', true);
    trophies.setAll('body.bounce.x', 1);
    trophies.setAll('body.bounce.y', 1);
    
    //enemy: straight mode
    enemies_one = game.add.physicsGroup(Phaser.Physics.ARCADE);
    var enemy_one = enemies_one.create(800, 200, 'enemy_one');
    enemy_one.body.velocity.set(150, 0);
    enemies_one.setAll('body.collideWorldBounds', true);
    enemies_one.setAll('body.bounce.x', 1);
    enemies_one.setAll('body.bounce.y', 1);
    
    
    // add keys for move
    cursors = this.input.keyboard.addKeys( 
    		{ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } 
    );
    
    

}

function update() {
	
	// get the bonus trophy
	game.physics.arcade.overlap(spaceship, trophies, function(obj1, obj2){
		
		/* spaceship's abilities that could be improved: speed, firerate, damage */
		var type = game.rnd.integerInRange(1, 3);
		switch(type){
			case 1:	// speed up
				bmpText = game.add.bitmapText(game.world.centerX, game.world.centerY-150, 'carrier_command','Speed Up!',22);
				bmpText.anchor.setTo(0.5);
				bmpText.lifespan = 1000;
				if(speed<10){
					speed++;
				}
				break;
			case 2: // fireate up
				bmpText = game.add.bitmapText(game.world.centerX, game.world.centerY-150, 'carrier_command','Firerate Up!',22);
				bmpText.anchor.setTo(0.5);
				bmpText.lifespan = 1000;
				if(weapon.fireRate>200){
					weapon.fireRate -= 40;
				}
				break;
			case 3: // damage up
				bmpText = game.add.bitmapText(game.world.centerX, game.world.centerY-150, 'carrier_command','Damage Up!',22);
				bmpText.anchor.setTo(0.5);
				bmpText.lifespan = 1000;
				break;
			default:
				break;
		}
		obj2.kill();
	}, function(obj1, obj2){ 
		return true; 
	}, this);
		
	// when the bullet hits enemy
	game.physics.arcade.overlap(weapon.bullets, enemies_one, function collisionHandler (obj1, obj2) {
	    obj1.kill();
	    obj2.kill();
	}, null, this);
	
	// game operations
	if (cursors.up.isDown){
		/*var trophy = trophies.create(400, 400, 'trophy');
		trophy.body.velocity.set(200, 200);
		trophy.body.collideWorldBounds = true;
		trophy.body.bounce.x = 1;
		trophy.body.bounce.y = 1;*/
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
	
    game.world.wrap(spaceship, 16);

}

function render() {

    weapon.debug();

}
