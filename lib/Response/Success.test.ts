import * as Success from './Success';

describe('OK', () => {
  test('Returns a response with status 200 and provided headers and JSON-encoded body representing the message and content fields', async () => {
    const message = 'Success message';
    const content = 'Extra details';
    const headers = { 'X-Custom': 'some header value' };

    const response = Success.OK(message, content, headers);

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');

    expect(Array.from(response.headers.keys())).toHaveLength(2);
    expect(response.headers.get('X-Custom')).toBe(headers['X-Custom']);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(await response.json()).toEqual({ message, content });
  });

  test('Returns a response with status 200 and JSON-encoded body representing just the message when content and headers are not provided', async () => {
    const message = 'Success message';

    const response = Success.OK(message);

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');

    expect(Array.from(response.headers.keys())).toHaveLength(1);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(await response.json()).toEqual({ message });
  });

  test('Throws an error when Response.json() fails', () => {
    const message = 'Success message';

    const originalJson = Response.json;

    Response.json = jest.fn(() => {
      throw new Error('Stringification failed');
    });

    expect(() => Success.OK(message)).toThrow('Stringification failed');

    Response.json = originalJson;
  });
});

describe('Created', () => {
  test('Returns a response with status 201 and provided headers merged with Location header and JSON-encoded body representing the message and location as content', async () => {
    const message = 'Success message';
    const location = '/new/resource';
    const headers = { 'X-Custom': 'some header value' };

    const response = Success.Created(message, location, headers);

    expect(response.status).toBe(201);
    expect(response.statusText).toBe('Created');

    // Headers should include custom header, Location, and Content-Type
    expect(Array.from(response.headers.keys())).toHaveLength(3);
    expect(response.headers.get('X-Custom')).toBe(headers['X-Custom']);
    expect(response.headers.get('Location')).toBe(location);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(await response.json()).toEqual({ message, content: location });
  });

  test('Returns a response with status 201 and JSON-encoded body representing the message and location when headers are not provided', async () => {
    const message = 'Success message';
    const location = '/new/resource';

    const response = Success.Created(message, location);

    expect(response.status).toBe(201);
    expect(response.statusText).toBe('Created');

    // With no extra headers, only Location and Content-Type should be present
    expect(Array.from(response.headers.keys())).toHaveLength(2);
    expect(response.headers.get('Location')).toBe(location);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(await response.json()).toEqual({ message, content: location });
  });

  test('Throws an error when Response.json() fails', () => {
    const message = 'Success message';
    const location = '/new/resource';

    const originalJson = Response.json;

    Response.json = jest.fn(() => {
      throw new Error('Stringification failed');
    });

    expect(() => Success.Created(message, location)).toThrow(
      'Stringification failed'
    );

    Response.json = originalJson;
  });
});
