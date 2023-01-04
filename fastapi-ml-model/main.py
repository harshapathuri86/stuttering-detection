from fastapi import FastAPI, UploadFile, HTTPException, Response, File, Form
from typing import List
import json
from model.main_calling_theta2 import get_output
import librosa
app = FastAPI(
    title="Stuttering detection API",
    description="Detect stuttering in audio files", version="0.1.0",
)


@app.get("/")
def home():
    return "Hello World"


@app.post("/")
# only allow wav format file to be uploaded
async def stutter(audios: List[UploadFile] = File(...), bounds:str = Form()):
    for audio in audios:
        if audio.content_type not in ["audio/wave", "audio/wav"]:
            raise HTTPException(400, detail="Invalid document type of file {}".format(audio.filename))
    try:
        bounds = [int(b) for b in bounds.split(',')]
        result = []
        n = len(audios)
        for i in range(n):
            audio  = audios[i]
            bound = bounds[i]
            output = get_output(audio.file, bound)
            result.append(list(output))

        result = json.dumps(result)
        return Response(content=result, media_type="application/json")
    except Exception as e:
        print(e)
        raise HTTPException(500, detail="{}".format(e))
