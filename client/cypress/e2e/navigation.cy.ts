describe("Navigation sidebar", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("input[name='email']").type("email@email.com");
    cy.get("input[name='password']").type("123456");
    cy.get("button[type='submit']").click();
  });

  afterEach(() => {
    cy.logout();
  });

  // it("sidebar should show all navLinks", () => {
  //   cy.get('a[href="/"]');
  //   cy.get('a[href="/customers"]');
  //   cy.get('a[href="/projects"]');
  //   cy.get('a[href="/employees"]');
  //   cy.get('a[href="/login"]');
  // });
  it("should navigate to customers section", () => {
    cy.get('a[href="/customers"]').click();

    cy.url().should("match", /\/customers$/);
  });
  // it("should navigate to projects section", () => {
  //   const navBar = cy.get("nav");
  //   navBar.should("exist");
  //   navBar.within(() => {
  //     cy.contains("Projects").click();
  //   });
  //   cy.url().should("match", /\/projects$/);
  // });
  // it("should navigate to home section", () => {
  //   const navBar = cy.get("nav");
  //   navBar.should("exist");
  //   navBar.within(() => {
  //     cy.contains("Customers").click();
  //     cy.url().should("match", /\/customers$/);
  //     cy.contains("Home").click();
  //   });
  //   cy.url().should("match", /\/$/);
  // });
});

// describe("Protected routes verification", () => {
//   beforeEach(() => {
//     cy.logout();
//     cy.visit("/login");
//   });
//   it("should redirect to /login if no auth and navigate to /home", () => {
//     cy.visit("/");
//     cy.url().should("match", /\/login$/);
//   });
//   it("should redirect to /login if no auth and navigate to /customers", () => {
//     cy.visit("/customers");
//     cy.url().should("match", /\/login$/);
//   });
//   it("should redirect to /login if no auth and navigate to /customers/add", () => {
//     cy.visit("/customers/add");
//     cy.url().should("match", /\/login$/);
//   });
//   it("should redirect to /login if no auth and navigate to /customers/read", () => {
//     cy.visit("/customers/read");
//     cy.url().should("match", /\/login$/);
//   });
//   it("should redirect to /login if no auth and navigate to /customers/edit", () => {
//     cy.visit("/customers/edit");
//     cy.url().should("match", /\/login$/);
//   });
//   it("should redirect to /login if no auth and navigate to /customers/delete", () => {
//     cy.visit("/customers/delete");
//     cy.url().should("match", /\/login$/);
//   });
//   it("should redirect to /login if no auth and navigate to /projects", () => {
//     cy.visit("/projects");
//     cy.url().should("match", /\/login$/);
//   });
//   it("should redirect to /login if no auth and navigate to /projects/add", () => {
//     cy.visit("/projects/add");
//     cy.url().should("match", /\/login$/);
//   });
//   it("should redirect to /login if no auth and navigate to /projects/read", () => {
//     cy.visit("/projects/read");
//     cy.url().should("match", /\/login$/);
//   });
//   it("should redirect to /login if no auth and navigate to /projects/edit", () => {
//     cy.visit("/projects/edit");
//     cy.url().should("match", /\/login$/);
//   });
//   it("should redirect to /login if no auth and navigate to /projects/delete", () => {
//     cy.visit("/projects/delete");
//     cy.url().should("match", /\/login$/);
//   });
// });

// describe("Navigation from customers section to its subroutes", () => {
//   beforeEach(() => {
//     cy.visit("/login");
//     cy.login();
//     cy.get("nav")
//       .should("exist")
//       .within(() => {
//         cy.contains("Customers").click();
//       });
//   });

//   afterEach(() => {
//     cy.logout();
//   });

//   it("should navigate to /customers/add route", () => {
//     cy.url().should("match", /\/customers$/);
//     cy.get("button").filter(":contains('CREATE')").click();
//     cy.url().should("match", /\/customers\/add$/);
//     cy.contains("NEW CUSTOMER");
//   });

//   it("should navigate to /customers/read route", () => {
//     cy.url().should("match", /\/customers$/);
//     cy.get("button").filter(":contains('READ')").click();
//     cy.url().should("match", /\/customers\/read$/);
//   });
//   it("should navigate to /customers/edit route", () => {
//     cy.url().should("match", /\/customers$/);
//     cy.get("button").filter(":contains('UPDATE')").click();
//     cy.url().should("match", /\/customers\/edit$/);
//     cy.contains("EDIT CUSTOMER");
//   });
//   it("should navigate to /customers/delete route", () => {
//     cy.url().should("match", /\/customers$/);
//     cy.get("button").filter(":contains('DELETE')").click();
//     cy.url().should("match", /\/customers\/delete$/);
//   });
// });

// describe("Navigation from projects section to its subroutes", () => {
//   beforeEach(() => {
//     cy.visit("/login");
//     cy.login();
//     cy.get("nav")
//       .should("exist")
//       .within(() => {
//         cy.contains("Projects").click();
//       });
//   });

//   afterEach(() => {
//     cy.logout();
//   });

//   it("should navigate to /projects/add route", () => {
//     cy.url().should("match", /\/projects$/);
//     cy.get("button").filter(":contains('CREATE')").click();
//     cy.url().should("match", /\/projects\/add$/);
//     cy.contains("NEW PROJECT");
//   });

//   it("should navigate to /projects/read route", () => {
//     cy.url().should("match", /\/projects$/);
//     cy.get("button").filter(":contains('READ')").click();
//     cy.url().should("match", /\/projects\/read$/);
//   });
//   it("should navigate to /projects/edit route", () => {
//     cy.url().should("match", /\/projects$/);
//     cy.get("button").filter(":contains('UPDATE')").click();
//     cy.url().should("match", /\/projects\/edit$/);
//     cy.contains("EDIT PROJECT");
//   });
//   it("should navigate to /projects/delete route", () => {
//     cy.url().should("match", /\/projects$/);
//     cy.get("button").filter(":contains('DELETE')").click();
//     cy.url().should("match", /\/projects\/delete$/);
//   });
// });
