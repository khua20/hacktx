from flask import Flask, request, send_file
from flask_cors import CORS
from datetime import timedelta
import cv2
import numpy as np
import os
import torch
import clip
from PIL import Image

totalAnalyzed = 1024
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model, preprocess = clip.load('ViT-B/32', device=device)
analyzedSet = set(filename for filename in os.listdir('static'))
current = next(iter(analyzedSet)) if len(analyzedSet) > 0 else ''


app = Flask(__name__)
CORS(app)


@app.route('/')
def main():
    return 'Please upload file'


@app.route('/upload', methods=['POST'])
def upload():
    try:
        if request.files.get('video') is None:
            raise Exception('No video uploaded!')
        print('getting video')
        # Put here some other checks (security, file length etc...)
        f = request.files['video']
        print('saving video')
        f.save(f'static/{f.filename}')

        cam = cv2.VideoCapture(f'static/{f.filename}')
        fps = cam.get(cv2.CAP_PROP_FPS)
        
        currentFrame = 0
        ret, frame = cam.read()
        frames = []
        timestamps = []
        density = max(cam.get(cv2.CAP_PROP_FRAME_COUNT) // totalAnalyzed, 1)

        print(f'reading video, density {density}')
        while ret:
            frames.append(frame)
            timestamps.append(currentFrame / fps)
            print(currentFrame // density)

            currentFrame += density
            cam.set(cv2.CAP_PROP_POS_FRAMES, currentFrame)
            ret, frame = cam.read()
        
        print('tensorizing video')
        framesTensor = torch.cat([preprocess(Image.fromarray(frame)).unsqueeze(0) for frame in frames]).to(device)
        frameVectors = None

        print('encoding video')
        with torch.no_grad():
            frameVectors = model.encode_image(framesTensor)
        
        torch.save((frameVectors, timestamps), f'{f.filename}.pt')

        global current
        current = f.filename
        analyzedSet.add(f.filename)
    
        return {
            'success': True,
        }
    except Exception as e:
        print(e)
        return {
            'success': False,
        }


@app.route('/analyzed', methods=['GET'])
def analyzed():
    return {
        'success': True,
        'analyzed': list(analyzedSet),
    }


@app.route('/current', methods=['GET', 'POST'])
def currentHandler():
    global current

    if request.method == 'GET':
        return {
            'success': True,
            'current': current if current != '' else None
        }
    elif request.method == 'POST':
        data = request.get_json()
        if data['video'] in analyzedSet:
            current = data['video']

        return {
            'success': data['video'] in analyzedSet,
        }
        


@app.route('/search', methods=['GET'])
def search():
    try:
        query = request.args.get('query')
        global current
        
        frameVectors, timestamps = torch.load(f'{current}.pt')
        
        with torch.no_grad():
            textVectors = model.encode_text(clip.tokenize(query).to(device))
            textVectors /= textVectors.norm(dim=-1, keepdim=True)

        similarities = (frameVectors @ textVectors.T).squeeze().cpu().detach().numpy().tolist()
    
        return {
            'similarities': tuple((similarity, timestamp) for similarity, timestamp in zip(similarities, timestamps)),
            'success': True,
        }
    except Exception as e:
        return {
            'success': False,
        }


@app.route('/video', methods=['GET'])
def video():
    global current

    if os.path.isfile(f'static/{current}'):
        return 'static/{current}'
    else:
        return '', 204  # empty, no content


if __name__ == '__main__':
   app.run()