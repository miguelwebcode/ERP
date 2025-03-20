import { Customer } from "../support/types";

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
    cy.wait(1000);
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
describe("Read Customers", () => {
  beforeEach(() => {
    cy.logout();
    cy.login();
    cy.visit("/");
    cy.get("nav").within(() => {
      cy.contains(/customers$/i).click();
    });
    cy.url().should("match", /\/customers$/);

    cy.contains("button", /read/i).click();
    cy.url().should("match", /\/customers\/read$/);
  });
  it("should show all customer cards", () => {
    cy.task("getAllCustomers").then((result) => {
      const customers = result as Customer[];
      // Verifica que el resultado sea un array
      expect(Array.isArray(customers)).to.be.true;

      // Validate Customer data
      customers.forEach((customer) => {
        expect(customer).to.be.an("object");
        expect(customer).to.have.property("customerId");
        expect(customer).to.have.property("name");
        expect(customer).to.have.property("email");
        cy.contains(customer.email);
        expect(customer).to.have.property("address");
        expect(customer).to.have.property("company");
        expect(customer).to.have.property("phone");
        expect(customer).to.have.property("project");
      });
    });
  });
});

describe("Edit Customer", () => {
  beforeEach(() => {
    cy.logout();
    cy.login();
    cy.visit("/");
    cy.get("nav").within(() => {
      cy.contains(/customers$/i).click();
    });
    cy.url().should("match", /\/customers$/);
    cy.contains("button", /update$/i).click();
    cy.url().should("match", /\/customers\/edit$/);
  });
  it("should edit a customer successfully", () => {
    cy.get("select[name='customerId']").select(1);
    cy.contains("button", /fetch customer$/i).click();
    cy.wait(1000);
    // Compare values with firestore
    cy.get("select[name='customerId']")
      .find("option:eq(1)")
      .invoke("val")
      .then((firstCustomerId) => {
        console.log("firstCustomerId: ", firstCustomerId);
        cy.task("getCustomerById", firstCustomerId).then((customer) => {
          const customerCast = customer as Customer;
          cy.get("input[name='address']")
            .invoke("val")
            .then((address) => {
              expect(address).to.eq(customerCast.address);
            });
          cy.get("input[name='company']")
            .invoke("val")
            .then((company) => {
              expect(company).to.eq(customerCast.company);
            });
          cy.get("input[name='email']")
            .invoke("val")
            .then((email) => {
              expect(email).to.eq(customerCast.email);
            });
          cy.get("input[name='name']")
            .invoke("val")
            .then((name) => {
              expect(name).to.eq(customerCast.name);
            });
          cy.get("input[name='phone']")
            .invoke("val")
            .then((phone) => {
              expect(phone).to.eq(customerCast.phone);
            });
          cy.get("input[name='project']")
            .invoke("val")
            .then((project) => {
              expect(project).to.eq(customerCast.project);
            });
        });
      });

    const newAddress: string = "1";

    cy.get("input[name='address']").clear().type(newAddress);
    // update
    cy.contains("button", /update customer$/i).click();
    cy.contains(/customer updated$/i);
    // reverse update
    cy.get("select[name='customerId']").select(1);
    cy.contains("button", /fetch customer$/i).click();
    cy.wait(1000);
    cy.get("input[name='address']")
      .invoke("val")
      .then((address) => {
        expect(address).to.eq(newAddress);
      });

    cy.get("input[name='address']").clear().type("Customer2 Street");
    cy.contains("button", /update customer$/i).click();
    cy.contains(/customer updated$/i);
  });
  it("should show empty customer id error", () => {
    cy.contains("button", /fetch customer$/i).click();
    cy.contains(/customer id is required$/i);
  });
  it("should show required fields errors", () => {
    cy.get("select[name='customerId']").select(1);
    cy.contains("button", /fetch customer$/i).click();
    cy.wait(500);
    // Clear all fields
    cy.get("input[name='address']").clear();
    cy.get("input[name='company']").clear();
    cy.get("input[name='email']").clear();
    cy.get("input[name='name']").clear();
    cy.get("input[name='phone']").clear();
    cy.get("input[name='project']").clear();
    cy.contains("button", /update customer$/i).click();
    // Check empty field errors
    cy.contains(/address is required$/i);
    cy.contains(/company is required$/i);
    cy.contains(/email is required$/i);
    cy.contains(/name is required$/i);
    cy.contains(/phone is required$/i);
    cy.contains(/project is required$/i);
  });
  it("should show invalid field errors in email and phone", () => {
    cy.get("select[name='customerId']").select(1);
    cy.contains("button", /fetch customer$/i).click();
    cy.wait(500);
    cy.get("input[name='email']").clear().type("a");
    cy.get("input[name='phone']").clear().type("a");
    cy.contains("button", /update customer$/i).click();
    cy.contains(/invalid email$/i);
    cy.contains(/Phone must contain 9 digits$/i);
  });
});

describe("Delete Customer", () => {
  beforeEach(() => {
    cy.logout();
    cy.login();
    cy.visit("/");
    cy.get("nav").within(() => {
      cy.contains(/customers$/i).click();
    });
    cy.url().should("match", /\/customers$/);
    cy.contains("button", /delete$/i).click();
    cy.url().should("match", /\/customers\/delete$/);
  });

  it("should delete a customer successfully", () => {
    cy.get("select[name='customerId']").select(1);
    cy.contains("button", /fetch customer$/i).click();
    cy.wait(500);
    cy.get("select[name='customerId']")
      .find("option:eq(1)")
      .invoke("val")
      .then((customerId) => {
        cy.task("getCustomerById", customerId).then((data) => {
          const customer = data as Customer;
          cy.contains("button", /delete customer$/i).click();
          cy.contains(/customer deleted$/i);
          // Create customer again
          cy.task("addCustomer", customer);
        });
      });
  });
  it("should show empty customer error", () => {
    cy.contains("button", /fetch customer$/i).click();
    cy.contains(/customer id is required$/i);
  });
});
