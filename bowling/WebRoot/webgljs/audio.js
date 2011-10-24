Bowling.START_BACKGROUND_MUSIC = "start_backgroup_music";
Bowling.Ball_BACKGROUND_MUSIC="ball_bg_music";
Bowling.ENDING_MUSIC="ending_music";
Bowling.STIKE_MUSIC="stike_music";
Bowling.KICK_MUSIC = "kick_music";
Bowling.NO_KICK_MUSIC = "nohit";
Bowling.ROLL_MUSIC = "bowlingroll";

Bowling.Audio = function(root_element) {
  this.music_db = { };
  this.music_db[Bowling.START_BACKGROUND_MUSIC] = ["audio/start_music_loop.mp3", 0.1];  
  this.music_db[Bowling.Ball_BACKGROUND_MUSIC] = ["audio/bg_music_loop.mp3", 0.1];
  this.music_db[Bowling.ENDING_MUSIC] = ["audio/ending.mp3", 1.0];
  this.music_db[Bowling.STIKE_MUSIC] = ["audio/stike.mp3", 1.0];
  this.music_db[Bowling.KICK_MUSIC] = ["audio/bowlinghit.ogg", 1.0];  
  this.music_db[Bowling.NO_KICK_MUSIC] = ["audio/nohit.mp3", 1.0];  
  this.music_db[Bowling.ROLL_MUSIC] = ["audio/bowlingroll.ogg", 1.0];  
  
  this.root_element = root_element;
  for ( var key in this.music_db){
    var value = this.music_db[key];
	this.appendAudioTag(key, value[0], value[1]);
  }
}


Bowling.Audio.prototype = {

  appendAudioTag : function(id, src, volume) {
    var audio = document.createElement("audio");
    this.root_element.appendChild(audio);
	audio.preload = true;
	audio.src = src;
	audio.id = id;
	audio.style = "display:none";
	if (volume) {
	  audio.volume = volume;
	}
  },
  
  play : function(music_name, isLoop) {
    var audio = document.getElementById(music_name);
	if (isLoop) {
	  audio.loop = true;
	}
    audio.play();
  },
  
  stop: function(music_name){
	  var audio = document.getElementById(music_name);
	  audio.pause();
  },
  /*playBackground : function(audio_tag_id) {
    var audio = document.getElementById(audio_tag_id);
	audio.volume = 0.1;
	audio.play();
  },
  
  playAction : function(audio_tag_id, music_type) {
    var audio = document.getElementById(audio_tag_id);
	//var current_src = audio.src;
	//var target_src = this.music_db[music_type];
	audio.play();
	if (current_src.indexOf(target_src) == -1) {
	  audio.pause();
	  audio.src = this.music_db[music_type];
	  audio.play();
	}
  },*/

}