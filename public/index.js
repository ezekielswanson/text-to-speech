//require('dotenv').config()


//Selecting inputs
const textInput = document.querySelector('textarea');
const languageSelect = document.querySelector('#languageSelect');
const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');



const speechSynth = window.speechSynthesis;

//need to load the voices in the array and access the voices in the event listener
let voices;


//languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' }
]


languages.forEach((language) => {
    const langOptions = document.createElement("option");
    langOptions.value = language.code;
    langOptions.textContent = language.name;
    languageSelect.appendChild(langOptions);

    console.log(langOptions);
})

//Get voices function
function loadVoices() {

    //and assing the global value returns a list of voices from the system
    voices = speechSynth.getVoices();

    voices.forEach((voice, i) => {
        //console.log(voice);
        const options = document.createElement("option");
        options.textContent = `${voice.name} (${voice.lang})`;
        options.value = i;
        options.setAttribute("data-lang", voice.lang)
        voiceSelect.appendChild(options);
    });

    console.log(voices)
        
}






 // in Google Chrome the voices are not ready on page load
if ("onvoiceschanged" in speechSynth) {
    speechSynth.onvoiceschanged = loadVoices;
  } else {
    loadVoices();
  }








//Connect w/ serverless function
/*

Purpose
    -take the text and langauge and send it to the serverelss function
Input
    -text, language
Output
 -transalted text 
*/



async function translateText(text, targetLang) {
    const config = {
        method: 'POST',
        headers: {
            accept: "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            text,
            target: targetLang
        })
    };

    try {
        const response = await fetch('/api/translate', config);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        return data.data.translations[0].translatedText;
    } 
    catch (error) {
        console.error('Translation Error:', error);
        alert('Failed to translate text');
        return text;
    }
}

/*

Purpose
    -
Input
Output

*/



function speakText(text, voiceIndex) {
    const utterance = new SpeechSynthesisUtterance(text);
    //console.log(utterance)
   //console.log(voices);
    utterance.voice = voices[voiceIndex];
    speechSynth.speak(utterance);



}



//could potentially pass in voices, pitch, etc, as a param here to use voice

playButton.addEventListener('click', async(e) => {
    e.preventDefault();
    console.log('btn clicked');

    //define text, targetLang
    const text = textInput.value.trim();
    const targetLang = languageSelect.value;
    const selectedVoice = voiceSelect.value;  // Get the voice value from select element

    try {
        const translatedText = await translateText(text, targetLang);
        speakText(translatedText, selectedVoice);  // Pass the values to speakText
    }
    catch (error) {
        console.error('Error during processing: ', error);
        alert('An error occurred');
    }
})




