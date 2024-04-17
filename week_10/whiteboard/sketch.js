let others = {};

let r = 0;
let g = 0;
let b = 0;

function setup() {
  createCanvas(800, 800);
  r = random(255);
  g = random(255);
  b = random(255);
  // Passing in "DATA" as the capture type but data sharing works with "CAPTURE" and "CANVAS" as well
  p5lm = new p5LiveMedia(this, "DATA", null, "w83C-S6DU");
  // "data" callback
  p5lm.on('data', gotData);
}

function draw() {
  //background(220);
  for (var id in others) {
      let thisOther = others[id];
     fill(thisOther.r,thisOther.g, thisOther.b );
  ellipse(thisOther.x,thisOther.y,20,20); 
    }

  if (mouseIsPressed){
      fill(r,g,b);
  ellipse(mouseX,mouseY,20,20);
    // Package as JSON to send
  let dataToSend = {x: mouseX, y: mouseY, r: r, g:g, b:g};
  
  // Send it
  p5lm.send(JSON.stringify(dataToSend));
  }

   
}

function gotData(data, id) {
  print(id + ":" + data);
  // If it is JSON, parse it
  let d = JSON.parse(data);
  //put it into an associative array
  others[id] = d;
  draw();
  
}

