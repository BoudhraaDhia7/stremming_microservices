const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

// Load the protobuf file for the reservation service definition and create a gRPC client from it
const packageDefinition = protoLoader.loadSync("reservationService.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the protobuf file
const reservationProto =
  grpc.loadPackageDefinition(packageDefinition).reservation;

// Import the reservation model from the reservationModel.js file
const Reservation = require("../src/models/reservationModel");

// Resolvers define the technique for fetching the types defined in the schema above
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

// Resolvers define the technique for fetching the types defined in the schema above and start the gRPC server on port 50052
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
