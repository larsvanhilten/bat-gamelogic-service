export interface Error {
  message: string;
}

export default (error: any): Error => {
  let message = 'Oops, something went wrong';

  if (error.message) {
    message = error.message;
  }

  if (error.details) {
    message = error.details[0].message;
  }

  return {
    message
  };
};
