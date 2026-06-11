import { BadrequestError, NotFoundError } from "../utils/error.js";
import { prisma } from "../lib/prisma.js";
import { invalidate } from "../utils/cache.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createEmployeeService = async (data) => {
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

export const getEmployeesService = async ({
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

export const fetchEmployeeService = async (id) => {
  const employee = await prisma.employee.findUnique({
    where: {
      employeeCode: id
    }
  })
  if (!employee) {
    throw new NotFoundError("Employee not found");
  }
  return employee
}

export const updateEmployeeDetailsService = async (updatedFields, id) => {
  const oldEmployee = await prisma.employee.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!oldEmployee) {
    throw new NotFoundError(
      "Employee not found or already deleted"
    );
  }

  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: updatedFields,
  });

  const affectsInsights =
    updatedFields.country !== undefined ||
    updatedFields.salary !== undefined ||
    updatedFields.jobTitle !== undefined;

  if (affectsInsights) {
    const oldCountry = oldEmployee.country;
    const newCountry = updatedFields.country || oldCountry;

    if (oldCountry.toLowerCase() !== newCountry.toLowerCase()) {
      await Promise.all([
        invalidate(oldCountry),
        invalidate(newCountry),
      ]);
    } else {
      await invalidate(oldCountry);
    }
  }

  return updatedEmployee;
};

export const deleteEmployeeService = async (id) => {
  const employee = await prisma.employee.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!employee) {
    throw new NotFoundError(
      "Employee not found or already deleted."
    );
  }

  await prisma.employee.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  await invalidate(employee.country);
}

export const validateAndIssueToken = async (email, password) => {
  const employee = await prisma.employee.findUnique({
    where: { email },
  });
  if (!employee) {
    throw new BadrequestError("Invalid credentials");
  }
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
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // or "15m", "7d"
  );

  // 5. Return token
  return {accessToken, employee};
}
