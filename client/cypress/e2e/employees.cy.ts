import { Customer, Employee } from "../support/types";

describe("Create employee", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get('a[href="/employees"]').click();
    cy.url().should("match", /\/employees$/);

    cy.contains("a", /^create$/i).click();
    cy.url().should("match", /\/employees\/add$/);
  });

  afterEach(() => {
    cy.logout();
  });

  const newEmployee: Employee = {
    name: "test name",
    email: "email123@gmail.com",
    phone: "111222333",
    address: "address",
    role: "Developer",
    salary: "9999",
  };
  it("should create a new employee successfully", () => {
    cy.get("input[name='address']").type(newEmployee.address);
    cy.get("input[name='company']").type(newEmployee.company);
    cy.get("input[name='email']").type(newEmployee.email);
    cy.get("input[name='name']").type(newEmployee.name);
    cy.get("input[name='phone']").type(newEmployee.phone);
    cy.contains("button", /create/i).click();
    cy.wait(1000);
    cy.contains(/employee created$/i);
    cy.wait(1000);
    // Clear employee from firestore
    cy.task("deleteCustomerByField", {
      fieldName: "email",
      fieldValue: newEmployee.email,
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
    cy.get('a[href="/employees"]').click();
    cy.url().should("match", /\/employees$/);

    cy.contains("a", /^read$/i).click();
    cy.url().should("match", /\/employees\/read$/);
  });

  afterEach(() => {
    cy.logout();
  });
  it("should show all employee cards", () => {
    cy.task("getAllCustomers").then((result) => {
      const employees = result as Customer[];
      // Verifica que el resultado sea un array
      expect(Array.isArray(employees)).to.be.true;

      // Validate Customer data
      employees.forEach((employee) => {
        expect(employee).to.be.an("object");
        expect(employee).to.have.property("id");
        expect(employee).to.have.property("name");
        expect(employee).to.have.property("email");
        cy.contains(employee.email);
        expect(employee).to.have.property("address");
        expect(employee).to.have.property("company");
        expect(employee).to.have.property("phone");
      });
    });
  });
});

describe("Edit Customer", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get('a[href="/employees"]').click();
    cy.url().should("match", /\/employees$/);

    cy.contains("a", /^update$/i).click();
    cy.url().should("match", /\/employees\/edit$/);
  });

  afterEach(() => {
    cy.logout();
  });
  it("should edit a employee successfully", () => {
    cy.get("select[name='employeeId']").select(1);
    cy.contains("button", /get data$/i).click();
    cy.wait(1000);
    // Compare values with firestore
    cy.get("select[name='employeeId']")
      .find("option:eq(1)")
      .invoke("val")
      .then((firstCustomerId) => {
        console.log("firstCustomerId: ", firstCustomerId);

        cy.task("getCustomerById", firstCustomerId).then((employee) => {
          const employeeCast = employee as Customer;
          cy.get("input[name='address']")
            .invoke("val")
            .then((address) => {
              expect(address).to.eq(employeeCast.address);
            });
          cy.get("input[name='company']")
            .invoke("val")
            .then((company) => {
              expect(company).to.eq(employeeCast.company);
            });
          cy.get("input[name='email']")
            .invoke("val")
            .then((email) => {
              expect(email).to.eq(employeeCast.email);
            });
          cy.get("input[name='name']")
            .invoke("val")
            .then((name) => {
              expect(name).to.eq(employeeCast.name);
            });
          cy.get("input[name='phone']")
            .invoke("val")
            .then((phone) => {
              expect(phone).to.eq(employeeCast.phone);
            });

          const newAddress: string = "1";

          cy.get("input[name='address']").clear().type(newAddress);
          // update
          cy.contains("button", /update$/i).click();
          cy.contains(/employee updated$/i);
          // reverse update
          cy.get("select[name='employeeId']").select(1);
          cy.contains("button", /get data$/i).click();
          cy.wait(1000);
          cy.get("input[name='address']")
            .invoke("val")
            .then((address) => {
              expect(address).to.eq(newAddress);
            });

          cy.get("input[name='address']").clear().type(employeeCast.address);
          cy.contains("button", /update$/i).click();
          cy.contains(/employee updated$/i);
        });
      });
  });
  it("should show empty employee id error", () => {
    cy.contains("button", /get data$/i).click();
    cy.contains(/employee id is required$/i);
  });
  it("should show required fields errors", () => {
    cy.get("select[name='employeeId']").select(1);
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
    cy.get("select[name='employeeId']").select(1);
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
    cy.get('a[href="/employees"]').click();
    cy.url().should("match", /\/employees$/);

    cy.contains("a", /delete$/i).click();
    cy.url().should("match", /\/employees\/delete$/);
  });

  afterEach(() => {
    cy.logout();
  });

  it("should delete a employee successfully", () => {
    cy.get("select[name='employeeId']").select(1);
    cy.contains("button", /fetch employee$/i).click();
    cy.wait(500);
    cy.get("select[name='employeeId']")
      .find("option:eq(1)")
      .invoke("val")
      .then((employeeId) => {
        cy.task("getCustomerById", employeeId).then((data) => {
          const employee = data as Customer;
          cy.contains("button", /delete$/i).click();
          cy.contains(/employee deleted$/i);
          // Create employee again
          cy.task("addCustomer", employee);
        });
      });
  });
  it("should show empty employee id error", () => {
    cy.contains("button", /fetch employee$/i).click();
    cy.contains(/employee id is required$/i);
  });
});
