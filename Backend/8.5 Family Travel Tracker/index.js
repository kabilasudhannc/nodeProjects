import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import morgan from "morgan";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "admin",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan('combined'));

let currentUserId = 1;
let error = null;
let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1", [currentUserId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getUsers() {
  // const users = await db.query("SELECT * FROM users");
  users = (await db.query("SELECT * FROM users")).rows;
  return users.find((user) => user.id == currentUserId);
}

app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  const user = await getUsers();
  
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: user.color,
    error: error
  });
  error = null;
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  console.log(req.body);

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: users,
        color: color.rows[0].color
      });
    } catch (err) {
      console.log(err);
      error = 'You already visited the country!';
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);

    error = "The country you visited doesn't exists on worldmap!";
    return res.redirect('/');
  }
});

app.post("/user", async (req, res) => {
  if (req.body.user) {
    currentUserId = req.body.user;
    return res.redirect('/');
  } else {
    res.render('new.ejs');
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  console.log(req.body);
  const result = await db.query('INSERT INTO users(name, color) values ($1, $2) RETURNING id, name, color', [req.body.name, req.body.color]);
  currentUserId = result.rows[0].id;
  return res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
