import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const ticketCategoryItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nama tier kategori wajib diisi'),
  price: z.coerce.number().min(0, 'Harga tiket minimal 0'),
  capacity: z.coerce.number().int().min(1, 'Kapasitas tiket minimal 1'),
});

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Judul event minimal 3 karakter'),
  description: z.string().min(5, 'Deskripsi event minimal 5 karakter'),
  category: z.enum([
    'CONCERT',
    'SPORTS',
    'SEMINAR',
    'WEBINAR',
    'EXHIBITION',
    'WORKSHOP',
    'FESTIVAL',
  ]),
  location: z.string().min(3, 'Lokasi venue wajib diisi'),
  date: z.string().min(1, 'Jadwal tanggal dan waktu wajib diisi'),
  categories: z.array(ticketCategoryItemSchema).min(1, 'Minimal harus ada satu kategori tiket'),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

export const addCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori tiket wajib diisi'),
  price: z.coerce.number().min(0, 'Harga tiket minimal 0'),
  capacity: z.coerce.number().int().min(1, 'Kapasitas tiket minimal 1'),
});

export type AddCategoryFormData = z.infer<typeof addCategorySchema>;
