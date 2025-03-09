export function BadRequest(
  message: string,
  content?: string,
  headers?: HeadersInit
): Response {
  return Response.json(
    { message, content },
    { status: 400, statusText: 'Bad Request', headers: headers }
  );
}

export function Unauthenticated(
  message: string,
  content?: string,
  headers?: HeadersInit
): Response {
  return Response.json(
    { message, content },
    { status: 401, statusText: 'Unauthorized', headers: headers }
  );
}

export function Forbidden(
  message: string,
  content?: string,
  headers?: HeadersInit
): Response {
  return Response.json(
    { message, content },
    { status: 403, statusText: 'Forbidden', headers: headers }
  );
}

export function NotFound(
  message: string,
  content?: string,
  headers?: HeadersInit
): Response {
  return Response.json(
    { message, content },
    { status: 404, statusText: 'Not Found', headers: headers }
  );
}

export function Conflict(
  message: string,
  content?: string,
  headers?: HeadersInit
): Response {
  return Response.json(
    { message, content },
    { status: 409, statusText: 'Conflict', headers: headers }
  );
}

export function Gone(
  message: string,
  content?: string,
  headers?: HeadersInit
): Response {
  return Response.json(
    { message, content },
    { status: 410, statusText: 'Gone', headers: headers }
  );
}

export function PayloadTooLarge(
  message: string,
  content?: string,
  headers?: HeadersInit
): Response {
  return Response.json(
    { message, content },
    { status: 413, statusText: 'Payload Too Large', headers: headers }
  );
}
