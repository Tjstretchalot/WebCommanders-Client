function tryConnect () {
  var socket = new WebSocket("ws://localhost:8081/Play");
  
  socket.onmessage = function(event) {
    console.log(event.data);
  };
  
  socket.onopen = function(event) {
    console.log("onopen!");
    
    var msg = {
      type: "message",
      text: "hello world"
    };
    
    socket.send(JSON.stringify(msg));
  }
  
  socket.onclose = function(event) {
    console.log("onclose");
  };
  
  return socket;
}

// phaser stuff
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'web-commanders', { preload: preload, create: create, update: update, render: render });
var graphics;
var assets;

var screenboundsPoly = new Phaser.Polygon(0, 0, window.innerWidth, 0, window.innerWidth, window.innerHeight, 0, window.innerHeight);

var gamestate = {};

function preload() {
  assets = {};
  
  assets.pixel = game.load.image('pixel', 'assets/black.png');
}

function create() {
  // for fps
  game.time.advancedTiming = true;
  
  game.stage.backgroundColor = '#000';
  game.stage.fullscreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  
  gamestate.player = {
    polygon: new Phaser.Polygon(0, -200, -200, 0, 100, 0),
    center: { x: 0, y: 0 }, // unshifted
    location: { x: 0, y: 0 },
    rotation: { rads: 0, sin: 0, cos: 1 },
    updateCenter: function() {
      this.center.x = 0;
      this.center.y = 0;
      for (var i = 0; i < this.polygon.points.length; i++)
      {
        this.center.x += this.polygon.points[i].x;
        this.center.y += this.polygon.points[i].y;
      }
      this.center.x /= this.polygon.points.length;
      this.center.y /= this.polygon.points.length;
    },
    setRotation: function(rads) {
      while(rads < 0) {
        rads += Math.PI * 2;
      }
      while(rads >= Math.PI * 2) {
        rads -= Math.PI * 2;
      }
      
      this.rotation.rads = rads;
      this.rotation.sin = Math.sin(this.rotation.rads);
      this.rotation.cos = Math.cos(this.rotation.rads);
    },
    up: function() { 
      console.log("up"); 
      this.setRotation(1.5 * Math.PI);
    }, 
    left: function() { 
      console.log("left");
      this.setRotation(Math.PI);
    }, 
    right: function() { 
      console.log("right");
      this.setRotation(0);
    }, 
    down: function() { 
      console.log("down");
      this.setRotation(0.5 * Math.PI);
    } 
  };
  gamestate.player.updateCenter();
  
  graphics = game.add.graphics(0, 0);
  
  //game.camera.follow(gamestate.player.polygon);
  
  upkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  upkey.onDown.add(gamestate.player.up);
  
  leftkey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  leftkey.onDown.add(gamestate.player.left);
}

function update() {
  gamestate.player.setRotation(gamestate.player.rotation.rads + 0.01);
}

function drawRotatedPolygon(poly, polyLoc, polyCent, rot) {
  var pt1 = getRotatedPoint(poly.points[0], polyCent, rot);
  graphics.moveTo(pt1.x + polyLoc.x, pt1.y + polyLoc.y);
  
  for(var i = 1; i < poly.points.length; i++)
  {
    var pt = getRotatedPoint(poly.points[i], polyCent, rot);
    graphics.lineTo(pt.x + polyLoc.x, pt.y + polyLoc.y);
  }
  
  graphics.lineTo(pt1.x + polyLoc.x, pt1.y + polyLoc.y);
}

function render() {
  graphics.beginFill(0x000000);
  graphics.drawPolygon(screenboundsPoly);
  graphics.endFill();
  
  game.debug.text("fps: " + game.time.fps, 200, 200, 'white');
  
  //graphics.beginFill(0xFFFFFF);
  //drawRotatedPolygon(gamestate.player.polygon, { x: 500, y: 500 }, gamestate.player.center, gamestate.player.rotation);
  //graphics.endFill();
  
  //graphics.beginFill(0xFFFFFF);
  //graphics.drawPolygon([ {x: 500, y: 500}, {x: 400, y: 600}, {x: 600, y: 600} ])
  //graphics.endFill();
}

// math
function addPoint(pt1, pt2)
{
  return { x: pt1.x + pt2.x, y: pt1.y + pt2.y }
}

function getRotatedPoint(point, center, rotation)
{
  var tmpX = point.x - center.x;
  var tmpY = point.y - center.y;
  return { x: tmpX * rotation.cos - tmpY * rotation.sin, y: tmpX * rotation.sin + tmpY * rotation.cos };
}

// resizing

window.addEventListener('resize', function(event) {
  var width = window.innerWidth;
  var height = window.innerHeight;
  
  screenboundsPoly = new Phaser.Polygon(0, 0, width, 0, width, height, 0, height);
  game.width = width;
  game.height = height;
  
  if(game.renderType === 1) {
    game.renderer.resize(width, height);
    Phaser.Canvas.setSmoothingEnabled(game.context, false);
  }
});