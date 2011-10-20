Bowling.BACKGROUND_MODEL = "models/scene.js";

Bowling.Background = function(webgl) {
  Bowling.Object.call(this);
  var scope = this;
  
  var jsonLoader = new THREE.JSONLoader(true);    
  jsonLoader.load({
    model: Bowling.BACKGROUND_MODEL,    
	callback:  function(geometry) {	   
	  scope.materials = geometry.materials;
	  for ( var i = 0, len = scope.materials.length; i < len; i ++ ) {
        var material = scope.materials[ i ][ 0 ];
		material.transparent = true;
      }  
	  var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( )); 
      Bowling.util.setPosition(mesh, [0, 0, 0]);
      webgl.addObject(mesh);
     },
    texture_path: Bowling.IMAGE_PATH,
  }); 

}

Bowling.Background.prototype = new Bowling.Object();
Bowling.Background.prototype.constructor = Bowling.Background;

Bowling.Background.prototype.getReady = function() {
  if (this.materials) {
    var len = this.materials.length;
	for (var i = 0; i < len; i ++) {
	  if (this.materials[i][0]["map"]["needsUpdate"] == false) {
	    return false;
	  }
	}
  }
  return true;
};

Bowling.Background.prototype.isActive = function() {
  return false;
}

