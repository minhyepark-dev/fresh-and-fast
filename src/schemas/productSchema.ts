import * as yup from 'yup';

export const productSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  price: yup.number().required(),
  image_url: yup.string().required(),
  description: yup.string().optional(),
});
