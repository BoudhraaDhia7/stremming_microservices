const { gql } = require("apollo-server-express");

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
