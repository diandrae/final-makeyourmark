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
  this.tracked_pose = null
  this.posenet_objs = []

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
      Pose._update(results);
      
    });
    // Hide the video element, and just show the canvas
    this.video.hide();
  }

  this._update = function(results){
    this.posenet_objs = results;
    if (results.length > 0){
      var new_pose = results[0].pose.keypoints
      if (this.tracked_pose == null){
        this.tracked_pose = new_pose
      }else{
        for (var i = 0; i < new_pose.length; i++){
          this.tracked_pose[i].position.x = lerp(this.tracked_pose[i].position.x, new_pose[i].position.x);
          this.tracked_pose[i].position.x = lerp(this.tracked_pose[i].position.y, new_pose[i].position.y);
        }
      }
    }
  }
  
  this.get_tracked_pose = function(){
    return this.tracked_pose;
  }
  
  this.draw = function(){
    this.draw_pose(this.get_tracked_pose);
  }
  
  this.get_all_poses = function(){
    return this.posenet_objs;
  }
  
  this.draw_pose = function(pose) {
    for (let j = 0; j < pose.length; j++) {
      let keypoint = pose[j];
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    }
  }
}