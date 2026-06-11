import { BadrequestError, NotFoundError } from "../utils/error.js";
import { prisma } from "../lib/prisma.js";
import { invalidate } from "../utils/cache.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createEmployeeService = async (data) => {
  const [existingEmployee, lastEmployee] = await Promise.all([
    prisma.employee.findUnique({
      where: {
        email: data.email,
      },
    }),

    prisma.employee.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        employeeCode: true,
      },
    }),
  ]);

  if (existingEmployee) {
    throw new Error("Employee with email already exists");
  }

  const nextNumber = lastEmployee?.employeeCode
    ? Number(lastEmployee.employeeCode.replace("EMP", "")) + 1
    : 1;

  const employeeCode = `EMP${String(nextNumber).padStart(5, "0")}`;

  return prisma.employee.create({
    data: {
      ...data,
      employeeCode,
    },
  });
};

const ALLOWED_SORT_FIELDS = [
  "id",
  "fullName",
  "salary",
  "age",
  "country",
  "jobTitle",
  "employeeCode",
];


export const getEmployeesService = async ({
  page = 1,
  limit = 10,
  search = "",
  country = "",
  department = "",
  sortBy = "id",
  sortOrder = "desc",
}) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  // Validate sort field
  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : "id";

  // Validate sort order
  const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";

  // Clean inputs
  const cleanSearch = search.trim();
  const cleanCountry = country.trim();
  const cleanDepartment = department.trim();

  /**
   * Build Prisma WHERE dynamically
   */
  const where = {
    isDeleted: false,
    ...(cleanCountry && {
      country: cleanCountry,
    }),
    ...(cleanDepartment && {
      department: cleanDepartment,
    }),
    ...(cleanSearch && {
      OR: [
        {
          fullName: {
            contains: cleanSearch,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: cleanSearch,
            mode: "insensitive",
          },
        },
        {
          jobTitle: {
            contains: cleanSearch,
            mode: "insensitive",
          },
        },
        {
          employeeCode: {
            contains: cleanSearch,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  /**
   * Run queries in parallel (performance optimization)
   */
  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
      select: {
        id: true,
        employeeCode: true,
        fullName: true,
        email: true,
        jobTitle: true,
        country: true,
        department: true,
        salary: true,
        currency: true,
        age: true,
        isDeleted: true,
        createdAt: true,
      },
    }),

    prisma.employee.count({
      where,
    }),
  ]);

  return {
    data: employees,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      hasNextPage: safePage * safeLimit < total,
      hasPrevPage: safePage > 1,
    },
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
  return { accessToken, employee };
}
