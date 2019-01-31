// Javascript with Node.js.
// Deploy script.


// Import modules.
var fs = require("fs");
var path = require('path');

// Deploy tasks..
// var paramfile = "./tools/deploy.json";
// var task = {};
// if (fs.existsSync(paramfile)) {
//     task = JSON.parse(fs.readFileSync(paramfile));
// }
var task = require("./deploy.json");

// Minify and join source codes.
console.log("" + task.targetpath);
task.srcfiles.forEach((srcfile) => {
	var targetfile = task.targetpath + srcfile;
	var targetpath = targetfile.substring(0, targetfile.lastIndexOf('/'));
	if (targetpath && !fs.existsSync(targetpath)) {
		fs.mkdirSync(targetpath);
	}
	fs.copyFile(task.srcpath + srcfile, targetfile, (error) => {
		if (error) {
			console.log("" + targetfile + ": " + error);
	    } else {
			console.log("" + targetfile);
		}
	});
});
