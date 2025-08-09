/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericErrorMessage } from '../interfaces/error';

const handleCastError = (error: any) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid Id',
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleCastError;
