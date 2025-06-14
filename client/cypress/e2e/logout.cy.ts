describe("Logout", () => {
  beforeEach(() => {
    cy.logout();

    cy.visit("/");
    cy.get("input[name='email']").type("email@email.com");

    cy.get("input[name='password']").type("123456");
    cy.get("button[type='submit']").click();
  });

  it("should navigate from home to login route after logout", () => {
    cy.url().should("eq", "http://localhost:5173/");
    cy.get('a[href="/login"]').click();
    cy.url().should("eq", "http://localhost:5173/login");
    cy.contains("h1", "Login");
  });
});
