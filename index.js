var fs = require('fs');
var portAudio = require('naudiodon');

var ai = new portAudio.AudioIO({
  inOptions: {
    channelCount:2,
    sampleFormat: portAudio.SampleFormat16Bit,
    sampleRate: 44100,
    deviceId: 2,
    closeOnError: false,
  }
});
ai.pipe(out);
ai.start();
