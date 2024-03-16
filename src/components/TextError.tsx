'use client';

import React from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { FieldValues } from 'react-hook-form';

type Props = {
  errors: FieldValues;
  name: string;
};

const TextError: React.FC<Props> = ({ errors, name }) => {
  return (
    <p className="text-sm p-1 text-red-500">
      <ErrorMessage errors={errors} name={name} />
    </p>
  );
};

export default TextError;
