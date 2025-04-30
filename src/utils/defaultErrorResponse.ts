export const defaultErrorResponse: (error: Error) => { error: string } = (error: Error) => {
  return {
    error: error instanceof Error ? error.message : 'Internal Server Error',
  };
};
