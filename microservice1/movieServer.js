const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync("movieService.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const movieProto = grpc.loadPackageDefinition(packageDefinition).movie;

// Import the Movie modela
const Movie = require("../src/models/movieModel");

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

function startServer() {
  const server = new grpc.Server();
  server.addService(movieProto.MovieService.service, {
    GetMovies: getMovies,
  });
  server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("Microservice 1 gRPC server started on port 50051");
}

startServer();
