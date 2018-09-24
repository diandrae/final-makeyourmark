var self;
var everybody;

function setup() {
  createCanvas(640, 480);
  background(0);
  PoseZero.init()
  
  var self = new Agent();

	var data = {
		position: self.position
		pose: self.pose
	};
  
	socket.emit('game-start', data)
	socket.on('heartbeat', function(data){
		everybody = data;
	})

  
}

function draw() {

  background(0);
  PoseZero.draw();
}