import express from 'express';
import bodyParser from 'body-parser';
import busboy from 'connect-busboy';
import path from 'path';
import fs from 'fs-extra';
import readline from 'readline';

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
	var filePath;

	fs.readFile('mbox.txt', 'utf8', function(err, data){
		if (err) throw err;

		filePath = 'public/photos/' + data.toLowerCase();

		if (!fs.existsSync(filePath)){
			fs.mkdir(filePath, function(){
				savePhotos(req, filePath);
			});
		}

		else{
			savePhotos(req, filePath)
		}


	});

}

const savePhotos = (req, filePath) => {
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
			console.log("Uploading: " + filename);

			//Path where image will be uploaded
			fstream = fs.createWriteStream(__dirname + filePath + filename);
			file.pipe(fstream);
			fstream.on('close', function () {
					console.log("Upload Finished of " + filename);
					return "success";
			});
	});
}

const downloadPhotos = (req, res) => {
	var groupName;
	fs.readFile('mbox.txt', 'utf8', function(err, data){
		if (err) throw err;
		groupName = data;
	})

	var files = fs.readdirSync('./public/photos/' + groupName);

		var html = [];
		for (var file in files) {
			if (validFile(files[file])){
				var htmlString = 'http://localhost:3001/photos/' + files[file];
				html.push(htmlString);
			}
		}
		return html
}

const validFile = (fileName) => {
	return (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif'));
}

const getGroupNames = () => {
  let p = new Promise((resolve, reject) => {
		var lines = [];

		var lineReader = readline.createInterface({
		    input: fs.createReadStream('classes.txt')
		});

		lineReader.on('line', function(line) {
		    lines.push(line);
		});

		lineReader.on('close', function() {
		    resolve(lines);
		});
	})

	return p;

}

const setGroupName = (req, res) => {
	var groupName = req.body.group;
	fs.writeFile('mbox.txt', groupName, (err) => {
		if (err) throw err;
		console.log('It\'s saved!');
	});
	return "success"
}

app.get('/download_photos', (req, res) => res.send(downloadPhotos(req, res)) );
app.get('/get_groupnames', (req, res) => getGroupNames().then( (result) => res.send(result) ) );

app.post('/upload_photos', (req, res) => res.send(uploadPhotos(req, res)) );
app.post('/set_groupname', (req, res) => res.send(setGroupName(req, res)) );

var server = app.listen(3001,  () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log('node listening at http://%s:%s', host, port);
});
