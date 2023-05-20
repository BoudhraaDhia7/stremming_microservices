const sqlite3 = require("sqlite3").verbose();
const kafka = require("kafka-node");

// Create and connect to the database
const db = new sqlite3.Database("../../database.db", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log("Base de données connectée.");
});

// Kafka configuration
const kafkaClient = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new kafka.Producer(kafkaClient);

// Function to send a message to the Kafka topic
function sendMessage(topic, message) {
  const payloads = [{ topic, messages: JSON.stringify(message) }];
  producer.send(payloads, (err, data) => {
    if (err) {
      console.error("Error sending message:", err);
    }
    console.log("Message sent:", message);
  });
}

// Create the reservations table if it doesn't exist
// db.run(`...`);

// Define the Reservation model
class Reservation {
  constructor(name, movie_id) {
    this.name = name;
    this.movie_id = movie_id;
  }

  static getAll(callback) {
    db.all("SELECT * from reservations;", [], function (err, rows) {
      if (err) {
        console.error("Error fetching reservations:", err.message);
        callback([]);
      } else {
        console.log("Rows:", rows); // Log the rows retrieved from the database
        const reservations = rows.map(
          (row) => new Reservation(row.name, row.movie_id)
        );
        callback(null, reservations);

        // Send reservation messages to Kafka topic
        reservations.forEach((reservation) => {
          sendMessage("reservation-created", reservation);
        });
      }
    });
  }
}

// Initialize the Kafka producer
producer.on("ready", () => {
  console.log("Kafka producer is ready");
});

// Handle Kafka producer errors
producer.on("error", (err) => {
  console.error("Error initializing Kafka producer:", err);
});

module.exports = Reservation;
