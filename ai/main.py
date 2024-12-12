from flask import Flask,request,jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from app.utils import analyze
from schema import ImageData
from PIL import Image
app = Flask(__name__)

CORS(app=app)


@app.route('/')
def Home():
    return 'hello world'

@app.route('/calculate',methods=['GET','POST'])
def calculate():
    if request.method == "POST":
        data = request.form.get('image')
        dict_of_vars = request.form.get('dictOfVars')
        image_data = base64.b64decode(data.split(',')[1])
        image_bytes = BytesIO(image_data)
        image =  Image.open(image_bytes)   
        responses = analyze(image,dict_of_vars)
        data = []
        for response in responses:
            data.append(response)
        print("response in route: ",data)
        return jsonify(data)
        
         


if __name__ == '__main__':
    app.run(debug=True,port=3000)