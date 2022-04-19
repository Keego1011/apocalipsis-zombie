var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie,zombieImg;
var heart1,heart2,heart3;
var heart1Img,heart2Img,heart3Img;
var zombieGroup;
var bullets=70;
var gameState="fight"
var score=0;
var life=3;
var lose,winning,explosionSound;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bgImg = loadImage("assets/bg.jpeg")
  zombieImg=loadImage("assets/zombie.png")

  heart1Img=loadImage("assets/heart_1.png")
  heart2Img=loadImage("assets/heart_2.png")
  heart3Img=loadImage("assets/heart_3.png")

  lose=loadSound("assets/lose.mp3")
  winning=loadSound("assets/win.mp3")
  explosionSound=loadSound("assets/explosion.mp3")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1500, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3;
   player.debug = true;
   player.setCollider("rectangle",0,0,300,300);

   //creando sprites para representar las vidas
   heart1=createSprite(displayWidth-150,40,20,20);
   heart1.visible=false;
   heart1.addImage("heart1",heart1Img);
   heart1.scale=0.4;

   heart2=createSprite(displayWidth-100,40,20,20);
   heart2.visible=false;
   heart2.addImage("heart2",heart2Img);
   heart2.scale=0.4;

   heart3=createSprite(displayWidth-150,40,20,20);
   heart3.addImage("heart3",heart3Img);
   heart3.scale=0.4;
   
   zombieGroup=new Group();
   bulletGroup=new Group();

   
}

function draw() {
  background(0); 

if(gameState==="fight"){
  //mostrar la imagen apropiada segun la vida restante
  if(life===3){
    heart3.visible=true;
    heart1.visible=false;
    heart2.visible=false;
  }
  if(life===2){
    heart2.visible=true;
    heart1.visible=false;
    heart3.visible=false;
  }
  if(life===1){
    heart1.visible=true;
    heart3.visible=false;
    heart2.visible=false;
}
//ir al estado de juego gameState "lost" cuando quedan 0 vidas
if(life===0){
  gameState="lost";
}
//ir al estado won si la puntuacion es 100
if(score===100){
  gameState="won";
  winning.play();
}
}


  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}

//liberar balas y cambiar imagen del tirador cuando se presiona la barra espaciadora
if(keyWentDown("SPACE")){
  bullet=createSprite(displayWidth-1500,player.y-30,20,10);
  bullet.velocityX=20;
  bulletGroup.add(bullet);
  player.depth=bullet.depth;
  player.depth=player.depth+2;
  player.addImage(shooter_shooting);
  bullets=bullets-1;
}


//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

//inicia el estado de juego(gameState)"bullet"cuabdo el jugador se queda sin balas
if(bullets===0){
  gameState="bullet"
  lose.play();
}

//destruye al zombie cuando una bala lo toca
if(zombieGroup.isTouching(bulletGroup)){
  for(var i=0;i<zombieGroup.length;i++){
    if(zombieGroup[i].isTouching(bulletGroup)){
      zombieGroup[i].destroy();
      bulletGroup.destroyEach();
      explosionSound.play();
      score=score+2
    }
  }
}


//reducir la vida y destruir al zombi cuando el jugador lo toca 
if(zombieGroup.isTouching(player)){ 
  lose.play();
  for(var i=0;i<zombieGroup.length;i++){ 
    if(zombieGroup[i].isTouching(player)){ 
      zombieGroup[i].destroy();
      life=life-1;
    } 
  } 
} 
//llamar a la función para generar zombis 
enemy()

drawSprites();

//mostrar la puntuacion, la vida y las balas restantes
textSize(20);
fill("white");
text("balas= "+bullets,displayWidth-200,displayHeight/2-250);
text("puntuacion= "+score,displayWidth-200,displayHeight/2-220);
text("vidas= "+life,displayWidth-200,displayHeight/2-280);

//destruye al jugador y al zombie.muestra el mensaje en el estado de juego "lost"
if(gameState==="lost"){
  textSize(100);
  fill("red");
  text("you lost",400,400);
  zombieGroup.destroyEach();
  player.destroy();
}

//muestra el mensaje en el estado de juego "won"
else if(gameState==="won"){
  textSize(100);
  fill("yellow");
  text("you won",400,400);
  zombieGroup.destroyEach();
  player.destroy();
}

//destruye al jugador, al zombie y a las balas. muestra el mensaje en el estado de juego "bullet"
else if(gameState==="bullet"){
  textSize(50);
  fill("yellow");
  text("you ran out of bullets",470,410);
  zombieGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();
}

}

function enemy(){
  if(frameCount%50===0){
    zombie=createSprite(random(1000,500),random(100,1000),40,40);
    zombie.addImage(zombieImg);
    zombie.scale=0.15;
    zombie.velocityX=-3;
    zombie.debug=true;
    zombie.setCollider("rectangle",0,0,400,400);
    zombie.lifetime=400;
    zombieGroup.add(zombie);
  }
}