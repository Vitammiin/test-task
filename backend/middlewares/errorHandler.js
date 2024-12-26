import { HttpError } from 'http-errors';

export const errorHandler = (error, request, reply) => {
  if (error instanceof HttpError) {
    reply.status(error.status).send({
      status: error.status,
      message: error.name,
      data: error,
    });
    return;
  }

  reply.status(500).send({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};
