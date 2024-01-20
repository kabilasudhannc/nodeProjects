import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import morgan from "morgan";


const app = express();
const port = 3000;

const apiUrl = 'https://v2.jokeapi.dev/joke/'

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.post('/', async (req, res) => {
    let finalUrl;

    console.log(req.body);

    if (req.body.primary === 'any'){
        finalUrl = apiUrl + 'Any';
    } else if (req.body.primary === 'custom') {
        if (!req.body.secondary) {
            finalUrl = apiUrl + 'Any';
        }
        else {
            finalUrl = apiUrl + req.body.secondary.join(',');
        }
    }
    let flags;
    let type;
    let searchString;
    
    if (req.body.flags){

        if (typeof req.body.flags === 'string') flags = req.body.flags;

        else flags = req.body.flags.join(',');
    }

    if (!typeof req.body.type === 'object'){
        type = req.body.type;
    }

    if (req.body.searchString) {
        searchString = req.body.searchString;
    }

    const response = await axios.get(finalUrl, {
        params: {flags: flags, type: type, contains: searchString}
    });

    console.log(response.data);
    return res.render('home.ejs', { data: response.data});
});

app.get('/add', (req, res) => {
    res.render('addJoke.ejs');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});