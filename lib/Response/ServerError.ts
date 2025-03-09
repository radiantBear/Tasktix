export default class ServerError {
  static Internal(
    message: string,
    content?: string,
    headers?: HeadersInit
  ): Response {
    return Response.json(
      { message, content },
      { status: 500, statusText: 'Internal Server Error', headers: headers }
    );
  }

  static BadGateway(
    message: string,
    content?: string,
    headers?: HeadersInit
  ): Response {
    return Response.json(
      { message, content },
      { status: 502, statusText: 'Bad Gateway', headers: headers }
    );
  }
}
