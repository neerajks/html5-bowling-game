Bowling = {
};

Bowling.IMAGE_PATH = "images";

Bowling.util = {

};

Bowling.util.setPosition = function(obj, pos) {
  obj.position.set(pos[0], pos[1], pos[2]);
};

Bowling.util.animate = function (func, timeout) {
  if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout(callback, timeout);
		};
	} )();
  }
  window.requestAnimationFrame(func);
}

Bowling.util.GetMatrix = function (cur_pos, dir, cur_sca) {
  if (cur_sca == undefined || cur_sca == null) {
    cur_sca = 1.0;
  } 
  var position = new THREE.Matrix4().setTranslation(cur_pos[0], cur_pos[1], cur_pos[2]);
  var scale = new THREE.Matrix4().setScale(cur_sca, cur_sca, cur_sca);
  position.multiplySelf(scale);
  
  if (dir != undefined && dir != null) {
    var rotate = new THREE.Matrix4(dir[0], dir[1], dir[2], dir[3], dir[4], dir[5], dir[6], dir[7], dir[8], 
        dir[9], dir[10], dir[11], dir[12], dir[13], dir[14], dir[15]);
	position.multiplySelf(rotate);
  }
  return position;  
}