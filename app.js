var config = require('./config.js');
var express = require('express');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var child_process = require('child_process');
var randomStringGenerator = require('randomstring');
var logger = require('winston');



var app = express();

// Set up logging to log files
var logPath = ( config.logger.logDirectory ? config.logger.logDirectory : __dirname );
// Check that log file directory can be written to
try {
	fs.accessSync(logPath, fs.W_OK);
} catch (e) {
	console.log( "Log directory '" + logPath + "' cannot be written to"  );
	throw e;
}
logPath += path.sep + config.logger.logFileName;

logger
	.add(logger.transports.File, {
		filename: logPath, // Write to projectname.log
		json: false, // Write in plain text, not JSON
		maxsize: config.logger.maxFileSize, // Max size of each file
		maxFiles: config.logger.maxFiles, // Max number of files
		level: config.logger.level // Level of log messages
	})
	// Console transport is no use to us when running as a daemon
	.remove(logger.transports.Console);

  var mkdirSync = function (path) {
    try {
      fs.mkdirSync(path);
    } catch(e) {
      if ( e.code != 'EEXIST' ) {
        logger.error('Fatal: path ' + path + ' not created - does parent exist?');
        process.exit(1);
      }
    }
  }

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory

  var randomString = randomStringGenerator.generate();

  var projectPath = path.join(__dirname, '/uploads/', randomString);
  mkdirSync(projectPath)
  form.uploadDir = path.join(projectPath,'/images');
  mkdirSync(form.uploadDir);

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    logger.error('An upload error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
    var child = child_process.spawn('python', ['../run.py','--project-path',projectPath],{ stdio: [0, fs.openSync(randomString+'_std.out','w'), fs.openSync(randomString+'_std.err','w')], env : process.env});
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

var server = app.listen(config.port || 8081, function(){
  logger.info('Server listening on port ' + String(config.port));
});
