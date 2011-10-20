function runCmd() {
	var sound = new Sound();
	sound.load('audio/bowling.ogg', function() {
		sound.play();
	});
}

function Sound() {
  var MIX_TO_MONO = false;
  var NUM_SAMPLES = 2048;

  var self_ = this;
  var context_ = new (window.AudioContext || window.webkitAudioContext)();
  var source_ = null;
  var jsProcessor_ = null;
  var analyser_ = null;
  var viewTimeDomain_ = false;

  var processAudio_ = function(e) {

    // Get left channel input. No need for output arrays. They're hooked up
    // directly to the destination, and we're not doing any processing.
    //var inputArrayL = e.inputBuffer.getChannelData(0);

    var freqByteData = new Uint8Array(analyser_.frequencyBinCount);

    if (viewTimeDomain_) {
      analyser_.getByteTimeDomainData(freqByteData);
    } else {
      analyser_.getByteFrequencyData(freqByteData);
      //analyser_.fftSize = 2048;
    }

  };

  

  this.initAudio = function(arrayBuffer) {
    if (source_) {
      runCmd('stop');
    }

    source_ = context_.createBufferSource();
    //source_.looping = true;

    // Use async decoder if it is available.
    if (context_.decodeAudioData) {
      context_.decodeAudioData(arrayBuffer, function(buffer) {
        source_.buffer = buffer;
      }, function(e) {
        console.log(e);
      });
    } else {
      source_.buffer = context_.createBuffer(arrayBuffer, MIX_TO_MONO /*mixToMono*/);//给定一个初始化值为0的缓冲区
    }

    // This AudioNode will do the amplitude modulation effect directly in JavaScript
    jsProcessor_ = context_.createJavaScriptNode(NUM_SAMPLES /*bufferSize*/, 1 /*num inputs*/, 1 /*num outputs*/);
    jsProcessor_.onaudioprocess = processAudio_;

    analyser_ = context_.createAnalyser();//提供一个实时的频率和时域分析的节点
  //  analyser_.smoothingTimeConstant = document.getElementById('smoothing').valueAsNumber;
	source_.connect(context_.destination);

  };

  this.load = function(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function(e) {
      self_.initAudio(request.response);
      callback();
    };
    request.send();
  };

  this.play = function() {
    if (!source_) {
      sound.load('audio/bowling.ogg');
    } else {
    
      source_.connect(context_.destination);
      source_.connect(analyser_);

      analyser_.connect(jsProcessor_);
      jsProcessor_.connect(context_.destination);
       
	  analyser_.smoothingTimeConstant = 0.8;
	  source_.playbackRate.value =1;
    	
    	source_.noteOn(0);
    }
  };

  this.stop = function(e) {
    source_.noteOff(0);
    source_.disconnect(0);
    jsProcessor_.disconnect(0);
    analyser_.disconnect(0);

  };
}

