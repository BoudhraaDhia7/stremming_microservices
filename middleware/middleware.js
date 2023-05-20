const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const movieProtoPath = path.join(
  __dirname,
  "../microservice1/movieService.proto"
); // Update with the correct path
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath);
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;

// Create gRPC client
const client = new movieProto.MovieService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Function to retrieve movies from the microservice
async function getMoviesFromMicroservice() {
  return new Promise((resolve, reject) => {
    client.getMovies({}, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response.movies);
      }
    });
  });
}

module.exports = { getMoviesFromMicroservice };
