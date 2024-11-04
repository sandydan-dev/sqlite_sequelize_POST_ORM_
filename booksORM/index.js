const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// database instance to seed or put data into database
const { sequelize } = require("./lib/index");
const book = require("./models/bookStore.model");

// row data
const booksData = [
  {
    title: "Getting Started with Node.js",
    content:
      "This post will guide you through the basics of Node.js and how to set up a Node.js project.",
    author: "Alice Smith",
  },
  {
    title: "Advanced Express.js Techniques",
    content:
      "Learn advanced techniques and best practices for building applications with Express.js.",
    author: "Bob Johnson",
  },
  {
    title: "ORM with Sequelize",
    content:
      "An introduction to using Sequelize as an ORM for Node.js applications.",
    author: "Charlie Brown",
  },
  {
    title: "Boost Your JavaScript Skills",
    content:
      "A collection of useful tips and tricks to improve your JavaScript programming.",
    author: "Dana White",
  },
  {
    title: "Designing RESTful Services",
    content: "Guidelines and best practices for designing RESTful APIs.",
    author: "Evan Davis",
  },
  {
    title: "Mastering Asynchronous JavaScript",
    content:
      "Understand the concepts and patterns for writing asynchronous code in JavaScript.",
    author: "Fiona Green",
  },
  {
    title: "Modern Front-end Technologies",
    content:
      "Explore the latest tools and frameworks for front-end development.",
    author: "George King",
  },
  {
    title: "Advanced CSS Layouts",
    content: "Learn how to create complex layouts using CSS Grid and Flexbox.",
    author: "Hannah Lewis",
  },
  {
    title: "Getting Started with React",
    content: "A beginner's guide to building user interfaces with React.",
    author: "Ian Clark",
  },
  {
    title: "Writing Testable JavaScript Code",
    content:
      "An introduction to unit testing and test-driven development in JavaScript.",
    author: "Jane Miller",
  },
];

// middelwares
app.use(express.json());
app.use(cors());

// seeding data into database

app.get("/seed_book_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await book.bulkCreate(booksData);
    res.status(200).json({ message: "books data seeded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get  all books from database
async function getAllBookDetails() {
  let query = await book.findAll();

  if (!query) {
    return null;
  } else {
    return { books: query };
  }
}
app.get("/books", async (req, res) => {
  try {
    let result = await getAllBookDetails();

    if (!result) {
      return res.status(404).json({ message: "No books found" });
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add new data to db
async function addNewDataToDatabase(newData) {
  let query = await book.create(newData);
  if (!query) {
    return null;
  } else {
    return { books: query };
  }
}
app.post("/books/new", async (req, res) => {
  try {
    let newData = req.body.newData;
    let result = await addNewDataToDatabase(newData);

    if (!result) {
      return res.status(404).json({ message: "Failed to add new data" });
    } else {
      return res
        .status(201)
        .json({ message: " data added successfully", result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update  existing data in db
async function updatedBooksDataById(id, updatedData) {
  let query = await book.findOne({ where: { id: id } });
  if (!query) {
    return null;
  } else {
    query.set(updatedData);

    let saveData = await query.save();
    return { books: saveData };
  }
}
app.post("/books/update/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let updatedData = req.body;

    let result = await updatedBooksDataById(id, updatedData);

    if (!result) {
      return res
        .status(404)
        .json({ message: "No books found with the given id" });
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete post by id
async function deleteBooksByid(id) {
  let query = await book.destroy({ where: { id: id } });
  if (!query) {
    return null;
  }
}
app.post("/books/delete", async (req, res) => {
  try {
    let id = parseInt(req.query.id);
    let result = await deleteBooksByid(id);

    if (!result) {
      return res.status(404).json({ message: "books not found by id " });
    } else {
      return res
        .status(200)
        .json({ message: "data deleted successfully", result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listening incomming request
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
