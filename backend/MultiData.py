from flask import Flask, render_template, request
from flask_cors import CORS
from datetime import timedelta
import cv2
import numpy as np
import os
import torch
import clip
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)


app = Flask(__name__)
CORS(app)


@app.route('/')
def main():
    return "Please upload file"


@app.route("/upload", methods=["POST"])
def upload():
    try:
        if request.files.get("video") is None:
            raise Exception('No video uploaded!')
        # Put here some other checks (security, file length etc...)
        f = request.files["video"]
        f.save('video.mp4')

        cam = cv2.VideoCapture('video.mp4')
        fps = cam.get(cv2.CAP_PROP_FPS)
        
        currentFrame = 0
        ret, frame = cam.read()
        frames = []
        timestamps = []

        while ret:
            frames.append(frame)
            timestamps.append(currentFrame / fps)

            currentFrame += 1
            ret, frame = cam.read()
        
        framesTensor = torch.cat([preprocess(Image.fromarray(frame)).unsqueeze(0) for frame in frames]).to(device)
        frameVectors = None

        with torch.no_grad():
            frameVectors = model.encode_image(framesTensor)
        
        torch.save((frameVectors, timestamps), 'frameVectors.pt')
    
        return {
            'success': True,
        }
    except Exception as e:
        print(e)
        return {
            'success': False,
        }


@app.route("/search", methods=["GET"])
def search():
    try:
        query = request.args.get('query')
        
        frameVectors, timestamps = torch.load('frameVectors.pt')
        
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

@app.route("/returnVideo")
def returnVideo():
    if upload() == True:
        return 'video'
    else:
        return 'please upload video'
if __name__ == '__main__':
   app.run()