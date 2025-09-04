describe('Home List', () => {
  beforeEach(() => {
    cy.exec('npm run testdb:reset');
    cy.exec('npm run testdb:seed');

    cy.visit('/');
  });

  it('Shows an "all caught up" message for a new user', () => {
    cy.login('newUser', 'password123');

    cy.contains("You're all caught up!");
  });
});
