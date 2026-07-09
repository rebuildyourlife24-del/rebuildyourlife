export * from '@prisma/client';
import { PrismaClient as PC } from '@prisma/client';
export type PrismaClient = any;
export const PrismaClient: any = PC;
export * from './client';
