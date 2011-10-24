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
  

  var span = Bowling.BOTTLE_Z_SPAN;
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
  
  this.audio = new Bowling.Audio(document.body);
  this.audio.play(Bowling.START_BACKGROUND_MUSIC, true);  
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
	init.ball.setVelocity([0, 0, 0]);
	var camera = init.webgl.getCamera();
    Bowling.util.setPosition(camera, Bowling.CAMERA.position);
    Bowling.util.setPosition(camera.target, Bowling.CAMERA.target_position);
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
	
	if (!init.ball.isZeroVelocity()) {
	  var camera = init.webgl.getCamera();
	  camera.position.z -= 10;
	  camera.target.position.z -= 10;
	}
	if (!init.ball.isOnTrack()) {
	  init.ball.setVelocity([0, -30, -2]);
      if (init.ball.isOnGround()) {
		
		init.resetPosition();
		init.gravityEngine.integrate();
		var count = Bowling.ComputeKickedBottle();
		Bowling.returnScore(count);
		if (count == 0) {
		  init.audio.play(Bowling.NO_KICK_MUSIC);
		}
	  }
	} else {
	  if (Bowling.ComputeKickedBottle() != 0) {
	    init.audio.play(Bowling.KICK_MUSIC);
	  } else {
	    if (!init.ball.isZeroVelocity()) {
	      //init.audio.play(Bowling.ROLL_MUSIC);
		}
	  }
	}
    init.updateMatrix();
  }
  init.webgl.doRender();
  Bowling.util.animate(Bowling.Render);
}

Bowling.ComputeKickedBottle = function() {
  var count = 0;
  for (var i = 0; i < 10; i++) {
    var bottle = init.objects[i];
    if (bottle.isKicked()) count++;
  }
  return count;	
}

Bowling.KickOneFrame = function(x, y, callback) {
  var vd = Bowling.NormalizeGravityXY(x, y);
  init.ball.setVelocity([vd[1], 0, vd[0]]);
  Bowling.returnScore = callback;
}

Bowling.NormalizeGravityXY = function(velocity, direction) {
  //velocity : from -70 ~ -120
  //direction : from -30 ~ 30
  var velocity = -70 + -50 * Math.random();
  var direction = -30 + 60 * Math.random();
  //var direction = -30 ;
  return [velocity, direction];
}