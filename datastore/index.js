const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(function(err, counter) {
    if (err) {
      callback(err);
    } else {
      var content = {
        id: counter,
        text: text
      };
      var path = `${exports.dataDir}/${counter}.txt`;
      fs.writeFile(path, text, (err, fileData) => {
        if (err) {
          callback(err);
        } else {
          callback(null, content);
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, function (err, files) {
    if (err) {
      callback(err);
    } else {
      var content2 = files.map(function(fileName) {
        var text = fileName.substring(0, 5);
        return { id: text,
          text: text
        };
      });
      callback(null, content2);
    }
  });

};

exports.readOne = (id, callback) => {
  // retrieve file with it's path
  var path = `${exports.dataDir}/${id}.txt`;
  // callback to read file path with optional string flag
  fs.readFile(path, 'utf8', (err, fileData) => {
    // reading data and puting in object form for callback
    var content = {
      id: id,
      text: fileData
    };
    if (err) {
      callback(err);
    } else {
      // "return" content data in obj format.
      callback(null, content);
    }
  });
// }
};

exports.update = (id, text, callback) => {
  // console.log('This is ID ', id);
  // console.log('This is TEXT ', text);
  var path = `${exports.dataDir}/${id}.txt`;
  const flag = fs.constants.O_WRONLY | fs.constants.O_TRUNC;
  fs.writeFile(path, text, {flag}, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text });
    }
  });
};

exports.delete = (id, callback) => {

  var path = `${exports.dataDir}/${id}.txt`;
  fs.unlink(path, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');


exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
