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

const uploadPhotos = (req, res) => {
	var readFile = fs.readFileSync('mbox.txt', 'utf8');

	var filePath = __dirname + '/public/photos/' + readFile.toLowerCase() + "/";

	savePhotos(req, filePath);

}

const savePhotos = (req, filePath) => {
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
			console.log("Uploading: " + filename);

			var splitBoy = filename.split('.');
			var newName = splitBoy[0] + '--' + Date.now() + '.' + splitBoy[1];

			//Path where image will be uploaded
			if (!fs.existsSync(filePath)){
				fs.mkdir(filePath, function(){
					console.log(filePath);
					writePhotos(file, filePath, newName)
				})
			}
			else {
				writePhotos(file, filePath, newName)
			}
	});
}

const writePhotos = (file, filePath, fileName) => {
	var fstream;
	fstream = fs.createWriteStream(filePath + fileName);
	file.pipe(fstream);
	fstream.on('close', function () {
			console.log("Upload Finished of " + fileName);
			return "success";
	});
}

const downloadPhotos = (req, res) => {
	var groupName = fs.readFileSync('mbox.txt', 'utf8').toLowerCase();
	var files = fs.readdirSync('./public/photos/' + groupName);

		var html = [];
		for (var file in files) {
			if (validFile(files[file], req.query.timeframe)){
				var htmlString = 'http://localhost:3001/photos/'+ groupName + '/' + files[file];
				html.push(htmlString);
			}
		}
		return shuffle(html)
}

const shuffle = (a) => {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
		return a
}

const validFile = (fileName, timeframe) => {
	if (fileName.endsWith('.jpg') || fileName.endsWith('.JPG') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')){
		var split = fileName.split('.');
		split  = split[0].split('--');

		var yesterday = Date.now() - (1000*60*60*24);

		if (timeframe == 'past'){
			return (split[1] < yesterday);
		}
		return (split[1] > yesterday);
	};
	return false;
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
		console.log('Group Name is now ' + groupName);
	});

	return "success"
}

const addGroupName = (req, groups) => {
	if (groups.includes(proposition)){
		return 'Exists';
	}
	return 'success';
}

app.get('/download_photos', (req, res) => res.send(downloadPhotos(req, res)) );
app.get('/get_groupnames', (req, res) => getGroupNames().then( (result) => res.send(result) ) );

app.post('/upload_photos', (req, res) => res.send(uploadPhotos(req, res)) );
app.post('/set_groupname', (req, res) => res.send(setGroupName(req, res)) );
app.post('/add_groupname', (req, res) => getGroupNames().then( (groups) => res.send(addGroupName(req, groups)) ) );

var server = app.listen(3001,  () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log('node listening at http://%s:%s', host, port);
});
