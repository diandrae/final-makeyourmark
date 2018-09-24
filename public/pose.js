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

  this._convert = function(posenet_obj){
    var result = {}
    var kpts = posenet_obj.pose.keypoints
    for (var i = 0; i < kpts.length; i++){
      result[kpts[i].part] = kpts[i].position
    }
    return result;
  }
  
  this._update = function(results){
    
    this.posenet_objs = results;
    if (results.length > 0){
      var new_pose = this._convert(results[0])
      if (this.pose0 == null){
        this.pose0 = new_pose
      }else{
        for (var k in new_pose){
          if (isNaN(this.pose0[k].x)){
            this.pose0[k].x = new_pose[k].x
          }else{
            this.pose0[k].x = lerp(this.pose0[k].x, new_pose[k].x, this.track_smooth);
          }
          if (isNaN(this.pose0[k].y)){
            this.pose0[k].y = new_pose[k].y
          }else{
            this.pose0[k].y = lerp(this.pose0[k].y, new_pose[k].y, this.track_smooth);
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
  
  this._draw_bones = function(){
    for (var i = 0; i < arguments.length-1; i++){
      line(arguments[i].x, arguments[i].y, arguments[i+1].x, arguments[i+1].y);
    }
  }
  
  this._draw_pose = function(pose) {
    for (var k in pose) {
      fill(255, 0, 0);
      noStroke();
      ellipse(pose[k].x, pose[k].y, 10, 10);
    }
    
    stroke(255,0,0);
    strokeWeight(5);
    
    this._draw_bones(pose.nose, pose.leftEye);
    this._draw_bones(pose.nose, pose.rightEye);
    this._draw_bones(pose.leftEye, pose.leftEar);
    this._draw_bones(pose.rightEye, pose.rightEar);
    
    this._draw_bones(pose.leftShoulder, pose.rightShoulder, pose.rightHip, pose.leftHip, pose.leftShoulder);
    
    this._draw_bones(pose.leftShoulder, pose.leftElbow, pose.leftWrist);
    
    this._draw_bones(pose.rightShoulder, pose.rightElbow, pose.rightWrist);

    this._draw_bones(pose.leftHip, pose.leftKnee, pose.leftAnkle);
    this._draw_bones(pose.rightHip, pose.rightKnee, pose.rightAnkle);
    

  }
}