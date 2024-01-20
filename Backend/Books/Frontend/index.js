import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import axios from "axios";

const apiUrl = 'http://localhost:4000/';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('combined'));

app.get('/', async (req, res) => {

    const sort = req.query.sort;
    const result = await axios.get(apiUrl + `books/?sort=${sort}`);
    
    if (result.status === 200){
        res.render('index.ejs', {
            data: result.data.result,
            message: result.data.message
        });
    } else {
        res.render('index.ejs', {
            error: result.error
        });
    }
});

app.get('/book/:id', async (req, res) => {

    const id = req.params.id;
    try {
        const result = await axios.get(apiUrl + `books/${id}`);
        // console.log(result.data);
        return res.render('book.ejs', {
           data: result.data.result[0],
           message: result.data.message 
        });
    } catch (e) {
        console.log(e);
    }
});


app.get('/add', async(req, res) => {
    res.render('add.ejs');
});

app.post('/add', async(req, res) => {
    const body = {
        isbnNumber: req.body.isbnNumber,
        bookTitle: req.body.bookTitle,
        rating: req.body.bookRating,
        description: req.body.bookDescription,
        author: req.body.bookAuthor
    }

    await axios.post(apiUrl + 'addBook', body).then(() => {
        return res.redirect('/');
    }).catch((error) => {
        console.log(error);
        return res.render('add.ejs', {error: 'failed to add Book!'});
    });

});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})