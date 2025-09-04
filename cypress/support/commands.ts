// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import '@testing-library/cypress/add-commands';

Cypress.Commands.add('login', (username: string, password: string) => {
  const REDIRECT_PATH = '/list';

  cy.session(
    `login-${username}`,
    () => {
      cy.visit('/');
      cy.contains('Sign In').click();

      cy.findByLabelText('Username').type(username);
      cy.findByLabelText('Password').type(password);

      cy.findByRole('form').contains('Sign In').click();

      // Included to make sure the request is resolved before Cypress runs the validate()
      // function. Also needed to catch it if the redirect changes - the `REDIRECT_PATH`
      // constant will need to be updated so the very last line of this command works.
      cy.location('pathname').should('eq', REDIRECT_PATH);
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        cy.getCookie('user').should('exist');
        cy.request('/api/session').its('status').should('eq', 200);
      }
    }
  );

  // End up on "about:blank" after cy.session(), so need to resume where logging in left off
  cy.visit(REDIRECT_PATH);
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}
