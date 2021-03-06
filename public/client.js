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

var localPreviousPose = {};
var remotePreviousPose = {};

function draw() {
  
  image(capture, 0, 0, 220, 140);
  
  
	local.update(PoseZero.get());// update your skeleton
  
  //draw the skeleton
  if (local.data.pose != null){ 
    PoseZero.draw_pose(local.data.pose,{color:local.data.color}, localPreviousPose)
  }
  
  // give the server your updates
	socket.emit('game-update', local.data);
  
  // draw the other skeletons
	for (var i = 0; i < world.length; i++) {
    if (world[i].id == socket.id){ // if its you skip drawing it
      continue;
    }
    
    // Already checking if other skeleton exists
    if (world[i].data.pose != null){
      PoseZero.draw_pose(world[i].data.pose,{color:world[i].data.color}, remotePreviousPose);
      
      if(local.data.pose != null)
      {
        var distance = Math.hypot(
          local.data.pose.rightWrist.x - world[i].data.pose.rightWrist.x,
          local.data.pose.rightWrist.y - world[i].data.pose.rightWrist.y
        );
        
        if(distance < 10)
        {
          download();
        }
      }
    }
	}
}

var cooldownDuration = 10;
var lastFrameSaveTime = -1;
function download()
{
  var time = Date.now();
  if(time < lastFrameSaveTime + (1000 * cooldownDuration))
  {
    // Dont want to save, since we're within 10 secs of save
    return;
  }
  
  console.log("Save!");
  
  saveCanvas();

  lastFrameSaveTime = time;
}