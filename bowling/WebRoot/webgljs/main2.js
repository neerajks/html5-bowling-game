var Bowling = {
  webglCamera : null,
  webglRender : null,
  webglScene : null,
  cameraPos : [40, 40, 2300],
  cameraTargetPos : [40, -90, -1600],
  lightPos : [100, 100, 1000],
  animationFrame : 50,
  sceneMaterials : null,
  isLoadedBallImg : false,
  isLoadedTrackImg : false,
  bowlingSphere : null,
  bowlingBottleLink : new Array(),
  //isLoadedBottleLink : new Array(),
  gravitySystem: null,
  sphereRadius : 20,
  planePos : [0, -80, 0, 0],
  //spherePos : [-80, 0, 1500],
  spherePos : [40, -40, 1600],
  bottlePos : [-80, -34, 800],
  bottleScale : 1.0,
  bottleCount : 0,
  trackWidth : 300,
  trackDepth : 2000,
  boxHeight : 20,
  jBall : null,
  jBottleLink: new Array(),
  jBox : null,
  friction : 10,
  ballVelocity: [0, 0, -100],
  gravityThen :  new Date().getTime(),
  gravityNow : new Date().getTime(),
  gravity : [0, -9.8 , 0 , 0],
  planeNormal : [0, 1, 0, 0],
  ballMass: 50,
}

Bowling.util = {

}

Bowling.util.setPosition = function(obj, pos) {
  obj.position.set(pos[0], pos[1], pos[2]);
}

Bowling.init = function() {
  Bowling.setupWebgl();
  Bowling.jBoxPos = [40, Bowling.planePos[1] + Bowling.boxHeight/2, 
      800]; 
  //Bowling.jBoxPos = [-50, -40, 1500];
  console.log("jboxpos:" + Bowling.jBoxPos);
  Bowling.setupGravity();
  Bowling.loadTrack();
  Bowling.loadAllBottles();
  Bowling.loadBall();  
  Bowling.loadScene(); 
}

Bowling.setupWebgl = function() {
  var winWidth = window.innerWidth;
  var winHeight = window.innerHeight;
  var viewAngle = 25;
  var near = 100;
  var far = 5000;  
  var lightColor = 0xffffff;
  var lightIntensity = 1.5;
  
  // render
  Bowling.webglRender = new THREE.WebGLRenderer({
    antialias: true
  }),
  Bowling.webglRender.shadowMapEnabled = true;
  Bowling.webglRender.sortObjects = false;
  Bowling.webglRender.shadowCameraFov = 90;
  Bowling.webglRender.shadowMapWidth = 1024;;
  Bowling.webglRender.shadowMapHeight = 1024;
  
  // camera
  Bowling.webglCamera = new THREE.Camera(viewAngle, winWidth/winHeight, near, far);
  Bowling.util.setPosition(Bowling.webglCamera, Bowling.cameraPos);
  Bowling.util.setPosition(Bowling.webglCamera.target, Bowling.cameraTargetPos);
  
  // initialize scene
  Bowling.webglScene = new THREE.Scene();  
  Bowling.webglRender.setSize(winWidth, winHeight);
  document.body.appendChild(Bowling.webglRender.domElement);
  
  //light
  /*var directionLight = new THREE.DirectionalLight(lightColor, 1.0);
  Bowling.util.setPosition(directionLight, [597.455, 2813.929, 2687.598]);
  directionLight.castShadow = true;
  Bowling.webglScene.addLight(directionLight);*/
  
  var spotlight = new THREE.SpotLight(0x2f2f2f, 0.1);

  Bowling.util.setPosition(spotlight, [597.455, 4813.929, 2687.598]);
  Bowling.util.setPosition(spotlight.target, [-80, -34, 800]);
  //spotlight.ambient = 0;
  //Bowling.util.setPosition(spotlight, [59.455, 281.929, 268.598]);
  //Bowling.util.setPosition(spotlight, [1580, 4710, 2290]);
  spotlight.castShadow = false;
  Bowling.webglScene.addLight(spotlight);
  
  var spotlight2 = new THREE.SpotLight(0x000000, 0.001);
  Bowling.util.setPosition(spotlight2, [500, 100, 1000]);
  Bowling.util.setPosition(spotlight2.target, [-80, -34, 800]);
  //Bowling.util.setPosition(spotlight, [59.455, 281.929, 268.598]);
  //Bowling.util.setPosition(spotlight, [1580, 4710, 2290]);
  spotlight2.castShadow = true;
  Bowling.webglScene.addLight(spotlight2);

  var abientLight = new THREE.AmbientLight(0x6f6f6f);
  Bowling.webglScene.addLight(abientLight);
  /*var dirlight = new THREE.DirectionalLight(lightColor, 0.75);
  dirlight.castShadow = true;
  Bowling.util.setPosition(dirlight, Bowling.lightPos);
  Bowling.webglScene.addLight(dirlight);*/
}

