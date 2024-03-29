import { get } from 'lodash';
import * as toastr from 'toastr';

const loopErrors = (errors: any) => {
  if (errors && Array.isArray(errors)) {
    errors.forEach((error) => {
      toastr.error(error?.message);
    });
  }
};

const loopSimpleErrors = (errors: any) => {
  if (errors && Array.isArray(errors)) {
    errors.forEach((error) => {
      toastr.error(error);
    });
  }
};

export const showErrorMessage = (err: any) => {
  if (typeof err === 'string') {
    return toastr.error(err);
  }

  const backendErrorMessage = get(err, 'response.data.message');
  if (backendErrorMessage) {
    return Array.isArray(backendErrorMessage)
      ? loopSimpleErrors(backendErrorMessage)
      : toastr.error(backendErrorMessage);
  }

  const axiosErrors = get(err, 'response.data.errors');
  if (axiosErrors) {
    return loopErrors(axiosErrors);
  }

  const message = get(err, 'message');
  if (message) {
    return toastr.error(message);
  }

  const socketError = get(err, 'code');
  if (socketError) {
    return toastr.error(socketError);
  }
};
