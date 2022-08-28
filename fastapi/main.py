from fastapi import FastAPI, UploadFile, HTTPException, Response, File
import json
from model.helper import *

app = FastAPI(
    title="Stuttering detection API",
    description="Detect stuttering in audio files",
    version="0.1.0",
)


print("loading model")
model = load_model()
print("model loaded")


@app.get("/")
def home():
    # return {"message": "Hello World"}
    return "Hello World"


@app.post("/")
# only allow wav format file to be uploaded
async def stutter(audio: UploadFile = File(...)):
    if audio.content_type not in ["audio/wave", "audio/wav"]:
        raise HTTPException(400, detail="Invalid document type")
    try:
        print(audio.filename)
        print(audio.content_type)
        output = run_model(model, audio.file)
        output = json.dumps(output)
        return Response(content=output, media_type="application/json")
    except Exception as e:
        print(e)
        raise HTTPException(500, detail="{}".format(e))
