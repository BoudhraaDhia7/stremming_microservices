const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load the protobuf
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
const client = new movieProto.MovieService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Resolvers define the technique for fetching the types defined in the schema above
const movieResolver = {
  Query: {
    movies: () => {
      return new Promise((resolve, reject) => {
        client.GetMovies({}, (error, response) => {
          if (error) {
            console.error("Error retrieving movies:", error);
            reject(error);
          } else {
            const movies = response.movies;
            resolve(movies);
          }
        });
      });
    },
  },
};

module.exports = movieResolver;
