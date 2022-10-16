

from werkzeug.utils import secure_filename
from flask import Flask, render_template, request
from flask_cors import CORS
import cv2
import os


app = Flask(__name__)
CORS(app)


@app.route('/')
def main():
    return "Please upload file"


@app.route("/upload", methods=["POST"])
def upload():
    if request.files.get("video") is None:
        return render_template("my_error_page.html", an_optional_message="Error uploading file")
    # Put here some other checks (security, file length etc...)
    f = request.files["video"]
    f.save(secure_filename(f.filename))

    cam = cv2.VideoCapture(f.filename)
    
    currentframe = 0
    listOfFrames = []
    while(True):
    # reading from frame
        ret, frame = cam.read()
  
        if ret:
        # if video is still left continue creating images
            name = './data/frame' + str(currentframe) + '.jpg'
            print ('Creating...' + name)
  
        # writing the extracted images
            cv2.imwrite(name, frame)

            listOfFrames.append(name)
  
        # increasing counter so that it will
        # show how many frames are created
            currentframe += 1
        else:
            break
    
    return {
        'success': True,
    }

if __name__ == '__main__':
   app.run()