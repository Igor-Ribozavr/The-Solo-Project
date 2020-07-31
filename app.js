const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const nodeFetch = require('node-fetch');

require('dotenv').config();
// console.log(process.env);
const api_key = process.env.API_KEY;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', async (req, res) => {
  console.log(req.body);
  let { word } = req.body;
  const response = await nodeFetch(
    `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/${word}`,
    {
      headers: {
        'x-rapidapi-host': 'lingua-robot.p.rapidapi.com',
        'x-rapidapi-key': `${api_key}`,
        useQueryString: true,
      },
    }
  );
  const result = await response.json();
  console.log(result);
  res.json(result);
});

app.listen(3000, () => {
  console.log('It works !!!');
});
