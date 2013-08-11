// map
var grass_img = new Image();
grass_img.src = "../img/map/grass.png";

// sheep
var sheep_img_file = ["idle.png", "run1.png",  "run2.png", "eat1.png",  "eat2.png",  "eat3.png", "walk.png"];

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
//sheep_img.eat = [ sheep_img_raw[3], sheep_img_raw[4], sheep_img_raw[5] ];
