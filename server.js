const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL password here
    database: 'school'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Middleware to check if admin is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.admin) {
        return next();
    } else {
        res.status(401).send('Unauthorized: You need to login first.');
    }
};



// Admin login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    let sql = 'SELECT * FROM admins WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) throw err;
        if (results.length && bcrypt.compareSync(password, results[0].password)) {
            req.session.admin = username;
            res.send('Login successful');
        } else {
            res.status(401).send('Login failed: Incorrect username or password.');
        }
    });
});

// Admin logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logged out');
});



// Protect routes
app.use('/students', isAuthenticated);

// CRUD routes for students
app.post('/students', (req, res) => {
    let student = req.body;
    let sql = 'INSERT INTO students SET ?';
    let query = db.query(sql, student, (err, result) => {
        if (err) throw err;
        res.send('Student added...');
    });
});

app.get('/students', (req, res) => {
    let sql = 'SELECT * FROM students';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.put('/students/:id', (req, res) => {
    let newStudent = req.body;
    let sql = `UPDATE students SET ? WHERE id = ${req.params.id}`;
    let query = db.query(sql, newStudent, (err, result) => {
        if (err) throw err;
        res.send('Student updated...');
    });
});

app.delete('/students', (req, res) => {
    const { id, name } = req.query;

    if (!id && !name) {
        return res.status(400).send('Bad Request: Either ID or name must be provided');
    }

    let sql;
    let params;

    if (id) {
        sql = 'DELETE FROM students WHERE id = ?';
        params = [id];
    } else if (name) {
        sql = 'DELETE FROM students WHERE name = ?';
        params = [name];
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error during deletion:', err);
            return res.status(500).send('Server error');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Student not found');
        } else {
            return res.send('Student deleted');
        }
    });
});

app.get('/students/:id', (req, res) => {
    let sql = 'SELECT * FROM students WHERE id = ?';
    let query = db.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/students/:id', (req, res) => {
    let sql = 'SELECT * FROM students WHERE id = ?';
    let query = db.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
