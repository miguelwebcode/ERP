describe("Logout", () => {
  beforeEach(() => {
    cy.logout();
    cy.visit("/");
    cy.login();
  });

  it("should navigate from home to login route after logout", () => {
    cy.url().should("eq", "http://localhost:5173/");
    cy.get('a[href="/login"]').click();
    cy.url().should("eq", "http://localhost:5173/login");
    cy.contains("h1", "Login");
  });
});
