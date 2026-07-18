import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({ message: 'ایمیل الزامی است' })
    .min(1, 'ایمیل الزامی است')
    .email('فرمت ایمیل صحیح نیست'),

  password: z
    .string({ message: 'رمز عبور الزامی است' })
    .min(1, 'رمز عبور الزامی است')
    .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
})

export type LoginFormValues = z.infer<typeof loginSchema>