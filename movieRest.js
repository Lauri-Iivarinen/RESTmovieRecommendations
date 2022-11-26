//Restful service for movie recommendations app

const express = require('express');
const app = express();

//security?
var helmet = require('helmet');
app.use(helmet({
    crossOriginResourcePolicy: false
}));

app.use(express.json());
app.use(express.urlencoded({
    limit: '5mb',
    extended: true
}));

const cors = require('cors');
app.use(cors());

//Database
const sqlite = require('sqlite3');
const db = new sqlite.Database('movielist.db');

app.listen(8080, () => {
    console.log('Rest service running.');
});

//connection test
app.get('/ping', (req, res, next) => {
    return res.status(200).json({
        error: false,
        message: 'Pong'
    });
});

//Find all movies from db
app.get('/movies', (req, res, next) => {
    const sql = 'SELECT id,title,watched,rating,review,img FROM movielist;'

    db.all(sql, (err, result) => {
        if (err) throw error
        return res.status(200).json(result);
    })
});

//Add one movie to db
app.post('/movies', (req, res, next) => {
    let movie = req.body
    console.log(movie)
    const sql = 'INSERT INTO movielist (id, title, watched, rating, review, img) VALUES(?,?,?,?,?,?);'
    
    db.run(sql, [movie.id, movie.title, movie.watched, movie.rating, movie.review, movie.img], (error, result) => {
        
        if (error) throw error

        return res.status(200).json({
            count: 1
        })
    })
});

//Delete one movie from db based on id
app.post('/delete', (req, res, next) => {
    let body = req.body
    let id = body.id
    const sql = 'DELETE FROM movielist WHERE id=?'

    db.run(sql, [id],(error, result) => {
        if (error) throw error

        return res.status(200).json({
            count: 1
        })
    })
})