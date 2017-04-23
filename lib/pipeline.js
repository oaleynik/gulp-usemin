var path = require('path');

module.exports = function(name, files, tasks, push) {
  var through = require('through2');
  var filename = name || 'filename.temp';
  var ext = path.extname(filename);
  var concat = require('gulp-concat')(filename, {newLine: (ext === '.js' ? ';' : '\n')});

  /* PREPARE TASKS */
  tasks = (tasks || []).slice();

  var concatIndex = tasks.indexOf('concat');
  if (concatIndex == -1)
    tasks.unshift(concat);
  else
    tasks[concatIndex] = concat;

  tasks.push(through.obj(function(file, enc, streamCallback) {
    streamCallback(null, file);
    push(file);
  }));

  /* PREPARE TASKS END */

  var stream = through.obj(function(file, enc, streamCallback) {
    streamCallback(null, file);
  });
  var newStream = stream;
  tasks.forEach(function(task) {
    newStream = newStream.pipe(typeof(task) == 'function' ? task(): task);
  });

  files.forEach(stream.write.bind(stream));
  stream.end();
};
