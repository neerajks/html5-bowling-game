Bowling.BOTTLE_MODE = "models/bottle.js";
Bowling.BOTTLE_IMG = "images/bottlepic512.png";

Bowling.Bottle = function(webgl, position, gravityEngine) {
  Bowling.Object.call(this);
  
  var scope = this;
  scope.isReadyOfBottleImg = false;
  
  var bottleLoader = new THREE.JSONLoader(true);
  var ambient = 0x6f6f6f;
  var shininess = 0;
  var specular = 0x000000;
  
  bottleLoader.load({
    model: Bowling.BOTTLE_MODE,
	
    callback: function(geometry) {
	  var texture = THREE.ImageUtils.loadTexture(Bowling.BOTTLE_IMG, null, 
	      function() {
		    scope.isReadyOfBottleImg = true;
		  });
	  var bottle = new THREE.Mesh(geometry, 
	       new THREE.MeshPhongMaterial ({map: texture, 
	       ambient: ambient, shininess: shininess, 
		   specular: specular})); 
	  
	  geometry.computeBoundingBox();
	  var boundingBox = geometry.boundingBox;	  
	  scope.width = boundingBox.x[1] - boundingBox.x[0];
	  scope.height = boundingBox.y[1] - boundingBox.y[0];
      scope.depth = boundingBox.z[1] - boundingBox.z[0];
	  
	  var bottle_center = position.slice();
	  bottle_center[1] += scope.height/2;
	  
      Bowling.util.setPosition(bottle, bottle_center);
	  bottle.castShadow = true;
      webgl.addObject(bottle);
	  
	  scope.meshObj = bottle;
	  scope.original_position = bottle_center;
	  console.log(scope.original_position);
      scope.addGravityObj(gravityEngine);
    },
    texture_path: "images"
  });
}

Bowling.Bottle.prototype = new Bowling.Object();
Bowling.Bottle.prototype.constructor = Bowling.Bottle;

Bowling.Bottle.prototype.addGravityObj = function(gravityEngine) {
  if (gravityEngine) {
    var bottleMass = 20;
    this.gravityObj = gravityEngine.addBox(this.width, this.height, this.depth, 
        this.original_position, bottleMass, true);
    this.meshObj.matrixAutoUpdate = false;
  }
}

Bowling.Bottle.prototype.isActive = function() {
  return true;
}

Bowling.Bottle.prototype.getReady = function() {
  return this.isReadyOfBottleImg;
};

Bowling.Bottle.prototype.isKicked = function() {
  var xp = new THREE.Vector3(this.original_position[0], 
      this.original_position[1], this.original_position[2]);
  var yp = new THREE.Vector3(this.current_position[0], 
      this.current_position[1], this.current_position[2]);
  var distance = xp.distanceTo(yp);
  if ( distance < 1) {
    return false;
  } else {
    return true;
  }
}