Bowling.setupGravity = function() { 
  Bowling.gravitySystem = jigLib.PhysicsSystem.getInstance();
  Bowling.gravitySystem.setGravity(Bowling.gravity);
  Bowling.gravitySystem.setSolverType('ACCUMULATED');
  
  var jGround = new jigLib.JPlane(null, Bowling.planeNormal);
  jGround.set_friction(Bowling.friction);
  jGround.moveTo(Bowling.planePos);
  Bowling.gravitySystem.addBody(jGround);
  
  Bowling.jBox = new jigLib.JBox(null, Bowling.trackWidth, Bowling.trackDepth, Bowling.boxHeight);
  Bowling.jBox.set_friction(Bowling.friction);
  Bowling.jBox.set_mass(1000);
  Bowling.jBox.setActive();
  Bowling.jBox.moveTo(Bowling.jBoxPos);
  Bowling.gravitySystem.addBody(Bowling.jBox);
  
  Bowling.jBall = new jigLib.JSphere(null, Bowling.sphereRadius);
  Bowling.jBall.set_friction(Bowling.friction);
  Bowling.jBall.set_mass(Bowling.ballMass);
  Bowling.jBall.moveTo(Bowling.spherePos);
  Bowling.jBall.setActive();
  Bowling.gravitySystem.addBody(Bowling.jBall);
}

Bowling.loadTrack = function() {

  var url = "images/px.png";
  var urls = [
	url, url,
	url, url,
	url, url
  ];

  var textureCube = THREE.ImageUtils.loadTextureCube( urls );
  var texture = THREE.ImageUtils.loadTexture('images/wood.jpg', null, function() {Bowling.isLoadedTrackImg = true;});
  var track = new THREE.Mesh( new THREE.PlaneGeometry(Bowling.trackWidth, Bowling.trackDepth), 
    //new THREE.MeshBasicMaterial( { map: texture } ) );
	new THREE.MeshPhongMaterial({color: 0xffffff, envMap: textureCube,  map: texture,
	reflectivity:0.2 ,combine: 1} ));
  track.rotation.x = - 90 * ( Math.PI / 180 );
  var pos = Bowling.jBox.get_currentState().position.slice();
  //pos[1] += Bowling.boxHeight/2;
  pos[1] += Bowling.boxHeight/2;
  console.log("track:" + pos);
  Bowling.util.setPosition(track, pos);
  track.receiveShadow = true;
  Bowling.webglScene.addObject(track);
}

Bowling.loadBall = function() {
  var bowlingImg = 'images/bowling.png';
  var segments = 50;  
  var url = "images/tiankong.jpg";
  var urls = [
	url, url,
	url, url,
	url, url
  ];

  var textureCube = THREE.ImageUtils.loadTextureCube( urls );
  
  var sphereTexture = THREE.ImageUtils.loadTexture(bowlingImg, null, 
    function() {
	  Bowling.isLoadedBallImg = true;
	});
    
  Bowling.bowlingSphere = new THREE.Mesh(
    new THREE.SphereGeometry(Bowling.sphereRadius, segments, segments), 
	//new THREE.CubeGeometry(Bowling.sphereRadius*2,Bowling.sphereRadius*2,Bowling.sphereRadius*2),
    //new THREE.MeshPhongMaterial({ map: sphereTexture } ) );
	new THREE.MeshPhongMaterial({color: 0xffffff, envMap: textureCube,  map: sphereTexture, 
	  reflectivity:0.1 ,combine:1} ) );
//	new THREE.MeshNormalMaterial({color: 0xffffff, envMap: textureCube,  map: sphereTexture } ) );
  
  Bowling.util.setPosition(Bowling.bowlingSphere, Bowling.spherePos);
  console.log("spherepos:" + Bowling.spherePos);
  Bowling.bowlingSphere.depthTest = false;
  Bowling.bowlingSphere.matrixAutoUpdate = false;
  Bowling.bowlingSphere.castShadow = true;
  //Bowling.bowlingSphere.receiveShadow = true;
  Bowling.webglScene.addObject(Bowling.bowlingSphere); 
}

