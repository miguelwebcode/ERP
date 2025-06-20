import { Customer } from "../support/types";

describe("Create customer", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get('a[href="/customers"]').click();
    cy.url().should("match", /\/customers$/);

    cy.contains("a", /^create$/i).click();
    cy.url().should("match", /\/customers\/add$/);
  });

  afterEach(() => {
    cy.logout();
  });

  const newCustomer: Customer = {
    address: "address",
    company: "company",
    email: "email123@gmail.com",
    name: "test create customer",
    phone: "111222333",
  };
  it("should create a new customer successfully", () => {
    cy.get("input[name='address']").type(newCustomer.address);
    cy.get("input[name='company']").type(newCustomer.company);
    cy.get("input[name='email']").type(newCustomer.email);
    cy.get("input[name='name']").type(newCustomer.name);
    cy.get("input[name='phone']").type(newCustomer.phone);
    cy.contains("button", /create/i).click();
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
    cy.contains("button", /create/i).click();
    cy.contains(/address is required/i);
    cy.contains(/company is required/i);
    cy.contains(/email is required/i);
    cy.contains(/name is required/i);
    cy.contains(/phone is required/i);
  });
  it("should show invalid error when email has invalid format", () => {
    cy.get("input[name='email']").type("a");

    cy.contains("button", /create/i).click();

    cy.contains(/invalid email/i);
  });
  it("should show invalid error when phone has invalid format", () => {
    cy.get("input[name='phone']").type("a");

    cy.contains("button", /create/i).click();

    cy.contains(/Phone must contain 9 digits/i);
  });
});
describe("Read Customers", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get('a[href="/customers"]').click();
    cy.url().should("match", /\/customers$/);

    cy.contains("a", /^read$/i).click();
    cy.url().should("match", /\/customers\/read$/);
  });

  afterEach(() => {
    cy.logout();
  });
  it("should show all customer cards", () => {
    cy.task("getAllCustomers").then((result) => {
      const customers = result as Customer[];
      // Verifica que el resultado sea un array
      expect(Array.isArray(customers)).to.be.true;

      // Validate Customer data
      customers.forEach((customer) => {
        expect(customer).to.be.an("object");
        expect(customer).to.have.property("id");
        expect(customer).to.have.property("name");
        expect(customer).to.have.property("email");
        cy.contains(customer.email);
        expect(customer).to.have.property("address");
        expect(customer).to.have.property("company");
        expect(customer).to.have.property("phone");
      });
    });
  });
});

describe("Edit Customer", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get('a[href="/customers"]').click();
    cy.url().should("match", /\/customers$/);

    cy.contains("a", /^update$/i).click();
    cy.url().should("match", /\/customers\/edit$/);
  });

  afterEach(() => {
    cy.logout();
  });
  it("should edit a customer successfully", () => {
    cy.get("select[name='customerId']").select(1);
    cy.contains("button", /get data$/i).click();
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

          const newAddress: string = "1";

          cy.get("input[name='address']").clear().type(newAddress);
          // update
          cy.contains("button", /update$/i).click();
          cy.contains(/customer updated$/i);
          // reverse update
          cy.get("select[name='customerId']").select(1);
          cy.contains("button", /get data$/i).click();
          cy.wait(1000);
          cy.get("input[name='address']")
            .invoke("val")
            .then((address) => {
              expect(address).to.eq(newAddress);
            });

          cy.get("input[name='address']").clear().type(customerCast.address);
          cy.contains("button", /update$/i).click();
          cy.contains(/customer updated$/i);
        });
      });
  });
  it("should show empty customer id error", () => {
    cy.contains("button", /get data$/i).click();
    cy.contains(/customer id is required$/i);
  });
  it("should show required fields errors", () => {
    cy.get("select[name='customerId']").select(1);
    cy.contains("button", /get data$/i).click();
    cy.wait(500);
    // Clear all fields
    cy.get("input[name='address']").clear();
    cy.get("input[name='company']").clear();
    cy.get("input[name='email']").clear();
    cy.get("input[name='name']").clear();
    cy.get("input[name='phone']").clear();
    cy.contains("button", /update$/i).click();
    // Check empty field errors
    cy.contains(/address is required$/i);
    cy.contains(/company is required$/i);
    cy.contains(/email is required$/i);
    cy.contains(/name is required$/i);
    cy.contains(/phone is required$/i);
  });
  it("should show invalid field errors in email and phone", () => {
    cy.get("select[name='customerId']").select(1);
    cy.contains("button", /get data$/i).click();
    cy.wait(500);
    cy.get("input[name='email']").clear().type("a");
    cy.get("input[name='phone']").clear().type("a");
    cy.contains("button", /update$/i).click();
    cy.contains(/invalid email$/i);
    cy.contains(/Phone must contain 9 digits$/i);
  });
});

describe("Delete Customer", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get('a[href="/customers"]').click();
    cy.url().should("match", /\/customers$/);

    cy.contains("a", /delete$/i).click();
    cy.url().should("match", /\/customers\/delete$/);
  });

  afterEach(() => {
    cy.logout();
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
          cy.contains("button", /delete$/i).click();
          cy.contains(/customer deleted$/i);
          // Create customer again
          cy.task("addCustomer", customer);
        });
      });
  });
  it("should show empty customer id error", () => {
    cy.contains("button", /fetch customer$/i).click();
    cy.contains(/customer id is required$/i);
  });
});
