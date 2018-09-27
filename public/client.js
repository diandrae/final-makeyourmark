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

}

function draw() {

  background(0);
  
  // image(PoseZero.video, 0, 0, width*0.2, height*0.2);
  
	local.update(PoseZero.get());
  
  if (local.data.pose != null){
    PoseZero.draw_pose(local.data.pose,{color:local.data.color})
  }
}