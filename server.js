// Import required modules
const express = require('express'); //Used to create a server
const mysql = require('mysql2'); //Used to connect to the database
const dotenv = require('dotenv'); //Used to load environment variables

// Load environment variables
dotenv.config();

//Initialize the database connection
const db = mysql.createConnection({
    host: process.env.MYSQL_SERVER,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

//Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

//Create the server
const app = express();

//Parse JSON bodies in the request
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running perfectly' });
});

//Get all items from the inventory
app.get('/inventory', (req, res) => {
    const query = 'SELECT * FROM inventory';
    db.query(query, (err, results) => {
        res.status(200).json(results);
    });
});

//Search for an item in the inventory
app.get('/search', (req, res) => {
    const { name } = req.query;
    const query = 'SELECT * FROM inventory WHERE name LIKE ?';
    db.query(query, [name], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error searching for item' });
        } else {
            res.status(200).json(results);
        }
    });
});

//Search by quantity
app.get('/search/quantity', (req, res) => {
    const { quantity } = req.query;
    const query = 'SELECT * FROM inventory WHERE quantity = ?';
    db.query(query, [quantity], (err, results) => {
        res.status(200).json(results);
    });
});

//Add an item to the inventory
app.post('/inventory/add', (req, res) => {
    const { name, quantity } = req.body;
    const query = 'INSERT INTO inventory (name, quantity) VALUES (?, ?)';
    db.query(query, [name, quantity], (err, results) => {
        res.status(200).json(results);
    });
});

//Delete an item from the inventory
app.delete('/inventory/delete', (req, res) => {
    const { id } = req.body;
    const query = 'DELETE FROM inventory WHERE id = ?';
    db.query(query, [id], (err, results) => {
        res.status(200).json(results);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});