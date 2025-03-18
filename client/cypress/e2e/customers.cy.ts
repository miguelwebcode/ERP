describe("Create customer", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
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
    cy.get("nav").within(() => {
      cy.contains("Customers").click();
    });
    cy.url().should("match", /\/customers$/);

    cy.contains("button", /create/i).click();
    cy.url().should("match", /\/customers\/add$/);
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
});
