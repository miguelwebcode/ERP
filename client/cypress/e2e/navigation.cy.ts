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

describe("Protected routes verification", () => {
  beforeEach(() => {
    cy.logout();
    cy.visit("/login");
  });
  it("should redirect to /login if no auth and navigate to /home", () => {
    cy.visit("/");
    cy.url().should("match", /\/login$/);
  });
  it("should redirect to /login if no auth and navigate to /customers", () => {
    cy.visit("/customers");
    cy.url().should("match", /\/login$/);
  });
  it("should redirect to /login if no auth and navigate to /customers/add", () => {
    cy.visit("/customers/add");
    cy.url().should("match", /\/login$/);
  });
  it("should redirect to /login if no auth and navigate to /customers/read", () => {
    cy.visit("/customers/read");
    cy.url().should("match", /\/login$/);
  });
  it("should redirect to /login if no auth and navigate to /customers/edit", () => {
    cy.visit("/customers/edit");
    cy.url().should("match", /\/login$/);
  });
  it("should redirect to /login if no auth and navigate to /customers/delete", () => {
    cy.visit("/customers/delete");
    cy.url().should("match", /\/login$/);
  });
  it("should redirect to /login if no auth and navigate to /projects", () => {
    cy.visit("/projects");
    cy.url().should("match", /\/login$/);
  });
  it("should redirect to /login if no auth and navigate to /projects/add", () => {
    cy.visit("/projects/add");
    cy.url().should("match", /\/login$/);
  });
  it("should redirect to /login if no auth and navigate to /projects/read", () => {
    cy.visit("/projects/read");
    cy.url().should("match", /\/login$/);
  });
  it("should redirect to /login if no auth and navigate to /projects/edit", () => {
    cy.visit("/projects/edit");
    cy.url().should("match", /\/login$/);
  });
  it("should redirect to /login if no auth and navigate to /projects/delete", () => {
    cy.visit("/projects/delete");
    cy.url().should("match", /\/login$/);
  });
});
