const sqlite3 = require("sqlite3").verbose();

// Crear una conexión a la base de datos
const db = new sqlite3.Database("students.sqlite", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Crear la tabla `students`
const sqlQuery = `
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        gender TEXT NOT NULL,
        age TEXT
    )
`;

db.run(sqlQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  } else {
    console.log("Table `students` created successfully.");
  }

  // Cerrar la conexión a la base de datos
  db.close((err) => {
    if (err) {
      console.error("Error closing the database connection:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
