// const mongoose = require("mongoose");

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

// const password = process.argv[2];

// const url = `mongodb+srv://fullstack:${password}@cluster0.ilvlp.mongodb.net/blog-list?retryWrites=true&w=majority&appName=Cluster01`;

// mongoose.set("strictQuery", false);

// mongoose.connect(url);

// const blogSchema = new mongoose.Schema({
//   title: String,
//   author: String,
//   url: String,
//   likes: Number,
// });

// const Blog = mongoose.model("Blog", blogSchema);

// const blog = new Blog({
//   title: "My second Blog",
//   author: "kane Doe",
//   url: "https://example.com/my-first-blog",
//   likes: 20,
// });

// blog.save().then((result) => {
//   console.log("blog saved!");
//   mongoose.connection.close();
// });
