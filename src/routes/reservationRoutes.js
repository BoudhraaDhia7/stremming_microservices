const express = require("express");
const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");
const reservationProtoPath = path.join(
  __dirname,
  "../../microservice2/reservationService.proto"
);

const reservationProtoDefinition = protoLoader.loadSync(reservationProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const reservationProto = grpc.loadPackageDefinition(
  reservationProtoDefinition
).reservation;
const clientReservations = new reservationProto.ReservationService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);
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
