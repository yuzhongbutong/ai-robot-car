export default class AudioRecorder {
  constructor(config = {sampleBits: 16, sampleRate: 16000}) {
    this.config = config;
  }

  _openMicrophone(startRecording) {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
          this.stream = stream;
          this._startRecording();
        });
    } else {
      this._throwError('Your browser does not support recording.');
    }
  }

  _closeMicrophone() {
    if (this.stream) {
      this.stream.getAudioTracks().forEach(function (track) {
        track.stop();
      });
      this.stream = null;
    }
  }

  _startRecording() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new window.AudioContext();
    const audioInput = context.createMediaStreamSource(this.stream);
    const createScript = context.createScriptProcessor || context.createJavaScriptNode;
    this.recorder = createScript.apply(context, [4096, 1, 1]);
    audioInput.connect(this.recorder);
    this.recorder.connect(context.destination);
    this.audioData = {
      size: 0,
      buffer: [],
      inputSampleRate: context.sampleRate,
      inputSampleBits: 16,
      outputSampleRate: this.config.sampleRate,
      outputSampleBits: this.config.sampleBits,
    };
    this.recorder.onaudioprocess = this._audioProcess;
  }

  _audioProcess = (e) => {
    const data = e.inputBuffer.getChannelData(0);
    this.audioData.buffer.push(new Float32Array(data));
    this.audioData.size += data.length;
  }

  _compress() {
    const data = new Float32Array(this.audioData.size);
    let offset = 0;
    this.audioData.buffer.forEach((item) => {
      data.set(item, offset);
      offset += item.length;
    });
    const compression = parseInt(this.audioData.inputSampleRate / this.audioData.outputSampleRate);
    const length = data.length / compression;
    const result = new Float32Array(length);
    let index = 0, j = 0;
    while (index < length) {
      result[index] = data[j];
      j += compression;
      index++;
    }
    return result;
  }

  _encodeWAV() {
    const sampleRate = Math.min(this.audioData.inputSampleRate, this.audioData.outputSampleRate);
    const sampleBits = Math.min(this.audioData.inputSampleBits, this.audioData.outputSampleBits);
    const bytes = this._compress();
    const dataLength = bytes.length * (sampleBits / 8);
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);
    const channelCount = 1;
    let offset = 0;
    const writeString = function (str) {
      for (var i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString('RIFF');
    offset += 4;
    view.setUint32(offset, 36 + dataLength, true);
    offset += 4;
    writeString('WAVE');
    offset += 4;
    writeString('fmt ');
    offset += 4;
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, channelCount, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
    offset += 4;
    view.setUint16(offset, channelCount * (sampleBits / 8), true);
    offset += 2;
    view.setUint16(offset, sampleBits, true);
    offset += 2;
    writeString('data');
    offset += 4;
    view.setUint32(offset, dataLength, true);
    offset += 4;

    if (sampleBits === 8) {
      for (let i = 0; i < bytes.length; i++, offset++) {
        const s = Math.max(-1, Math.min(1, bytes[i]));
        let val = s < 0 ? s * 0x8000 : s * 0x7FFF;
        val = parseInt(255 / (65535 / (val + 32768)));
        view.setInt8(offset, val, true);
      }
    } else {
      for (let i = 0; i < bytes.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, bytes[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    }

    return new Blob([view], {type: 'audio/wav'});
  }

  start() {
    this.isRecording = true;
    if (this.stream) {
      this._startRecording();
    } else {
      this._openMicrophone();
    }
  }

  stop(callback, stopMic = true) {
    if (this.isRecording) {
      const stopTimer = setInterval(() => {
        if (this.stream) {
          this.isRecording = false;
          this.recorder.context.close();
          this.recorder.disconnect();
          if (stopMic) {
            this._closeMicrophone();
          }
          if (callback) {
            callback(this._encodeWAV());
          }
        }
        clearInterval(stopTimer);
      }, 200);
    }
  }

  _throwError(errorMsg) {
    alert(errorMsg);
  }
}