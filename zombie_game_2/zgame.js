var game = new Phaser.Game(1300, 650, Phaser.AUTO, 'game', {preload: preload, create: create, update: update, }); 
var cursor;
var player;
var playerDead;
var gun;
var ground;
var platforms1;
var platforms2;
var gate;
var trap;
var zombie1;
var zombie1Death;
var zombie2;
var zombie2Death;
var zombie3;
var zombie3Death;
var zombie4;
var zombie4Death;
var zombie5;
var zombie5Death;
var zombie6;
var zombie6Death;
var zombie7;
var zombie7Death;
var zombie8;
var zombie8Death;
var bullets;
var fireRate = 100;
var nextFire = 0;
var text;
var highScore = 0;
var highScoreDisplay;
var style;
var time;
var timeLength = 0;
var timeLogEnd;
var gameoverText;
var xcoordinate = [0, 650, 1247];     
var ycoordinate = [0, 500];
var randomx = game.rnd.integerInRange(1, 3);
var randomy = game.rnd.integerInRange(1, 2);


function preload()
{
                  
               game.load.image('player', 'player_prototype.png');     
               game.load.image('gun', 'gun.png');
               game.load.image('ground', 'wallHorizontal.png');
               game.load.image('gate', 'gate.png');
               game.load.image('trap_door', 'trap_door.png');
               game.load.image('gun', 'gun.png');
               game.load.image('zombie', 'zombie.png');
               game.load.image('bullet', 'bullet.png');
}


function create()
{
                game.physics.startSystem(Phaser.Physics.ARCADE);
                
    
                // player code
                player = game.add.sprite(650, 400, 'player');  
                player.anchor.setTo(0.405, 0.5);
                game.physics.arcade.enable(player);
                game.physics.arcade.enableBody(player);
                player.body.gravity.y = 300;
                player.body.collideWorldBounds = true;
    
    
                //level code
                createWorld();
    
                //zombie code
                createZombies();
                game.time.events.loop(2000, zombieJump, this);
    
                //gun code
                gun = game.add.sprite(player.x, player.y, 'gun');
                gun.anchor.setTo(0, 0.5);
                gun.scale.setTo(1, 0.8);
                game.physics.arcade.enable(gun);
                game.physics.arcade.enableBody(gun);
                gun.body.gravity.y = 300;
                gun.body.collideWorldBounds = true;
    
    
              
    
                //bullet code
                 bullets = game.add.group();
                 bullets.enableBody = true;
                 game.physics.arcade.enable(bullets);
                 bullets.createMultiple(50, 'bullet', 0, false);
                 bullets.setAll('anchor.x', 0.5);
                 bullets.setAll('anchor.y', 0.5);
                 bullets.setAll('outOfBoundsKill', true);
                 bullets.setAll('checkWorldBounds', true);
                 //bullets.scale.setTo(1, 0.5);
               
               //input enabling code
                cursor = game.input.keyboard.createCursorKeys();  
    
    
                //highscore + other text code
                text = "zombies killed: " + highScore;
                style = { font: "35px Arial", fill: "#ff0044", align: "center" };                
                highScoreDisplay = game.add.text(160, 0, text, style);
                time = game.add.text(790, 0, "Time alive: " + game.time.events.length + " seconds",  style);
                game.time.events.loop(1000, timeLog);
}


function update()
{
                //player level collisions
                game.physics.arcade.collide(player, ground);
                game.physics.arcade.collide(player, platforms1);
                game.physics.arcade.collide(player, platforms2);
                game.physics.arcade.collide(player, gate);
                game.physics.arcade.collide(player, trap);
                //player movement function, allows user control of the robot using the arrow keys
                movePlayer();
    
    
    
                //zombie code
                //code for collisions for the zombies
                zombieCollisionHandler(); 
    
               
    
                
                
                //code to revive zombies if they are all dead
                if (zombie1Death && zombie2Death && zombie3Death && zombie4Death && zombie5Death && zombie6Death && zombie7Death && zombie8Death)
                {
                    createZombies();
                }
    
    
    
                // gun and firing code
                if (!playerDead)
                {
                gun.reset(player.x, player.y);
                }
    
                if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
                {
                    fireGun();
                }
                 
}




