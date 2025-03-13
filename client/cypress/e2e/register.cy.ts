describe("Register test", () => {
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
  });
});
