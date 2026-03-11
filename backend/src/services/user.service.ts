import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: string;
  companyName?: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  skills?: string[];
  experienceYears?: number;
}

export const userService = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        company: true,
        resumes: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });
  },

  async create(data: CreateUserData) {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
    });

    if (data.role === 'company' && data.companyName) {
      await prisma.company.create({
        data: {
          userId: user.id,
          name: data.companyName,
        },
      });
    }

    return user;
  },

  async update(id: string, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  },

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          isVerified: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};