//creates level design
var createWorld = function()
{
            ground = game.add.sprite(0, 620, 'ground');
                game.physics.arcade.enable(ground);
                game.physics.arcade.enableBody(ground);
                ground.body.immovable = true;
                ground.scale.setTo(6.5, 2)
                
            platforms1 = game.add.group();
                platforms1.enableBody = true;
                game.add.sprite(200, 370, 'ground', 0, platforms1);
                game.add.sprite(900, 370, 'ground', 0, platforms1);
                game.add.sprite(0, 210, 'ground', 0, platforms1);
                game.add.sprite(100, 210, 'ground', 0, platforms1);
                game.add.sprite(1100, 210, 'ground', 0, platforms1);
                game.add.sprite(1000, 210, 'ground', 0, platforms1);
                game.physics.arcade.enable(platforms1);
                platforms1.setAll('body.immovable', true);
                
            platforms2 = game.add.group();
                platforms2.enableBody = true;
                game.add.sprite(450, 210, 'ground', 0, platforms2);
                game.add.sprite(650, 210, 'ground', 0, platforms2);
                platforms2.setAll('body.immovable', true);
    
    
    
            gate = game.add.group();
                gate.enableBody = true;
                game.add.sprite(0, 470, 'gate', 0, gate);
                game.add.sprite(1200, 470, 'gate', 0, gate); 
                gate.setAll('body.immovable', true);
    
             trap = game.add.group();
                trap.enableBody = true;
                game.add.sprite(100, 0, 'trap_door', 0, trap);
                game.add.sprite(1160, 0, 'trap_door', 0, trap); 
                game.add.sprite(525, 0, 'trap_door', 0, trap);
                game.add.sprite(725, 0, 'trap_door', 0, trap);
                trap.setAll('body.immovable', true);    
};


//zombie functions (creating the zombies, killing the zombies, moving the zombies and reviving the zombies)
var createZombies = function()
{
                  
    
        // They were not grouped, they had to be isolated, otherwise a single bullet would kill all the zombies
        // Furthermore it is a simpler setup to understand as a beginner programmer
                    zombie1 = game.add.sprite(0, 0, 'zombie');    
          game.physics.arcade.enable(zombie1);
          game.physics.arcade.enableBody(zombie1);
          zombie1.body.gravity.y = 300;
          zombie1.body.velocity.x = 250;
          zombie1.body.bounce.x = 1;    
          zombie1.body.collideWorldBounds = true;   
          zombie1Death = false;
    
                    zombie2 = game.add.sprite(650, 0, 'zombie');    
          game.physics.arcade.enable(zombie2);
          game.physics.arcade.enableBody(zombie2);
          zombie2.body.gravity.y = 300;
          zombie2.body.velocity.x = 250;
          zombie2.body.bounce.x = 1; 
          zombie2.body.collideWorldBounds = true;   
          zombie2Death = false;
    
                    zombie3 = game.add.sprite(1247, 0, 'zombie');    
          game.physics.arcade.enable(zombie3);
          game.physics.arcade.enableBody(zombie3);
          zombie3.body.gravity.y = 300;
          zombie3.body.velocity.x = 250;
          zombie3.body.bounce.x = 1; 
          zombie3.body.collideWorldBounds = true;   
          zombie3Death = false;
    
                    zombie4 = game.add.sprite(1247, 500, 'zombie');    
          game.physics.arcade.enable(zombie4);
          game.physics.arcade.enableBody(zombie4);
          zombie4.body.gravity.y = 300;
          zombie4.body.velocity.x = 300;
          zombie4.body.bounce.x = 1; 
          zombie4.body.collideWorldBounds = true;   
          zombie4Death = false;
    
    
                    zombie5 = game.add.sprite(0, 500, 'zombie');    
          game.physics.arcade.enable(zombie5);
          game.physics.arcade.enableBody(zombie5);
          zombie5.body.gravity.y = 300;
          zombie5.body.velocity.x = 300;
          zombie5.body.bounce.x = 1; 
          zombie5.body.collideWorldBounds = true;   
          zombie5Death = false;
    
                    zombie6 = game.add.sprite(0, 340, 'zombie');    
          game.physics.arcade.enable(zombie6);
          game.physics.arcade.enableBody(zombie6);
          zombie6.body.gravity.y = 300;
          zombie6.body.velocity.x = 300;
          zombie6.body.bounce.x = 1; 
          zombie6.body.collideWorldBounds = true;   
          zombie6Death = false; 
    
                    zombie7 = game.add.sprite(1247, 340, 'zombie');    
          game.physics.arcade.enable(zombie7);
          game.physics.arcade.enableBody(zombie7);
          zombie7.body.gravity.y = 300;
          zombie7.body.velocity.x = 300;
          zombie7.body.bounce.x = 1; 
          zombie7.body.collideWorldBounds = true;   
          zombie7Death = false;
    
                    zombie8 = game.add.sprite(670, 0, 'zombie');    
          game.physics.arcade.enable(zombie8);
          game.physics.arcade.enableBody(zombie8);
          zombie8.body.gravity.y = 300;
          zombie8.body.velocity.x = 300;
          zombie8.body.bounce.x = 1; 
          zombie8.body.collideWorldBounds = true;   
          zombie6Death = false;
            
};

