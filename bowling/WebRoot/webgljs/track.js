Bowling.TRACK_IMG = "images/wood.jpg";
Bowling.TRACK_CUBE_IMG = "images/floor_mirror.png";
Bowling.TRACK_WIDTH = 240;
Bowling.TRACK_DEPTH = 1100;
Bowling.TRACK_HEIHGT = 100;

Bowling.Track = function(webgl, position, gravityEngine) {
  Bowling.Object.call(this);
  var scope = this;
  scope.isReadyOfTrackImg = false;
  scope.countOfCubeImg = 0;
  
  var cube_url = Bowling.TRACK_CUBE_IMG;
  var cube_urls = [
	cube_url, cube_url,
	cube_url, cube_url,
	cube_url, cube_url
  ];
  var reflectivity =  0.1;
  var combine = 1;
  var color = 0xffffff;
  
  var textureCube = THREE.ImageUtils.loadTextureCube(cube_urls, null, 
      function() {
	    scope.countOfCubeImg ++;
	  });
  
  var texture = THREE.ImageUtils.loadTexture(Bowling.TRACK_IMG, null, 
      function() {
	    scope.isReadyOfTrackImg = true;
	  });
  
  var track = new THREE.Mesh(new THREE.PlaneGeometry(Bowling.TRACK_WIDTH, Bowling.TRACK_DEPTH), 
	  new THREE.MeshPhongMaterial( {color: color, envMap: textureCube,  
	  map: texture, reflectivity: reflectivity, combine: combine}));
  
  track.rotation.x = - ( Math.PI / 2 );
  Bowling.util.setPosition(track, position);
  track.receiveShadow = true;
  webgl.addObject(track);
  this.original_position = position;
  this.addGravityObj(gravityEngine);
}

Bowling.Track.prototype = new Bowling.Object();
Bowling.Track.prototype.constructor = Bowling.Track;

Bowling.Track.prototype.addGravityObj = function(gravityEngine) {
  if (gravityEngine) {
    var trackBoxHeight = Bowling.TRACK_HEIHGT;
    var trackMass = 1000;
    var groundPos = this.original_position.slice();
    groundPos[1] -= trackBoxHeight;
    var planeNormal = [0, 1, 0, 0];
    gravityEngine.addGround(planeNormal, groundPos);
  
    var trackBoxPos = this.original_position.slice();
    trackBoxPos[1] -= trackBoxHeight/2;
    gravityEngine.addBox(Bowling.TRACK_WIDTH, trackBoxHeight, Bowling.TRACK_DEPTH, 
      trackBoxPos, trackMass, false);
  }
}

Bowling.Track.prototype.getReady = function() { 
  return (this.isReadyOfTrackImg && (this.countOfCubeImg == 6));
}

Bowling.Track.prototype.isActive = function() {
  return false;
}