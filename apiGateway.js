const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./src/graphql/schema.js");
const resolvers = require("./src/graphql/resolver.js");
const movieRoutes = require("./src/routes/movieRoutes.js");
const reservationRoutes = require("./src/routes/reservationRoutes.js");
const kafkaRoutes = require("./src/routes/kafkaRoutes.js");

// Import the movieMiddleware
const movieMiddleware = require("./middleware/middleware.js");

const app = express();

// Define the GraphQL schema
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
async function startServer() {
  await server.start();

  // Apply the GraphQL server to the Express app
  server.applyMiddleware({ app });

  // Middleware to retrieve movies from the microservice
  app.use(async (req, res, next) => {
    try {
      // Retrieve movies from the microservice via gRPC using movieMiddleware
      const movies = await movieMiddleware.getMoviesFromMicroservice();
      req.movies = movies; // Store the movies in the request object
      next();
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve movies" });
    }
  });

  // Import routes for the rest api
  app.use("/api/v1/movies", movieRoutes);
  app.use("/api/v1/reservations", reservationRoutes);
  app.use("/api/v1/kafka", kafkaRoutes);
  app.listen({ port: 3000 }, () => console.log(`Server running at port 3000`));
}

startServer();
