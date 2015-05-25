#include <Servo.h> 

Servo myservo;  // create servo object to control a servo 
Servo myservo2;  
char response;
int x = 90;
int y = 90;

void setup() { 
  myservo.attach(6);  // attaches the servo on pin 9 to the servo object 
  myservo2.attach(7);  // attaches the servo on pin 9 to the servo object 
 //Initialize serial and wait for port to open:
  Serial.begin(9600);
   myservo.write(x);  
   myservo2.write(y);   
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  
  // prints title with ending line break 
  Serial.println("ASCII Table ~ Character Map"); 
} 

void loop() { 
  if (Serial.available() > 0) {  // if the data came      
      response = Serial.read(); // read byte       
  }else{
      doSomething(response);
      delay(100);
      response = 'z';      
  }
}

void doSomething(char resp){
  if(resp == '1'){
    x+=20;
    myservo.write(x);  
  }else if(resp == '2'){
    x-=20;
    myservo.write(x);
  }else if(resp == '3'){  
    y+=20;
    myservo2.write(y);
  }else if(resp == '4'){
    y-=20;
    myservo2.write(y);
    delay(100);
  }else if(resp == 'l'){
    digitalWrite(5, HIGH);
  }else if (resp == 'f'){
    digitalWrite(5, LOW);
  }
}

