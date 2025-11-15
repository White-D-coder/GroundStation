export const ARDUINO_CODE = `
// Define sensor pin
const int sensorPin = A0;

// Potentiometer reading
int sensorValue = 0; 

void setup() {
  // Start serial communication
  Serial.begin(9600);
}

void loop() {
  // Read the input on analog pin 0:
  sensorValue = analogRead(sensorPin);

  // Print out the value you read:
  Serial.println(sensorValue);

  // Wait 100 milliseconds before the next reading
  delay(100);
}
`;
