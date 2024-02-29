const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB (replace 'your-mongodb-url' with your MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/my-blog', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a mongoose model for blog posts
const Post = mongoose.model('Post', {
  title: String,
  content: String,
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Render the form to create a new post
app.get('/posts/new', (req, res) => {
  res.render('new-post');
});

// Handle the form submission to create a new post
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content });

  try {
    await post.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Display all posts on the homepage
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('index', { posts });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
