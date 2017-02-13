var Gpio = require('pigpio').Gpio;
var Milight = require("milight");

var milight = new Milight({
    host: "192.168.1.255",
    broadcast: true
}), pourcentage = 100;

var NBSEC_BEFORE_OFF = 500 ;

// led control
var led = new Gpio(17, {mode: Gpio.OUTPUT}),
 dutyCycle = 0;

var sensor = new Gpio(4, {mode: Gpio.INPUT}),
  nbRep=0, val;

if(sensor.digitalRead() == 1) {
  milight.on();
}

setInterval(function(){
  if(val == sensor.digitalRead()){
    nbRep++;
  }
  else {
    nbRep=0;
  }
  val = sensor.digitalRead();
  if(val == 0 && nbRep > NBSEC_BEFORE_OFF){
    dutyCycle = 0;
    milight.off();
  }
  else if (val == 0 && pourcentage > 0 ){
    pourcentage-- ;
    milight.zone(1).white(pourcentage);
  }
  else if (val == 1) {
    pourcentage = 100 ;
    dutyCycle = 255;
    milight.zone(1).white(pourcentage);
  }
  // milight.zone(1).white(pourcentage);
  led.pwmWrite(dutyCycle);
  console.log("-----------------------");
  console.log("Sensor value : " + val);
  console.log("nbRep : " + nbRep);
  console.log("pourcentage : " + pourcentage);
}, 1000);
