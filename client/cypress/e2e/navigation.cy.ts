describe("Navigation bar", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it("navbar should show all navLinks", () => {
    const navBar = cy.get("nav");
    navBar.should("exist");
    navBar.within(() => {
      cy.contains("Home");
      cy.contains("Customers");
      cy.contains("Projects");
    });
  });
  it("should navigate to customers section", () => {
    const navBar = cy.get("nav");
    navBar.should("be.visible");
    navBar.within(() => {
      const customersNavLink = cy.contains("Customers");
      customersNavLink.click();
    });
    cy.url().should("match", /\/customers$/);
  });
  it("should navigate to projects section", () => {
    const navBar = cy.get("nav");
    navBar.should("exist");
    navBar.within(() => {
      cy.contains("Projects").click();
    });
    cy.url().should("match", /\/projects$/);
  });
  it("should navigate to home section", () => {
    const navBar = cy.get("nav");
    navBar.should("exist");
    navBar.within(() => {
      cy.contains("Customers").click();
      cy.url().should("match", /\/customers$/);
      cy.contains("Home").click();
    });
    cy.url().should("match", /\/$/);
  });
});
