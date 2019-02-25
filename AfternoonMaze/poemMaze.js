   //Ben B. Burge  | Feb. 25 12019 (not a typo)  | Creative Coding: Poetry Maze
  //V1 | Map: Hairbender
 //Thank you Processing Day for the encouragement to make this project!  This draft is a huge step forward,
//but there is still plenty to do.      Any Qs?    burgb739@newschool.edu

var player = [2,1]    //to-do: determine spawn by map data
//below is the "map" which contains the maze layout, and associated lines.
var level = [[0,0,0,0,0,0,0,0],[0,0,2,0,0,0,0,0],[0,"crane","under the",0,0,0,"and always",0], [0,"miss the","gaze of",0,0,3,"against",0],[0,0,"drawing",0,0,0,"pliant beds",0],[0,"words","with",0,0,0,"amenable",0],[0,0,"pencils",0,"when I walk",0,"tend",0],[0,"offset","it's all","pointers","with you","pointers which are","trending to","pre",0],[0,"insured",0,"of you",0,"destraction","derermined","vail",0],[0,"tides","stored","off site",0,3,0,0,0],[0,0,"neatly",0,0,0,0,0],[0,0,0,0,0,0,0]]
var rColor = 255      //these colors will form the walls of the maze.
var gColor = 255     //they start white.  see function bgColorFade
var bColor = 255
var pressed           //for button presses
var gridSize = 20
var moveBank = [0, 0, 0, 0]       //left, up, down, right

function setup() {
  var maze = createCanvas(960, 540)    //arbitrary wall size
  maze.parent("mazeCanvas")           //uses the html cavnas
  fill(255)
  frameRate(24); // lmao
  step.setVolume(.7)
}

function draw() {
  push()            //centers player, moves map around them
  translate(960/2-player[0]*gridSize-gridSize/2,504/2-player[1]*gridSize-gridSize/2)
  drawLevel(player[0],player[1])
  drawPlayer()
  pop()
  canMove()
  //textSize(42)
  //text(moveBank, 500, 270)
  keyPressed()
  wipeMoveBank()
  print(level[player[1]].length)
  zoomIn()
  bgColorFade()
}

function zoomIn() {         //for that cool zoom in the begining
  if (gridSize < 200) {
    gridSize++
  }
}

function onGridEvent() {    //passes lines, ends game
  if (level[player[1]][player[0]] == 3) {
    for (var a = 24; a > 0; a--) {
      noStroke()
      draw()
    }
    fill(255)
    rect(0,0,960,540)
    maze.remove()
  }
  else if (level[player[1]][player[0]] == 2) {
  }
  else {
    var line = createP(level[player[1]][player[0]])
    line.parent('lines')
  }
  step.play()                            //step sound
  rColor = rColor + random(-25,25)      //lots of running around will change colors
  gColor = gColor + random(-25,25)
  bColor = bColor + random(-25,25)
}

function bgColorFade() {    //fade in!  and back.  Keeps wall squares the r/g/bColor color up top
  if (rColor > 102) { rColor--}
  else if (rColor < 102) { rColor++}
  if (gColor > 159) { gColor--}
  else if (gColor < 159) { gColor++}
  if (bColor > 100) { bColor--}
  else if (bColor < 100) { bColor++}
  
}

function drawLevel() {    //this code will be good for a map editor...  Coming soon!
  for (var i = level.length - 1; i >= 0; i--) {
    for (var j = level[i].length - 1; j>= 0; j--) {
      if (level[i][j] == 0){
        fill(255)
        rect(j*gridSize, i*gridSize, gridSize, gridSize)
      }
      else {
        fill(150)
        rect(j*gridSize, i*gridSize, gridSize, gridSize)
      }
    }
  }
}

function drawLevel(cameraX, cameraY) {    //draws the map.  Transformed in the draw() function
  for (var i = level.length - 1; i >= 0; i--) {
    for (var j = level[i].length - 1; j>= 0; j--) {
      if (level[i][j] == 0){                            //r/g/bColor effectable background (wall tiles)
        fill(rColor,gColor,bColor,50)
        rect(j*gridSize, i*gridSize, gridSize, gridSize)
      }
      else if (level[i][j] == 2) {                      //blue spawn point
        fill(0,166,215,50)
        rect(j*gridSize, i*gridSize, gridSize, gridSize)
      }
      else if (level[i][j] == 3) {                      //dark blue end point
        fill(20,45,73,50)
        rect(j*gridSize, i*gridSize, gridSize, gridSize)
      }
      else {                                            //make it bright idk
        fill(250,250,250)
        rect(j*gridSize, i*gridSize, gridSize, gridSize)
      }
    }
  }
}

function drawPlayer() {   //player model 'moves' with the map lol
  fill(150)
  ellipse(player[0]*gridSize+0.5*gridSize, player[1]*gridSize+0.5*gridSize, .66*gridSize)
}

function canMove() {              //sets up "moveBank" one could map this to html buttons for a cool (touch)interface
  //unfotunietly our grid is y then x...  I know, bummer.
  //left
  if (player[0]-1 >= 0 && level[player[1]][player[0]-1] != 0) {
    moveBank[0] = 1
  }
  //up
  if (player[1]-1 >= 0 && level[player[1]-1][player[0]] != 0) {
    moveBank[1] = 1
  }
  //down
  if (player[1]+1 <= level.length-1 && level[player[1]+1][player[0]] != 0) {
    moveBank[2] = 1
  }
  //right
  if (player[0]+1 <= level[player[1]].length-1 && level[player[1]][player[0]+1] != 0) {
    moveBank[3] = 1
  }
}

function wipeMoveBank() {           //these are made nonstop, I need to add a "movedToNewTile" bool or something.
  moveBank = [0, 0, 0, 0]
}

function keyPressed() {             //wasd, or arrow keys plz
    if (!pressed && (key === 'a' || keyCode === LEFT_ARROW)  && moveBank[0] == 1) {
      player[0] = player[0]-1
      pressed=true
      onGridEvent()
    }
    else if (!pressed && (key === 'w' || keyCode === UP_ARROW) && moveBank[1] == 1) {
      player[1] = player[1]-1
      pressed=true
      onGridEvent()
    }
    else if (!pressed && (key === 's' || keyCode === DOWN_ARROW) && moveBank[2] == 1) {
      player[1] = player[1]+1
      pressed=true
      onGridEvent()
    }
    else if (!pressed && (key === 'd' || keyCode === RIGHT_ARROW) && moveBank[3] == 1) {
      player[0] = player[0]+1
      pressed=true
      onGridEvent()
    }
  return false
}

function keyReleased() {            //I never call this...  It's a built in thing?
  pressed = false;
}

function preload() {                //stepping sound!
 step = loadSound('step.wav');
}