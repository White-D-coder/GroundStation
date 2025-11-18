import { SerialPort, ReadlineParser } from "serialport";
import mysql from "mysql2";

export default function startSerial(io) {
  // ======================================================
  // 1. CREATE A MYSQL POOL (never closes, auto-reconnect)
  // ======================================================
  const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "djdevil09876",
    database: "GroundStation",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.warn("⚠️ MySQL connection failed:", err.message);
      console.warn("Continuing without database...");
    } else {
      console.log("✅ MySQL connected to GroundStation");
      connection.release();
    }
  });

  // ======================================================
  // 2. PACKET COUNTER & DATA STORAGE
  // ======================================================
  let packetId = 0;

  // ======================================================
  // 3. SERIAL PORT SETUP
  // ======================================================
  try {
    const serialPort = new SerialPort({
      path: "/dev/cu.usbmodem101",
      baudRate: 9600
    });

    const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

    console.log("🔌 Listening to Arduino Serial...");

    // ======================================================
    // 4. SERIAL DATA EVENT
    // ======================================================
    parser.on("data", line => {
      const value = parseInt(line.trim());

      if (!isNaN(value)) {
        packetId++;
        const voltage = ((value / 1023) * 5).toFixed(2);

        // ===============================================
        // SAVE TO MYSQL SAFELY (POOL.query NEVER FAILS)
        // ===============================================
        pool.query(
          "INSERT INTO potentiometer_readings (value, voltage) VALUES (?, ?)",
          [value, voltage],
          (err) => {
            if (err) console.log("⚠️ DB insert error:", err.message);
          }
        );

        // ===============================================
        // EMIT TO FRONTEND IN CUBESAT FORMAT
        // ===============================================
        const telemetryData = {
          packetId: packetId,
          battery: voltage,              // Map voltage to battery
          solar: (voltage * 0.8).toFixed(2),  // Derived from battery
          
          // IMU Data (can be expanded if you have more sensors)
          accX: (Math.random() * 2 - 1).toFixed(2),
          accY: (Math.random() * 2 - 1).toFixed(2),
          accZ: (9.8).toFixed(2),
          
          gyroX: (Math.random() * 10 - 5).toFixed(2),
          gyroY: (Math.random() * 10 - 5).toFixed(2),
          gyroZ: (Math.random() * 10 - 5).toFixed(2),
          
          // Environmental Data
          altitude: (value * 0.1).toFixed(2),  // Scale potentiometer value to altitude
          pressure: (101325 + value).toFixed(0),
          temp: (25 + Math.random() * 5).toFixed(2),
          
          // GPS Data
          lat: (37.7749 + (value - 512) * 0.00001).toFixed(6),
          long: (-122.4194 + (value - 512) * 0.00001).toFixed(6),
          sats: Math.floor(value / 50)
        };

        io.emit("new_data", telemetryData);

        console.log(`📡 Packet #${packetId} | ADC: ${value} | Voltage: ${voltage}V | Altitude: ${telemetryData.altitude}m`);
      }
    });

    // SERIAL ERRORS
    parser.on("error", err => {
      console.error("Serial Error:", err.message);
    });

    serialPort.on("error", err => {
      console.error("Serial Port Error:", err.message);
    });

  } catch (err) {
    console.warn("⚠️ Serial port not available:", err.message);
    console.warn("Server running without serial connection. Connect Arduino to use.");
  }
}

