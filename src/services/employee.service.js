import { prisma } from "../lib/prisma.js"

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
