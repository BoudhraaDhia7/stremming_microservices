const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const kafka = require("kafka-node");

// Load the protobuf
const packageDefinition = protoLoader.loadSync("movieService.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the protobuf
const movieProto = grpc.loadPackageDefinition(packageDefinition).movie;

// Import the Movie model
const Movie = require("../src/models/movieModel");
const kafkaClient = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });

// Resolvers define the technique for fetching the types defined in the schema above
function getMovies(call, callback) {
  Movie.getAll(function (error, movies) {
    if (error) {
      console.error("Error retrieving movies:", error);
      callback({
        code: grpc.status.INTERNAL,
        details: "Error retrieving movies",
      });
    } else {
      console.log("Movies:", movies);
      callback(null, { movies });
    }
  });
}

// Resolvers define the technique for fetching the types defined in the schema above
function startServer() {
  const consumer = new kafka.Consumer(
    kafkaClient,
    [{ topic: "reservationTopic" }],
    { autoCommit: true }
  );

  consumer.on("message", function (message) {
    console.log("Received message from Kafka:", message.value.toString());

    // Process the message and save it to the database
    const reservationData = JSON.parse(message.value);
    
    // Save reservationData to the Reservation model 
    getMovies(null, function (error, response) {
      if (error) {
        console.error("Error fetching movies:", error);
      } else {
        console.log("Movies:", response.movies);
      }
    });
  });

  consumer.on("error", function (error) {
    console.error("Kafka Consumer error:", error);
  });

  const server = new grpc.Server();
  server.addService(movieProto.MovieService.service, {
    GetMovies: getMovies,
  });
  server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("Microservice 1 gRPC server started on port 50051");
}

startServer();
