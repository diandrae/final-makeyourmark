var express = require('express'); 

var app = express();
var server = app.listen(process.env.PORT || 300);

app.use(express.static('public'));
console.log('server running')

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

var players = [];

function Player(id, data){
	this.id = id;
  this.data = data;
}

function newConnection(socket){
	console.log('new connection: ' + socket.id)
	socket.on('mouse', mouseMsg);
	socket.on('game-start', gameStart)
	socket.on('game-update', gameUpdate)
	socket.on('disconnect', removePlayer)
  
	function mouseMsg(data){
		socket.broadcast.emit('mouse', data);
		console.log(data)
	}
  
	function gameStart(data){
		console.log(socket.id)
		var player = new Player(socket.id, data)
		players.push(player)
		setInterval(heartbeat, 10)

		function heartbeat(){
			io.sockets.emit('heartbeat', players)
		}
	}
	function gameUpdate(data){
		var player;
		for (var i = 0; i < players.length; i++) {
			if(socket.id == players[i].id){
				player = players[i];
				break;
			}
		}
		player.data = data;
	}

	function removePlayer(){
		for (var i = 0; i < players.length; i++) {
			if(socket.id == players[i].id){
				players.splice(i, 1)
				console.log('disconnected')
				break
			}
		}
	}
	
}