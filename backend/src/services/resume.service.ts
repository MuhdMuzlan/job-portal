import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateResumeData {
  userId: string;
  fileUrl: string;
  fileName: string;
  parsedText?: string;
  parsedSkills?: string[];
}

export const resumeService = {
  async create(data: CreateResumeData) {
    // If this is the first resume, make it primary
    const existingResumes = await prisma.resume.count({
      where: { userId: data.userId },
    });

    return prisma.resume.create({
      data: {
        userId: data.userId,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        parsedText: data.parsedText,
        parsedSkills: data.parsedSkills || [],
        isPrimary: existingResumes === 0,
      },
    });
  },

  async findById(id: string) {
    return prisma.resume.findUnique({
      where: { id },
    });
  },

  async findByUser(userId: string) {
    return prisma.resume.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });
  },

  async delete(id: string) {
    return prisma.resume.delete({
      where: { id },
    });
  },

  async setPrimary(id: string, userId: string) {
    // Unset all other primary resumes
    await prisma.resume.updateMany({
      where: { userId },
      data: { isPrimary: false },
    });

    // Set the new primary
    return prisma.resume.update({
      where: { id },
      data: { isPrimary: true },
    });
  },
};