Bowling.loadGravityBottle = function (geometry, targetPos, width, height, depth) {
  var mass = 15;
  var jBottle = new jigLib.JBox(null, width, depth, height);
  jBottle.set_friction(Bowling.friction);
  jBottle.set_mass(mass);
  jBottle.moveTo(targetPos);
  jBottle.setActive();
  Bowling.gravitySystem.addBody(jBottle);
  return jBottle;
}

Bowling.updateGravityMatrix = function (target, pos, dir, sca) {
  if (sca == undefined || sca == null) {
    sca = 1.0;
  } 
  //var targetPos = Bowling.moveToOrigin(target.geometry, pos, sca);

  //var position = new THREE.Matrix4().setTranslation(targetPos[0], targetPos[1], targetPos[2]);
  var position = new THREE.Matrix4().setTranslation(pos[0], pos[1], pos[2]);
  var scale = new THREE.Matrix4().setScale(sca, sca, sca);
  position.multiplySelf(scale);
  
  if (dir != undefined && dir != null) {
    var rotate = new THREE.Matrix4(dir[0], dir[1], dir[2], dir[3], dir[4], dir[5], dir[6], dir[7], dir[8], 
        dir[9], dir[10], dir[11], dir[12], dir[13], dir[14], dir[15]);
	position.multiplySelf(rotate);
  }
  target.matrix = position;
  target.update(false, true, Bowling.webglCamera);
}

Bowling.createOneBottle = function(position, count) {
  var bottleLoader = new THREE.JSONLoader( true );
  var bottleModel = 'models/bottle.js';

  bottleLoader.load({
    model: bottleModel,
    callback: function(geometry) {
	  var texture = THREE.ImageUtils.loadTexture('images/bottlepic512.png');
	  var bowlingBottle = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial ({map: texture, 
	       ambient: 0x6f6f6f, shininess: 0, specular: 0x0})); 
      Bowling.util.setPosition(bowlingBottle, position);
	  bowlingBottle.matrixAutoUpdate = false;	
      //bowlingBottle.receiveShadow = true;
	  bowlingBottle.castShadow = true;
      Bowling.webglScene.addObject(bowlingBottle);	  	  
	  
	  Bowling.bowlingBottleLink[count] = bowlingBottle;
	  
	  geometry.computeBoundingBox();
	  var boundingBox = geometry.boundingBox;	  
	  var width = boundingBox.x[1] - boundingBox.x[0];
	  var height = boundingBox.y[1] - boundingBox.y[0];
      var depth = boundingBox.z[1] - boundingBox.z[0];	  
	  console.log("bottle size:", width, height, depth);
	  Bowling.jBottleLink[count] = Bowling.loadGravityBottle(bowlingBottle.geometry, position, 
	      width, height, depth);
	  Bowling.bottleCount ++;
	  
	  //Bowling.isLoadedBottleImg = true;
    },
    texture_path: "images"
  });
  
}

Bowling.loadAllBottles = function() {
  var count = 0;
  for (var i = 4; i > 0; i--) {
	for (var j = 0; j < i; j++) {
	  var pos = Bowling.bottlePos.slice();
	  pos[0] += (4 - i) * Bowling.sphereRadius * 2;
	  pos[0] += Bowling.sphereRadius * 4 * j;
	  pos[2] += Bowling.sphereRadius * 2 * (4-i);
	  console.log("ball:" + i + "," + j + ":" + pos)
	  Bowling.createOneBottle(pos, count);
	  count ++;
	}
  }
}

