// map
var grass_img = new Image();
grass_img.src = "../img/map/grass.png";

var flower_blue_img = new Image();
flower_blue_img.src = "../img/map/flower_blue.png";
var flower_red_img = new Image();
flower_red_img.src = "../img/map/flower_red.png";


// sheep
var sheep_img_file = ["idle.png", "run1.png",  "run2.png", "eat1.png",  "eat2.png",  "eat3.png", "dead.png", "walk.png"];

var sheep_img_raw = [];
for (var i = 0; i < sheep_img_file.length; i++) {
	var img = new Image();
	img.src = "../img/sheep/" + sheep_img_file[i];
	sheep_img_raw.push( img );
}

var sheep_img = {};
//sheep_img.idle = [ sheep_img_raw[0] ];
sheep_img.idle = [ sheep_img_raw[3], sheep_img_raw[4], sheep_img_raw[5] ];
sheep_img.run = [ sheep_img_raw[1], sheep_img_raw[2] ];
sheep_img.dead = [ sheep_img_raw[6] ];
//sheep_img.eat = [ sheep_img_raw[3], sheep_img_raw[4], sheep_img_raw[5] ];


// wolf
var wolf_img_file = ["wolf_idle_1.png", "wolf_idle_2.png", "wolf_run_1.png", "wolf_run_2.png", "wolf_run_3.png", "wolf_run_4.png", "wolf_run_5.png", "wolf_run_6.png", "wolf_run_7.png", "wolf_run_8.png", ];

var wolf_img_raw = [];
for (var i = 0; i < wolf_img_file.length; i++) {
	var img = new Image();
	img.src = "../img/wolf/" + wolf_img_file[i];
	wolf_img_raw.push( img );
}

var wolf_img = {};
wolf_img.idle = [ wolf_img_raw[0], wolf_img_raw[1] ];
wolf_img.run = [ wolf_img_raw[2], wolf_img_raw[3], wolf_img_raw[4], wolf_img_raw[5], wolf_img_raw[6], wolf_img_raw[7], wolf_img_raw[8], wolf_img_raw[9] ];
