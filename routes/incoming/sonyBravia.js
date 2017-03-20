/**
 * http://usejsdoc.org/
 */
var bodyParser = require('body-parser');
var express = require('express');
var outSonyBravia = require('./../outgoing/sonyBravia');

var router = express.Router();
router.use(bodyParser.json());

//respond with "hello world" when a GET request is made to the homepage
router.get('/', function(req, res) {
  res.send('Sony API');
});

router.post('/power',function(req,res){
    var power = req.headers.power; 
    console.log("User request TV Power " + power);
    var powerIntent = '';

    //sets the users power intent variable      
    switch (power) {
        case "on": powerIntent = 'active'; break;
        case "off": powerIntent = 'standby'; break;
    }
    console.log("User has requested that the TV turn " + powerIntent);

    //retrieves the Sony Bravia power status
    var powerstatus = "";

    outSonyBravia.getPowerStatus(function responseCallback(err, codeResponse) {

        if (err) {
            res.send("I cannot do that right now. Please try again");
        } else {

            console.log(codeResponse + " status has been retrieved from function.");
        
            //if powerIntent already matches the power status. does nothing. otherwise turns power on/off
            if (powerIntent == codeResponse) {
                res.send("The TV is already " + power);
            } else {
                console.log("TV has been turned " + power)

                outSonyBravia.sendIRCodeRequest("AAAAAQAAAAEAAAAVAw==", function responseCallback(err, codeResponse) {
                res.send("I have switched the TV " + power);
                });
            }
        }        
    });   
});

router.post('/video-input', function(req,res){
    var inputNumber = req.headers.input; 
    console.log("User request TV Input change to " + inputNumber);

    //calls the VideoInputChange function to
    outSonyBravia.setVideoInputChange(inputNumber, function responseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/decrease-volume', function(req, res){
    var volume = req.headers.volume; 
    console.log("User requested decrease volume by " + volume);

    outSonyBravia.increaseDecreaseVolume(volume, false, function responseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/increase-volume', function(req, res){
    var volume = req.headers.volume; 
    console.log("User requested increase volume by " + volume);

    outSonyBravia.increaseDecreaseVolume(volume, true, function responseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

//this leaves a bug open that calling mute or unmute on alexa app would just toggle the button
//won't actually check if it is mute or not
router.post('/mute', function(req, res) { 
    console.log("User requested mute");

    outSonyBravia.muteVolume(function responseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/set-volume',function(req,res){
    var newVolume = req.headers.volume; 
    console.log("User request to change volume to " + newVolume);

    //builds message
    var options = {
      url: "/sony/audio",
      jsonmsg: {"method":"setAudioVolume","params":[{"target":"speaker","volume": newVolume}],"id":10, "version":"1.0"},
    }

    //calls the VideoInputChange function to
    outSonyBravia.callSonyAPI(options, function ResponseCallback(speechoutput) {
      console.log(speechoutput + 'received');
      console.log(speechoutput.length);

      try {
        if (speechoutput.result.length > 0) {
          message = "The volume has been changed to " + newVolume;
        }        
      } catch(e) {
          message = "The Display is turned off or I am having trouble setting the volume";
      }
      console.log(message);
      res.send(message);
    });
});

//Export Module
module.exports = router;

//module.exports = function(app){
//    app.get('/', function(req, res){
//    	res.send('Sony API');
//    });
//    //other routes..
//}