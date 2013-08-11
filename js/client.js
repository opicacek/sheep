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

	//TODO get canvas size from server
	c.width = 760;
	c.height = 400;

	var screen_w = c.width;
	var screen_h = c.height;
	
	//
	var bro_list; // list of online players
	var map; // map status

	var my_bro = new Bro(); // player
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
			var mouse_x = e.pageX - document.documentElement.scrollLeft - c.offsetLeft;
			var mouse_y = e.pageY - document.documentElement.scrollTop - c.offsetTop;
			//console.log(mouse_x, mouse_y);

			// set goal fro Bro
			my_bro.goal_pos = [mouse_x, mouse_y];
		}
	}

	function drawWorld() {
		// background
		if ( typeof(map) == "undefined" ) {
			// display image of grass
			//ctx.fillStyle = "rgb(0, 0, 0)";
			//ctx.fillRect(0, 0, screen_w, screen_h);
			ctx.drawImage(grass_img, 0, 0);
		} else {
			for (var x = 0; x < map.size[0]; x++) {
				for (var y = 0; y < map.size[1]; y++) {
					//ctx.fillStyle = "rgb(0, " + (50 * map.grass[x][y]) + ", 0)";
					//ctx.fillRect(x*map.tile_size, y*map.tile_size, map.tile_size, map.tile_size);
					
					ctx.save();
					ctx.globalAlpha = map.grass[x][y] * 0.11;
					ctx.drawImage(grass_img, x*map.tile_size, y*map.tile_size, map.tile_size, map.tile_size, x*map.tile_size, y*map.tile_size, map.tile_size, map.tile_size);
					ctx.restore();
					
				}
			}
		}
	}
	
	function drawBros() {
		
		for (var bro_key in bro_list) {
						
			var center_x = bro_list[bro_key].pos[0];
			var center_y = bro_list[bro_key].pos[1];

			// player represented by circle
			/*
			var radius = 10;
			ctx.beginPath();
			ctx.arc(center_x, center_y, radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = "rgb(255, 255, 255)";
			if (bro_key == my_bro.id) {
				ctx.fillStyle = "rgb(255, 0, 0)";
			}
			
			ctx.fill();
			*/
			//var img_index = 0; //TODO get index from server
			var animation = bro_list[bro_key].skin.animation; //TODO
			//var animation_frame = bro_list[bro_key].skin.animation_frame; //TODO
			var animation_frame = Math.floor((bro_list[bro_key].skin.animation_frame) / 10) % sheep_img[animation].length; //TODO

			if (bro_list[bro_key].skin.left) {
				ctx.drawImage(sheep_img[animation][animation_frame], center_x - sheep_img[animation][animation_frame].width/2, center_y - sheep_img[animation][animation_frame].height/2);
			} else {
				ctx.save();
                ctx.scale(-1, 1);
				ctx.drawImage(sheep_img[animation][animation_frame], -(center_x + sheep_img[animation][animation_frame].width/2), center_y - sheep_img[animation][animation_frame].height/2);
				ctx.restore();
			}
		}
	}

	// Bro to server
	//var socket = io.connect('192.168.2.102'); //TODO
	//var socket = io.connect('localhost'); //TODO
	var socketio.connect();
	socket.emit('add_bro', my_bro);
	
	// get positions of all Bros
	socket.on('bro_list', function (data) {
		//console.log("got Bros from server:", data);
		bro_list = data.bro_list;
		map = data.map;
		
	});
	
	function updateScore() {
		//TODO update highcores
		/*
		for (var bro_key in bro_list) {
			console.log(bro_list[bro_key].score);
		}
		console.log("============");
		*/
	}

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

			ctx.clearRect(0, 0, screen_w, screen_h);
			drawWorld();
						
			drawBros();
			
			updateScore();
		
			// update time stuffs
			then = now - (delta % interval);		
		}
		
	}
	drawLoop();

}