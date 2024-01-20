import express, { json, response } from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "technicalbot";
const yourPassword = "Testing@1234";
const yourAPIKey = "2c12b54d-13f5-44c7-b5d2-a22b4d8d4373";
const yourBearerToken = "3afe0ebb-706a-478b-a6f1-6b889d1e5258";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  await axios.get('https://secrets-api.appbrewery.com/random').then(response => {
    res.render('index.ejs', {content: JSON.stringify(response.data)});
  }).catch(error => {
    console.log(error);
    res.render('index.ejs', {content: 'Failed to fetch the data'});
  });
});

app.get("/basicAuth", async (req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
  await axios.get('https://secrets-api.appbrewery.com/all', {
    auth: {
      username: yourUsername,
      password: yourPassword,
    },
    params: {
      page: 2,
    },
  }).then(response => {
    res.render('index.ejs', { content: JSON.stringify(response.data)});
  }).catch(error => {
    console.log(error);
    res.render('index.ejs', {content: 'failed to fetch the data!'});
  });
});

app.get("/apiKey", async (req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  await axios.get('https://secrets-api.appbrewery.com/filter', {
    params: {
      apiKey: yourAPIKey,
      score: 5,
    },
  }).then(response => {
    res.render('index.ejs', {content: JSON.stringify(response.data)});
  }).catch(error => {
    console.log(error);
    res.render('index.ejs', {content: 'Failed to fetch the data!'});
  });
});

app.get("/bearerToken", async (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
  await axios.get('https://secrets-api.appbrewery.com/secrets/42', {
    headers: {
      Authorization: `Bearer ${yourBearerToken}`,
    },
  }).then(response => {
    res.render('index.ejs', {content: JSON.stringify(response.data)});
  }).catch(error => {
    console.log(error);
    res.render('index.ejs', {content: 'Failed to fetch the data!'});
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
