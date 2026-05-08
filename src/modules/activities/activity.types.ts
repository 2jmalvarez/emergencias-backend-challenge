import type { createActivityBodySchema } from './activity.schemas';
import type { z } from 'zod';

export type CreateActivityDto = z.infer<typeof createActivityBodySchema>;

export type ActivityWithContact = {
  id: number;
  personId: number;
  activityType: 'call' | 'meeting' | 'email';
  activityDate: string;
  description: string | null;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  };
};
