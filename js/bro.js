function Bro() {
	this.id;
	this.alive = true;
	this.pos = [];
	this.goal_pos;
	this.score = 0;
	
	this.red_flower = false;
	this.blue_flower = false;

	this.skin = {};
	this.skin.left = true;
	this.skin.animation = "idle";
	this.skin.animation_frame = 0;
}
