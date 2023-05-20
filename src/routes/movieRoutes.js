const express = require("express");
const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");
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
const clientMovies = new movieProto.MovieService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
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
// GET /api/v1/movies
//router.get("/", movieController.getMovies);

// GET /api/v1/movies/:id
// router.get("/:id", movieController.getMovieById);

// // POST /api/v1/movies
// router.post("/", movieController.createMovie);

// // PUT /api/v1/movies/:id
// router.put("/:id", movieController.updateMovie);

// // DELETE /api/v1/movies/:id
// router.delete("/:id", movieController.deleteMovie);
