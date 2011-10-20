Bowling.Object = function () {
}

Bowling.Object.prototype = {  
  updateMatrix : function(camera) {
    if (this.gravityObj) {
	  if (this.velocity) {
	    this.gravityObj.setVelocity(this.velocity);
      };
	  var state = this.gravityObj.get_currentState();
	  this.current_position = state.position;
	  this.meshObj.matrix = Bowling.util.GetMatrix(this.current_position, 
	      state.get_orientation().glmatrix);
	  this.meshObj.update(false, true, camera);
	}
  },
}