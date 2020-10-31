import uvicorn
from fastapi import FastAPI, File, UploadFile

from predict import predict

app = FastAPI()


@app.get('/')
async def root():
    return {'message': 'Hello World'}


@app.post('/predict')
async def predict_image(image: UploadFile = File(...)):
    img_bytes = await image.read()
    boxes = predict(img_bytes)
    return boxes


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
