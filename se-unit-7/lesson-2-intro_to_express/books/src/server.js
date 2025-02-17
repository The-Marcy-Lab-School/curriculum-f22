/* eslint-disable no-shadow */
const path = require('path');
const express = require('express');
const Book = require('./model-books');

// creating the express app servedr
const app = express();

// Setting up the /public/ folder to be served at / path
const publicDir = path.join(__dirname, '..', 'public');
console.log(`sending client files from ${publicDir}`);
const staticServer = express.static(publicDir);
app.use(staticServer);

// Middleware

// Parse any incoming JSON request bodies
app.use(express.json());

// Add the Book model to our request object
app.use((req, res, next) => {
  req.Book = Book;
  next();
});

// Put your routes here!
/*
Pattern for creating a route:
- app.verb(pathname, requestHandler)
  - extract information from the req
    - Model
    - req.body
    - req.params
    - req.query
  - act on that information
  - if unsuccessful, send a 404 response
  - otherwise send a 2xx response
*/

app.get('/books', (req, res) => {
  const { Book } = req;
  res.status(200).send(Book.list());
});

app.get('/books/:id', (req, res) => {
  const { Book, params: { id } } = req;
  // const Book = req.Book
  // const id = req.params.id
  const bookToFind = Book.find(Number(id));
  if (!bookToFind) return res.status(404).send('Not Found');

  res.send(bookToFind);
});

app.delete('/books/:id', (req, res) => {
  const { Book, params: { id } } = req;
  // const Book = req.Book
  // const id = req.params.id
  const didDelete = Book.delete(Number(id));
  if (!didDelete) return res.status(404).send('Not Found');

  res.sendStatus(204);
});

app.patch('/books/:id', (req, res) => {
  const {
    Book,
    params: { id },
    body: { title },
  } = req;
  // const Book = req.Book
  // const id = req.params.id
  const bookToEdit = Book.editTitle(Number(id), title);
  if (!bookToEdit) return res.status(404).send('Not Found');

  res.send(bookToEdit);
});

app.post('/books', (req, res) => {
  // extracting data from the request object
  const { Book, body } = req;
  const { title } = body;
  // const Book = req.Book;
  // const body = req.body;
  // const title = body.title;
  const newBook = new Book(title); // adding data to the model
  res.status(201).send(newBook); // sending data back
});

// We need this for our tests, it's a freebie!
app.delete('/books', (req, res) => {
  const { Book } = req;
  const result = Book.deleteAll();
  if (!result) return res.sendStatus(404);

  res.sendStatus(204);
});

// export the server to be used in index.js
module.exports = app;
