import pathlib as pl
from flask import Flask, Response
from flask_socketio import SocketIO, emit
import random
import base64
app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading')
file_map ={}
frame = None

num_connections = 0

@app.route('/')
def index():
    with open("index.html") as f:
        return Response(f.read(), content_type="text/html")

@app.route('/goodimg')
async def goodimg():
    with open("goodimg.html") as f:
        return Response(f.read(), content_type="text/html")

@app.route('/badimg')
async def badimg():
    with open("badimg.html") as f:
        return Response(f.read(), content_type="text/html")

@socketio.on("connect")
def connect():
    global frame
    print("Device Connected")
    global num_connections, frame
    num_connections = num_connections + 1
    frame.new_connection()

@socketio.on("message")
async def message(sid, message):
    print(message)

@socketio.on('disconnect')
def disconnect():
    print("Device Connected")

class PictureFrame:
    def __init__(self):
        self.base_path = pl.Path('/NAS')
        self.image = self.get_image()
        # self.image = "C:\\Users\\BenVe\\Desktop\\moon.png"
        self.connections = 0

    def new_connection(self):
        self.connections = self.connections+1
        print(f"Client Connected \t {self.connections} current connections")
        #add code for sending image
    
    def disconnection(self):
        print(f"Client Disconnected \t {self.connections} current connections")
        self.connections = self.connections-1
    
    def broadcast(self):
        SocketIO
        emit("img-new", broadcast = True)
        with open(self.image, "rb") as img:
            b_read = img.read(500000)
            emit("img-chunk", data=base64.b64encode(b_read), broadcast = True)
            while len(b_read) > 0:
                b_read = img.read(500000)
                emit("img-chunk", data=base64.b64encode(b_read), broadcast = True)
        emit("img-close")
        emit("img-path", '//Ansel/Pictures' + self.image[4:], broadcast = True)

    def run(self):
        # self.get_image()
        self.broadcast()
            
    
    def get_image(self):
        curr_path = self.base_path
        isIMG = False
        while isIMG is False:
            re_type, choice = self.get_next(curr_path)
            if re_type is False:
                curr_path = self.base_path()
            elif re_type == "folder":
                curr_path = choice
            elif re_type == "image":
                isIMG = True
                self.img = choice
                return choice
    
            
    def get_next(self, start_dir):
        for i in range(5):
            choice = random.choice([f for f in start_dir.iterdir()])
            if choice.is_dir():
                return("folder", choice)
            elif choice.suffix.lower() in ['.jpg', '.jpeg', '.png'] :
                return ("image", choice)
        return (False, False)
            
    

def imgTimer(frame = None):
    while True:
        frame.run()
        print("New Image")
        socketio.sleep(5)


if __name__ == "__main__":
    frame = PictureFrame()
    socketio.start_background_task(imgTimer, frame = frame)
    socketio.run(app, port=8080)
