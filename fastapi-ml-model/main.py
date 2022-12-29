from fastapi import FastAPI, UploadFile, HTTPException, Response, File
from typing import List
import json
from model.main_calling_theta2 import get_output

app = FastAPI(
    title="Stuttering detection API",
    description="Detect stuttering in audio files", version="0.1.0",
)


@app.get("/")
def home():
    return "Hello World"


@app.post("/")
# only allow wav format file to be uploaded
async def stutter(audios: List[UploadFile] = File(...)):
    for audio in audios:
        if audio.content_type not in ["audio/wave", "audio/wav"]:
            raise HTTPException(400, detail="Invalid document type of file {}".format(audio.filename))
    try:
        result = []
        for audio in audios:
            print(audio.filename)
            print(audio.headers)
            print(audio.content_type)
            output = get_output(audio)
            print("here 2")
            print("output", output)
            result.append(list(output))
            # result[audio.filename] = output
            # print("result", result)
        result = json.dumps(result)
        return Response(content=result, media_type="application/json")
    except Exception as e:
        print(e)
        raise HTTPException(500, detail="{}".format(e))
