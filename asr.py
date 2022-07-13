import speech_recognition as spr

def transcribe(file, language):
    recognizer = spr.Recognizer()
    audioFile = spr.AudioFile(file)
    with audioFile as source:
        audio = recognizer.record(source)
        try:
            transcript = recognizer.recognize_google(audio, language=language)
            return transcript
        except spr.UnknownValueError:
            return "Could not understand the audio."
        except spr.RequestError as e:
            return f"Service failed: {e}"


if __name__ == '__main__':
    LANG = {1: 'en-IN', 2: 'hi-IN', 3: 'mr-IN'}
    r = spr.Recognizer()
    n = int(
        input("Select the language to recognize:\n1. English\n2. Hindi\n3. Marathi\n"))

    print('#' * 80)
    with spr.Microphone(sample_rate=44100, chunk_size=1024) as source:
        print(f"Please speak into the microphone. (Recognizing {LANG[n]})")
        audio = r.listen(source, timeout=5.0, phrase_time_limit=10.0)
    print('#' * 80)
    print("Transcribing...")
    try:
        res = r.recognize_google(audio, language=LANG[n])
        print("Google Speech Recognized: ", res)
    except spr.UnknownValueError:
        print("Google Speech Recognition could not understand the audio.")
    except spr.RequestError as e:
        print(
            "Could not request results from Google Speech Recognition service; {0}".format(e))
