var local;
var world = [];
var socket;

function setup() {
  socket = io();
  
  cnv = createCanvas(windowWidth,windowHeight);
  capture = createCapture(VIDEO);
  // capture.size(220, 140);
  background(255);
  
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
  
  image(capture, 0, 0, 220, 140);
  
  
	local.update(PoseZero.get());// update your skeleton
  
  //draw the skeleton
  if (local.data.pose != null){ 
    PoseZero.draw_pose(local.data.pose,{color:local.data.color})
  }
  
  // give the server your updates
	socket.emit('game-update', local.data);
  
  // draw the other skeletons
	 for (let i = 0; i < world.length; i++) {
      if (world[i].id == socket.id) { // if its you skip drawing it
        continue;
      }

      if (world[i].data.pose != null) {
        PoseZero.draw_pose_black(world[i].data.pose, {
          color: world[i].data.color
        });

        //find distance between hands of the 2 clients
        if (i < 2 && world.length > 1) {
          if (world[0].data.pose != null && world[1].data.pose != null) {
            let d = dist(
              world[0].data.pose.rightWrist.x,
              world[0].data.pose.rightWrist.y,
              world[1].data.pose.rightWrist.x,
              world[1].data.pose.rightWrist.y
            );

            let distHands = 110;
            // if hands are touching, capture screen
            if (d < distHands) {
              saveCanvas(cnv, 'myMark', 'jpg');
            }
          }
        }
      }
   }
    