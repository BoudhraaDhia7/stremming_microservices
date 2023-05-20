const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const kafka = require("kafka-node");

const packageDefinition = protoLoader.loadSync("reservationService.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const reservationProto =
  grpc.loadPackageDefinition(packageDefinition).reservation;

// Import the reservation model
const Reservation = require("../src/models/reservationModel");

function startServer() {
  const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
  const producer = new kafka.Producer(client);

  producer.on("ready", function () {
    console.log("Kafka Producer is ready");

    Reservation.getAll(function (error, reservations) {
      if (error) {
        console.error("Error retrieving reservations:", error);
      } else {
        console.log("Reservations:", reservations);

        const payload = [
          {
            topic: "reservationTopic",
            messages: JSON.stringify(reservations),
          },
        ];

        producer.send(payload, function (error, data) {
          if (error) {
            console.error("Error sending data to Kafka:", error);
          } else {
            console.log("Data sent to Kafka:", data);
          }
        });
      }
    });

    const server = new grpc.Server();
    server.addService(reservationProto.ReservationService.service, {
      GetReservations: getReservations,
    });

    server.bind("0.0.0.0:50052", grpc.ServerCredentials.createInsecure());
    server.start();
    console.log("Microservice 1 gRPC server started on port 50052");
  });

  producer.on("error", function (error) {
    console.error("Kafka Producer error:", error);
  });
}

function getReservations(call, callback) {
  Reservation.getAll(function (error, reservations) {
    if (error) {
      console.error("Error retrieving reservations:", error);
      callback({
        code: grpc.status.INTERNAL,
        details: "Error retrieving reservations",
      });
    } else {
      console.log("Reservations:", reservations);
      callback(null, { reservations });
    }
  });
}

startServer();
