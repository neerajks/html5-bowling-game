Bowling.CAMERA = {position: [40, 80, 2300], 
    target_position: [40, -90, -1600]};

Bowling.MAIN_LIGHT = {position: [597, 4813, 2687],
    target_position: [-80, -34, 800]};

Bowling.SHADOW_LIGHT = {position: [500, 500, 1800],
    target_position: [-80, -34, 800]};

Bowling.TRACK_Y = -60;  	
Bowling.TRACK = {position : [40, Bowling.TRACK_Y , 1400]};
Bowling.BALL = {position : [40, Bowling.TRACK_Y, 1700]};
Bowling.BOTTLE = {position : [-80, Bowling.TRACK_Y, 900]};
	
Bowling.Init = function (element) { 
  
  this.objects = new Array();
  this.webgl = new Bowling.Webgl(element, Bowling.CAMERA.position, 
      Bowling.CAMERA.target_position, Bowling.MAIN_LIGHT.position, 
	  Bowling.MAIN_LIGHT.target_position, Bowling.SHADOW_LIGHT.position, 
	  Bowling.SHADOW_LIGHT.target_position);
  
  this.gravityEngine = new Bowling.GravityEngine();
  

  var span = Bowling.SPHERE_RADIUS * 1.5;
  Bowling.BOTTLE.position[0] += (Bowling.TRACK_WIDTH - 7*span)/2;
  for (var i = 4; i > 0; i--) {
	for (var j = 0; j < i; j++) {
	  var pos = Bowling.BOTTLE.position.slice();
	  pos[0] += span/2 + (4 - i) * span;
	  pos[0] += (span * 2)* j;
	  pos[2] += span * (4-i) * 3;
	  var bottle = new Bowling.Bottle(this.webgl, pos, this.gravityEngine);
	  this.objects.push(bottle);
	}
  }
  
  var background = new Bowling.Background(this.webgl);
  var track = new Bowling.Track(this.webgl, Bowling.TRACK.position, this.gravityEngine);
  this.objects.push(track);
  
  this.ball = new Bowling.Ball(this.webgl, Bowling.BALL.position, this.gravityEngine);
  this.objects.push(this.ball);  
}



Bowling.Init.prototype = {
  getReady : function() {
    for (var i = 0; i < this.objects.length; i++) {
	  var obj = this.objects[i];
	  if (!obj.getReady()) {
	    return false;
	  }
	}
	return true;
  },
  
  updateMatrix : function() {
    for (var i = 0; i < this.objects.length; i++) {
	  var obj = this.objects[i];
	  obj.updateMatrix();
	}    
  },
  
  resetPosition : function() {
    this.gravityEngine.removeAllBodies();
    this.gravityEngine = new Bowling.GravityEngine();
    for (var i = 0; i < this.objects.length; i++) {
	  var obj = this.objects[i];
      obj.addGravityObj(this.gravityEngine);
	}
	init.ball.setVelocity([0, 0, 0])
  }
}

Bowling.LoadResource = function() {
  if (init.getReady()) {
	if (init.gravityEngine) {
	  init.gravityEngine.integrate();
	  init.updateMatrix();
	}
	Bowling.Render();
  } else {
	Bowling.util.animate(Bowling.LoadResource);
  }
}


Bowling.Render = function() {
  if (init.gravityEngine) {
	init.gravityEngine.integrate();
	if (!init.ball.isOnTrack()) {
	  init.ball.setVelocity([0, -30, -2]);
      if (init.ball.isOnGround()) {
	    var count = 0;
	    for (var i = 0; i < 10; i++) {
	      var bottle = init.objects[i];
	      if (bottle.isKicked()) count++;
	    }
		Bowling.returnScore(count);
		init.resetPosition();
		init.gravityEngine.integrate();
	  }
	}
    init.updateMatrix();
  }
  init.webgl.doRender();
  Bowling.util.animate(Bowling.Render);
}

Bowling.KickOneFrame = function(x, y, callback) {
  init.ball.setVelocity([10, 0, -100]);
  Bowling.returnScore = callback;
}