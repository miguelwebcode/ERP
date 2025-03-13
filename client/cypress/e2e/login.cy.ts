describe("Authentication test", () => {
  beforeEach(() => {
    cy.logout();
    cy.visit("/login");
  });

  // Works when tests production but not with emulators
  it("allows the user to fill and submit the login form", () => {
    cy.get("input[name='email']").type("email@email.com");

    cy.get("input[name='password']").type("123456");

    cy.get("button[type='submit']").click();

    cy.contains("h1", "HOME").should("be.visible");
    cy.contains("h2", "Welcome, email@email.com").should("be.visible");
    cy.url().should("eq", "http://localhost:5173/");
  });
  it("after entering invalid credentials shows invalid credentials notification", () => {
    cy.get("input[name='email']").type("wrongemail@email.com");

    cy.get("input[name='password']").type("wrongpassword");

    cy.get("button[type='submit']").click();

    cy.contains("Invalid credentials").should("be.visible");
    cy.url().should("eq", "http://localhost:5173/login");
  });
});
