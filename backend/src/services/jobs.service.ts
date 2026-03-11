import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JobFilters {
  page: number;
  limit: number;
  search?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
}

interface CreateJobData {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skillsRequired: string[];
  experienceLevel: string;
  companyId: string;
}

export const jobsService = {
  async findAll(filters: JobFilters) {
    const { page, limit, search, location, jobType, experienceLevel, salaryMin, salaryMax, skills } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'active',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (salaryMin || salaryMax) {
      where.AND = [];
      if (salaryMin) {
        where.AND.push({ salaryMax: { gte: salaryMin } });
      }
      if (salaryMax) {
        where.AND.push({ salaryMin: { lte: salaryMax } });
      }
    }

    if (skills && skills.length > 0) {
      where.skillsRequired = { hasSome: skills };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });
  },

  async create(data: CreateJobData) {
    return prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        location: data.location,
        jobType: data.jobType as any,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        currency: data.currency || 'USD',
        skillsRequired: data.skillsRequired,
        experienceLevel: data.experienceLevel as any,
        status: 'active',
        companyId: data.companyId,
      },
    });
  },

  async update(id: string, data: Partial<CreateJobData>) {
    return prisma.job.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  },

  async delete(id: string) {
    return prisma.job.delete({
      where: { id },
    });
  },

  async findByCompany(companyId: string) {
    return prisma.job.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
