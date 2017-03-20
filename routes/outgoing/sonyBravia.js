/**
 * http://usejsdoc.org/
 */

var request = require('request');
var bodyParser = require('body-parser');
var config = require('../../config');

var sendIRCodeRequest = function(irCode, responseCallback) {
    console.log("IRcodeRequest function called with code " + irCode);  //verifies IRcode received

    request({
        url: 'http://' + config.sony.ip + ':' + config.sony.port + '/sony/ircc', //URL to hit
        //qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST', 
        headers: {
        'X-Auth-PSK': 'key2013',
        'Content-Type': 'text/xml; charset=utf-8',
        'soapaction': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"'
        },
        body : '<?xml version="1.0"?>' +
              '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
              '<s:Body>' +
              '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">' +
              '<IRCCCode>' + irCode + '</IRCCCode>' +
              '</u:X_SendIRCC>' +
              '</s:Body>' +
              '</s:Envelope>',
    }, function(error, response, body){
        if(error) {
            console.log('communication error ' + error);
            responseCallback(error, response);
        } 

        else {
            responseCallback(error, body);
            console.log(response.statusCode, body);
        }
    });
};  

var setVideoInputChange = function (inputNumber, callback) {
    console.log("VideoInputChange function called for HDMI " + inputNumber);
    var irCode;
    var speechOutput;
    switch (inputNumber) {
      case "1": irCode = "AAAAAgAAABoAAABaAw=="; break;
      case "2": irCode = "AAAAAgAAABoAAABbAw=="; break;
      case "3": irCode = "AAAAAgAAABoAAABcAw=="; break;
      case "4": irCode = "AAAAAgAAABoAAABdAw=="; break;
    }

    //If there is an IRCODE send to TV.
    if(irCode) {
      console.log(irCode + " code sent to TV");
      sendIRCodeRequest(irCode, function responseCallback(err, codeResponse) {
          if (err) {
              speechOutput = "I had trouble processing this request. Please try again.";
          } else {
              speechOutput = "Input changed to HDMI " + inputNumber;
          } 
          callback(speechOutput);
      });
    } 
    //If IRCODE is not located. Tell the user had trouble finding that input.
    if(irCode == undefined) {
      speechOutput = "I had trouble finding that input.";
      callback(speechOutput);
    }
};

var muteVolume = function(callback) {
	console.log("inside mute function");
	var irCode = "AAAAAQAAAAEAAAAUAw==";
	sendIRCodeRequest(irCode, function responseCallback(err, codeResponse) {
		if(err) {
			speechOutput = "I had trouble processing this request. Please try again.";
		} else {
			speechOutput = "Mute button pressed";
		}
		callback(speechOutput);
	});
}

var increaseDecreaseVolume = function (changeBy, increase, callback) {
	console.log("increaseVolume function called for increasing volume by " + changeBy);
	var irCode;
    var speechOutput;
    var counter = 0;
    var success = false;
    var speechText;
    
    if(increase) {
    	irCode = "AAAAAQAAAAEAAAASAw==";
    	speechText = "increased";
    } else {
    	irCode = "AAAAAQAAAAEAAAATAw==";
    	speechText = "decreased";
    }
	for (var i=0; i < changeBy; i++) {
		sendIRCodeRequest(irCode, function responseCallback(err, codeResponse) {
			if(err) {
				speechOutput = "I had trouble processing this request. Please try again.";
			} else {
				counter++;
			}
			if (counter == changeBy) {
				speechOutput = "Volume " + speechText + " by " + counter;
				callback(speechOutput);
			}
		});
	}
	if (speechOutput) {
		callback(speechOutput);
	}
};

var getPowerStatus = function(responseCallback) {
    console.log("Power Status function requested.");

    request({
        url: 'http://' + config.sony.ip + ':' + config.sony.port + '/sony/system', //URL to hit
        //qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST', 
        headers: {
            'X-Auth-PSK': 'key2013',
            'Content-Type': 'application/json'
        },
        json: {
            "id":20,
            "method":"getPowerStatus",
            "version":"1.0",
            "params":[]
        },
    }, function(error, response, body){
        if(error) {
            console.log('communication error ' + error);
            responseCallback(error, response);
        } 

        else {
            console.log(body);
            console.log(body.result[0].status);
            responseCallback(null, body.result[0].status)
        }
    });
};

var callSonyAPI = function (options, responseCallback) {
    console.log("Calling Sony API");

    request({
            url: 'http://' + config.sony.ip + ':' + config.sony.port + options.url , //URL to hit
            //qs: {from: 'blog example', time: +new Date()}, //Query string data
            method: 'POST', 
            headers: {
                'X-Auth-PSK': 'key2013',
                'Content-Type': 'application/json'
            },
            json: options.jsonmsg,
        }, function(error, response, body){
            if(error) {
                console.log('communication error ' + error);
                responseCallback(error, response);
            } 

            else {
                console.log(body);
                responseCallback(body)
            }
        });
};

module.exports = {
    sendIRCodeRequest : sendIRCodeRequest,
    setVideoInputChange: setVideoInputChange,
    increaseDecreaseVolume: increaseDecreaseVolume,
    muteVolume: muteVolume,
    getPowerStatus: getPowerStatus,
    callSonyAPI: callSonyAPI,
};