import * as yup from 'yup';

interface ValidationSchemaProps {
  country?: string;
  symbolName: string;
}

export const validationSchema = () => {
  const schema: yup.ObjectSchema<ValidationSchemaProps> = yup.object({
    country: yup.string(),
    symbolName: yup.string().required('Symbol or name is required'),
  });

  return schema;
};

interface ValidationSchemaEmailProps {
  email: string;
}

export const validationSchemaEmail = () => {
  const schema: yup.ObjectSchema<ValidationSchemaEmailProps> = yup.object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  return schema;
};
