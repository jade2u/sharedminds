/* --- VARS --- */
let player, hades, obstacle, intro;
let player_pic, hades_pic, pic, story_pic;

let vocals, bg, bg_left, bg_right;
let level_counter, asset_counter;
let line_counter = 0;
let part;
let extra = [];
let pics = [];

const pic_elem = document.getElementById("story");
const intro_elem = document.getElementById("intro");

/* --- TIME --- */
let times = [
  //intro
  1, 2, 3, 5, 8, 9,
  //part 1
  12, 14, 16, 18,
  //part 2
  20, 21, 22, 24, 26,
  //part 3
  29, 33, 38, 43,
  //part 4
  46, 50, 55,
  //part 5
  61, 65, 68, 
];

//show updated time
var time = {
  value: '',
  letMeKnow() {
    //console.log(this.now);
    //make text
    if(this.now == times[line_counter]){
      new_line(pics, line_counter, 2 + this.now/5);
      line_counter++;
    }
    /// EXTRAS --- extras(line, freq, limit)
    //intro
    if(this.now == 5){extras(0, 800, 7);} //more
    //pt 1
    if(this.now == 12){extras(1, 800, 16);} //girl
    if(this.now == 17){extras(2, 1000, 26);} //forever
    //pt 2
    if(this.now == 20){extras(3, 1200, 28);} //he's there
    //pt 3
    if(this.now == 33){extras(4, 1000, 41);} //me
    if(this.now == 43){extras(4, 800, 50);} //me
    //pt 4
    if(this.now == 46){extras(5, 800, 55);} //special
    if(this.now == 50){extras(1, 600, 61);} //girl
    if(this.now == 55){extras(6, 400, 80);} //harder
    //pt 5
    if(this.now == 61){extras(7, 600, 80);} //again
    if(this.now == 65){extras(8, 600, 80);} //give in?
    //if(this.now == 68){extras(9, 400, 80);} //make me weak
    if(this.now == 75){extras(5, 400, 80);} //special

  },
  get now() {return this.value;},
  set now(value) {
    this.value = value;
    this.letMeKnow();
  }
}

//update time
var seconds = 0;
var start_counter = setInterval((function(){
  seconds +=1;
  console.log(time.now);
  time.now = seconds;
}), 1000);

/// EXTRAS
function extras(line, freq, limit){
  var new_extra = setInterval((function(){
    new_obstacle(extra, line, 2 + time.now/2);
    if(time.now == limit){
      clearInterval(new_extra);
    }
  }), freq);
}

