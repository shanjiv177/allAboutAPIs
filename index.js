const express = require("express");
const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  res.send("Hello Welcome to Notes API");
});

//CRUD API

//CREATE

let users = []; // {username: "", password: ""}

let notes = []; // { username: "", notes: []}

app.post("/signup", (req, res) => {
    const password = req.body.password;
    const username = req.body.username;
    const user = {
      username: username,
      password: password,
    };

    const user_notes = {
      user: username,
      notes: [],
    };

    if (username == null || password == null) {
        res.status(400).send("username or password is missing");
        return;
    }

    users.push(user);
    notes.push(user_notes);

    res.status(201).send(`${username} has been signed up`);
});

app.get('/notes', (req, res) => {
    const user = users.find(user => user.username === req.body.username);

    if (user == null) {
        return res.status(404).send("User not found");
    }
    
    if (user.password === req.body.password) {
        return res.status(200).send(notes.find(note => note.user === req.body.username).notes);
    } else {
        return res.status(401).send("Invalid credentials");
    }
});

app.post('/createNote', (req, res) => {
    const user = users.find(user => user.username === req.body.username);

    if (user == null) {
        return res.status(404).send("User not found");
    }

    if (req.body.note == null) {
        return res.status(400).send("Note is missing");
    }
    
    if (user.password === req.body.password) {
        notes.find(note => note.user === req.body.username).notes.push(req.body.note);
        return res.status(201).send(`${"Note : " + req.body.note} has been created, id: ${notes.find(note => note.user === req.body.username).notes.length - 1}`);
    } else {
        return res.status(401).send("Invalid credentials");
    }
})

app.delete('/deleteNote', (req,res) => {
    const user = users.find(user => user.username === req.body.username);

    if (user == null) {
        return res.status(404).send("User not found");
    }

    if (req.body.noteId == null) {
        return res.status(400).send("Give a note ID");
    }

    if (user.password === req.body.password) {

        if (req.body.noteId < notes.find(note => note.user === req.body.username).notes.length) {
            notes.find(note => note.user === req.body.username).notes.splice(req.body.noteId, 1);
            return res.status(200).send(`Note with id ${req.body.noteId} has been deleted`);
        }
        return res.status(404).send("Note not found");
    } else {
        return res.status(401).send("Invalid credentials");
    }
})

app.put('/updateNote', (req,res) => {
    const user = users.find(user => user.username === req.body.username);

    if (user == null) {
        return res.status(404).send("User not found");
    }

    if (req.body.noteId == null) {
        return res.status(400).send("Give a note ID");
    }

    if (user.password === req.body.password) {

        if (req.body.noteId < notes.find(note => note.user === req.body.username).notes.length) {
            notes.find(note => note.user === req.body.username).notes[req.body.noteId] = req.body.note;
            return res.status(200).send(`Note with id ${req.body.noteId} has been  updated to ${req.body.note}`);
        }
        return res.status(404).send("Note not found");
    } else {
        return res.status(401).send("Invalid credentials");
    }
})