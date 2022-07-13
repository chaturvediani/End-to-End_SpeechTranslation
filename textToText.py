from googletrans import Translator
from gtts import gTTS
import os
from datetime import datetime

def translate(text,from_lang,to_lang):
    translator = Translator()
    text_to_translate = translator.translate(text, src=from_lang, dest=to_lang)
    text = text_to_translate.__dict__()["text"]
    return text 

def textToSpeech(text, to_lang):
    dt = str(datetime.now()).split(".")[0].replace(" ", "-").replace(":", "-")
    filepath = f"/static/audios/{dt}.mp3"
    speak = gTTS(text=text, lang=to_lang, slow=False)
    print(filepath)
    speak.save(f".{filepath}")
    return filepath
    # os.system("start captured_voice.mp3")
