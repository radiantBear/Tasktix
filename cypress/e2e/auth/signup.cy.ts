describe('Sign up', () => {
  beforeEach(() => {
    // ///////////////////////////////////////////////////////////////////////////////////
    // WARNING: These tests do **NOT** clean up the database between runs. To preserve
    // test isolation, be sure that the user interactions between tests do not overlap.
    // ///////////////////////////////////////////////////////////////////////////////////
    cy.visit('/');
  });

  it('Allows users to sign up', () => {
    cy.contains('Sign In').click();
    cy.contains('Sign Up').click();

    cy.findByLabelText('Username').type(`user_${Date.now()}`);
    cy.findByLabelText('Email').type(`user${Date.now()}@example.com`);
    cy.findByLabelText('Password').type('password123');

    cy.findByRole('form').contains('Sign Up').click();

    cy.location('pathname').should('eq', '/list');
  });
});
