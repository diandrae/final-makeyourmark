var local;
var world = [];
var socket;

function setup() {
  socket = io();
  
  createCanvas(640, 480);
  background(0);
  
  //this is where posenet initlizes and webcam stuff happens
  PoseZero.init();
  
  //this is you, check out agent.js for adding properties and functions
  local = new Agent();

  //tell the server "i am here!"
	socket.emit('game-start', local.data)
  // listen for the server to send you a heartbeat and when it does do this
	socket.on('heartbeat', function(data){
		world = data;
	})

}

function draw() {

  background(0);
    
	local.update(PoseZero.get());// update your skeleton
  
  //draw the skeleton
  if (local.data.pose != null){ 
    PoseZero.draw_pose(local.data.pose,{color:local.data.color})
  }
  
  // give the server your updates
	socket.emit('game-update', local.data);
  
  // draw the other skeletons
	for (var i = 0; i < world.length; i++) {
    if (world[i].id == socket.id){ // if its you skip drawing it
      continue;
    }
    
    if (world[i].data.pose != null){
      PoseZero.draw_pose(world[i].data.pose,{color:world[i].data.color})
    }
	}

  
}