var zombieJump = function()
{       
  
    zombie1.body.velocity.y = -350;
    zombie2.body.velocity.y = -350;
    zombie3.body.velocity.y = -350;
    zombie4.body.velocity.y = -350;
    
    
};


var zombieDeath1 = function()
{
  
    zombie1.kill();
    zombie1Death = true;    
    highScoreFunction();

};
var zombieDeath2 = function()
{
    
     zombie2.kill();    
     zombie2Death = true;
     highScoreFunction();

    
};
var zombieDeath3 = function()
{
   
     zombie3.kill();
     zombie3Death = true;
     highScoreFunction();
    
    
};
var zombieDeath4 = function()
{
  
     zombie4.kill();
      zombie4Death = true;
      highScoreFunction();
    
};
var zombieDeath5 = function()
{
   
     zombie5.kill();
      zombie5Death = true;  
         highScoreFunction();
    
};
var zombieDeath6 = function()
{

    
     zombie6.kill();
      zombie6Death = true;  
      highScoreFunction(); 
};
var zombieDeath7 = function()
{

    
     zombie7.kill();
      zombie7Death = true;  
      highScoreFunction(); 
};
var zombieDeath8 = function()
{

    
     zombie8.kill();
      zombie8Death = true;  
      highScoreFunction(); 
};

