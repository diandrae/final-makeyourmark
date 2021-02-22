//send data
function Agent(x, y){
  this.data = {
    position : {x:0, y:0},
    pose : null,
    color: [random(255),100,255]
  }
	
//update pose
	this.update = function(pose){
    this.data.pose = pose;
	}

}