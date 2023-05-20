const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const movieProtoPath = path.join(
  __dirname,
  "../../microservice1/movieService.proto"
);

const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;

// Create a gRPC client
const client = new movieProto.MovieService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

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
