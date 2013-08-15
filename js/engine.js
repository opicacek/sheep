function Engine() {
	this.bro_list = {};
	this.pipeline = {};
	
	// set game map parameters
	this.tile_size = 20;
	this.grass_size = [38, 20];	
	this.grass = [];
	this.generateGrass();
	
	this.flowers_actual = [0, 0];
	this.flowers_limit = [3, 1];
}
Engine.prototype.generateGrass = function() {
	this.grass = [];
	
	for (i = 0; i < this.grass_size[0]; i++) {
		this.grass.push([]);
		for (j = 0; j < this.grass_size[1]; j++) {
			//this.grass[i].push(1); //
			this.grass[i].push( Math.floor(Math.random()*10) ); // random
		}
	}
}
Engine.prototype.growthGrass = function() {
	var flower_candidates = [];
	
	for (var x = 0; x < this.grass.length; x++) {
		for (var y = 0; y < this.grass[0].length; y++) {
			if (this.grass[x][y] < 10) {
				this.grass[x][y] += 1;
			} else {
				flower_candidates.push([x, y]);
			}
		}
	}
	
	//TODO add flowers
	if (flower_candidates.length) {
		//var flower_pos = flower_candidates.pop([ Math.floor( Math.random()*flower_candidates.length ) ]);
		if (this.flowers_actual[0] < this.flowers_limit[0]) {
			var flower_pos = flower_candidates.splice(Math.floor( Math.random()*flower_candidates.length ), 1)[0];
			this.grass[ flower_pos[0] ][ flower_pos[1] ] = 11;
			this.flowers_actual[0] += 1;
		}
		if (this.flowers_actual[1] < this.flowers_limit[1]) {
			var flower_pos = flower_candidates.splice(Math.floor( Math.random()*flower_candidates.length ), 1)[0];
			if (flower_pos.length) {
				this.grass[ flower_pos[0] ][ flower_pos[1] ] = 12;
				this.flowers_actual[1] += 1;
			}
		}
	}
	
}
Engine.prototype.eatGrass = function() {
	for (var bro in this.bro_list) {
		var x = Math.floor( this.bro_list[bro].pos[0] / this.tile_size);
		var y = Math.floor( this.bro_list[bro].pos[1] / this.tile_size);
		
		if ( this.grass[x][y] > 0 ) {
			
			if ( this.grass[x][y] > 10 ) { // flowers
				if ( this.grass[x][y] == 11 ) { // blue = turbo
					this.flowers_actual[0] -= 1;
					this.bro_list[bro].blue_flower += 150;
				} else 	if ( this.grass[x][y] == 12 ) { // red = wolf
					this.flowers_actual[1] -= 1;
					this.bro_list[bro].red_flower += 250;
				}
				this.bro_list[bro].score += 1;
				this.grass[x][y] = 10;
			}
			else {
				this.bro_list[bro].score += 1;
				this.grass[x][y] -= 1;
			}
		}
	}
}
Engine.prototype.deleteBro = function(socket_id, parameters) {
	delete this.bro_list[parameters];
}
Engine.prototype.moveBro = function(socket_id, parameters) {
		
	var step = 2; // max length of each step
	
	var bro = this.bro_list[socket_id];
	if (bro.blue_flower) {
		bro.blue_flower -= 1;
		step = 4;
	}
	
	if (bro.red_flower) {
		bro.red_flower -= 1;
		step = Math.max(3, step);
		
		//TODO show skin as wolf
	}
	
	
	var x_delta = parameters[0] - bro.pos[0];
	var y_delta = parameters[1] - bro.pos[1];
		
	var distance = Math.sqrt( Math.pow(x_delta, 2) + Math.pow(y_delta, 2) );
	if (distance == 0) {
		
		if (bro.skin.animation == "idle") {
			bro.skin.animation_frame += 1;
		} else {
			bro.skin.animation_frame = 0;
			bro.skin.animation = "idle";
		}
		
		return;
	}
	
	// change skin of sheep
	if (x_delta > 0) {
		bro.skin.left = false;
	} else if (x_delta < 0) {
		bro.skin.left = true;
	}
	
	if (bro.skin.animation == "run") {
		bro.skin.animation_frame += 1;
	} else {
		bro.skin.animation_frame = 0;
		bro.skin.animation = "run";
	}
	
	//var tan_angle = y_delta / x_delta;
	var cos_angle = Math.abs(x_delta) / distance;
	var sin_angle = Math.abs(y_delta) / distance;
		
	var x_step = cos_angle * Math.min(step, distance);
	var y_step = sin_angle * Math.min(step, distance);
	
	bro.pos[0] += x_step * (x_delta > 0 ? 1 : -1);
	bro.pos[1] += y_step * (y_delta > 0 ? 1 : -1);
}
Engine.prototype.process = function() {
	for (var socket_id in this.pipeline) {
		for (var command in this.pipeline[socket_id]) {
			var parameters = this.pipeline[socket_id][command];
			this[command](socket_id, parameters);
		}
	}
	
	this.eatGrass();
}
exports.Engine = Engine;