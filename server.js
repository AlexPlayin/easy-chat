var express = require('express')
,   app = express()
,   chatapp = express()
,   chatserver = require('http').createServer(chatapp)
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(chatserver)
,   conf = require('./config.json');

// Webserver
// auf den Port x schalten
server.listen(conf.httpport);

app.use(express.static(__dirname + '/public'));

// wenn der Pfad / aufgerufen wird
app.get('/', function (req, res) {
	// so wird die Datei index.html ausgegeben
	res.sendfile(__dirname + '/public/index.html');
});

// Websocket
io.sockets.on('connection', function (socket) {
	// der Client ist verbunden
	socket.emit('chat', { zeit: new Date(), text: 'Du bist nun mit dem Server verbunden!' });
	// wenn ein Benutzer einen Text senden
	socket.on('chat', function (data) {
		// so wird dieser Text an alle anderen Benutzer gesendet
		io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
	});
});

// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.httpport + '/');