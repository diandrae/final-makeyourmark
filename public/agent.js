function Agent(x, y){
  this.data = {
    position : {x:0, y:0},
    pose : null
  }
	
	this.update = function(pose){
    this.data.pose = pose;
	}

}