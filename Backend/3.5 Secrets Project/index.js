//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

let userIsAuthorized = false;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));

const authChecker = (req, res, next) => {

    if (req.body.password === 'ILoveProgramming'){
        userIsAuthorized = true;
    } 
    next();
};

app.use(authChecker);

app.get('/', (req, res) => {
    userIsAuthorized = false;
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/check', (req, res) => {
    if (userIsAuthorized) {
        res.sendFile(__dirname + '/public/secret.html');
    } else {
        res.redirect('../');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});