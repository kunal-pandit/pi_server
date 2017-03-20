/**
 * http://usejsdoc.org/
 */

var bodyParser = require('body-parser');
var express = require('express');
var outBose = require('./../outgoing/boseSoundtouch');

var router = express.Router();
router.use(bodyParser.json());

router.post('/mute', function(req,res){ 
    console.log("User request to mute bose soundtouch");

    outBose.sendKey('press', 'MUTE', function responseCallback(speechOutput) {
        console.log(speechOutput);
    });
    
    outBose.sendKey('release', 'MUTE', function responseCallback(speechOutput) {
        console.log(speechOutput);
        res.send(speechOutput);
    });
});

router.post('/power', function(req,res){ 
    console.log("User request to press power button");
    var power = req.headers.power;
    
    outBose.checkNowPlaying(function(isOn) {
		if (isOn && power == 'off') {
			outBose.sendKey('press', 'POWER', function responseCallback(speechOutput) {
		        console.log(speechOutput);
		    });
		    
		    outBose.sendKey('release', 'POWER', function responseCallback(speechOutput) {
		        console.log(speechOutput);
		        res.send(speechOutput);
		    });
		} else if (!isOn && power == 'on') {
			outBose.sendKey('press', 'POWER', function responseCallback(speechOutput) {
		        console.log(speechOutput);
		    });
		    
		    outBose.sendKey('release', 'POWER', function responseCallback(speechOutput) {
		        console.log(speechOutput);
		        res.send(speechOutput);
		    });
		} else {
			res.send('Bose is already ' + power);
		}
	});
});


router.post('/set-volume', function(req, res){
    var volume = req.headers.volume;
    console.log("User requested to set volume to " + volume);

    outBose.setVolume(volume, function responseCallback(speechOutput) {
        console.log(speechOutput);
        res.send(speechOutput);
    });
});

module.exports = router;