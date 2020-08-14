var fs = require('fs'),
    Jimp = require('jimp'),
    path = require('path'),
    express =require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    mainimg = __dirname + '/mainimg.jpg',
    dayfolder = '/NAS',
    imgpath = '',
    lastimg = '',
    getimgtimer = setInterval(getnewimg, 30000);
    
//app.use(express.static(__dirname + '/node_modules'));


getnewimg();

//Send HTML file for core page
app.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

//Page that changes the folder to be used at next image grab
app.get('/changefolder', (req, res) => {
    console.log("Changing folder")
    res.sendFile(__dirname+'/changefolder.html');
    dayfolder = '/NAS';
    imgpath = '';
});

//Adds the current image to the list of good images
app.get('/goodimg', (req, res) => {
    res.sendFile(__dirname +'/goodimg.html');
    console.log("Image marked as good");
    var filewrite = fs.createWriteStream('/goodbadimgs/goodimgs.txt', {
        flags: 'a'
    });
    filewrite.write('//Ansel/Pictures' + imgpath.slice(4));
});

app.get('/badimg', (req, res) => {
    res.sendFile(__dirname +'/badimg.html');
    console.log("Image marked as bad");
    var filewrite = fs.createWriteStream('/goodbadimgs/badimgs.txt', {
        flags: 'a'
    });
    filewrite.write('//Ansel/Pictures' + imgpath.slice(4));
});

server.listen(3000);
io.on('connect', socket => {
    console.log('Connection is being made')
});


io.on('connection', (socket) => {
    console.log('Connected')
    //console.log(socket);

    var readStream = fs.createReadStream(mainimg, {
        encoding: 'binary'
    });
    socket.emit('img-new', "");

    readStream.on('end', () => {
            //console.log('All data taken'); 
            socket.emit('img-end', '')  
        });
    readStream.on('data', chunk => {
            //console.log(chunk);
            //console.log("Sending Data");
            socket.emit('img-chunk', chunk);
        });

    readStream.on('error', (err) => {
            console.log(err);
            
        });
    readStream.on('close', () => {
        readStream.destroy();
        //console.log("File has been closed");
    });
    socket.emit('img-path', '//Ansel/Pictures' + imgpath.slice(4));

    
});


//Get a random number to use for picking file
function rand(max) {
    return Math.floor(
        Math.random()*max
    );
}


//Get new image
function getnewimg() {
    //console.log('getting new image')
    var isimg = false,
        currpath = dayfolder,
        testpath = '';
    while(isimg ==false) {

        //Get the contents of a folder
        files = fs.readdirSync(currpath);
        var isusable = false,
            len = files.length,
            select = 1,
            count = 0;
        
        while (isusable == false && count < 10) {
            select = rand(len)
            testpath = currpath.concat('/', files[select])
            //console.log(testpath)
            if (fs.lstatSync(testpath).isDirectory() == true) {
                var selectname = files[select].toLowerCase()
                 if (selectname.includes('video') == false) {
                    currpath = testpath;
                    isusable = true;
                 }                
            } else if (path.extname(testpath) == '.jpg' || path.extname(testpath) == '.JPG') {
                isusable = true;
                isimg = true;
                dayfolder = currpath;
                imgpath = testpath;
            } else {
                count ++;
                try {
                    currpath.slice(0, currpath.lastIndexOf('\\\\'));
                } catch(err) {
                    console.log(err);
                }
                
            }
        }
    }
    try {
        fs.unlinkSync(mainimg);
    } catch(err) {
        console.error(err);
        //console.log("Error deleteing file")
    }

    imgresize();
    return
}

async function imgresize() {
    const img = await Jimp.read(imgpath);
    var h = img.bitmap.height;
    var w = img.bitmap.width;
    var curraspect = w/h,
        aspectratio = 2560/1440;
    if (curraspect>aspectratio) {
        if (w>2560) {
            //console.log("Writing Image");
            await img.resize(2560, h/(w/2560))
            await img.writeAsync(mainimg);
        } else {
            //console.log("Writing Image");
            await img.writeAsync(mainimg);
        }
    } else if (aspectratio>curraspect) {
        if (h > 1440) {
            //console.log("Writing Image");
            await img.resize(w/(h/1440),1440);
            await img.writeAsync(mainimg);
        } else {
            //console.log("Writing Image");
            await img.writeAsync(mainimg);
        }
    } else {
        //console.log("Writing Image");
        await img.resize(2560,1440);
        await img.writeAsync(mainimg);
    }
    pushimg();
}

function pushimg() {
    //console.log('sending new image');
    var readStream = fs.createReadStream(mainimg, {
        encoding: 'binary'
    });
    io.emit('img-new', "");
    
    readStream.on('end', () => {
            //console.log('All data taken');   
            io.emit('img-end', '')
        });
    readStream.on('data', chunk => {
            //console.log(chunk);
            //console.log("Sending Data");
            io.emit('img-chunk', chunk);
        });
    
    readStream.on('error', (err) => {
            console.log(err);
            //console.log("Error reading image")
        });
    readStream.on('close', () => {
        readStream.destroy();
        //console.log("File has been closed");
    });
    io.emit('img-path', '//Ansel/Pictures' + imgpath.slice(4));
}


