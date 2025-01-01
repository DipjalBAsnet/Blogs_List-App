const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "First Blog",
    author: "John Doe",
    url: "http://example.com/first",
    likes: 10,
  },
  {
    title: "Second Blog",
    author: "Jane Doe",
    url: "http://example.com/second",
    likes: 5,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe("GET /api/blogs", () => {
  test("blogs are returned as JSON", async () => {
    const response = await api.get("/api/blogs").expect(200);
    assert.strictEqual(
      response.headers["content-type"].includes("application/json"),
      true
    );
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, initialBlogs.length);
  });
});

describe("unique identifier property", () => {
  test("id is defined and _id is undefined", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    assert(blog.id !== undefined);
    assert(blog._id === undefined);
  });
});

describe("POST /api/blogs", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Third Blog",
      author: "New Author",
      url: "http://example.com/third",
      likes: 15,
    };

    const postResponse = await api.post("/api/blogs").send(newBlog).expect(201);

    const getResponse = await api.get("/api/blogs");
    assert.strictEqual(getResponse.body.length, initialBlogs.length + 1);

    const titles = getResponse.body.map((blog) => blog.title);
    assert(titles.includes("Third Blog"));
  });

  test("blog without likes defaults to 0", async () => {
    const newBlog = {
      title: "Blog Without Likes",
      author: "Anonymous",
      url: "http://example.com/nolikes",
    };

    const postResponse = await api.post("/api/blogs").send(newBlog).expect(201);

    assert.strictEqual(postResponse.body.likes, 0);
  });
});

after(async () => {
  await mongoose.connection.close();
});

describe("DELETE /api/blogs/:id", () => {
  test("a blog can be deleted", async () => {
    const blogsAtStart = await api.get("/api/blogs");
    const blogToDelete = blogsAtStart.body[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await api.get("/api/blogs");
    const ids = blogsAtEnd.body.map((blog) => blog.id);

    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1);
    assert(!ids.includes(blogToDelete.id));
  });

  test("returns 404 if the blog does not exist", async () => {
    const nonExistentId = "64c4f9c0b6f2063b1f9e4a9f";
    await api.delete(`/api/blogs/${nonExistentId}`).expect(404);
  });

  test("returns 400 if the ID is invalid", async () => {
    await api.delete("/api/blogs/invalid-id").expect(400);
  });
});

describe("PUT /api/blogs/:id", () => {
  test("a blog's likes can be updated", async () => {
    const blogsAtStart = await api.get("/api/blogs");
    const blogToUpdate = blogsAtStart.body[0];

    const updatedLikes = { likes: blogToUpdate.likes + 10 };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedLikes)
      .expect(200);

    assert.strictEqual(response.body.likes, updatedLikes.likes);
  });

  test("returns 404 if the blog does not exist", async () => {
    const nonExistentId = "64c4f9c0b6f2063b1f9e4a9f";
    const updatedLikes = { likes: 10 };

    await api.put(`/api/blogs/${nonExistentId}`).send(updatedLikes).expect(404);
  });

  test("returns 400 if the ID is invalid", async () => {
    await api.put("/api/blogs/invalid-id").send({ likes: 10 }).expect(400);
  });
});
