

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
    this.video.hide();
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
        this.pose0 = new_pose;
      }else{
        this.pose0 = new_pose;
        // *** HERE ***
        // this.lerp_pose(this.pose0, new_pose, this.track_smooth);
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
      // this.draw_pose(this.get());
    }
  }
  
  this.estimate_scale = function(pose){
    return dist(pose.nose.x, pose.nose.y , pose.leftEye.x, pose.leftEye.y);
  }
  
  // drawing the bone lines
  this._draw_bones = function(){
    beginShape()
    for (var i = 0; i < arguments.length; i++){
      vertex(arguments[i].x, arguments[i].y);
    }
    endShape()
  }
  
  
  
  this.validPose = function(pose)
  {
    return !!pose.leftElbow && !!pose.rightElbow  && !!pose.leftWrist && !!pose.rightWrist;
  }
  
  this.draw_pose = function(pose, args, previousPose) {
    if (args == undefined){args = {}}
    if (args.color == undefined){args.color = [255,255,255]}
    
    if(!this.validPose(pose)) {
      console.log('invalid pose');
      return;
    };
    
    
    if(previousPose.data == undefined)
    {
      
      previousPose.data = pose;
      return;
    }
    
    if(frameCount % 750== 0){
         background(255);
    }

    push();
    blendMode(MULTIPLY);
    colorMode(HSB, 255);
    fill.apply(this, args.color);
    noStroke();
    beginShape();
    vertex(previousPose.data.rightWrist.x, previousPose.data.rightWrist.y);
    vertex(pose.rightWrist.x, pose.rightWrist.y);
    vertex(pose.rightElbow.x, pose.rightElbow.y);
    vertex(previousPose.data.rightElbow.x, previousPose.data.rightElbow.y);
    endShape(CLOSE);
    pop();
    
    previousPose.data = pose;
    
  }
}


