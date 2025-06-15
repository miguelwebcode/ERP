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

  it("sidebar should show all navLinks", () => {
    cy.get('a[href="/"]');
    cy.get('a[href="/customers"]');
    cy.get('a[href="/projects"]');
    cy.get('a[href="/employees"]');
    cy.get('a[href="/login"]');
  });
  it("should navigate to customers section", () => {
    cy.get('a[href="/customers"]').click();

    cy.url().should("match", /\/customers$/);
  });
  it("should navigate to projects section", () => {
    cy.get('a[href="/projects"]').click();

    cy.url().should("match", /\/projects$/);
  });
  it("should navigate to employees section", () => {
    cy.get('a[href="/employees"]').click();

    cy.url().should("match", /\/employees$/);
  });
  it("should navigate to home section", () => {
    cy.get('a[href="/customers"]').click();
    cy.url().should("match", /\/customers$/);
    cy.get('a[href="/"]').click();
    cy.url().should("match", /\/$/);
  });
});

describe("Protected routes verification", () => {
  beforeEach(() => {
    cy.logout();
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

describe("Navigation from customers section to its subroutes", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("input[name='email']").type("email@email.com");
    cy.get("input[name='password']").type("123456");
    cy.get("button[type='submit']").click();
    cy.get('a[href="/customers"]').click();
  });

  afterEach(() => {
    cy.logout();
  });

  it("should navigate to /customers/add route", () => {
    cy.url().should("match", /\/customers$/);
    cy.get("a").filter(":contains('CREATE')").click();
    cy.url().should("match", /\/customers\/add$/);
    cy.contains("NEW CUSTOMER");
  });

  it("should navigate to /customers/read route", () => {
    cy.url().should("match", /\/customers$/);
    cy.get("a").filter(":contains('READ')").click();
    cy.url().should("match", /\/customers\/read$/);
  });
  it("should navigate to /customers/edit route", () => {
    cy.url().should("match", /\/customers$/);
    cy.get("a").filter(":contains('UPDATE')").click();
    cy.url().should("match", /\/customers\/edit$/);
    cy.contains("EDIT CUSTOMER");
  });
  it("should navigate to /customers/delete route", () => {
    cy.url().should("match", /\/customers$/);
    cy.get("a").filter(":contains('DELETE')").click();
    cy.url().should("match", /\/customers\/delete$/);
  });
});

describe("Navigation from projects section to its subroutes", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("input[name='email']").type("email@email.com");
    cy.get("input[name='password']").type("123456");
    cy.get("button[type='submit']").click();
    cy.get('a[href="/projects"]').click();
  });

  afterEach(() => {
    cy.logout();
  });

  it("should navigate to /projects/add route", () => {
    cy.url().should("match", /\/projects$/);
    cy.get("a").filter(":contains('CREATE')").click();
    cy.url().should("match", /\/projects\/add$/);
    cy.contains("NEW PROJECT");
  });

  it("should navigate to /projects/read route", () => {
    cy.url().should("match", /\/projects$/);
    cy.get("a").filter(":contains('READ')").click();
    cy.url().should("match", /\/projects\/read$/);
  });
  it("should navigate to /projects/edit route", () => {
    cy.url().should("match", /\/projects$/);
    cy.get("a").filter(":contains('UPDATE')").click();
    cy.url().should("match", /\/projects\/edit$/);
    cy.contains("EDIT PROJECT");
  });
  it("should navigate to /projects/delete route", () => {
    cy.url().should("match", /\/projects$/);
    cy.get("a").filter(":contains('DELETE')").click();
    cy.url().should("match", /\/projects\/delete$/);
  });
});
describe("Navigation from employees section to its subroutes", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("input[name='email']").type("email@email.com");
    cy.get("input[name='password']").type("123456");
    cy.get("button[type='submit']").click();
    cy.get('a[href="/employees"]').click();
  });

  afterEach(() => {
    cy.logout();
  });

  it("should navigate to /employees/add route", () => {
    cy.url().should("match", /\/employees$/);
    cy.get("a").filter(":contains('CREATE')").click();
    cy.url().should("match", /\/employees\/add$/);
    cy.contains("NEW EMPLOYEE");
  });

  it("should navigate to /employees/read route", () => {
    cy.url().should("match", /\/employees$/);
    cy.get("a").filter(":contains('READ')").click();
    cy.url().should("match", /\/employees\/read$/);
  });
  it("should navigate to /employees/edit route", () => {
    cy.url().should("match", /\/employees$/);
    cy.get("a").filter(":contains('UPDATE')").click();
    cy.url().should("match", /\/employees\/edit$/);
    cy.contains("EDIT EMPLOYEE");
  });
  it("should navigate to /employees/delete route", () => {
    cy.url().should("match", /\/employees$/);
    cy.get("a").filter(":contains('DELETE')").click();
    cy.url().should("match", /\/employees\/delete$/);
  });
});
