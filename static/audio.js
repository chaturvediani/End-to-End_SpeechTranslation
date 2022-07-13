const recordButton = document.getElementById("audio-record");
const uploadButton = document.getElementById("upload-button");
const instructionText = document.getElementById("instruction-text");
const outputText = document.getElementById("output-text");
const translatedText = document.getElementById("translated-text");
const videoText = document.getElementById("video-text");
const videoTranslatedText = document.getElementById("video-translated-text");
const fromLanguageSelect = document.getElementById("from-language-select");
const toLanguageSelect = document.getElementById("to-language-select");
const fromLanguageSelectVideo = document.getElementById(
  "from-language-select-video"
);
const toLanguageSelectVideo = document.getElementById(
  "to-language-select-video"
);
const audioPlayer = document.getElementById("audio-player");
const audioPlayerVideo = document.getElementById("audio-player-video");
const videoPlayer = document.getElementById("video-player");
const videoForm = document.getElementById("video-form");
const audioLoader = document.getElementById("audio-loader");
const videoLoader = document.getElementById("video-loader");

const fromLanguage = { 1: "en-IN", 2: "hi-IN", 3: "mr-IN" };
const toLanguage = { 1: "mr-IN", 2: "en-IN", 3: "hi-IN" };
const toLanguageVideo = { 1: "mr-IN", 2: "en-IN", 3: "hi-IN" };
const fromLanguageVideo = { 1: "en-IN", 2: "hi-IN", 3: "mr-IN" };
let fromLanguageKey = 1;
let toLanguageKey = 1;
let toLanguageKeyVideo = 1;
let fromLanguageKeyVideo = 1;
fromLanguageSelect.innerText = `recording in: ${fromLanguage[fromLanguageKey]}`;
toLanguageSelect.innerText = `translating in: ${toLanguage[toLanguageKey]}`;
toLanguageSelectVideo.innerText = `translating in: ${toLanguageVideo[toLanguageKeyVideo]}`;
fromLanguageSelectVideo.innerText = `recording in: ${fromLanguageVideo[fromLanguageKeyVideo]}`;
const constraints = { audio: true, video: false };
let gumStream;
let audioCtx;
let source;
let rec;

const submit = async (blob) => {
  audioLoader.style.visibility = "visible";
  const formData = new FormData();
  formData.set("recording", blob, "recording.wav");
  formData.set("fromLanguage", fromLanguage[fromLanguageKey]);
  formData.set("toLanguage", toLanguage[toLanguageKey]);
  const response = await fetch("http://127.0.0.1:5000/audio", {
    method: "POST",
    body: formData,
  });
  let result = await response.json();
  outputText.innerText = `Transcript: ${result["transcript"]}`;
  translatedText.innerText = `Translation: ${result["translated_text"]}`;
  audioPlayer.src = result["file_path"];
  audioPlayer.load();
  audioPlayer.play();
  audioLoader.style.visibility = "hidden";
  outputText.style.visibility = "visible";
  translatedText.style.visibility = "visible";
  audioPlayer.style.visibility = "visible";
};

recordButton.addEventListener("click", () => {
  if (recordButton.checked === true) {
    if (navigator.mediaDevices.getUserMedia) {
      instructionText.innerText = '"click to stop recording"';
      outputText.style.visibility = "hidden";
      translatedText.style.visibility = "hidden";
      audioPlayer.style.visibility = "hidden";
      audioPlayer.pause();
      navigator.mediaDevices.getUserMedia(constraints).then(
        (stream) => {
          gumStream = stream;
          audioCtx = new AudioContext();
          source = audioCtx.createMediaStreamSource(stream);
          rec = new Recorder(source, {
            numChannels: 1,
          });
          rec.record();
        },
        (err) => {
          console.log("The following error occured: " + err);
        }
      );
    } else {
      console.error("getUserMedia not supported on your browser!");
    }
  } else if (recordButton.checked === false) {
    instructionText.innerText = '"click to start recording"';
    rec.stop();
    gumStream.getAudioTracks()[0].stop();
    rec.exportWAV(submit);
  }
});

fromLanguageSelect.addEventListener("click", (e) => {
  fromLanguageKey = (fromLanguageKey % 3) + 1;
  fromLanguageSelect.innerText = `recording in: ${fromLanguage[fromLanguageKey]}`;
  outputText.style.visibility = "hidden";
  translatedText.style.visibility = "hidden";
  audioPlayer.style.visibility = "hidden";
  audioPlayer.pause();
});

toLanguageSelect.addEventListener("click", (e) => {
  toLanguageKey = (toLanguageKey % 3) + 1;
  toLanguageSelect.innerText = `translating in: ${toLanguage[toLanguageKey]}`;
  outputText.style.visibility = "hidden";
  translatedText.style.visibility = "hidden";
  audioPlayer.style.visibility = "hidden";
  audioPlayer.pause();
});

uploadButton.addEventListener("click", async () => {
  videoLoader.style.visibility = "visible";
  videoText.style.visibility = "hidden";
  videoTranslatedText.style.visibility = "hidden";
  videoPlayer.style.visibility = "hidden";
  audioPlayerVideo.style.visibility = "hidden";
  const formData = new FormData(videoForm);
  formData.set("fromLanguage", fromLanguageVideo[fromLanguageKeyVideo]);
  formData.set("toLanguage", toLanguageVideo[toLanguageKeyVideo]);
  const response = await fetch("http://127.0.0.1:5000/video", {
    method: "POST",
    body: formData,
  });
  let result = await response.json();
  videoText.innerText = `Transcript: ${result["transcript"]}`;
  videoTranslatedText.innerText = `Translation: ${result["translated_text"]}`;
  videoPlayer.src = result["video"];
  audioPlayerVideo.src = result["file_path"];
  videoPlayer.load();
  videoPlayer.play();
  audioPlayerVideo.load();
  audioPlayerVideo.play();
  videoLoader.style.visibility = "hidden";
  videoText.style.visibility = "visible";
  videoPlayer.style.visibility = "visible";
  videoTranslatedText.style.visibility = "visible";
  audioPlayerVideo.style.visibility = "hidden";
});

fromLanguageSelectVideo.addEventListener("click", (e) => {
  fromLanguageKeyVideo = (fromLanguageKeyVideo % 3) + 1;
  fromLanguageSelectVideo.innerText = `recording in: ${fromLanguageVideo[fromLanguageKeyVideo]}`;
  videoText.style.visibility = "hidden";
  videoTranslatedText.style.visibility = "hidden";
  videoPlayer.style.visibility = "hidden";
  audioPlayerVideo.style.visibility = "hidden";
  videoPlayer.pause();
  audioPlayerVideo.pause();
});

toLanguageSelectVideo.addEventListener("click", (e) => {
  toLanguageKeyVideo = (toLanguageKeyVideo % 3) + 1;
  toLanguageSelectVideo.innerText = `translating in: ${toLanguageVideo[toLanguageKeyVideo]}`;
  videoText.style.visibility = "hidden";
  videoTranslatedText.style.visibility = "hidden";
  videoPlayer.style.visibility = "hidden";
  audioPlayerVideo.style.visibility = "hidden";

  videoPlayer.pause();
  audioPlayerVideo.pause();
});
