var self;
var everybody;

function setup() {
  createCanvas(640, 480);
  background(0);
  PoseZero.init()
  
  var self = new Agent();

	socket.emit('game-start', self.data)
	socket.on('heartbeat', function(data){
		everybody = data;
	})

}

function draw() {

  background(0);
  PoseZero.draw();
  
	self.update();

	socket.emit('game-update', self.data);
  
	for (var i = 0; i < everybody.length; i++) {
    if (everybody[i].data.pose != null){
      PoseZero.draw_pose(everybody[i].data.pose)
    }
	}

  
}