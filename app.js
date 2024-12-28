const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();
const port = 8000;

const upload = multer();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const db = new sqlite3.Database("students.sqlite", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Routes
app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      res.status(500).send("Error fetching students");
    } else {
      const students = rows.map((row) => ({
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        gender: row.gender,
        age: row.age,
      }));
      res.json(students);
    }
  });
});

app.post("/students", upload.none(), (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  const sql =
    "INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)";
  db.run(sql, [firstname, lastname, gender, age], function (err) {
    if (err) {
      console.log("--err--");
      console.log(err);
      res.status(500).send("Error creating student");
    } else {
      res.send(`Student with id: ${this.lastID} created successfully`);
    }
  });
});

app.get("/student/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).send("Error fetching student");
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send("Student not found");
    }
  });
});

app.put("/student/:id", upload.none(), (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, gender, age } = req.body;
  const sql =
    "UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?";
  db.run(sql, [firstname, lastname, gender, age, id], function (err) {
    if (err) {
      res.status(500).send("Error updating student");
    } else {
      res.json({ id, firstname, lastname, gender, age });
    }
  });
});

app.delete("/student/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM students WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).send("Error deleting student");
    } else {
      res.send(`The Student with id: ${id} has been deleted.`);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
