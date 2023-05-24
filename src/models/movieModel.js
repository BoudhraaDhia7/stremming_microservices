const sqlite3 = require("sqlite3").verbose();

// Create and connect to the database file (if it doesn't exist, it will be created) and create the movies table if it doesn't exist
const db = new sqlite3.Database("../../database.db", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log("Base de données connectée.");
});

//Create the movies table if it doesn't exist
// db.run(`

// INSERT INTO movies (title, description, year)
//     VALUES
//       ('Movie 1', 'Description 1', 2021),
//       ('Movie 2', 'Description 2', 2022),
//       ('Movie 3', 'Description 3', 2023),
//       ('Movie 4', 'Description 4', 2024),
//       ('Movie 5', 'Description 5', 2025);

// `);

// Define the Movie model
class Movie {
  constructor(title, description, year) {
    this.title = title;
    this.description = description;
    this.year = year;
  }

  // Define the getAll method to retrieve all movies from the database
  static getAll(callback) {
    db.all("SELECT * from movies;", [], function (err, rows) {
      if (err) {
        console.error("Error fetching movies:", err.message);
        callback([]);
      } else {
        const movies = rows.map(
          (row) => new Movie(row.title, row.description, row.year)
        );
        callback(null, movies);
      }
    });
  }
}

module.exports = Movie;
