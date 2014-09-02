var game = new Phaser.Game(1300, 650, Phaser.AUTO, 'game', {preload: preload, create: create, update: update, }); 
var cursor;

var playerDead;
var gun;
var ground;
var platforms1;
var platforms2;
var gate;
var trap;
var zombie =[];
var zombieDie = [];

var zombieDeath = [];
var bullets;
var fireRate = 100;
var nextFire = 0;
var text;
var score = 0;
var highScoreDisplay;
var style;
var time;
var timeLength = 0;
var timeLogEnd;
var gameoverText;
var position = [ [0, 0], [650, 0], [1247, 0], [0, 500], [1247, 500], [0, 350], [650, 0], [1247, 350] ];


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
                game.time.events.loop(1000, zombieJump, this);
    
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
                text = "zombies killed: " + score;
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
                if (zombieDie[0] && zombieDie[1] && zombieDie[2] && zombieDie[3] && zombieDie[4] && zombieDie[5] && zombieDie[6] && zombieDie[7])
                {
                    createZombies();
                    zombieDie[0] = false;
                    zombieDie[1] = false;
                    zombieDie[2] = false;
                    zombieDie[3] = false;
                    zombieDie[4] = false;
                    zombieDie[5] = false;
                    zombieDie[6] = false;
                    zombieDie[7] = false;
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
    for (var i = 0; i < 8; i++)
         {
              
                
            zombie[i] = game.add.sprite(position[i][0], position[i][1], 'zombie');    
          game.physics.arcade.enable(zombie[i]);
          game.physics.arcade.enableBody(zombie[i]);
          zombie[i].body.gravity.y = 300;
          zombie[i].body.velocity.x = 400;
          zombie[i].body.bounce.x = 1;    
          zombie[i].body.collideWorldBounds = true;   
         
         }         
};
var zombieJump = function()
{  
    for (var i = 0; i < 4; i++)
    {
  if (zombie[i].body.touching.down)
  {
   zombie[i].body.velocity.y = -400;   
  }
    }
   
};
zombieDeath[0] = function()
{
    zombie[0].kill();
    zombieDie[0] = true;
    highScoreFunction();
};
zombieDeath[1] = function()
{
    zombie[1].kill();
    zombieDie[1] = true;
    highScoreFunction();
};
zombieDeath[2] = function()
{
    zombie[2].kill();
    zombieDie[2] = true;
   highScoreFunction();
};
zombieDeath[3] = function()
{
    zombie[3].kill();
    zombieDie[3] = true;
   highScoreFunction();
};
zombieDeath[4] = function()
{
    zombie[4].kill();
    zombieDie[4] = true;
    highScoreFunction();
};
zombieDeath[5] = function()
{
    zombie[5].kill();
    zombieDie[5] = true;
    highScoreFunction();
};
zombieDeath[6] = function()
{
    zombie[6].kill();
    zombieDie[6] = true;
    highScoreFunction();
};
zombieDeath[7] = function()
{
    zombie[7].kill();
    zombieDie[7] = true;
    highScoreFunction();
};

var zombieCollisionHandler = function()
{
                
                for (var i = 0; i < 8; i++)
                {
                  
                game.physics.arcade.collide(zombie[i], ground);
                game.physics.arcade.collide(zombie[i], platforms1);
                game.physics.arcade.collide(zombie[i], platforms2);
                game.physics.arcade.collide(zombie[i], gate);
                game.physics.arcade.collide(zombie[i], trap);
                game.physics.arcade.overlap(zombie[i], bullets, zombieDeath[i]);       
                game.physics.arcade.overlap(zombie[i], player,  playerDie);
                    
                }
                    
};


//player functions (movement, death and gunfire)
var movePlayer = function()
{
            if (cursor.left.isDown)
            {

             player.body.velocity.x = -350; 
             player.scale.x = 1;
             gun.scale.x = -1;
            }
    
            else if (cursor.right.isDown)
            {
             player.body.velocity.x = 350;  
             player.scale.x = -1;
             gun.scale.x = 1;    
            }
            else 
            {
             player.body.velocity.x = 0;
            }
    
            if (cursor.up.isDown && player.body.touching.down)
            {
             player.body.velocity.y = -400;   
            }  
};

var fireGun = function()
{       
                            if (game.time.now > nextFire && bullets.countDead() > 0 && !playerDead)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(gun.x + (40 * player.scale.x * -1), gun.y);
        bullet.body.velocity.x = 680 * player.scale.x * -1; 
        
       
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
{       if (!playerDead)
            {
        score = score + 1;
       highScoreDisplay.text = "zombies Killed: " + score;
            }    
};
 
var timeLog = function()
{
        
  
        if (!playerDead)
        {
        timeLength = timeLength + 1;
        time.text = "Time alive: " + timeLength + " seconds"; 
        }
    
};
