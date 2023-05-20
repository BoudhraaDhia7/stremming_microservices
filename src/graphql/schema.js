const { gql } = require("apollo-server-express");

// The GraphQL schema in string form - this is the schema definition language, or SDL
const typeDefs = gql`
  type Movie {
    id: Int
    title: String
    description: String
    year: Int
  }

  type Query {
    movies: [Movie]
  }
`;

module.exports = typeDefs;