var zombieCollisionHandler = function()
{
                
                game.physics.arcade.collide(zombie1, ground);
                game.physics.arcade.collide(zombie1, platforms1);
                game.physics.arcade.collide(zombie1, platforms2);
                game.physics.arcade.collide(zombie1, gate);
                game.physics.arcade.collide(zombie1, trap);
                
        
    
                
                game.physics.arcade.collide(zombie2, ground);
                game.physics.arcade.collide(zombie2, platforms1);
                game.physics.arcade.collide(zombie2, platforms2);
                game.physics.arcade.collide(zombie2, gate);
                game.physics.arcade.collide(zombie2, trap);
    
                
                game.physics.arcade.collide(zombie3, ground);
                game.physics.arcade.collide(zombie3, platforms1);
                game.physics.arcade.collide(zombie3, platforms2);
                game.physics.arcade.collide(zombie3, gate);
                game.physics.arcade.collide(zombie3, trap);
    
    
                game.physics.arcade.collide(zombie4, ground);
                game.physics.arcade.collide(zombie4, platforms1);
                game.physics.arcade.collide(zombie4, platforms2);
                game.physics.arcade.collide(zombie4, gate);
                game.physics.arcade.collide(zombie4, trap);
    
    
                game.physics.arcade.collide(zombie5, ground);
                game.physics.arcade.collide(zombie5, platforms1);
                game.physics.arcade.collide(zombie5, platforms2);
                game.physics.arcade.collide(zombie5, gate);
                game.physics.arcade.collide(zombie5, trap);
    
    
                game.physics.arcade.collide(zombie6, ground);
                game.physics.arcade.collide(zombie6, platforms1);
                game.physics.arcade.collide(zombie6, platforms2);
                game.physics.arcade.collide(zombie6, gate);
                game.physics.arcade.collide(zombie6, trap);
    
    
                game.physics.arcade.collide(zombie7, ground);
                game.physics.arcade.collide(zombie7, platforms1);
                game.physics.arcade.collide(zombie7, platforms2);
                game.physics.arcade.collide(zombie7, gate);
                game.physics.arcade.collide(zombie7, trap);
    
                game.physics.arcade.collide(zombie8, ground);
                game.physics.arcade.collide(zombie8, platforms1);
                game.physics.arcade.collide(zombie8, platforms2);
                game.physics.arcade.collide(zombie8, gate);
                game.physics.arcade.collide(zombie8, trap);
    
    
             
                game.physics.arcade.overlap(zombie1, bullets, zombieDeath1);
                game.physics.arcade.overlap(zombie2, bullets, zombieDeath2);
                game.physics.arcade.overlap(zombie3, bullets, zombieDeath3);
                game.physics.arcade.overlap(zombie4, bullets, zombieDeath4);
                game.physics.arcade.overlap(zombie5, bullets, zombieDeath5); 
                game.physics.arcade.overlap(zombie6, bullets, zombieDeath6);
                game.physics.arcade.overlap(zombie7, bullets, zombieDeath7);
                game.physics.arcade.overlap(zombie8, bullets, zombieDeath8);
                            
                game.physics.arcade.overlap(zombie1, player,  playerDie);
                game.physics.arcade.overlap(zombie2, player,  playerDie);
                game.physics.arcade.overlap(zombie3, player,  playerDie);
                game.physics.arcade.overlap(zombie4, player,  playerDie);
                game.physics.arcade.overlap(zombie5, player,  playerDie);
                game.physics.arcade.overlap(zombie6, player, playerDie);
                game.physics.arcade.overlap(zombie7, player,  playerDie);
                game.physics.arcade.overlap(zombie8, player, playerDie);
};


//player functions (movement, death and gunfire)
var movePlayer = function()
{
            if (cursor.left.isDown)
            {

             player.body.velocity.x = -300; 
             player.scale.x = 1;
             gun.scale.x = -1;
            }
    
            else if (cursor.right.isDown)
            {
             player.body.velocity.x = 300;  
             player.scale.x = -1;
             gun.scale.x = 1;    
            }
            else 
            {
             player.body.velocity.x = 0;
            }
    
            if (cursor.up.isDown && player.body.touching.down)
            {
             player.body.velocity.y = -350;   
            }  
};

var fireGun = function()
{       
                            if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(gun.x + (40 * player.scale.x * -1), gun.y);
        bullet.body.velocity.x = 600 * player.scale.x * -1; 
        
       
    }   
};

var playerDie = function()
{
    gameoverText = "Game Over!";
  var gameover = game.add.text(game.world.centerX, game.world.centerY, "Game over!", { font: "200px Arial", fill: "#ff0044", align: "center" });
  gameover.anchor.setTo(0.5, 0.5); 
     player.kill();
     gun.kill();
    playerDead = true;
        
    
};


//text functions for game
var highScoreFunction = function()
{     
        highScore = highScore + 1;
       highScoreDisplay.text = "zombies Killed: " + highScore;
};
var timeLog = function()
{
        
  
    
        timeLength = timeLength + 1;
        time.text = "Time alive: " + timeLength + " seconds"; 
        
    
};
