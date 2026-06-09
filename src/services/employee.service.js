import { BadrequestError, NotFoundError } from "../utils/error.js";
import { prisma } from "../lib/prisma.js";
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";

export const createEmployee = async (data) => {
  const existingEmployee =
    await prisma.employee.findFirst({
      where: {
        OR: [
          { email: data.email },
          { employeeCode: data.employeeCode },
        ],
      },
    });

  if (existingEmployee) {
    throw new Error(
      "Employee with email or employee code already exists"
    );
  }

  return prisma.employee.create({
    data,
  });
};

export const getEmployees = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
      OR: [
        {
          fullName: {
            contains: search,
          },
        },
        {
          employeeCode: {
            contains: search,
          },
        },
      ],
    }
    : {};

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.employee.count({ where }),
  ]);

  return {
    employees,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const fetchEmployee = async (empID) => {
  const employee = await prisma.employee.findUnique({
    where: {
      employeeCode: empID
    }
  })
  if (!employee) {
    throw new NotFoundError("Employee not found");
  }
  return employee
}

export const updateEmployeeDetails = async (updatedFields, id) => {
  console.log(updatedFields, "up")
  const result = await prisma.employee.updateMany({
    where: {
      id: id,
      isDeleted: false
    },
    data: updatedFields
  });

  if (result.count === 0) {
    throw new NotFoundError(
      "Employee not found or already deleted"
    );
  }
  return true;
}

export const validateAndIssueToken = async (email, password) => {
  const employee = await prisma.employee.findUnique({
    where: { email },
  });
  if (!employee) {
    throw new BadrequestError("Invalid credentials");
  }
  console.log(employee, email, password)
  const isMatch = await bcrypt.compare(
    password,
    employee.password
  );

  if (!isMatch) {
    throw new BadrequestError("Invalid credentials");
  }
  const accessToken = jwt.sign(
    {
      id: employee.id,
      jobTitle: employee.jobTitle,
      email: employee.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // or "15m", "7d"
  );

  // 5. Return token
  return accessToken;
}
