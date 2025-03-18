describe("Create customer", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get("nav").within(() => {
      cy.contains(/customers$/i).click();
    });
    cy.url().should("match", /\/customers$/);

    cy.contains("button", /create/i).click();
    cy.url().should("match", /\/customers\/add$/);
  });

  const newCustomer = {
    address: "address",
    company: "company",
    email: "email123@gmail.com",
    name: "test create customer",
    phone: "111222333",
    project: "project123",
  };
  it("should create a new customer successfully", () => {
    cy.get("input[name='address']").type(newCustomer.address);
    cy.get("input[name='company']").type(newCustomer.company);
    cy.get("input[name='email']").type(newCustomer.email);
    cy.get("input[name='name']").type(newCustomer.name);
    cy.get("input[name='phone']").type(newCustomer.phone);
    cy.get("input[name='project']").type(newCustomer.project);
    cy.contains("button", /create customer/i).click();
    cy.contains(/customer created$/i);
    cy.wait(1000);
    // Clear customer from firestore
    cy.task("deleteCustomerByField", {
      fieldName: "email",
      fieldValue: newCustomer.email,
    });
  });
  it("should show required errors when fields are empty", () => {
    cy.contains("button", /create customer/i).click();
    cy.contains(/address is required/i);
    cy.contains(/company is required/i);
    cy.contains(/email is required/i);
    cy.contains(/name is required/i);
    cy.contains(/phone is required/i);
    cy.contains(/project is required/i);
  });
  it("should show invalid error when email has invalid format", () => {
    cy.get("input[name='email']").type("a");

    cy.contains("button", /create customer/i).click();

    cy.contains(/invalid email/i);
  });
  it("should show invalid error when phone has invalid format", () => {
    cy.get("input[name='phone']").type("a");

    cy.contains("button", /create customer/i).click();

    cy.contains(/Phone must contain 9 digits/i);
  });
});
