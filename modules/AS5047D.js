/*
| SPI | MOSI | MISO | CLK | SS |
+------+------+------+-----+----+
| HSPI | 13 | 12 | 14 | 15 |
| VSPI | 23 | 19 | 18 | 5 |

 We have mapped 
 SPI1 -> HSPI 
 SPI2 -> VSPI.
 
 Connection table
 
 | AS5047D | ESP32 | NAME |
 +---------+-------+------+
 |  pin 12 |  3V3  +  VCC +
 |  pin 13 |  GND  +  GND +
 |  pin 1  |  D15  +  nCS +
 |  pin 2  |  D14  +  CLK +
 |  pin 3  |  D12  + MISO +
 |  pin 4  |  D13  + MOSI +
 
*/
//var exports = {};
/*
require('AS5047D').connect(1000);
function PrintEncoderValue(){
EncoderProc();
//print(pos+" "+ dif+" "+ a16);
}
if you want load modul to FS first time shold format fs by
E.flashFatFS({format:true});
*/

var 
    a = 0,
    a16=0,
    a16_=0 ,
    dif,
    pos=0,
    i ; 


function AS5047D (interval){
    //inint SPI interface
  SPI1.setup({mode:1});
    //send first command 
  SPI1.send([0b11111111,0xFF],D15) ;
    //run EncoderProc
  i = setInterval(EncoderProc,interval);
}

 AS5047D.prototype.stop = function(){
 clearInterval(i);
};

AS5047D.prototype.pos = pos;



//read and update encoder value
function EncoderProc (){
 //read data frame  
a = SPI1.send([0b11111111,0xFF],D15);
  //extract angel value
a16 = (a[1]+(a[0]<<8)) & 0x3FFF; 
  //accumulate  with previos value
  //calculate module of absolute value 

  //calculate position difference 
 dif = a16-a16_;
  if (dif < -0x01FFF) {dif += 0x3FFF;}
  if (dif > 0x1FFF){dif -=  0x3FFF;} 
  a16_= a16;   
  //
  pos += dif ;  //return absolut angel
  print(pos);
}



exports.connect = function (interval){
  if(interval === undefined ){ interval = 1000;}
  return new AS5047D(interval);
};
