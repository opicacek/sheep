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
					ctx.globalAlpha = Math.min(map.grass[x][y] * 0.11, 1);
					ctx.drawImage(grass_img, x*map.tile_size, y*map.tile_size, map.tile_size, map.tile_size, x*map.tile_size, y*map.tile_size, map.tile_size, map.tile_size);
					ctx.restore();
					
					//TODO draw flower
					if (map.grass[x][y] > 10) {
						if (map.grass[x][y] == 11) {
							ctx.drawImage(flower_blue_img, x*map.tile_size, y*map.tile_size);
						} else if (map.grass[x][y] == 12) {
							ctx.drawImage(flower_red_img, x*map.tile_size, y*map.tile_size);
						}
					}
					
				}
			}
		}
	}
	
	function drawBros() {
		
		for (var bro_key in bro_list) {
						
			var center_x = bro_list[bro_key].pos[0];
			var center_y = bro_list[bro_key].pos[1];

			var animation = bro_list[bro_key].skin.animation;
			
			// show skin as wolf
			if (bro_list[bro_key].red_flower) {
				var skin = wolf_img;
				//var animation_frame = Math.floor((bro_list[bro_key].skin.animation_frame) / 4) % skin[animation].length;
			} else {
				var skin = sheep_img;
				//var animation_frame = Math.floor((bro_list[bro_key].skin.animation_frame) / 10) % skin[animation].length;
			}
			
			var animation_frame = Math.floor((bro_list[bro_key].skin.animation_frame) / (20 / skin[animation].length) ) % skin[animation].length;
			
			if (bro_list[bro_key].skin.left) {
				ctx.drawImage(skin[animation][animation_frame], center_x - skin[animation][animation_frame].width/2, center_y - skin[animation][animation_frame].height/2);
			} else {
				ctx.save();
                ctx.scale(-1, 1);
				ctx.drawImage(skin[animation][animation_frame], -(center_x + skin[animation][animation_frame].width/2), center_y - skin[animation][animation_frame].height/2);
				ctx.restore();
			}
		}
	}

	// Bro to server
	//var socket = io.connect('192.168.2.102'); //TODO
	//var socket = io.connect('localhost'); //TODO
	var socket = io.connect();

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