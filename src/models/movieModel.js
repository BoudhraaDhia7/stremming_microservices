const sqlite3 = require("sqlite3").verbose();

// Create and connect to the database
const db = new sqlite3.Database("../../database.db", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log("Base de données connectée.");
});

// Create the movies table if it doesn't exist
// db.run(`

// CREATE TABLE reservations (
//   id INT PRIMARY KEY,
//   name VARCHAR(255),
//   movie_id INT
// );

// INSERT INTO reservation (id, name, movie_id)
// VALUES
//   (1, 'John', 1),
//   (2, 'Alice', 2),
//   (3, 'Michael', 1),
//   (4, 'Emily', 3),
//   (5, 'David', 2),
//   (6, 'Sophia', 4),
//   (7, 'Daniel', 1),
//   (8, 'Olivia', 3);

// `);

// Define the Movie model
class Movie {
  constructor(title, description, year) {
    this.title = title;
    this.description = description;
    this.year = year;
  }

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
