const express = require("express");
const kafka = require("kafka-node");
const movieMiddleware = require("../../middleware/middleware"); // Import the movieMiddleware

const router = express.Router();
const kafkaClient = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(kafkaClient, [
  { topic: "movieTopic", partition: 0 },
]);

// Kafka producer configuration
const Producer = kafka.Producer;
const producer = new Producer(kafkaClient);

producer.on("ready", function () {
  console.log("Kafka producer is ready");
});

producer.on("error", function (error) {
  console.error("Error occurred in Kafka producer:", error);
});

// GET /api/v1/movies
router.get("/", (req, res) => {
  console.log("GET /api/v1/movies");

  const movies = req.movies; // Retrieve movies from the middleware

  const payload = [
    {
      topic: "movieTopic",
      messages: JSON.stringify(movies),
    },
  ];

  producer.send(payload, function (error, data) {
    if (error) {
      console.error("Error sending data to Kafka:", error);
      res.status(500).json({ error: "Failed to publish message to Kafka" });
    } else {
      console.log("Data sent to Kafka:", data);
      res
        .status(200)
        .json({ message: "Message published to Kafka successfully" });
    }
  });
});

// POST /api/v1/kafka/publish
router.post("/publish", async (req, res) => {
  const { topic, message } = req.body;

  try {
    // Retrieve movies from the microservice via gRPC using movieMiddleware
    const movies = await movieMiddleware.getMoviesFromMicroservice();

    // Publish the movies to Kafka
    const payload = [
      {
        topic: topic,
        messages: JSON.stringify(movies),
      },
    ];

    producer.send(payload, function (error, data) {
      if (error) {
        console.error("Error sending data to Kafka:", error);
        res.status(500).json({ error: "Failed to publish message to Kafka" });
      } else {
        console.log("Data sent to Kafka:", data);
        res
          .status(200)
          .json({ message: "Message published to Kafka successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve movies" });
  }
});

// Kafka consumer
consumer.on("message", (message) => {
  const movieData = JSON.parse(message.value);

  // Perform necessary actions with the movie data received from Kafka
  console.log("Received movie data from Kafka:", movieData);
  // Process the movie data as needed
});

module.exports = router;
