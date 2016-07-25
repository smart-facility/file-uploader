var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var child_process = require('child_process');
var randomstring = require('randomstring');

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
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

  var projectPath = path.join(__dirname, '/uploads/', randomstring.generate());
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
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
    var child = child_process.spawn('python', ['../run.py','--project-path',projectPath],{ stdio: [0, fs.openSync('std.out','w'), fs.openSync('std.err','w')], env : process.env});
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

var server = app.listen(8081, function(){
  console.log('Server listening on port 8081');
});
