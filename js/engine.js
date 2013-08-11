function Engine() {
	this.bro_list = {};
	this.pipeline = {};
	
	// set game map parameters
	this.tile_size = 20;
	this.grass_size = [38, 20];	
	this.grass = [];
	this.generateGrass();
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
	for (var x = 0; x < this.grass.length; x++) {
		for (var y = 0; y < this.grass[0].length; y++) {
			if (this.grass[x][y] < 10) {
				this.grass[x][y] += 1;
			}
		}
	}
}
Engine.prototype.eatGrass = function() {
	for (var bro in this.bro_list) {
		var x = Math.floor( this.bro_list[bro].pos[0] / this.tile_size);
		var y = Math.floor( this.bro_list[bro].pos[1] / this.tile_size);
				
		if ( this.grass[x][y] > 0 ) {
			this.bro_list[bro].score += 1;
			this.grass[x][y] -= 1;
		}
	}
}
Engine.prototype.deleteBro = function(socket_id, parameters) {
	delete this.bro_list[parameters];
}
Engine.prototype.moveBro = function(socket_id, parameters) {
		
	var step = 2; // max length of each step
	
	var bro = this.bro_list[socket_id];
		
	var x_delta = parameters[0] - bro.pos[0];
	var y_delta = parameters[1] - bro.pos[1];
		
	var distance = Math.sqrt( Math.pow(x_delta, 2) + Math.pow(y_delta, 2) );
	if (distance == 0) {
		return;
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