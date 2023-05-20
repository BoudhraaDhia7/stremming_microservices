const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

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

function startServer() {
  const server = new grpc.Server();
  server.addService(reservationProto.ReservationService.service, {
    GetReservations: getReservations,
  });

  server.bind("0.0.0.0:50052", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("Microservice 1 gRPC server started on port 50052");
}

startServer();
