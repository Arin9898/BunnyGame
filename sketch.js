const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground,rope,fruit;
var fruit_con;
var bg_image,food,bunnyImg,bunny,button;
var blink,eat,sad;
var blower;
var bg_sound,air,cut_sound,eat_sound,sad_sound;
var mute_button;

function preload(){
  bg_image = loadImage("background.png");
  bunnyImg = loadImage("Rabbit-01.png");
  food = loadImage("melon.png");
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
  bg_sound = loadSound("sound1.mp3");
  air = loadSound("air.wav");
  cut_sound = loadSound("rope_cut.mp3")
  eat_sound = loadSound("eating_sound.mp3")
  sad_sound = loadSound("sad.wav");
}

function setup() {
  createCanvas(600,700);
  frameRate(80)
  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;
  
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(300,690,600,20)
  rope = new Rope(8,{x:300,y:10});
  fruit = Bodies.circle(300,300,30);
  Matter.Composite.add(rope.body,fruit);
  fruit_con = new Link(rope,fruit);

  bunny = createSprite(300,600,50,50)
  bunny.scale = 0.25;

  bunny.addAnimation("blinking",blink);
  bunny.addAnimation("eating",eat);
  bunny.addAnimation("crying",sad);
  bunny.changeAnimation("blinking");
  
  button = createImg("cut_btn.png");
  button.position(280,10);
  button.size(50,50)
  button.mouseClicked(drop);

  blower = createImg("balloon.png");
  blower.position(50,325);
  blower.size(100,100);
  blower.mouseClicked(airBlow);

  mute_button = createImg("mute.png");
  mute_button.position(500,10);
  mute_button.size(50,50);
  mute_button.mouseClicked(mute)


  bg_sound.play();
  bg_sound.setVolume(0.5);


  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function draw() {
  background(51);
  image(bg_image,0,0,width,height)
  
  Engine.update(engine);
  ground.show();
  rope.show();
  
  push();
  
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,100,100)
  }
  pop();

  if(collide(fruit,bunny)== true){
    bunny.changeAnimation("eating");
    eat_sound.play()
  }
  
  if(fruit!=null&&fruit.position.y>650){
    bunny.changeAnimation("crying");
    sad_sound.play()
    bg_sound.stop()
    fruit = null;
  }
  drawSprites();
}

function drop(){
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}


function collide(body,sprite){
  if(body!=null){
  var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
  if(d<=80){
    World.remove(world,fruit)
    fruit = null;
    return true;
  }
  else{
    return false;
  }
  }
  
}

function airBlow(){
Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.1,y:0})
air.play();
}

function mute(){
  if(bg_sound.isPlaying()){
    bg_sound.stop();
  }
  else{
    bg_sound.play()
  }
}

