/* global describe io createCanvas background PoseZero Agent*/
var local;
var world = [];
var socket;

function setup() {
  socket = io();
  
  createCanvas(640, 480);
  background(0);
  PoseZero.init()
  
  local = new Agent();

	socket.emit('game-start', local.data)
	socket.on('heartbeat', function(data){
		world = data;
	})

}

function draw() {

  background(0);
  
  // image(PoseZero.video, 0, 0, width*0.2, height*0.2);
  
	local.update(PoseZero.get());
  
  if (local.data.pose != null){
    PoseZero.draw_pose(local.data.pose,{color:local.data.color})
  }
	socket.emit('game-update', local.data);
  console.log(world);
	for (var i = 0; i < world.length; i++) {
    if (world[i].id == socket.id){
      continue;
    }
    if (world[i].data.pose != null){
      console.log(world[i].data.pose);
      PoseZero.draw_pose(world[i].data.pose,{color:world[i].data.color})
    }else{
      
    }
	}

  
}