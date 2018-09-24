// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

var PoseZero = new function(){
  this.video = null
  this.poseNet = null
  this.pose0 = null
  this.posenet_objs = []
  this.track_smooth = 0.2

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
    var self = this;
    
    this.poseNet.on('pose', function(results) {
      self._update(results);
      
    });
    // Hide the video element, and just show the canvas
    this.video.hide();
  }

  this._update = function(results){
    
    this.posenet_objs = results;
    if (results.length > 0){
      var new_pose = results[0].pose.keypoints
      if (this.pose0 == null){
        this.pose0 = new_pose
      }else{
        for (var i = 0; i < new_pose.length; i++){
          if (isNaN(this.pose0[i].position.x)){
            this.pose0[i].position.x = new_pose[i].position.x
          }else{
            this.pose0[i].position.x = lerp(this.pose0[i].position.x, new_pose[i].position.x, this.track_smooth);
          }
          
          if (isNaN(this.pose0[i].position.y)){
            this.pose0[i].position.y = new_pose[i].position.y
          }else{
            this.pose0[i].position.y = lerp(this.pose0[i].position.y, new_pose[i].position.y, this.track_smooth);
          }
          
        }
      }
    }
    console.log(this.pose0);
  }
  
  this.get = function(){
    return this.pose0;
  }
  
  this.draw = function(){
    if (this.pose0 != null){
      this._draw_pose(this.get());
    }
  }
  
  this._get_keypt = function(pose, keypt_name){
    for (var i = 0; i < pose.length; i++){
      if (pose[i].part == keypt_name){
        return pose[i].position
      }
    }
  }
  
  this._draw_pose = function(pose) {
    for (let j = 0; j < pose.length; j++) {
      let keypoint = pose[j];
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    }
  }
}