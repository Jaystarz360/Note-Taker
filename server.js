// Set up requirements
const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid')
const noteData = require('./db/db.json');

const fs = require('fs/promises');

// Set up express and PORT
const app = express();
const PORT = process.env.PORT || 3001;

//Middleware JSON and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware static assets
app.use(express.static('public'));

// HTML routes & home page route
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html')));

// API get route
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8')
        .then((data) => {
            notes = JSON.parse(data);
            res.json(notes);
        });
});

//API delete route
app.delete('/api/notes/:id', (req, res) => {
    activeNote = req.params.id;
    fs.readFile('./db/db.json', 'utf-8')
        .then((data) => {
            const allNotes = JSON.parse(data);
            const newNoteListA = allNotes.filter((note) =>
                note.id !== activeNote);
            const newNoteList = JSON.stringify(newNoteListA);
            fs.writeFile('./db/db.json', newNoteList, (err) =>
                err ? console.error(err) : console.log(`Note was deleted...`)
            );
            res.json(newNoteList);
        })
});

// API post route
app.post('/api/notes', (req, res) => {
    const addNote = {
        id: uuid(),
        title: req.body.title,
        text: req.body.text,
    };

    fs.readFile('./db/db.json', 'utf-8')
        .then((data) => {
            notes = JSON.parse(data);
            notes.push(addNote);
            updatedNotes = JSON.stringify(notes);
            fs.writeFile('./db/db.json', updatedNotes, (err) =>
                err ? console.error(err) : console.log(`Note was written...`)
            );
            res.json(notes);
        });
});
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, "./public/index.html")));

// Listener to start server PORT 3001
app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
});