import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UpdateSettingsDto {
  reminderEnabled?: boolean;
  reminderTime?: string;
  darkMode?: boolean;
  currency?: string;
}

export async function getSettings() {
  let settings = await prisma.userSettings.findUnique({
    where: { id: 'default' },
  });

  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { id: 'default' },
    });
  }

  return settings;
}

export async function updateSettings(data: UpdateSettingsDto) {
  return prisma.userSettings.upsert({
    where: { id: 'default' },
    update: data,
    create: {
      id: 'default',
      ...data,
    },
  });
}
