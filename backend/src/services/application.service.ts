import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateApplicationData {
  userId: string;
  jobId: string;
  resumeId: string;
  coverLetter?: string;
  matchScore?: number;
}

export const applicationService = {
  async create(data: CreateApplicationData) {
    return prisma.application.create({
      data: {
        userId: data.userId,
        jobId: data.jobId,
        resumeId: data.resumeId,
        coverLetter: data.coverLetter,
        matchScore: data.matchScore,
        status: 'pending',
      },
    });
  },

  async findByUserAndJob(userId: string, jobId: string) {
    return prisma.application.findFirst({
      where: {
        userId,
        jobId,
      },
    });
  },

  async findByUser(userId: string) {
    return prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  },

  async findByJob(jobId: string) {
    return prisma.application.findMany({
      where: { jobId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            headline: true,
          },
        },
        resume: true,
      },
      orderBy: { appliedAt: 'desc' },
    });
  },

  async updateStatus(id: string, status: string) {
    return prisma.application.update({
      where: { id },
      data: {
        status: status as any,
        updatedAt: new Date(),
      },
    });
  },
};