/* --- PRELOAD --- */
function preload() {
  /// PICS
  player_pic = loadImage('png/perse.gif');
  hades_pic = loadImage('png/hades.png');
  //intro
  let intro_1 = loadImage('png/intro/1.png');
  let intro_2 = loadImage('png/intro/2.png');
  let intro_3 = loadImage('png/intro/3.png');
  let intro_4 = loadImage('png/intro/4.png');
  let intro_5 = loadImage('png/intro/5.png');
  let intro_6 = loadImage('png/intro/6.png');
  //pt 1
  let pt1_1 = loadImage('png/1/1.png');
  let pt1_2 = loadImage('png/1/2.png');
  let pt1_3 = loadImage('png/1/3.png');
  let pt1_4 = loadImage('png/1/4.png');
  //pt 2
  let pt2_1 = loadImage('png/2/1.png');
  let pt2_2 = loadImage('png/2/2.png');
  let pt2_3 = loadImage('png/2/3.png');
  let pt2_4 = loadImage('png/2/4.png');
  let pt2_5 = loadImage('png/2/5.png');
  //pt 3
  let pt3_1 = loadImage('png/3/1.png');
  let pt3_2 = loadImage('png/3/2.png');
  let pt3_3 = loadImage('png/3/3.png');
  let pt3_4 = loadImage('png/3/4.png');
  //pt 4
  let pt4_1 = loadImage('png/4/1.png');
  let pt4_2 = loadImage('png/4/2.png');
  let pt4_3 = loadImage('png/4/3.png');
  //pt 5
  let pt5_1 = loadImage('png/5/1.png');
  let pt5_2 = loadImage('png/5/2.png');
  let pt5_3 = loadImage('png/5/3.png');
  //extra
  let extra_1 = loadImage('png/extra/more.png');
  let extra_2 = loadImage('png/extra/girl.png');
  let extra_3 = loadImage('png/extra/forever.png');
  let extra_4 = loadImage('png/extra/hes_there.png');
  let extra_5 = loadImage('png/extra/me.png');
  let extra_6 = loadImage('png/extra/special.png');
  let extra_7 = loadImage('png/extra/harder.png');
  let extra_8 = loadImage('png/extra/again.png');
  let extra_9 = loadImage('png/extra/give.png');
  //pic array
  pics = [
    //intro
    intro_1, intro_2, intro_3, intro_4, intro_5, intro_6,
    //1
    pt1_1, pt1_2, pt1_3, pt1_4,
    //2
    pt2_1, pt2_2, pt2_3, pt2_4, pt2_5,
    //3
    pt3_1, pt3_2, pt3_3, pt3_4,
    //4
    pt4_1, pt4_2, pt4_3,
    //5
    pt5_1, pt5_2, pt5_3
  ];
  //extra array
  extra = [
    extra_1, extra_2, extra_3, extra_4, extra_5, extra_6, extra_7, extra_8, extra_9
  ];

  //sounds
  soundFormats('wav');
  vocals = loadSound('music/vocals_half.wav');
  bg = loadSound('music/synths_half.wav');
  bg_left = loadSound('music/bass_half.wav');
  bg_right = loadSound('music/bass_half.wav');
}

/* --- SETUP --- */
function setup() {
  new Canvas();
  //text
  //level_counter
  level_counter = 6;
  asset_counter = 0;
  world.gravity.y = 10;
  
  //draw player
  stroke(255,255,255,100);
  strokeWeight(5);
  player = new Sprite();
  player.img = player_pic;
  player_pic.resize(0,height/6);
  player.height = player_pic.height;
  player.width = player_pic.width;
  player.y = height/2;
  player.x = width/2;
  player.rotation = 0;


  intro = new Sprite();
  strokeWeight(0);
  intro.color = "black";
  intro.textColor = "gray";
  intro.textSize = 20;
  intro.y = height/2 -50;
  intro.x = width/2;
  intro.collider = "none";

  hades = new Sprite();
  hades.img = hades_pic;
  hades_pic.resize(width/3, height/6);
  hades.x = player.x;
  hades.y = height-40;
  hades.collider="none";
  
  //play music
  bg.play();
  bg_left.play();
  bg_right.play();
  vocals.play();
  if (kb.presses(' ')){
    bg.play();
    bg_left.play();
    bg_right.play();
    vocals.play();
  }
}


/* --- DRAW --- */
function draw() {
  clear();
  move();
  /// MUSIC
  //vocals
  let pan_vocal = map(player.x, 0, width, -1.0, 1.0);
  let vol_vocal = map(player.y, 0, height*3, 0.5, -0.5); //louder @ top
  vocals.pan(pan_vocal);
  vocals.setVolume(vol_vocal);
  //bg
  let pan_left = map(player.y, 0, height * 3, -1.0, 1.0);
  let pan_right = map(player.y, 0, height * 3, 1.0, -1.0);
  let vol_sides = map(player.y, 0, height, 0.8, 2.5);
  let vol_bg = map(player.y, 0, height, 0.8, 2.0); //louder @ bottom

  bg_left.pan(pan_left);
  bg_right.pan(pan_right);
  bg_left.setVolume(vol_sides);
  bg_right.setVolume(vol_sides);
  bg.setVolume(vol_bg);
}


