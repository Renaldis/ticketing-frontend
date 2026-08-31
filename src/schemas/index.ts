import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const ticketCategoryItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tier name is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or positive'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
});

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.enum([
    'CONCERT',
    'SPORTS',
    'SEMINAR',
    'WEBINAR',
    'EXHIBITION',
    'WORKSHOP',
    'FESTIVAL',
  ]),
  location: z.string().min(3, 'Location is required'),
  date: z.string().min(1, 'Date and time are required'),
  categories: z.array(ticketCategoryItemSchema).min(1, 'At least one ticket tier is required'),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

export const addCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
});

export type AddCategoryFormData = z.infer<typeof addCategorySchema>;
