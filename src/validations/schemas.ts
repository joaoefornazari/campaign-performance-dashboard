import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().min(1, 'The email field is required.').email('Invalid email format.'),
  password: z.string().min(1, 'The password field is required.')
});

export const StoreUserSchema = z.object({
  name: z.string().min(1, 'The name field is required.').max(255),
  email: z.string().min(1, 'The email field is required.').email('Invalid email format.'),
  password: z.string().min(8, 'The password must be at least 8 characters.'),
  role: z.enum(['admin', 'standard']).optional()
});

export const UpdateUserSchema = z.object({
  name: z.string().max(255).optional(),
  email: z.string().email('Invalid email format.').optional(),
  password: z.string().min(8, 'The password must be at least 8 characters.').optional(),
  role: z.enum(['admin', 'standard']).optional()
});

export const StorePlatformSchema = z.object({
  name: z.string().min(2, 'The name must be at least 2 characters.').max(20)
});

export const UpdatePlatformSchema = z.object({
  name: z.string().min(2, 'The name must be at least 2 characters.').max(20).optional()
});

export const StoreCampaignSchema = z.object({
  name: z.string().min(10, 'The name must be at least 10 characters.').max(200),
  spend: z.number().min(0, 'The spend must be at least 0.'),
  revenue: z.number().min(0, 'The revenue must be at least 0.'),
  conversions: z.number().int().min(0, 'The conversions must be at least 0.'),
  platform_id: z.number().int(),
  user_id: z.number().int(),
  company_id: z.number().int().optional(),
  start_datetime: z.string().datetime().optional()
});

export const StoreCompanySchema = z.object({
  name: z.string().min(1, 'The name field is required.').max(255),
  ticker_symbol: z.string().optional()
});

export const UpdateCompanySchema = z.object({
  name: z.string().min(1, 'The name field is required.').max(255).optional(),
  ticker_symbol: z.string().optional()
});

export const UpdateCampaignSchema = z.object({
  name: z.string().min(10, 'The name must be at least 10 characters.').max(200).optional(),
  spend: z.number().min(0, 'The spend must be at least 0.').optional(),
  revenue: z.number().min(0, 'The revenue must be at least 0.').optional(),
  conversions: z.number().int().min(0, 'The conversions must be at least 0.').optional(),
  platform_id: z.number().int().optional(),
  user_id: z.number().int().optional(),
  company_id: z.number().int().optional(),
  start_datetime: z.string().datetime().optional()
});
