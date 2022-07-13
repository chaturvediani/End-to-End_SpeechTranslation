from flask import Flask, render_template, request, redirect
from asr import transcribe
import os
from textToText import translate, textToSpeech
from moviepy.editor import *

app = Flask(__name__)


@app.route('/', methods=["GET"])
def index():
    return render_template("index.html")


@app.route('/app', methods=["GET"])
def webapp():
    return render_template("app.html")


@app.route('/audio', methods=["POST"])
def audio():
    try:
        audio = request.files["recording"]
        fromLanguage = request.form["fromLanguage"]
        toLanguage = request.form["toLanguage"]
        audio.save(audio.filename)
        # en-IN, hi-IN, mr-IN
        transcript = transcribe(audio.filename, fromLanguage)
        if os.path.exists(audio.filename):
            os.remove(audio.filename)
        translated_text = translate(
            transcript, fromLanguage.split('-')[0], toLanguage.split('-')[0])
        file_path = textToSpeech(translated_text, toLanguage.split('-')[0])
        print(transcript, translated_text, file_path)
        return {"transcript": transcript, "translated_text": translated_text, "file_path": file_path}
    except Exception as e:
        print(e)
        return {"error": "Something wrong."}


@app.route('/video', methods=["POST"])
def video():
    try:
        f = request.files['videofile']
        fromLanguage = request.form["fromLanguage"]
        toLanguage = request.form["toLanguage"]
        filelocation = os.path.join("/static/videos/", f.filename)
        audiolocation = os.path.join("/static/audios/", "audio.wav")
        f.save(f".{filelocation}")
        audio = VideoFileClip(f".{filelocation}").audio
        audio.write_audiofile(f".{audiolocation}")
        transcript = transcribe(f".{audiolocation}", fromLanguage)
        if os.path.exists(f".{audiolocation}"):
            os.remove(f".{audiolocation}")
        translated_text = translate(
            transcript, fromLanguage.split('-')[0], toLanguage.split('-')[0])
        file_path = textToSpeech(translated_text, toLanguage.split('-')[0])
        print(transcript, translated_text)
        return {"transcript": transcript, "translated_text": translated_text, "video": filelocation, "file_path": file_path}
    except Exception as e:
        print(e)
        return {"error": "Something wrong."}


if __name__ == '__main__':
    app.run(use_reloader=True, debug=True)
