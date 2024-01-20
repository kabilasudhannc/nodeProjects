import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import morgan from "morgan";
import pg from "pg";

const app = express();
const port = 4000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan('combined'));

const db = new pg.Client({
    database: 'notes',
    user: 'postgres',
    password: 'admin',
    port: 5432,
    host: 'localhost'
});

db.connect();

app.get('/books', async (req, res) => {
    try{

        const sort = req.query.sort;
        
        let query = `SELECT * FROM book`;

        if (sort !== 'undefined') query += ` ORDER BY ${sort} DESC`;

        console.log(query);

        const books = await db.query(query);
        console.log(books.rows);
        res.json({result: books.rows, message: 'Fetch successful!'}).status(200);

    } catch(e){
        console.log(e);
        res.json({error: 'error fetching books!'}).status(400);
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await db.query('SELECT * FROM book LEFT JOIN my_note ON book.id = my_note.book_id WHERE book.id = $1', [bookId]);
        res.json({result: book.rows, message: 'Fetch successful!'}).status(200);
    } catch (e) {
        console.log(e);
        res.json({error: "The book id you're trying to fetch is not available"}).status(400);
    }
});

app.post('/addBook', async (req, res) => {
    try {
        const isbnNumber = req.body.isbnNumber;
        const bookTitle = req.body.bookTitle;
        const rating = req.body.rating;
        const description = req.body.description;
        const author = req.body.author;
        const bookCover = `https://covers.openlibrary.org/b/isbn/${isbnNumber}-M.jpg?default=false`

        console.log(req.body);

        const result = await db.query('INSERT INTO book(isbnNumber, title, rating, description, author, bookCover) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [
            isbnNumber, bookTitle, rating, description, author, bookCover
        ]);

        res.json({result: result.rows, message: 'Added successfully!'}).status(200);
    } catch(e) {
        console.log(e);
        res.json({ error: 'failed to add book please try again later!'}).status(400);
    }
});

app.put('/editBook', async (req, res) => {
    try {
        const bookId = req.body.bookId;
        const result = await db.query(`SELECT * FROM book WHERE id=$1`, [bookId]);
        const data = result.rows[0];
        const bookTitle = req.body.bookTitle ? req.body.bookTitle : data.title;
        const rating = req.body.rating ? req.body.rating : data.rating;
        const description = req.body.description ? req.body.description : data.description;
        const author = req.body.author ? req.body.author : data.author;

        const updatedResult = await db.query('UPDATE book SET title=$1, rating=$2, description=$3, author=$4 WHERE id = $5 RETURNING *', [
            bookTitle, rating, description, author, bookId
        ]);

        res.json({result: updatedResult.rows, message: 'Updated successfully!'}).status(200);
    } catch(e) {
        console.log(e);
        res.json({error: 'Unable to update book. Please try again!'}).status(400);
    }
});

app.delete('/deleteBook', async (req, res) => {
    try {
        const bookId = req.body.bookId;
        const result = await db.query('DELETE FROM book WHERE id=$1 RETURNING *', [bookId]);
        if (result.rowCount === 0) return res.json({error: "the book you're trying to delete doesn't exists"}).status(400);
        return res.json({resut: result.rows, message: 'Deleted successfully!'}).status(200);
    } catch(e) {
        console.log(e);
        return res.json({error: "the book you're trying to delete doesn't exists"}).status(400);
    }
});

app.post('/addNotes', async (req, res) => {
    try {
        const bookId = req.body.bookId;
        const note = req.body.note;

        const result = await db.query('INSERT INTO my_note (note, book_id) VALUES ($1, $2) RETURNING *', [note, bookId]);

        res.json({resut: result.rows, message: 'Deleted successfully!'}).status(200);

    } catch(e) {
        console.log(e);
        res.json({error: 'Error adding notes to the current book. Please try again later.'}).status(400);
    }
});

app.put('/updateNote', async (req, res) => {
    try {
        const bookId = req.body.bookId;
        const my_note = req.body.note;
        const notes = await db.query('SELECT * FROM my_note WHERE book_id=$1', [bookId]);

        let note = my_note ? my_note : notes[0].note;

        const result = await db.query('UPDATE my_note SET note=$1 WHERE book_id=$2 RETURNING *', [note, bookId]);

        if (result.rowCount === 0) return res.json({error: "the note you're trying to update doesn't exists"}).status(400);
        res.json({result: result.rows, message: 'Updated successfully!'}).status(200);
    } catch(e) {
        console.log(e);
        res.json({error: 'Unable to update notes. please try again!'});
    }
});

app.delete('/deleteNote', async (req, res) => {
    try {
        const bookId = req.body.bookId;
        const result = await db.query('DELETE FROM my_note WHERE book_id=$1 RETURNING *', [bookId]);
        if (result.rowCount === 0) return res.json({error: "the note you're trying to delete doesn't exists"}).status(400);
        return res.json({resut: result.rows, message: 'Deleted successfully!'}).status(200);
    } catch(e) {
        console.log(e);
        return res.json({error: "the note you're trying to delete doesn't exists"}).status(400);
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});