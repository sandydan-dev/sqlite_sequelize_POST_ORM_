const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

const { sequelize } = require("./lib/index");
const company = require("./models/company.model");

const companyData = [
  {
    id: 1,
    name: "Tech Innovators",
    industry: "Technology",
    foundedYear: 2010,
    headquarters: "San Francisco",
    revenue: 75000000,
  },
  {
    id: 2,
    name: "Green Earth",
    industry: "Renewable Energy",
    foundedYear: 2015,
    headquarters: "Portland",
    revenue: 50000000,
  },
  {
    id: 3,
    name: "Innovatech",
    industry: "Technology",
    foundedYear: 2012,
    headquarters: "Los Angeles",
    revenue: 65000000,
  },
  {
    id: 4,
    name: "Solar Solutions",
    industry: "Renewable Energy",
    foundedYear: 2015,
    headquarters: "Austin",
    revenue: 60000000,
  },
  {
    id: 5,
    name: "HealthFirst",
    industry: "Healthcare",
    foundedYear: 2008,
    headquarters: "New York",
    revenue: 80000000,
  },
  {
    id: 6,
    name: "EcoPower",
    industry: "Renewable Energy",
    foundedYear: 2018,
    headquarters: "Seattle",
    revenue: 55000000,
  },
  {
    id: 7,
    name: "MediCare",
    industry: "Healthcare",
    foundedYear: 2012,
    headquarters: "Boston",
    revenue: 70000000,
  },
  {
    id: 8,
    name: "NextGen Tech",
    industry: "Technology",
    foundedYear: 2018,
    headquarters: "Chicago",
    revenue: 72000000,
  },
  {
    id: 9,
    name: "LifeWell",
    industry: "Healthcare",
    foundedYear: 2010,
    headquarters: "Houston",
    revenue: 75000000,
  },
  {
    id: 10,
    name: "CleanTech",
    industry: "Renewable Energy",
    foundedYear: 2008,
    headquarters: "Denver",
    revenue: 62000000,
  },
];

app.use(express.json());
app.use(cors());

// seeding data to database

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await company.bulkCreate(companyData);
    res.status(200).json({ message: "Company data seeded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all company details from db
async function getAllCompanyDetails() {
  let query = await company.findAll();
  if (!query) {
    return null;
  } else {
    return { company: query };
  }
}
app.get("/company", async (req, res) => {
  try {
    let result = await getAllCompanyDetails();
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add new data to db
async function updateCompanyData(newCompany) {
  let query = await company.create(newCompany);
  if (!query) {
    return null;
  } else {
    return { company: query };
  }
}
app.post("/company/new", async (req, res) => {
  try {
    let newCompany = req.body.newCompany;
    let result = await updateCompanyData(newCompany);
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update data  in db
async function updatedCompanyDetails(id, updatedBody) {
  let query = await company.findOne({ where: { id } });

  if (!query) {
    return "Data not found from db";
  } else {
    query.set(updatedBody);
    let saveData = query.save();
    return { message: " data updated successfully ", company: saveData };
  }
}
app.post("/company/update/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let updatedBody = req.body;
    let result = await updatedCompanyDetails(id, updatedBody);
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete data from company
async function deleteCompanyDataById(id) {
  let query = await company.destroy({ where: { id } });
  if (query === 0) {
    return "didnt get id number ";
  } else {
    return { message: "data deleted successfully", id: id, query };
  }
}
app.post("/company/delete", async (req, res) => {
  try {
    let id = parseInt(req.query.id);
    let result = await deleteCompanyDataById(id);

    if (!result) {
      return res.status(404).json({ message: "Id not found from db" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
