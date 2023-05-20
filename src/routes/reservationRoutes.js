const express = require("express");
const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");
const reservationProtoPath = path.join(
  __dirname,
  "../../microservice2/reservationService.proto"
);

// Load the protobuf from the reservation service definition and create a gRPC client from it
const reservationProtoDefinition = protoLoader.loadSync(reservationProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the protobuf
const reservationProto = grpc.loadPackageDefinition(
  reservationProtoDefinition
).reservation;
// Create a gRPC client for the reservation service defined in the reservationService.proto file
const clientReservations = new reservationProto.ReservationService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);
// Import the Reservation model from the reservationModel.js file
const router = express.Router();
// GET /api/v1/reservations
router.get("/", (req, res) => {
  console.log("GET /api/v1/reservations");
  clientReservations.getReservations({}, (error, result) => {
    if (!error) {
      res.json(result);
    } else {
      res.status(500).json({ error });
    }
  });
});

module.exports = router;
