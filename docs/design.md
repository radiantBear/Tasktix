# Website Design Decisions

## Middleware Not Used For Authorization
A `middleware.ts` file is [the usual way](https://nextjs.org/docs/pages/building-your-application/authentication#protecting-routes-with-middleware) to handle authorization for protected pages. However, the MySQL library requires the 'net' module, which the edge runtime that runs `middleware.ts` does not support. This means it is impossible to verify that the user's session cookie is valid via middleware. Instead, each protected page **must** begin by verifying that the user is authorized or redirect them to `/signIn`.

## API Over Server Actions
This project uses a REST API for communicating with the server instead of the Server Actions built into Next.js. There are a handful of reasons for this; mainly:
  - Server Actions could not be used if a mobile app is developed, and an API would need to be developed anyway;
  - Next.js' Server Actions structure provides little control over when database sessions are created and destroyed; 
  - Server Actions provide little granularity for responses (just `throw`ing or `return`ing); and
  - REST APIs are well-regarded for their maintainability.

There are some drawbacks of this decision, however:
  - Server Actions guarantee type safety since they're just function calls, but API calls do not;
  - Server Actions automatically take care of many details that APIs must explicitly define; and
  - This approach does not take advantage of all Next.js features.

This decision may be revisited in the future, but a change to Server Actions is unlikely.