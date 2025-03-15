describe("Register", () => {
  beforeEach(() => {
    cy.logout();
    cy.visit("/login");
  });

  const randomDigits = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 1000)
  ).join("");
  const newUser = {
    name: "Name test",
    role: 1,
    email: `${randomDigits}@testemail.com`,
    password: "111222333",
    confirmPassword: "111222333",
  };
  const repeatedEmail = "email@email.com";
  it("should register successfully and navigate to home page", () => {
    cy.url().should("eq", "http://localhost:5173/login");
    cy.contains("button", "Register").should("be.visible").click();
    cy.url().should("eq", "http://localhost:5173/register");

    cy.get("input[name='name']").type(newUser.name);
    cy.get("select[name='role']").find("option").should("contain", "Developer");
    cy.get("select[name='role']").select(newUser.role);
    cy.get("input[name='email']").type(newUser.email);
    cy.get("input[name='password']").type(newUser.password);
    cy.get("input[name='confirmPassword']").type(newUser.confirmPassword);
    cy.contains("button", "Register").click();
    cy.contains("h1", "HOME").should("be.visible");
    cy.contains("h2", `Welcome, ${newUser.email}`).should("be.visible");
    cy.url().should("eq", "http://localhost:5173/");
  });
  it("should show error notification when email already in use", () => {
    cy.url().should("eq", "http://localhost:5173/login");
    cy.contains("button", "Register").should("be.visible").click();
    cy.url().should("eq", "http://localhost:5173/register");

    cy.get("input[name='name']").type(newUser.name);
    cy.get("select[name='role']").find("option").should("contain", "Developer");
    cy.get("select[name='role']").select(newUser.role);
    cy.get("input[name='email']").type(repeatedEmail);
    cy.get("input[name='password']").type(newUser.password);
    cy.get("input[name='confirmPassword']").type(newUser.confirmPassword);
    cy.contains("button", "Register").click();
    cy.contains(`${repeatedEmail} is already in use`).should("be.visible");
    cy.url().should("eq", "http://localhost:5173/register");
  });
  it("should show empty fields errors", () => {
    cy.url().should("eq", "http://localhost:5173/login");
    cy.contains("button", "Register").should("be.visible").click();
    cy.url().should("eq", "http://localhost:5173/register");

    cy.contains("button", "Register").click();
    cy.contains("Name is required").should("be.visible");
    cy.contains("Role is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Name is required").should("be.visible");
    cy.contains("Password required").should("be.visible");
    cy.contains("Confirm password required").should("be.visible");
    cy.url().should("eq", "http://localhost:5173/register");
  });
  it("should show wrong passwords and email errors", () => {
    cy.url().should("eq", "http://localhost:5173/login");
    cy.contains("button", "Register").should("be.visible").click();
    cy.url().should("eq", "http://localhost:5173/register");

    cy.get("input[name='password']").type("1");
    cy.get("input[name='confirmPassword']").type("2");
    cy.get("input[name='email']").type("e");
    cy.contains("Password must be at least 6 characters long").should(
      "be.visible"
    );
    cy.contains("Password must match").should("be.visible");
    cy.contains("button", "Register").should("be.visible").click();
    cy.url().should("eq", "http://localhost:5173/register");
  });
});
