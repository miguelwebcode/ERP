describe("Authentication test", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Shows welcome message with user email", () => {
    // Se asume que cy.login() realiza el login y actualiza la UI
    cy.login();

    // Verifica que aparezca el mensaje de bienvenida con el email indicado
    cy.contains("Welcome, email@email.com").should("be.visible");
  });
});
