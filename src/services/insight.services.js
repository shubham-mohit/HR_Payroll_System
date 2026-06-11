import { prisma } from "../lib/prisma.js";

export async function getCountryInsightsService(country) {
    const [overall, byJobTitle] = await Promise.all([

        // Query 1 — overall aggregation for country
        prisma.employee.aggregate({
            where: {
                country: {
                    equals: country,
                },
            },
            _count: { id: true },
            _min: { salary: true },
            _max: { salary: true },
            _avg: { salary: true },
        }),


        // Query 2 — group by job title inside that country
        prisma.employee.groupBy({
            by: ['jobTitle'],
            where: {
                country: {
                    equals: country,
                },
            },
            _count: { id: true },
            _avg: { salary: true },
            _min: { salary: true },
            _max: { salary: true },
            orderBy: {
                _avg: { salary: 'desc' },
            },
        }),

    ]);

    if (!overall || overall._count.id === 0) {
        return null;
    }

    return {
        country,
        employee_count: overall._count.id,
        salary: {
            min: overall._min.salary,
            max: overall._max.salary,
            avg: parseFloat(overall._avg.salary.toFixed(2)),
        },
        by_job_title: byJobTitle.map((row) => ({
            job_title: row.jobTitle,
            employee_count: row._count.id,
            avg_salary: parseFloat(row._avg.salary.toFixed(2)),
            min_salary: row._min.salary,
            max_salary: row._max.salary,
        })),
        cached_at: new Date().toISOString(),
    };
}


export const getJobTitleInsightsService = async (jobTitle) => {
    const [overall, byCountry] = await Promise.all([
        prisma.employee.aggregate({
            where: {
                jobTitle,
                isDeleted: false,
            },
            _count: {
                id: true,
            },
            _avg: {
                salary: true,
            },
            _min: {
                salary: true,
            },
            _max: {
                salary: true,
            },
        }),

        prisma.employee.groupBy({
            by: ["country"],
            where: {
                jobTitle,
                isDeleted: false,
            },
            _count: {
                id: true,
            },
            _avg: {
                salary: true,
            },
            _min: {
                salary: true,
            },
            _max: {
                salary: true,
            },
            orderBy: {
                _avg: {
                    salary: "desc",
                },
            },
        }),
    ]);

    if (overall._count.id === 0) {
        return null;
    }

    return {
        job_title: jobTitle,
        employee_count: overall._count.id,

        salary: {
            min: overall._min.salary,
            max: overall._max.salary,
            avg: Number(
                overall._avg.salary?.toFixed(2) ?? 0
            ),
        },

        by_country: byCountry.map((row) => ({
            country: row.country,
            employee_count: row._count.id,
            avg_salary: Number(
                row._avg.salary?.toFixed(2) ?? 0
            ),
            min_salary: row._min.salary,
            max_salary: row._max.salary,
        })),

        generated_at: new Date().toISOString(),
    };
};

export const getAgeDistributionService = async () => {
    const employees = await prisma.employee.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            age: true,
        },
    });

    const buckets = {
        "18-25": 0,
        "26-35": 0,
        "36-45": 0,
        "46-55": 0,
        "56+": 0,
    };

    employees.forEach(({ age }) => {
        if (age <= 25) buckets["18-25"]++;
        else if (age <= 35) buckets["26-35"]++;
        else if (age <= 45) buckets["36-45"]++;
        else if (age <= 55) buckets["46-55"]++;
        else buckets["56+"]++;
    });

    return Object.entries(buckets).map(
        ([range, employee_count]) => ({
            range,
            employee_count,
        })
    );
};

export const getNewHiresThisMonthService = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const where = {
        isDeleted: false,
        createdAt: { gte: startOfMonth },
    };

    const [count, hires] = await Promise.all([
        prisma.employee.count({ where }),
        prisma.employee.findMany({
            where,
            select: {
                fullName: true,
                salary: true,
                country: true,
                jobTitle: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    return {
        month: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
        employee_count: count,
        hires: hires.map(h => ({
            fullName: h.fullName,
            salary: h.salary,
            country: h.country,
            jobTitle: h.jobTitle,
            startDate: h.createdAt.toISOString().split('T')[0],
        })),
    };
};
