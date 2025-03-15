describe("Navigation bar", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.login();
  });

  it("navbar should show all options", () => {
    const navBar = cy.get("nav");
    navBar.should("exist");
    navBar.within(() => {
      cy.contains("Home");
      cy.contains("Customers");
      cy.contains("Projects");
    });
  });
});
