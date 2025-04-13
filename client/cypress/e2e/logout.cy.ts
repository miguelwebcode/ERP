describe("Logout", () => {
  beforeEach(() => {
    cy.logout();

    cy.login();
    cy.visit("/");
  });

  it("should navigate from home to login route after logout", () => {
    cy.url().should("eq", "http://localhost:5173/");
    cy.get("button").filter(":contains('Logout')").click();
    cy.url().should("eq", "http://localhost:5173/login");
    cy.contains("h1", "Login");
  });
});
