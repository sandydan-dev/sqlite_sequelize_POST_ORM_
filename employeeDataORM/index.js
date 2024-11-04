const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const { sequelize } = require("./lib/index");
const employee = require("./models/employee.model");

const employeeData = [
  {
    id: 1,
    name: "John Doe",
    designation: "Manager",
    department: "Sales",
    salary: 90000,
  },
  {
    id: 2,
    name: "Anna Brown",
    designation: "Developer",
    department: "Engineering",
    salary: 80000,
  },
  {
    id: 3,
    name: "James Smith",
    designation: "Designer",
    department: "Marketing",
    salary: 70000,
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "HR Specialist",
    department: "Human Resources",
    salary: 60000,
  },
  {
    id: 5,
    name: "Michael Wilson",
    designation: "Developer",
    department: "Engineering",
    salary: 85000,
  },
  {
    id: 6,
    name: "Sarah Johnson",
    designation: "Data Analyst",
    department: "Data Science",
    salary: 75000,
  },
  {
    id: 7,
    name: "David Lee",
    designation: "QA Engineer",
    department: "Quality Assurance",
    salary: 70000,
  },
  {
    id: 8,
    name: "Linda Martinez",
    designation: "Office Manager",
    department: "Administration",
    salary: 50000,
  },
  {
    id: 9,
    name: "Robert Hernandez",
    designation: "Product Manager",
    department: "Product",
    salary: 95000,
  },
  {
    id: 10,
    name: "Karen Clark",
    designation: "Sales Associate",
    department: "Sales",
    salary: 55000,
  },
];

app.use(express.json());
app.use(cors());

app.get("/seed_employee_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await employee.bulkCreate(employeeData);
    res.status(200).json({ message: "employee data seeded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Get all employees

async function getAllEmployeesDetails() {
  let query = await employee.findAll();
  return query;
}
app.get("/employees", async (req, res) => {
  try {
    let result = await getAllEmployeesDetails();
    if (!result) {
      return res.status(404).json({ message: "No employees found" });
    } else {
      return res
        .status(200)
        .json({ message: "Getting All Employees Data ", result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// adding new  employee
async function addingNewEmployee(newEmployee) {
  let query = await employee.create(newEmployee);

  if (!query) {
    return { message: "Employee not created" };
  } else {
    return { message: "Employee created successfully", query };
  }
}
app.post("/employees/new", async (req, res) => {
  try {
    let newEmployee = req.body.newEmployee;
    let result = await addingNewEmployee(newEmployee);
    if (!result) {
      return res.status(404).json({ message: "Employee not added" });
    } else {
      return res
        .status(200)
        .json({ message: "data added successfully", result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update employee from db
async function updateEmployeeDetails(id, updateBody) {
  let query = await employee.findOne({ where: { id } });

  if (!query) {
    return { message: "Employee not found" };
  } else {
    query.set(updateBody);
    let saveData = await query.save();
    return { message: "Employee updated successfully", employee: saveData };
  }
}
app.post("/employees/update/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let updateBody = req.body;

    let result = await updateEmployeeDetails(id, updateBody);

    if (!result) {
      return res.status(404).json({ message: "Employee not found" });
    } else {
      return res
        .status(200)
        .json({ message: "Employee updated successfully", result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete  employee from db
async function deleteEmployeeDataById(id) {
  let query = await employee.destroy({ where: { id } });
  if (!query) {
    return { message: "Employee not found" };
  } else {
    return { employee: query };
  }
}
app.post("/employees/delete", async (req, res) => {
  try {
    let id = parseInt(req.query.id);
    let result = await deleteEmployeeDataById(id);

    if (!result) {
      return res.status(404).json({ message: "Employee not found" });
    } else {
      return res
        .status(200)
        .json({ message: "Employee deleted successfully", result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listining incomming request
app.listen(port, () => {
  console.log("listening port on 3000");
});
