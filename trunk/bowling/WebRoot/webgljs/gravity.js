Bowling.GRAVITY = [0, -9.8 , 0 , 0];
Bowling.FRICTION = 10;
Bowling.ANIMATIONFRAME = 0.2;

Bowling.GravityEngine = function() {
  this.gravitySystem = jigLib.PhysicsSystem.getInstance();
  this.gravitySystem.setGravity(Bowling.GRAVITY);
  this.gravitySystem.setSolverType('ACCUMULATED'); 
}

Bowling.GravityEngine.prototype = {
  addGround : function(planeNormal, position) {
    var jPlane = new jigLib.JPlane(null, planeNormal);
    jPlane.set_friction(Bowling.FRICTION);
    jPlane.moveTo(position);
    this.gravitySystem.addBody(jPlane);
	return jPlane;
  },
  
  addBox : function(width, height, depth, position, mass, isActive) {
    var jBox = new jigLib.JBox(null, width, depth, height);
    jBox.set_friction(Bowling.FRICTION);
    jBox.set_mass(mass);
	if (isActive) {
	  jBox.setActive();
	}
    jBox.moveTo(position);
    this.gravitySystem.addBody(jBox);
    return jBox;
  },
  addSphere : function(radius, position, mass, isActive) {
    var jBall = new jigLib.JSphere(null, radius);
    jBall.set_friction(Bowling.FRICTION);
    jBall.set_mass(mass);
    jBall.moveTo(position);
    if (isActive) {
	  jBall.setActive();
	}
    this.gravitySystem.addBody(jBall);
	return jBall;
  },
  
  integrate : function() {
    this.gravitySystem.integrate(Bowling.ANIMATIONFRAME);
  },
  
  removeAllBodies : function() {
    this.gravitySystem.removeAllBodies();
  }
}
