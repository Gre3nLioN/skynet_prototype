var express = require('express'),
	router = express.Router();
var exec = require('child_process').exec;
var request = require('request');
var fs = require('fs'),
	path = require('path')
	util = require('util');
  var SerialPort = require("serialport").SerialPort;
  //Reemplazalo con el tuyo :)
  var port = "/dev/ttyUSB0";
  var serialPort = new SerialPort(port, {
      baudrate: 9600
  });


global.flag = false;
global.position={ x:0, y:0, z:0};
module.exports = {
	
	index: function(req, res) {
  		res.sendfile('./public/index.html');
	},

	send: function(req, res){
		request.post(
				'http://sheepridge.pandorabots.com/pandora/talk?botid=b69b8d517e345aba&skin=custom_input',
				{ form: {botcust2:"b85aa68d3e742653", input: req.body.text} },
				function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var response = body.split("ALICE:");
						var alice = response[response.length-1];

						var url = "https://translate.google.pl/translate_tts?ie=UTF-8&q=" + alice + "&tl=en&total=1&idx=0&client=t&prev=input";
						var wstream = fs.createWriteStream('response.mp3');
						request.get(url).pipe(wstream).on('close', function() {
							res.send("success");
						});
					}
				}
				);
	},

	sound: function(req,res){
		var rstream = fs.createReadStream('response.mp3');
		exec("mpg321 response.mp3" ,function(error, stdout, stder){
			console.log(stdout);
		});
		serialPort.write("l", function(err, results) {});
		var stat = fs.statSync('response.mp3');
		console.log('resp');
		res.writeHead(200, {
			'Content-Type': 'audio/mpeg',
			'Content-Length': stat.size
		});
		rstream.on('data', function(data) {
			res.write(data);
		});

		rstream.on('end', function() {
			res.end();        
		});
		setTimeout(function () {
			serialPort.write("f", function(err, results) {});
		}, 5000);
	},
	
	position: function(req, res){
		var xDiff = req.body.x - global.position.x;
		var yDiff = req.body.y - global.position.y;
		var zDiff = req.body.z - global.position.z;
		global.position.x = req.body.x;
		global.position.y = req.body.y;
		global.position.z = req.body.z;
		//1 = derecha
		//2 = izq
		//3 = arriba
		//4 = abajo
		if(Math.abs(xDiff) > Math.abs(yDiff) && global.flag == true){
		if(xDiff != 0 && Math.abs(xDiff) >2  ){
				if(xDiff > 0){
					console.log("1");
					serialPort.write("1", function(err, results) {});
				}else{
					console.log("2");
					serialPort.write("2", function(err, results) {});
				}	
			}
		}
		global.flag = true;
		res.send('success');
	}

}
