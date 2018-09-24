// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

var Pose = new function(){
  this.video = null
  this.poseNet = null
  this.poses = []

  this.init = function() {
    this.video = createCapture(VIDEO);
    this.video.size(640, 480);

    function modelReady() {
      select('#status').html('Model Loaded');
    }
    // Create a new poseNet method with a single detection
    this.poseNet = ml5.poseNet(this.video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    this.poseNet.on('pose', function(results) {
      Pose.poses = results;
      console.log(Pos
    });
    // Hide the video element, and just show the canvas
    this.video.hide();
  }

  this.get_poses = function(){
    return this.poses;
  }
  
  this.draw_pose = function(pose) {
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
    let skeleton = pose.skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}