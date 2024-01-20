import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  database: 'world',
  user: 'postgres',
  password: 'admin',
  port: 5432
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.connect();

async function checkVisistedCountries() {
  const result = await db.query("SELECT country_code FROM visited_countries");

  let countries = result.rows.map(country => country.country_code).join(',');
  return [countries, result.rows.length];
}

app.get("/", async (req, res) => {
  //Write your code here.
  // let result = await db.query('SELECT country_code FROM visited_countries');
  let countries = await checkVisistedCountries();
  console.log(countries);

  res.render('index.ejs', {
    countries: countries[0],
    total: countries[1],
  });
});

app.post("/add", async (request, response) => {

  const country = await checkVisistedCountries();
  db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE ($1) || '%'", [request.body.country.toLowerCase()], async (error, result) => {
    if (result.rows.length === 0) {
      response.render('index.ejs', {
        countries: country[0],
        total: country[1],
        error: 'The country you entered was not found!, Please Try again.',
      });
    } else {
      try {
        await db.query('INSERT INTO visited_countries(country_code) VALUES ($1)', [result.rows[0].country_code]);
        response.redirect('/');
      } catch(err) {
        console.log(err);
        response.render('index.ejs', {
          countries: country[0],
          total: country[1],
          error: 'You already visited the country!',
        });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
