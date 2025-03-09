export function OK(
  message: string,
  content?: string,
  headers?: HeadersInit
): Response {
  return Response.json(
    { message, content },
    { status: 200, statusText: 'OK', headers: headers }
  );
}

export function Created(
  message: string,
  location: string,
  headers?: HeadersInit
): Response {
  return Response.json(
    { message, content: location },
    {
      status: 201,
      statusText: 'Created',
      headers: { ...headers, Location: location }
    }
  );
}
