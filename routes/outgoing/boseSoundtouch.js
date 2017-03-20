/**
 * http://usejsdoc.org/
 */

var request = require('request');
var bodyParser = require('body-parser');
var config = require('../../config');
var parser = require('./../../utils/xmlToJson');

var sendKey = function(action, keyValue, responseCallback) {
    console.log("send key code " + keyValue);  //verifies key value received

    request({
        url: 'http://' + config.bose.togo.ip + ':' + config.bose.togo.port + '/key', //URL to hit
        //qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST', 
        headers: {
        	'Content-Type': 'text/xml; charset=utf-8'
        },
        body : '<key state="' + action + '" sender="Gabbo">' + keyValue + '</key>'
    }, function(error, response, body){
        if(error) {
            console.log('communication error ' + error);
            responseCallback(response);
        } else {
        	console.log('Success ');
        	if (response.statusCode == 200) {
        		responseCallback('Bose ' + keyValue + ' button pressed');
        	} else {
        		responseCallback('Status code ' + response.statusCode);
        	}
            console.log(body);
        }
    });
};

var checkNowPlaying = function(responseCallback) {
	request({
        url: 'http://' + config.bose.togo.ip + ':' + config.bose.togo.port + '/now_playing', //URL to hit
        //qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'GET', 
        headers: {
        	'Content-Type': 'text/xml; charset=utf-8'
        }
    }, function(error, response, body){
        if(error) {
            console.log('communication error now playing ' + error);
            responseCallback(response);
        } else {
        	console.log('Success now playing');
        	if (response.statusCode == 200) {
        		var json = parser.convert(body);
        		if(json.nowPlaying.source == 'STANDBY') {
        			responseCallback(false);
        		} else {
        			responseCallback(true);
        		}
        	} else {
        		responseCallback('Status code ' + response.statusCode);
        	}
            console.log(body);
        }
    });
};

var setVolume = function(volume, responseCallback) {
    console.log("volume is " + volume);  //verifies key value received

    request({
        url: 'http://' + config.bose.togo.ip + ':' + config.bose.togo.port + '/volume', //URL to hit
        //qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST', 
        headers: {
        	'Content-Type': 'text/xml; charset=utf-8'
        },
        body : '<volume>' + volume + '</volume>'
    }, function(error, response, body){
        if(error) {
            console.log('communication error ' + error);
            responseCallback(response);
        } else {
        	console.log('Success Volume');
        	if (response.statusCode == 200) {
        		responseCallback('Bose volume set to ' + volume);
        	} else {
        		responseCallback('Status code ' + response.statusCode);
        	}
            console.log(body);
        }
    });
};

module.exports = {
		sendKey: sendKey,
		setVolume: setVolume,
		checkNowPlaying: checkNowPlaying
}