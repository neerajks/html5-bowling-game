Bowling.WINDOW_WIDTH = window.innerWidth;
Bowling.WINDOW_HEIGHT = window.innerHeight;
Bowling.VIEW_ANGLE = 25;
Bowling.VIEW_NEAR = 100;
Bowling.VIEW_FAR = 5000;
Bowling.SHADOW_CAMERA_FOV = 90;
Bowling.SHADOW_MAP_WIDTH = 1024;
Bowling.SHADOW_MAP_HEIGHT = 1024;

Bowling.Webgl = function(element, camera_position, camera_target_position, 
    main_light_position, main_light_target_position, 
	shadow_light_position, shadow_light_target_position) {
  
  var MAIN_LIGHT_VALUES = {color: 0x2f2f2f, intensity: 0.3};
  var SHADOW_LIGHT_VALUES = {color: 0x000000, intensity: 0.001};
  var ABIENT_LIGHT_VALUES = {color: 0x6f6f6f};
  
  this.render = new THREE.WebGLRenderer({
    antialias: true
  }),
  
  this.render.shadowMapEnabled = true;
  this.render.sortObjects = false;
  this.render.shadowCameraFov = Bowling.SHADOW_CAMERA_FOV;
  this.render.shadowMapWidth = Bowling.SHADOW_MAP_WIDTH;
  this.render.shadowMapHeight = Bowling.SHADOW_MAP_HEIGHT;
  this.render.setSize(Bowling.WINDOW_WIDTH, Bowling.WINDOW_HEIGHT);
  element.appendChild(this.render.domElement);
  
  this.camera = new THREE.Camera(Bowling.VIEW_ANGLE, Bowling.WINDOW_WIDTH/Bowling.WINDOW_HEIGHT, 
      Bowling.VIEW_NEAR, Bowling.VIEW_FAR);
  Bowling.util.setPosition(this.camera, camera_position);
  Bowling.util.setPosition(this.camera.target, camera_target_position);
  
  this.scene = new THREE.Scene();  
    
  var mainlight = new THREE.SpotLight(MAIN_LIGHT_VALUES.color, MAIN_LIGHT_VALUES.intensity);

  Bowling.util.setPosition(mainlight, main_light_position);
  Bowling.util.setPosition(mainlight.target, main_light_target_position);
  this.scene.addLight(mainlight);
  
  var shadowlight = new THREE.SpotLight(SHADOW_LIGHT_VALUES.color, SHADOW_LIGHT_VALUES.intensity);
  Bowling.util.setPosition(shadowlight, shadow_light_position);
  Bowling.util.setPosition(shadowlight.target, shadow_light_target_position);
  shadowlight.castShadow = true;
  this.scene.addLight(shadowlight);

  var abientLight = new THREE.AmbientLight(ABIENT_LIGHT_VALUES.color);
  this.scene.addLight(abientLight);
}

Bowling.Webgl.prototype = {
  doRender : function () {
    this.render.render(this.scene, this.camera);
  },
  
  addObject : function(obj) {
    this.scene.addObject(obj);
  },
  
  getCamera : function() {
    return this.camera;
  },
}
