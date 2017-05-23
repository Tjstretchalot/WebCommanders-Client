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

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'web-commanders', { preload: preload, create: create, update: update, render: render });

function preload() {
  
}

function create() {
  game.stage.backgroundColor = '#000';
  game.stage.fullscreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
}

function update() {
  
}

function render() {
  
}

// resizing

window.addEventListener('resize', function(event) {
  var width = window.innerWidth;
  var height = window.innerHeight;
  
  game.width = width;
  game.height = height;
  
  if(game.renderType === 1) {
    game.renderer.resize(width, height);
    Phaser.Canvas.setSmoothingEnabled(game.context, false);
  }
});