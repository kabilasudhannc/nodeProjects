import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    const date = new Date();
    const dayOfWeek = date.getDay();
    let data = {};

    switch (dayOfWeek){
        case 0 || 6:
            data['dayOfWeek'] = "the weekend, it's time to have fun";
            break;
        default:
            data['dayOfWeek'] = "a weekday, it's time to work hard!";
            break;
    };

    res.render('index.ejs', data);
})

app.listen(port, () => {
    console.log(`Server is listining on port ${port}`);
});