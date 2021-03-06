var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	static = require('node-static'),
	engine = require('./js/engine'); // for serving files

var en = new engine.Engine()

// This will make all the files in the current folder
// accessible from the web
var fileServer = new static.Server('./');

//TODO alternatives to websockets
io.configure(function () {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
	io.set("heartbeat interval", 3); //TODO kill idle users
	io.set("heartbeat timeout", 5);
	io.set("close timeout ", 5);
});

// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
app.listen(process.env.PORT || 8080);

// If the URL of the socket server is opened in a browser
function handler (request, response) {
	fileServer.serve(request, response); // this will return the correct file
}

io.sockets.on('connection', function (socket) {
	var socket_id;
	socket.on('add_bro', function (data) {
		socket_id = data.id;
		//data.score = 0; // set default score
		en.bro_list[data.id] = data;
		socket.on('disconnect', function () {
			en.pipeline[data.id] = {deleteBro: socket_id}; //TODO works only with websockets
	    });
	});
	socket.on('update_bro', function (commands) {
		if (en.bro_list[socket_id] != undefined) {
			en.pipeline[socket_id] = commands;
		}
	});
});

var timer = 0;
var loop_time = 20;

function updateBros() {
	
	// grass growth
	if (timer == 5000) {
		timer = 0;
		en.growthGrass();
	}	
	
	io.sockets.emit('bro_list', {bro_list: en.bro_list, map: {tile_size: en.tile_size, size: en.grass_size, grass:en.grass} });
	en.process();
	
	timer += loop_time;
	setTimeout(updateBros, loop_time);
}
updateBros();