//Server.
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const usersFile = './database/users.json';
const blogsFile = './database/blog.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');
if (!fs.existsSync(blogsFile)) fs.writeFileSync(blogsFile, '[]');

app.post('/register', (req, res) => {
    const { username, password, fullName, age, email, gender } = req.body;

    if (!username || username.length < 3) return res.status(400).send('Username must be at least 3 characters long.');
    if (!password || password.length < 5) return res.status(400).send('Password must be at least 5 characters long.');
    if (age < 10) return res.status(400).send('Age must be at least 10.');
    if (!email) return res.status(400).send('Email is required.');

    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    if (users.find(user => user.username === username)) {
        return res.status(400).send('Username already exists.');
    }

    const newUser = { id: users.length + 1, username, password, fullName, age, email, gender };
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.status(201).send('User registered successfully.');
});

app.get('/profile/:identifier', (req, res) => {
    const { identifier } = req.params;
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const user = users.find(user => user.username === identifier || user.email === identifier);
    if (!user) return res.status(404).send('User not found.');
    res.status(200).json(user);
});

app.put('/profile/:identifier', (req, res) => {
    const { identifier } = req.params;
    const updates = req.body;
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const userIndex = users.findIndex(user => user.username === identifier || user.email === identifier);
    if (userIndex === -1) return res.status(404).send('User not found.');

    users[userIndex] = { ...users[userIndex], ...updates };
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.status(200).send('Profile updated successfully.');
});

app.delete('/profile/:identifier', (req, res) => {
    const { identifier } = req.params;
    let users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const userIndex = users.findIndex(user => user.username === identifier || user.email === identifier);
    if (userIndex === -1) return res.status(404).send('User not found.');

    users = users.filter(user => user.username !== identifier && user.email !== identifier);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.status(200).send('Profile deleted successfully.');
});

app.post('/blog', (req, res) => {
    const { title, slug, content, tags } = req.body;
    if (!title || !slug || !content) return res.status(400).send('All fields are required.');

    const blogs = JSON.parse(fs.readFileSync(blogsFile, 'utf-8'));
    const newBlog = { id: blogs.length + 1, title, slug, content, tags: tags || [], comments: [] };
    blogs.push(newBlog);
    fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));
    res.status(201).send('Blog created successfully.');
});

app.get('/blog', (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(blogsFile, 'utf-8'));
    res.status(200).json(blogs);
});

app.put('/blog/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const blogs = JSON.parse(fs.readFileSync(blogsFile, 'utf-8'));
    const blogIndex = blogs.findIndex(blog => blog.id === parseInt(id));
    if (blogIndex === -1) return res.status(404).send('Blog not found.');

    blogs[blogIndex] = { ...blogs[blogIndex], ...updates };
    fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));
    res.status(200).send('Blog updated successfully.');
});

app.delete('/blog/:id', (req, res) => {
    const { id } = req.params;
    let blogs = JSON.parse(fs.readFileSync(blogsFile, 'utf-8'));
    const blogIndex = blogs.findIndex(blog => blog.id === parseInt(id));
    if (blogIndex === -1) return res.status(404).send('Blog not found.');

    blogs = blogs.filter(blog => blog.id !== parseInt(id));
    fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));
    res.status(200).send('Blog deleted successfully.');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000...');
});
