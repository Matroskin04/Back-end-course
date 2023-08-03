export type ErrorsTypeService = {
  errorsMessages: Array<{
    message: string;
    field: string;
  }>;
};

export type ResponseTypeService ={
  status: number;
  message: any;
};
