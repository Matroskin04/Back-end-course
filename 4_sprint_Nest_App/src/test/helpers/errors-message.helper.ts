export function createErrorsMessageTest(field: string) {
  return {
    errorsMessages: [
      {
        message: expect.any(String),
        field: field ?? expect.any(String),
      },
    ],
  };
}
