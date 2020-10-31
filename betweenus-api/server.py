import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from predict import predict

app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
async def root():
    return {'message': 'Hello World'}


@app.post('/predict')
async def predict_image(image: UploadFile = File(...)):
    img_bytes = await image.read()
    return predict(img_bytes)


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
