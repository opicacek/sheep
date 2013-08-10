function play() {
	
	// Frame rate definition
	var fps = 50;
	var now;
	var then = Date.now();
	var interval = 1000 / fps;
	var delta;
	
	// Init
	var c = document.getElementById('c');
	var ctx = c.getContext('2d');

	c.width = 760;
	c.height = 400;

	var screen_w = c.width;
	var screen_h = c.height;
	
	//
	var my_bro = new Bro();
	my_bro.pos.push( Math.floor(Math.random()*screen_w), Math.floor(Math.random()*screen_h) );

	//TODO same id for user all the time, get from local storage
	var id_time = new Date().getTime();
	var id_random = Math.floor(Math.random()*100000);
	my_bro.id = id_time + "" + id_random;
	my_bro.goal_pos = my_bro.pos;
	
	//
	c.onmousedown = mouseDown;
	function mouseDown(e) {
		if (e.button == 0) { // left click
			// get click position
			var mouse_x = event.pageX - document.documentElement.scrollLeft - c.offsetLeft;
			var mouse_y = event.pageY - document.documentElement.scrollTop - c.offsetTop;
			//console.log(mouse_x, mouse_y);

			// set goal fro Bro
			my_bro.goal_pos = [mouse_x, mouse_y];
		}
	}

	function drawWorld() {
		// background 
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(0, 0, screen_w, screen_h);
	}
	
	function drawBros(bro_list) {
		
		for (var bro_key in bro_list) {
						
			var centerX = bro_list[bro_key].pos[0];
			var centerY = bro_list[bro_key].pos[1];
			var radius = 10;

			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			//console.log(centerX, centerY);
			ctx.fillStyle = "rgb(255, 0, 0)";
			if (bro_key == my_bro.id) {
				ctx.fillStyle = "rgb(0, 255, 0)";
			}
			
			ctx.fill();
		}
	}

	// Bro to server
	var bro_list;

	var socket = io.connect('192.168.2.102'); //TODO
	//var socket = io.connect('localhost'); //TODO
	socket.emit('add_bro', my_bro);
	
	// get positions of all Bros
	socket.on('bro_list', function (data) {
		//console.log("got Bros from server:", data);
		bro_list = data; //TODO dont drop bro_list

		// TODO logical steps - leave it to server
		// move Bro
		//my_bro.pos = my_bro_goal;
	});

	// send Bro position to server
	function updateBros() {
		//console.log("informations send to server");
				
		//socket.emit('update_bro', my_bro);
		socket.emit('update_bro', {moveBro: my_bro.goal_pos});

		setTimeout(updateBros, 20);
	}
	updateBros();
	
	// draw loop
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	
	function drawLoop(e) {

		requestAnimationFrame(drawLoop);
		
		now = Date.now();
		delta = now - then;
		
		if (delta > interval) {

			drawWorld();
						
			drawBros(bro_list);
		
			// update time stuffs
			then = now - (delta % interval);		
		}
		
	}
	drawLoop();

}