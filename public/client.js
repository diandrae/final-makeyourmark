var local;
var world = [];
var socket;


function setup() {
  socket = io();
  
  createCanvas(windowWidth,windowHeight);
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
  
  // initialInput = createInput("Initials");
// var saveButton = select('#saveButton');
//   saveButton.mousePressed(saveDrawing);
  
  
  
//   //configure Firebase
//    var firebaseConfig = {
//     apiKey: "AIzaSyBnf2hTYsEs6blfOXPSQMEqcp2HOeSh4WI",
//     authDomain: "make-your-mark-6437b.firebaseapp.com",
//     projectId: "make-your-mark-6437b",
//     storageBucket: "make-your-mark-6437b.appspot.com",
//     messagingSenderId: "372648696036",
//     appId: "1:372648696036:web:fb5cd1361754548b93f4f1",
//     measurementId: "G-ECJCD7BJ80"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
//   console.log(firebase);

//   var database = firebase.database();
//   var ref = database.ref('drawings');
//   var data = {
//     name: "DE", 
//   }
  
}

function draw() {

  // background(0);
  
   image(capture, 0, 0, 220, 140);
    
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

// function saveDrawing() {
//   var ref = database.ref('drawings');
//   var data{
//     name: "Diandra";
//     drawing:drawing
//   }
//   ref.push(data);
// }