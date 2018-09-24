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
  PoseZero.draw();
  
	local.update();

	socket.emit('game-update', local.data);
  console.log(world);
	for (var i = 0; i < world.length; i++) {
    console.log(world[i].data.pose);
    if (world[i].data.pose != null){
      PoseZero.draw_pose(world[i].data.pose)
    }
	}

  
}