Bowling.loadScene = function() {
  // load scene
  var jsonLoader = new THREE.JSONLoader(true);  
  var jsonModel = "models/scene.js";
  var imgPath = "images";
  var scenePos = [0, 0, 0];
  
  jsonLoader.load({
    model: jsonModel,
    callback:  function(geometry) {	 
      Bowling.sceneMaterials = geometry.materials;
	  for ( var i = 0, len = Bowling.sceneMaterials.length; i < len; i ++ ) {
        var material = Bowling.sceneMaterials[ i ][ 0 ];
        //material.depthTest = false;
		material.transparent = true;
		//material.shading = "Basic";
      }
	  var sceneMesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( )); 
      Bowling.util.setPosition(sceneMesh, scenePos);
  	  geometry.computeBoundingBox();
	  //sceneMesh.scale.x = sceneMesh.scale.y = sceneMesh.scale.z = 100;	  
	  var boundingBox = geometry.boundingBox;	  
	  var width = boundingBox.x[1] - boundingBox.x[0];
	  var height = boundingBox.y[1] - boundingBox.y[0];
      var depth = boundingBox.z[1] - boundingBox.z[0];	  
	  console.log(width, height, depth);
      sceneMesh.overdraw = true;
	  //sceneMesh.scale.x = sceneMesh.scale.y = sceneMesh.scale.z = 100;
      sceneMesh.updateMatrix();
	  //sceneMesh.receiveShadow = true;
      Bowling.webglScene.addObject(sceneMesh);
     },
    texture_path: imgPath,
  }); 
}

Bowling.waitforResourceLoading = function(load_func, callback) {
  var timeSpan = 1000;
  if (load_func() == false) {
    setTimeout(function() {Bowling.waitforResourceLoading(load_func, callback);}, timeSpan);
	
  } else {
	callback();
  }
}
Bowling.finishLoadResource = function(callback) {
  Bowling.waitforResourceLoading( function() {
    if (Bowling.sceneMaterials) {
	  var len = Bowling.sceneMaterials.length;
	  for (var i = 0; i < len; i ++) {
	    if (Bowling.sceneMaterials[i][0]["map"]["needsUpdate"] == false) {
		  return false;
	    }
	  }
	}
	return true;
  }, function() {  
    Bowling.waitforResourceLoading( function() {
      return Bowling.isLoadedBallImg && Bowling.isLoadedTrackImg;
	  //return Bowling.isLoadedTrackImg;
	  //return true;
	}, function() { 
	  Bowling.waitforResourceLoading(
	    function() {
		  //return true;
		    if (Bowling.bottleCount == 10 ) {
			  for (var i = 0; i < Bowling.bottleCount; i++) {
			    //if (Bowling.bowlingBottleLink[i].materials[0][0]["map"]["needsUpdate"] == false) {
				//}
			  }
			  return true;
			}
		  return false;
	    }, callback) 
	  })
	}
  )
}

Bowling.render = function() {
  Bowling.gravitySystem.integrate(Bowling.animationFrame/1000 );//400
  
  //Bowling.webglCamera.position.z -= 3;
  //Bowling.webglCamera.target.position.z -= 3;
  
  Bowling.webglCamera.position.z = 1400;
  Bowling.webglCamera.target.position.z = -2300;
  
  var jBallState = Bowling.jBall.get_currentState();
  //console.log("jBallState:" + jBallState.position);
  
  if (jBallState.position[2] > -2000) {
    Bowling.jBall.setVelocity(Bowling.ballVelocity);
  } else {
    Bowling.jBall.setVelocity([0, 0, 1]);
	jBallState.position[1] -= 3;
  }  
  Bowling.updateGravityMatrix(Bowling.bowlingSphere, jBallState.position, jBallState.get_orientation().glmatrix);
  
  for (var i = 0 ; i < Bowling.jBottleLink.length ; i ++) {
    var jBottleState = Bowling.jBottleLink[i].get_currentState();  
    Bowling.updateGravityMatrix(Bowling.bowlingBottleLink[i], jBottleState.position, jBottleState.get_orientation().glmatrix, Bowling.bottleScale);
  }
  Bowling.webglRender.render(Bowling.webglScene, Bowling.webglCamera);
  
  setTimeout(Bowling.render, Bowling.animationFrame);
}

Bowling.init();
Bowling.finishLoadResource(function() {
  //Bowling.webglRender.render(Bowling.webglScene, Bowling.webglCamera);
  Bowling.render();
});