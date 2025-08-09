/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';

const handleValidationError = (err: any): IGenericErrorResponse => {
  const validationError: IGenericErrorMessage[] = Object.values(err.errors).map(
    (el: any) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation error',
    errorMessages: validationError,
  };
};

export default handleValidationError;
