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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is running on port ${ PORT }`);
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
    const sql = 'SELECT id,title,watched,rating,review,img,genres FROM movielist ORDER BY watched DESC;'

    db.all(sql, (err, result) => {
        if (err) throw error
        return res.status(200).json(result);
    })
});

//Add one movie to db
app.post('/movies', (req, res, next) => {
    let movie = req.body
    console.log(movie)
    const sql = 'INSERT INTO movielist (id, title, watched, rating, review, img, genres) VALUES(?,?,?,?,?,?,?);'

    const postMovie = () => {
        db.run(sql, [movie.id, movie.title, movie.watched, movie.rating, movie.review, movie.img, movie.genres], (error, result) => {
        
            if (error) throw error
    
            return res.status(200).json({
                count: 1
            })
        })
    }

    //check for existing movie
    db.all('SELECT count(id) as count FROM movielist WHERE id=?;', [movie.id], (error, result) => {
        if (error) throw error
        console.log(result)
        if (result[0].count === 0) postMovie() //movie is saved if there are no results with same id
        else {
            return res.status(200).json({
                count: 0
            })
        }
    })
    
});

app.put('/movies', (req, res, next) => {
    let movie = req.body
    console.log(movie)
    const sql = 'UPDATE movielist SET watched=?, rating=?, review=? WHERE id=?;'
    
    db.run(sql, [movie.watched, movie.rating, movie.review, movie.id], (error, result) => {
        
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
    console.log('deleting: ' + id)
    const sql = 'DELETE FROM movielist WHERE id=?'

    db.run(sql, [id],(error, result) => {
        if (error) throw error

        return res.status(200).json({
            count: 1
        })
    })
})

app.get('/topthree', (req, res, next) => {
    const sql = 'SELECT id FROM movielist ORDER BY rating DESC LIMIT 3;'

    db.all(sql, (error, result) => {
        if (error) throw error
        if (result.length > 0) {
            return res.status(200).json(result);
        }
        return res.status(200).json([]);
    })
});

app.get('/all-id', (req, res, next) => {
    const sql = "SELECT id FROM movielist;"

    db.all(sql, (error, result) => {
        if (error) throw error
        if (result.length > 0) {
            return res.status(200).json(result);
        }
        return res.status(200).json([]);
    })
})