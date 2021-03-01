

var PoseZero = new function(){
  this.video = null
  this.poseNet = null
  this.pose0 = null
  this.posenet_objs = []
  this.track_smooth = 0.3

  this.init = function() {
    
    this.video = createCapture(VIDEO);  // init webcam
    this.video.size(width,height);

    function modelReady() {
      select('#status').html('Model Loaded'); // change that html bit to say model loaded
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
    // this.video.hide();
  }

  this._convert = function(posenet_obj){
    var result = {}
    var kpts = posenet_obj.pose.keypoints
    for (var i = 0; i < kpts.length; i++){
      result[kpts[i].part] = {
        x:width-kpts[i].position.x,
        y:kpts[i].position.y
      }      
    }
    return result;
  }
  
  // smoothens the movement
  this.lerp_pose = function(poseA, poseB, t){
    for (var k in poseB){
      if (isNaN(poseA[k].x)){
        poseA[k].x = poseB[k].x
      }else{
        poseA[k].x = lerp(poseA[k].x, poseB[k].x, t);
      }
      if (isNaN(poseA[k].y)){
        poseA[k].y = new_pose[k].y
      }else{
        poseA[k].y = lerp(poseA[k].y, poseB[k].y, t);
      }
    }
    
  }
  
  
  this._update = function(results){
    
    this.posenet_objs = results;
    if (results.length > 0){
      var new_pose = this._convert(this._get_largest_posenet_obj(results));
      if (this.pose0 == null){
        this.pose0 = new_pose
      }else{
        this.lerp_pose(this.pose0, new_pose, this.track_smooth);
        
      }
    }
  }
  
  this._get_largest_posenet_obj = function(objs){
    var max_i = 0;
    var max_d = 0;
    for (var i = 0; i < objs.length; i++){
      var kpts = objs[i].pose.keypoints;
      var nose = kpts[0]
      var leftEye = kpts[1]
      var d = dist(nose.x,nose.y,leftEye.x,leftEye.y);
      if (d > max_d){
        max_d = d;
        max_i = i;
      }
    }
    return objs[max_i];
  }
  
  this.get = function(){
    return this.pose0;
  }
  
  this.draw = function(){
    if (this.pose0 != null){
      this.draw_pose(this.get());
    }
  }
  
  this.estimate_scale = function(pose){
    return dist(pose.nose.x, pose.nose.y , pose.leftEye.x, pose.leftEye.y);
  }
  
  /// this bit (i think?)! vvvv
  
  
  // drawing the bone lines
  this._draw_bones = function(){
    beginShape()
    for (var i = 0; i < arguments.length; i++){
      vertex(arguments[i].x, arguments[i].y);
    }
    endShape()
  }
  
  
  this.previousPose = undefined;
  
  this.validPose = function(pose)
  {
    return !!pose.leftElbow && !!pose.rightElbow  && !!pose.leftWrist && !!pose.rightWrist;
  }
  
  this.draw_pose = function(pose, args) {
    if (args == undefined){args = {}}
    if (args.color == undefined){args.color = [255,255,255]}
    
    if(!this.validPose(pose)) {
      console.log('invalid pose');
      return;
    };
    
    
    if(this.previousPose == undefined)
    {
      console.log('set previous pose');
      this.previousPose = pose;
      return;
    }
    
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 10, 10);
    
    console.log(`POSE: ${pose.leftWrist.x} PREV: ${this.previousPose.leftWrist.x}`);
    
    console.log(pose.leftWrist.x - this.previousPose.leftWrist.x);
    
    this.previousPose = pose;
    
    
//     push();
    
//     // colorMode(HSB, 255);
//     // stroke.apply(this, args.color);
//     // strokeWeight(4);
//     // blendMode(MULTIPLY);
    
//     strokeJoin(ROUND);

//     // this._draw_bones(pose.leftShoulder, pose.rightShoulder, pose.rightHip, pose.leftHip, pose.leftShoulder);
    
//     this._draw_bones(pose.leftElbow, pose.leftWrist);
//     this._draw_bones(pose.rightElbow, pose.rightWrist);
    
//     // noStroke();
//     fill(0,255,0);
//     stroke(255,0,0);
//     // ellipse(this.previousPose.leftWrist.x, this.previousPose.leftWrist.y, 10, 10);
//     // ellipse(pose.leftWrist.x, pose.leftWrist.y, 10, 10);
//     // ellipse(this.previousPose.leftElbow.x, this.previousPose.leftElbow.y, 10, 10);
//     // ellipse(pose.leftElbow.x, pose.leftElbow.y, 10, 10);
    
//     beginShape();
//     // // vertex(pose.leftWrist.x, pose.leftWrist.y);
//     // vertex(this.previousPose.leftWrist.x, this.previousPose.leftWrist.y);
//     // // vertex(pose.leftElbow.x, pose.leftElbow.y);
//     // vertex(this.previousPose.leftElbow.y, this.previousPose.leftElbow.x);
    

    
//      vertex(this.previousPose.leftWrist.x, this.previousPose.leftWrist.y);
//     vertex(pose.leftWrist.x, pose.leftWrist.y);
//     vertex(this.previousPose.leftElbow.y, this.previousPose.leftElbow.x);
//     vertex(pose.leftElbow.x, pose.leftElbow.y);


//     endShape(CLOSE);

// //     this._draw_bones(pose.leftHip, pose.leftKnee, pose.leftAnkle);
// //     this._draw_bones(pose.rightHip, pose.rightKnee, pose.rightAnkle);
// //     this._draw_head(pose);
  
//     var s = this.estimate_scale(pose);
    
//     // fill(0);
//     // rect(this._draw_bones);
//     pop();
    
//     this.previousPose = pose;
    
  }
}

function keyPressed() {
	if(key === 's' || key ==='S'){
    save("myMark.jpg");
  }
}
