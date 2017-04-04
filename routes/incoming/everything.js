/**
 * http://usejsdoc.org/
 */

var outBose = require('./../outgoing/boseSoundtouch');
var outSonyBravia = require('./../outgoing/sonyBravia');

router.post('/power', function(req,res){ 
    console.log("User request to power on/off everything");
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