/* --- NEW LINE --- */
function new_line(part, line) {
  console.log(intro.text);
  if(line<=6){
    switch(line) {
      case 0:
        intro.text = "use scroll or keys to move.";
        break;
      case 1:
        intro.text = "blur the images,";
        break;
      case 2:
        intro.text = "change the sound,";
        break;
      case 3:
        intro.text = "stay at the top of the screen & avoid the obstacles.";
        break
      case 4:
        intro.text = "stay at the top of the screen & avoid the obstacles.";
        break;
      case 5:
        intro.text = "";
        break;
      default: break;
    }
  }
  else{intro.remove();}
  let pic_width = width/2;
  story_pic = part[line].url;
  pic_elem.setAttribute("src", story_pic);
  pic_elem.setAttribute("width", pic_width);
}


/* --- NEW OBSTACLE --- */
function new_obstacle(part, line, time) {
  //pic
  let obst_width;

  pic = part[line];
  if(part == pics){obst_width = width/2;}
  if(part == extra) {
    if(pic.height > height/3){obst_width = width/6;}
    else {obst_width = width/5;}
  }

  pic.resize(obst_width, 0);
  //spawn
  obstacle = new Sprite();
  obstacle.img = pic;

  //obstacle
  if(part == pics){obstacle.x = width/2;}
  else{obstacle.x = random(width);}
  obstacle.y = 0;  //@ top of screen
  obstacle.w = obst_width;
  obstacle.h = pic.h;  //gets bigger
  
  //move
  obstacle.velocity.y = 1 + (time/10);
  if(part == extra){obstacle.collider = 'k';}
  else{obstacle.collider = 'none';}
}


/* --- MOUSE MOVE --- */
function mouseWheel(event) {
  /// HORIZONTAL
  if(abs(event.deltaX) > abs(event.deltaY)){
    //left
    if(event.deltaX > 0){
      player.x -= 4;
      if(player.x <= 0) player.x = 0;
    }
    //right
    if (event.deltaX < 0){
      player.x += 4;
      if(player.x >= width) player.x = width;
    }
    hades.x = player.x;
  }
  /// VERTICAL
  else if(abs(event.deltaY) > abs(event.deltaX)){
    //up
    if(event.deltaY > 0){
      player.y -= 4;
      if(player.y <= 0) player.y = 0;
    }
    //down
    if (event.deltaY < 0){
      player.y += 4;
      if(player.y >= height) console.log('died'); //lose
    }
  }
}


/* --- KEY MOVE --- */
function move() {
  
  /// HORIZONTAL
  //left
  if (kb.pressing('a')){
    player.vel.x = -5;
    if(player.x <= 0) player.vel.x = 0;
  }
  //right
  else if (kb.pressing('d')) {
    player.vel.x = 5;
    if(player.x >= width) player.vel.x = 0;
  }
  else player.vel.x = 0;
  /// VERTICAL
  //up
  if (kb.pressing('w')) {
    player.vel.y = -5;
    if(player.y <= 0) player.vel.y = 0;
  }
  //down
  else if (kb.pressing('s')) {
    player.vel.y = 5;
    if(player.y >= height) console.log('died');
  }
  else player.vel.y = 0;
}


/*
  //whole second
  if((world.realTime %= level_counter) < 1) {
    //world.timeScale = 1;  //slo-mo effect
    //@ time change
     if((world.realTime %= level_counter) < 0.014) {
       new_obstacle(world.realTime); //spawn
       //inc frequency
       if(level_counter > 2.5) level_counter = level_counter - 0.2;
       else level_counter = 2;
     }
  }
  //reset
  else {
    clear();
    //world.timeScale = 1;
  }
  */
  //blur
  /*
  if(pic !== undefined){
    if(pic == pics[0]){
      let every_other = floor(obstacle.y)%2;
      if(every_other == 0){
        
        if(obstacle.y >= (height/2)){
          //blur
          pics[0].filter(BLUR, (obstacle.y/700));
          //resize
          pic.resize(pic.width + 1, pic.height + 1);
        }

      }
      
    }
  }
  */
