const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('movielist.db')

db.serialize( () => {
    
    let sql = 'CREATE TABLE movielist(' +
        'id integer PRIMARY KEY not null' +
        ',title varchar(40)' +
        ',watched date' +
        ',rating integer' +
        ',review text' + 
        ',img varchar(40)' +
        ');'
    
    db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log("Created table");
    })

    //Add test data
    sql = 'INSERT INTO movielist(id,title,watched,rating,review,img) VALUES(' +
        '238' +
        ',"The Godfather"' +
        ',"2022-11-26"' +
        ',9' +
        ',"Banger of a movie"' +
        ',"3bhkrj58Vtu7enYsRolD1fZdja1.jpg"' +
        ');'
    
    db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log("Insert OK");
    })

    sql = 'INSERT INTO movielist(id,title,watched,rating,img) VALUES(' +
        '278' +
        ',"Shawshank Redemption"' +
        ',"2022-10-15"' +
        ',8' +
        ',"q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"' +
        ');'

    db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log("Insert OK");
    })


    db.each('SELECT id,title,watched,rating,review,img FROM movielist', function (err, row) {
        if (err) {
            return console.log(err.message);
        }
        console.log(row.id + ", " + row.title + ', ' + row.watched + ', ' +row.rating + ', ' + row.img + ', ' + row.review);
    })

    db.close();
})