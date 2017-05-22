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