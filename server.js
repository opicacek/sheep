var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	static = require('node-static'),
	engine = require('./js/engine'); // for serving files

var en = new engine.Engine()

// This will make all the files in the current folder
// accessible from the web
var fileServer = new static.Server('./');

// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
app.listen(8080);

// If the URL of the socket server is opened in a browser
function handler (request, response) {
	fileServer.serve(request, response); // this will return the correct file
}

io.sockets.on('connection', function (socket) {
	var socket_id;
	socket.on('add_bro', function (data) {
		socket_id = data.id;
		en.bro_list[data.id] = data;
		socket.on('disconnect', function () {
			en.pipeline[data.id] = {deleteBro: socket_id};
	    });
	});
	socket.on('update_bro', function (commands) {
		if (en.bro_list[socket_id] != undefined) {
			en.pipeline[socket_id] = commands;
		}
	});
});

function updateBros() {
	io.sockets.emit('bro_list', en.bro_list);
	en.process();
	setTimeout(updateBros, 20);
}
updateBros();