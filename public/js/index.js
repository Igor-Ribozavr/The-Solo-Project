const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const playButton = document.querySelector('#play');
const input = document.querySelector('.input1');
const buttonTranscript = document.querySelector('.btn1');
const form = document.querySelector('.myForm');
const audioPlay = document.querySelector('.music');

const contentTranscription = document.querySelector('.transcription');
const contentRegion = document.querySelector('.region');

let myPar = [];
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = function () {
  console.log('voice is activated');
};

recognition.onresult = function (event) {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  content.textContent = transcript;
};

btn.addEventListener('click', () => {
  recognition.start();
});

async function test() {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        word: e.target.word.value,
      }),
    });
    const res = await response.json();

    if (res.entries.length == 0) {
      alert('THIS WORD DOSE NOT EXIST !!!');
    } else {
      let arrayPr = res.entries[0].pronunciations;

      let transcription;

      function findTranscription(arr) {
        arr.forEach(function (el) {
          if (el.audio) {
            el.transcriptions.forEach(function (el) {
              transcription = el.transcription;
            });
          }
        });
      }
      findTranscription(arrayPr);

      contentTranscription.textContent = transcription;

      let region;

      function findOrigin(arr) {
        arr.forEach(function (el) {
          if (el.audio) {
            region = el.context.regions.toString();
          }
        });
      }
      findOrigin(arrayPr);
      contentRegion.textContent = region;

      let pathAudio;
      function findAudio(arr) {
        arr.forEach(function (el) {
          if (el.audio) {
            pathAudio = el.audio.url;
          }
        });
      }
      findAudio(arrayPr);

      playButton.addEventListener('click', () => {
        audioPlay.src = pathAudio;
        audioPlay.play();
      });
    }
  });
}

test();
