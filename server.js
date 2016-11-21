var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();
var guests = [];
var fs = require('fs');
var filePath = process.env.BACKUP_FILE_PATH || './guests.json';
var maxLength = 40;
var runningBackup = false;
var cakes = Array(15).fill('🍰');

function takePieceOfCake() {
  cakes.pop();
  if (cakes.length < 3) {
    cakes = Array(15).fill('🍰');
  }
}

function initNames(cb) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (data) {
      guests = JSON.parse(data);
    }
    cb();
  });
}

function backupGuests() {
  if (!runningBackup) {
    runningBackup = true;
    fs.writeFile(filePath, JSON.stringify(guests), function (err) {
      runningBackup = false;
      if (err) return console.log(err);
      console.log('Successful backup ^_^');
    });
  }
}

app.use(bodyParser.json());
app.use(express.static('static'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home', {guests: guests, cakes: cakes});
});

app.post('/', function (req, res) {
  var name = req.body.name;
  var twitter = req.body.twitter;
  var github = req.body.github;
  if (!name && !twitter && !github) {
    res.send({
      error: true,
      msg: 'What\'s your name?'
    });
    return;
  }
  if (name && name.length > maxLength) {
    res.send({
      error: true,
      msg: `Maximum of ${maxLength} characters allowed.`
    });
    return;
  }
  if (twitter && twitter.length > maxLength) {
    res.send({
      error: true,
      msg: `Maximum of ${maxLength} characters allowed.`
    });
    return;
  }
  if (github && github.length > maxLength) {
    res.send({
      error: true,
      msg: `Maximum of ${maxLength} characters allowed.`
    });
    return;
  }
  guests.push({
    name: name,
    twitter: twitter,
    github: github
  });
  takePieceOfCake();
  res.send({
    msg: 'Thank you! Enjoy your piece of cake 🍰'
  });
  backupGuests();
  
});

initNames(function() {
  app.listen(3000, function () {
    console.log(`Write backup data into ${filePath}.`);
    console.log('App listening on port 3000!');
  });
});
