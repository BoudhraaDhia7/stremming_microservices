const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./src/graphql/schema.js");
const resolvers = require("./src/graphql/resolver.js");
const movieRoutes = require("./src/routes/movieRoutes.js");
const reservationRoutes = require("./src/routes/reservationRoutes.js");

const app = express();

// Define the GraphQL schema
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
async function startServer() {
  await server.start();

  // Apply the GraphQL server to the Express app
  server.applyMiddleware({ app });

  // Import routes for the rest api
  app.use("/api/v1/movies", movieRoutes);
  app.use("/api/v1/reservations", reservationRoutes);

  app.listen({ port: 3000 }, () => console.log(`Server running at port 3000`));
}

startServer();
