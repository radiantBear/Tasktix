export default class ClientError {
  static BadRequest(
    message: string,
    content?: string,
    headers?: HeadersInit
  ): Response {
    return Response.json(
      { message, content },
      { status: 400, statusText: 'Bad Request', headers: headers }
    );
  }

  static Unauthenticated(
    message: string,
    content?: string,
    headers?: HeadersInit
  ): Response {
    return Response.json(
      { message, content },
      { status: 401, statusText: 'Unauthorized', headers: headers }
    );
  }

  static Forbidden(
    message: string,
    content?: string,
    headers?: HeadersInit
  ): Response {
    return Response.json(
      { message, content },
      { status: 403, statusText: 'Forbidden', headers: headers }
    );
  }

  static NotFound(
    message: string,
    content?: string,
    headers?: HeadersInit
  ): Response {
    return Response.json(
      { message, content },
      { status: 404, statusText: 'Not Found', headers: headers }
    );
  }

  static Conflict(
    message: string,
    content?: string,
    headers?: HeadersInit
  ): Response {
    return Response.json(
      { message, content },
      { status: 409, statusText: 'Conflict', headers: headers }
    );
  }

  static Gone(
    message: string,
    content?: string,
    headers?: HeadersInit
  ): Response {
    return Response.json(
      { message, content },
      { status: 410, statusText: 'Gone', headers: headers }
    );
  }

  static PayloadTooLarge(
    message: string,
    content?: string,
    headers?: HeadersInit
  ): Response {
    return Response.json(
      { message, content },
      { status: 413, statusText: 'Payload Too Large', headers: headers }
    );
  }
}
