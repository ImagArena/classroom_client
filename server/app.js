import express from 'express';
import bodyParser from 'body-parser';
import busboy from 'connect-busboy';
import path from 'path';
import fs from 'fs-extra';

const app = express();

app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
    next();
});

app.get('/', (req, res) => res.send('hello'));

const uploadPhotos = (req, res) => {
	var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/public/photos/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {
                console.log("Upload Finished of " + filename);
                return "success"
            });
        });
}

const downloadPhotos = (req, res) => {
	var files = fs.readdirSync('./public/photos')
		var html = [];
		for (var file in files) {
			var htmlString = 'http://localhost:3001/photos/' + files[file];
			html.push(htmlString);
		}
		return html
}

app.get('/download_photos', (req, res) => res.send(downloadPhotos(req, res)) )
app.post('/upload_photos', (req, res) => res.send(uploadPhotos(req, res)) )

var server = app.listen(3001,  () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log('node listening at http://%s:%s', host, port);
});
