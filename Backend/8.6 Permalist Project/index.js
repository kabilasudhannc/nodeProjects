import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan('combined'));

const db = new pg.Client({
  database: 'permalist',
  host: 'localhost',
  user: 'postgres',
  password: 'admin',
  port: '5432',
});

db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

let current = 'today';

async function getItems(){
  const result = await db.query('SELECT * FROM items WHERE current=$1 ORDER BY created_at DESC', [current]);
  items = result.rows;
}

app.get("/", async (req, res) => {
  current = 'today';
  await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.get('/week', async(req, res) => {
  current = 'week';
  await getItems();
  res.render("week.ejs", {
    listTitle: "Week",
    listItems: items,
  });
});

app.get('/month', async (req, res) => {
  current = 'month';
  await getItems();
  res.render("month.ejs", {
    listTitle: "Month",
    listItems: items,
  });
})

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  await db.query('INSERT INTO items(title, created_at, current) VALUES ($1, $2, $3)', [item, new Date(), current]);
  console.log(items);
  if (current === 'week') return res.redirect('/week');
  else if (current === 'month') return res.redirect('/month');
  return res.redirect("/");
});

app.post("/edit", async (req, res) => {
  await db.query('UPDATE items SET title=$1 WHERE id=$2', [req.body.updatedItemTitle, req.body.updatedItemId]);
  if (current === 'week') return res.redirect('/week');
  else if (current === 'month') return res.redirect('/month');
  res.redirect('/');
});

app.post("/delete", async (req, res) => {
  await db.query('DELETE FROM items WHERE id=$1', [req.body.deleteItemId]);
  if (current === 'week') return res.redirect('/week');
  else if (current === 'month') return res.redirect('/month');
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
