describe("Authentication test", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  // Works when tests production but not with emulators
  it("allows the user to fill and submit the login form", () => {
    cy.get("input[name='email']").type("email@email.com");

    cy.get("input[name='password']").type("123456");

    cy.get("button[type='submit']").click();

    cy.contains("Welcome, email@email.com").should("be.visible");
  });
});
