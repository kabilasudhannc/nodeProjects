import express from "express";
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log(req.query);
  res.send('<h1>Welcome to My Page</h1>');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
