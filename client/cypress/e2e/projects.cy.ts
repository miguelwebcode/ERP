import { Project } from "../support/types";

describe("Create project", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get("nav").within(() => {
      cy.contains(/projects$/i).click();
    });
    cy.url().should("match", /\/projects$/);

    cy.contains("button", /create/i).click();
    cy.url().should("match", /\/projects\/add$/);
  });

  const newProject: Project = {
    name: "project name",
    description: "delete this project",
    customerId: "fakeCustomerId",
    developer: "developer1",
    state: "pending",
    startDate: "2025-01-30",
    endDate: "2025-06-30",
  };
  it("should create a new customer successfully", () => {
    cy.get("input[name='name']").type(newProject.name);
    cy.get("input[name='description']").type(newProject.description);
    cy.get("input[name='customerId']").type(newProject.customerId);
    cy.get("input[name='developer']").type(newProject.developer);
    cy.get("select[name='state']").select(1);
    cy.get("input[name='startDate']").type(newProject.startDate);
    cy.get("input[name='endDate']").type(newProject.endDate);
    cy.contains("button", /create project/i).click();
    cy.wait(1000);
    cy.contains(/project created$/i);
    cy.wait(1000);
    // Clear project from firestore
    cy.task("deleteProjectByField", {
      fieldName: "description",
      fieldValue: newProject.description,
    });
  });
  it("should show required errors when fields are empty", () => {
    cy.contains("button", /create project/i).click();
    cy.contains(/name is required/i);
    cy.contains(/description is required/i);
    cy.contains(/customer id is required/i);
    cy.contains(/project's developer is required/i);
    cy.contains(/project's state is required/i);
    cy.contains(/start date is required/i);
    cy.contains(/end date is required/i);
  });
});

describe("Read projects", () => {
  beforeEach(() => {
    cy.logout();
    cy.login();
    cy.visit("/");
    cy.get("nav").within(() => {
      cy.contains(/projects$/i).click();
    });
    cy.url().should("match", /\/projects$/);

    cy.contains("button", /read/i).click();
    cy.url().should("match", /\/projects\/read$/);
  });
  it("should show all project cards", () => {
    cy.task("getAllProjects").then((result) => {
      const projects = result as Project[];
      // Verifica que el resultado sea un array
      expect(Array.isArray(projects)).to.be.true;
      // Validate Customer data
      projects.forEach((project) => {
        expect(project).to.be.an("object");
        expect(project).to.have.property("name");
        cy.contains(project.name);
        expect(project).to.have.property("description");
        expect(project).to.have.property("customerId");
        expect(project).to.have.property("developer");
        expect(project).to.have.property("state");
        expect(project).to.have.property("startDate");
        expect(project).to.have.property("endDate");
        expect(project).to.have.property("createdAt");
      });
    });
  });
});
