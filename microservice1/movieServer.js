const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

// Load the protobuf file
const packageDefinition = protoLoader.loadSync("movieService.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the protobuf file for the movie service definition and create a gRPC client from it 
const movieProto = grpc.loadPackageDefinition(packageDefinition).movie;

// Import the Movie modela from the movieModel.js file
const Movie = require("../src/models/movieModel");


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


// Resolvers define the technique for fetching the types defined in the schema above and start the gRPC server on port 50051 
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
