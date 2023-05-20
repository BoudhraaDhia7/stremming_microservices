const express = require("express");
const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");
const movieProtoPath = path.join(
  __dirname,
  "../../microservice1/movieService.proto"
);

// Load the protobuf from the movie service definition and create a gRPC client from it
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the protobuf
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;

// Create a gRPC client for the movie service defined in the movieService.proto file
const clientMovies = new movieProto.MovieService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Import the Movie model from the movieModel.js file
const router = express.Router();
// GET /api/v1/movies
router.get("/", (req, res) => {
  console.log("GET /api/v1/movies");
  clientMovies.getMovies({}, (error, result) => {
    if (!error) {
      res.json(result);
    } else {
      res.status(500).json({ error });
    }
  });
});
module.exports = router;
s;
