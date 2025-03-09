import * as ServerError from './ServerError';

describe('Internal', () => {
  test('Returns a response with status 500 and provided headers and JSON-encoded body representing the message and content fields', async () => {
    const message = 'Error message';
    const content = 'Extra details';
    const headers = { 'X-Custom': 'some header value' };

    const response = ServerError.Internal(message, content, headers);

    expect(response.status).toBe(500);
    expect(response.statusText).toBe('Internal Server Error');

    expect(Array.from(response.headers.keys())).toHaveLength(2);
    expect(response.headers.get('X-Custom')).toBe(headers['X-Custom']);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(await response.json()).toEqual({ message, content });
  });

  test('Returns a response with status 500 and JSON-encoded body representing just the message when content and headers are not provided', async () => {
    const message = 'Error message';

    const response = ServerError.Internal(message);

    expect(response.status).toBe(500);
    expect(response.statusText).toBe('Internal Server Error');

    expect(Array.from(response.headers.keys())).toHaveLength(1);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(await response.json()).toEqual({ message });
  });

  test('Throws an error when Response.json() fails', () => {
    const message = 'Error message';

    const originalJson = Response.json;
    Response.json = jest.fn(() => {
      throw new Error('Stringification failed');
    });

    expect(() => ServerError.Internal(message)).toThrow(
      'Stringification failed'
    );

    Response.json = originalJson;
  });
});

describe('BadGateway', () => {
  test('Returns a response with status 502 and provided headers and JSON-encoded body representing the message and content fields', async () => {
    const message = 'Error message';
    const content = 'Extra details';
    const headers = { 'X-Custom': 'some header value' };

    const response = ServerError.BadGateway(message, content, headers);

    expect(response.status).toBe(502);
    expect(response.statusText).toBe('Bad Gateway');

    // Expect headers to include the provided header plus the default Content-Type
    expect(Array.from(response.headers.keys())).toHaveLength(2);
    expect(response.headers.get('X-Custom')).toBe(headers['X-Custom']);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(await response.json()).toEqual({ message, content });
  });

  test('Returns a response with status 502 and JSON-encoded body representing just the message when content and headers are not provided', async () => {
    const message = 'Error message';

    const response = ServerError.BadGateway(message);

    expect(response.status).toBe(502);
    expect(response.statusText).toBe('Bad Gateway');

    expect(Array.from(response.headers.keys())).toHaveLength(1);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(await response.json()).toEqual({ message });
  });

  test('Throws an error when Response.json() fails', () => {
    const message = 'Error message';

    const originalJson = Response.json;
    Response.json = jest.fn(() => {
      throw new Error('Stringification failed');
    });

    expect(() => ServerError.BadGateway(message)).toThrow(
      'Stringification failed'
    );

    Response.json = originalJson;
  });
});
