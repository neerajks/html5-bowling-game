Bowling.BALL_IMG = 'images/bowling.png';
Bowling.BALL_CUBE_IMG = "images/sky_cube.png";
Bowling.SPHERE_RADIUS = 20;

Bowling.Ball = function(webgl, position, gravityEngine) {
  Bowling.Object.call(this);
  var scope = this;
  scope.isReadyOfBallImg = false;
  scope.countOfCubeImg = 0;  
  var segments = 50;

  var reflectivity = 0.1;
  var combine = 1;
  var color = 0xffffff;
  
  var cube_url = Bowling.BALL_CUBE_IMG;
  var cube_urls = [
	cube_url, cube_url,
	cube_url, cube_url,
	cube_url, cube_url
  ];
  var textureCube = THREE.ImageUtils.loadTextureCube(cube_urls, null, 
      function() {
	    scope.countOfCubeImg ++;
	  });
  
  var sphereTexture = THREE.ImageUtils.loadTexture(Bowling.BALL_IMG, null, 
      function() {
	    scope.isReadyOfBallImg = true;
	  });
    
  var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(Bowling.SPHERE_RADIUS, segments, segments), 
	  new THREE.MeshPhongMaterial({color: color, envMap: textureCube,  map: sphereTexture, 
	  reflectivity: reflectivity, combine: combine} ) );
  
  
  var ball_center = position.slice();
  
  ball_center[1] += Bowling.SPHERE_RADIUS;
  Bowling.util.setPosition(sphere, ball_center);
  //sphere.depthTest = false;
  sphere.castShadow = true;
  webgl.addObject(sphere);   
  
  this.original_position = ball_center;
  this.meshObj = sphere;
  this.addGravityObj(gravityEngine);
}

Bowling.Ball.prototype = new Bowling.Object();
Bowling.Ball.prototype.constructor = Bowling.Ball;

Bowling.Ball.prototype.addGravityObj = function(gravityEngine) {
  if (gravityEngine) {
    var ballMass = 150;
    this.gravityObj = gravityEngine.addSphere(Bowling.SPHERE_RADIUS, this.original_position, 
      ballMass, true);
    this.meshObj.matrixAutoUpdate = false;
  }
}

Bowling.Ball.prototype.isActive = function() {
  return true;
}

Bowling.Ball.prototype.getReady = function() {
  return (this.isReadyOfBallImg && (this.countOfCubeImg == 6));
}

Bowling.Ball.prototype.setVelocity = function(velocity) {
  this.velocity = velocity;
}

Bowling.Ball.prototype.isOnTrack = function() {
  var xBorder = [Bowling.TRACK.position[0] - Bowling.TRACK_WIDTH/2, 
      Bowling.TRACK.position[0] + Bowling.TRACK_WIDTH/2];
  var zBorder = [Bowling.TRACK.position[2] - Bowling.TRACK_DEPTH/2, 
      Bowling.TRACK.position[2] + Bowling.TRACK_DEPTH/2];
  var x = this.current_position[0];
  var z = this.current_position[2];
  if ( x < xBorder[0] || x > xBorder[1]) return false;
  if ( z < zBorder[0] || z > zBorder[1]) return false;
  return true;
}

Bowling.Ball.prototype.isOnGround = function() {
  var bally = this.current_position[1];
  var groundy = Bowling.TRACK.position[1] - Bowling.TRACK_HEIHGT;
  if (Math.abs(bally - groundy - Bowling.SPHERE_RADIUS) < 10) {
    return true;
  } else {
    return false;
  }
}
