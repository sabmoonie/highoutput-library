import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  InputProps,
  TextareaProps,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

import InputField from '../../components/InputField/InputField';
import TextAreaField from '../../components/TextareaField/TextareaField';

export type AutoFormProps = {
  yupSchema?: any;
  inputProps?: InputProps;
  onSubmitForm?(v: any): void;
  buttonProps?: ButtonProps;
  boxContainer?: BoxProps;
  placeholders?: Array<string>;
  textAreaProps?: TextareaProps;
};

export enum InputTypeEnum {
  Textarea = 'textarea',
  Input = 'input',
}

export interface InputTypeProps {
  key: string;
  label: string;
  placeholder: string;
  inputProps?: InputProps;
  textAreaProps?: TextareaProps;
}

const getInputType = (
  input: InputTypeProps,
  type: InputTypeEnum,
  form: UseFormReturn
) => {
  const { key, placeholder, label, inputProps, textAreaProps } = input;
  const { register, formState } = form;
  const { isSubmitting, errors } = formState;
  const error = (errors[`${key}`]?.message as unknown) as string;

  const input_type = {
    textarea: (
      <TextAreaField
        {...register(key)}
        key={key}
        id={key}
        label={label}
        placeholder={placeholder}
        errorMsg={error}
        disabled={isSubmitting}
        textAreaProps={{ width: '100%', ...textAreaProps }}
      />
    ),
    input: (
      <InputField
        {...register(key)}
        key={key}
        id={key}
        label={label}
        placeholder={placeholder}
        errorMsg={error}
        disabled={isSubmitting}
        partProps={{ input: { width: '100%', ...inputProps } }}
      />
    ),
  };

  return input_type[type];
};

const AutoForm: FC<AutoFormProps> = props => {
  const {
    yupSchema,
    buttonProps,
    boxContainer,
    onSubmitForm,
    placeholders,
    inputProps,
    textAreaProps,
  } = props;

  const dataKey = Object.keys(yupSchema.fields);

  const form = useForm({
    resolver: yupResolver(yupSchema),

    shouldUnregister: true,
  });

  const { handleSubmit } = form;

  const onSubmitData = (s: any) => {
    if (onSubmitForm) onSubmitForm(s);
  };

  return (
    <Box width={512} {...boxContainer}>
      <VStack as={'form'} onSubmitCapture={handleSubmit(onSubmitData)}>
        {dataKey.map((key, idx) => {
          const input = {
            key,
            label:
              yupSchema.fields[`${key}`].spec.label ??
              key.charAt(0).toUpperCase() + key.slice(1),
            placeholder: placeholders?.[idx],
            inputProps,
            textAreaProps,
          } as InputTypeProps;
          const type = yupSchema.fields[`${key}`].spec?.meta?.type || 'input';

          return getInputType(input, type, form);
        })}
        <Button
          type="submit"
          variant={'primary'}
          width={'100%'}
          {...buttonProps}
          data-testid="button.form.submit"
        >
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default AutoForm;
