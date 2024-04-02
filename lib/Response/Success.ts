export default class Success {
  static OK(message: string, content: string|undefined = undefined, headers: HeadersInit|undefined = undefined) {
      return Response.json({message, content}, {status: 200, statusText: 'OK', headers: headers});
  }

  static Created(message: string, location: string, headers: HeadersInit|undefined = undefined) {
      return Response.json({message, content: location}, {status: 201, statusText: 'Created', headers: {...headers, 'Location': location}});
  }

  static NoContent(headers: HeadersInit|undefined = undefined) {
      return Response.json({}, {status: 204, statusText: 'No Content', headers: headers});
  }

  static PartialContent(content: any, headers: HeadersInit|undefined = undefined) {
      return Response.json(content, {status: 204, statusText: 'No Content', headers: headers});
  }
}