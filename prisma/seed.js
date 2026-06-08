import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../src/lib/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const countries = [
  "India",
  "USA",
  "Germany",
  "UK",
  "Canada",
];

const jobTitles = [
  "Software Engineer",
  "Senior Software Engineer",
  "Engineering Manager",
  "HR Manager",
  "Product Manager",
];

const departments = [
  "Engineering",
  "HR",
  "Product",
  "Finance",
];

async function seed() {
  const firstNames = [
    "John",
    "Michael",
    "David",
    "Sarah",
    "Emma",
    "Olivia",
    "James",
    "Robert",
    "Sophia",
    "Daniel",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Brown",
    "Williams",
    "Jones",
    "Miller",
    "Davis",
    "Wilson",
    "Taylor",
    "Anderson",
  ];

  const employees = [];

  for (let i = 1; i <= 10000; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);

    employees.push({
      employeeCode: `EMP${i}`,
      fullName: `${firstName} ${lastName}`,
      email: `employee${i}@acme.com`,
      country: randomItem(countries),
      department: randomItem(departments),
      jobTitle: randomItem(jobTitles),
      salary: Math.floor(
        Math.random() * (5000000 - 300000) + 300000
      ),
      currency: "INR",
    });
  }

  await prisma.employee.createMany({
    data: employees,
  });

  console.log("10000 employees inserted");
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
