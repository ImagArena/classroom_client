import express from 'express';
import bodyParser from 'body-parser';
import busboy from 'connect-busboy';
import path from 'path';
import fs from 'fs-extra';
import readline from 'readline';
import jsonfile from 'jsonfile';

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
	var obj = jsonfile.readFileSync('group.json');

	var filePath = __dirname + '/public/photos/' + obj.groupName.toLowerCase() + "/";

	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath);
	}

	filePath += obj.levelNumber + "/";

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
					writePhotos(file, filePath, newName);
				})
			}
			else {
				writePhotos(file, filePath, newName);
			}
	});
}

const writePhotos = (file, filePath, fileName) => {
	var fstream = fs.createWriteStream(filePath + fileName);
	file.pipe(fstream);
	fstream.on('close', function () {
			console.log("Upload Finished of " + fileName);
			return "success";
	});
}

const downloadPhotos = (req, res) => {


	var level;
	var groupName;
	var files = [];

	var html = [];

	groupName = jsonfile.readFileSync('group.json').groupName.toLowerCase();

	if (req.query.timeframe == 'present'){
		var levels = fs.readdirSync('./public/photos/' + groupName);
		levels.sort();
		level = levels.splice(-1, 1);

		files = fs.readdirSync('./public/photos/' + groupName + '/' + level);

		for (var file in files) {
			var htmlString = 'http://localhost:3001/photos/' + groupName + '/' + level + '/' + files[file];
			html.push({
				file: htmlString,
				groupName: groupName,
				levelNumber: level
			});
		}

	}
	else {

		level = req.query.levelnumber;

		if (req.query.grouptype == 'external') {
			let current = jsonfile.readFileSync('group.json').groupName.toLowerCase();

			let groups = fs.readdirSync('./public/photos');

			let deletingIndex = groups.indexOf(current);
			if (deletingIndex > -1)
				groups.splice(deletingIndex, 1);

			deletingIndex = groups.indexOf('.gitignore');
			if (deletingIndex > -1)
				groups.splice(deletingIndex, 1);

			deletingIndex = groups.indexOf('.DS_Store');
			if (deletingIndex > -1)
				groups.splice(deletingIndex, 1);

			for (let i in groups) {

				let levelPhotos = fs.readdirSync('./public/photos/' + groups[i] + '/' + level);

				for (let x in levelPhotos) {
					let fileName =  groups[i] + '/' + level + '/' + levelPhotos[x];

					var htmlString = 'http://localhost:3001/photos/'+ fileName;
					html.push({
						file: htmlString,
						groupName: groups[i],
						levelNumber: level
					});
				}

			}

		}
		else {
			files = fs.readdirSync('./public/photos/' + groupName + '/' + level);

			for (let file in files) {
				var htmlString = 'http://localhost:3001/photos/' + groupName + '/' + level + '/' + files[file];
				html.push({
					file: htmlString,
					groupName: groupName,
					levelNumber: level
				});
			}

		}

	}

	if (req.query.timeframe == 'past'){
		return shuffle(html);
	}
	else {
		return html;
	}

}

const deletePhoto = (req) => {
	let fileName = req.body.fileName;
	var prefix = fileName.split(".")[0];

	jsonfile.readFile('group.json', (err, obj) => {
		var groupName = obj.groupName;
		var levelNumber = obj.levelNumber;

		var files = fs.readdirSync('./public/photos/' + groupName + '/' + levelNumber);

		for (var file in files) {
			if (files[file].indexOf(prefix) !== -1){
				fs.unlinkSync('./public/photos/' + groupName + '/' + levelNumber + '/' + files[file])
			}
		}

	});
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

const getGroupInfo = () => {
  let groups = new Promise((resolve, reject) => {
		var lines = [];

		var lineReader = readline.createInterface({
		    input: fs.createReadStream('classes.txt')
		});

		lineReader.on('line', (line) => {
		    lines.push(line);
		});

		lineReader.on('close', () => {
		    resolve(lines);
		});
	});

	let groupInfo = new Promise((resolve, reject) => {
		jsonfile.readFile('group.json', (err, obj) => {
			resolve(obj);
		});
	});

	return Promise.all([groups, groupInfo]).then((values) => {
		return {
			groups: values[0],
			groupName: values[1].groupName,
			levelNumber: values[1].levelNumber
		}
	});

}

const setGroupInfo = (req, res) => {
	var groupName = req.body.groupName;
	var levelNumber = req.body.levelNumber;

	var file = 'group.json';

	jsonfile.readFile(file, (err, obj) => {
		console.log(err);
		obj.groupName = groupName.value;
		obj.levelNumber = levelNumber;

		jsonfile.writeFile(file, obj, {spaces: 2}, (err, obj) => {
		  console.log(err);
		});

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
app.get('/get_groupinfo', (req, res) => getGroupInfo().then( (result) => res.send(result) ) );

app.post('/upload_photos', (req, res) => res.send(uploadPhotos(req, res)) );
app.post('/set_groupinfo', (req, res) => res.send(setGroupInfo(req, res)) );
app.post('/add_groupname', (req, res) => getGroupNames().then( (groups) => res.send(addGroupName(req, groups)) ) );
app.post('/delete_photo', (req, res) => res.send(deletePhoto(req, res)) );

var server = app.listen(3001,  () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log('node listening at http://%s:%s', host, port);
});
