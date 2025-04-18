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

describe("Edit Customer", () => {
  beforeEach(() => {
    cy.logout();
    cy.login();
    cy.visit("/");
    cy.get("nav").within(() => {
      cy.contains(/projects$/i).click();
    });
    cy.url().should("match", /\/projects$/);
    cy.contains("button", /update$/i).click();
    cy.url().should("match", /\/projects\/edit$/);
  });
  it("should edit a project successfully", () => {
    cy.get("select[name='projectId']").select(1);
    cy.contains("button", /fetch project$/i).click();
    cy.wait(1000);
    // Compare values with firestore
    cy.get("select[name='projectId']")
      .find("option:eq(1)")
      .invoke("val")
      .then((firstProjectId) => {
        console.log("firstProjectId: ", firstProjectId);
        cy.task("getProjectById", firstProjectId).then((project) => {
          const projectCast = project as Project;
          cy.get("input[name='name']")
            .invoke("val")
            .then((name) => {
              expect(name).to.eq(projectCast.name);
            });
          cy.get("input[name='description']")
            .invoke("val")
            .then((description) => {
              expect(description).to.eq(projectCast.description);
            });
          cy.get("input[name='customerId']")
            .invoke("val")
            .then((customerId) => {
              expect(customerId).to.eq(projectCast.customerId);
            });
          cy.get("input[name='developer']")
            .invoke("val")
            .then((developer) => {
              expect(developer).to.eq(projectCast.developer);
            });
          cy.get("select[name='state']")
            .invoke("val")
            .then((state) => {
              expect(state).to.eq(projectCast.state);
            });
          cy.get("input[name='startDate']")
            .invoke("val")
            .then((startDate) => {
              expect(startDate).to.eq(projectCast.startDate);
            });
          cy.get("input[name='endDate']")
            .invoke("val")
            .then((endDate) => {
              expect(endDate).to.eq(projectCast.endDate);
            });
          const newName: string = "1";

          cy.get("input[name='name']").clear().type(newName);
          // update
          cy.contains("button", /update project$/i).click();
          cy.contains(/project updated$/i);
          // reverse update
          cy.get("select[name='projectId']").select(1);
          cy.contains("button", /fetch project$/i).click();
          cy.wait(1000);
          cy.get("input[name='name']")
            .invoke("val")
            .then((name) => {
              expect(name).to.eq(newName);
            });

          cy.get("input[name='name']").clear().type(projectCast.name);
          cy.contains("button", /update project$/i).click();
          cy.contains(/project updated$/i);
        });
      });
  });
  it("should show empty project id error", () => {
    cy.contains("button", /fetch project$/i).click();
    cy.contains(/project id is required$/i);
  });
  it("should show required fields errors", () => {
    cy.get("select[name='projectId']").select(1);
    cy.contains("button", /fetch project$/i).click();
    cy.wait(500);
    // Clear all fields
    cy.get("input[name='name']").clear();
    cy.get("input[name='description']").clear();
    cy.get("input[name='customerId']").clear();
    cy.get("input[name='developer']").clear();
    cy.get("select[name='state']").select(0);
    cy.get("input[name='startDate']").clear();
    cy.get("input[name='endDate']").clear();
    cy.contains("button", /update project$/i).click();
    // Check empty field errors
    cy.contains(/name is required$/i);
    cy.contains(/description is required$/i);
    cy.contains(/customer id is required$/i);
    cy.contains(/project's developer is required$/i);
    cy.contains(/project's state is required$/i);
    cy.contains(/start date is required$/i);
    cy.contains(/end date is required$/i);
  });
});

describe("Delete Project", () => {
  beforeEach(() => {
    cy.logout();
    cy.login();
    cy.visit("/");
    cy.get("nav").within(() => {
      cy.contains(/projects$/i).click();
    });
    cy.url().should("match", /\/projects$/);
    cy.contains("button", /delete$/i).click();
    cy.url().should("match", /\/projects\/delete$/);
  });

  it("should delete a project successfully", () => {
    cy.get("select[name='projectId']").select(1);
    cy.contains("button", /fetch project$/i).click();
    cy.wait(500);
    cy.get("select[name='projectId']")
      .find("option:eq(1)")
      .invoke("val")
      .then((projectId) => {
        cy.task("getProjectById", projectId).then((data) => {
          const project = data as Project;
          cy.contains("button", /delete project$/i).click();
          cy.contains(/project deleted$/i);
          // Create project again
          cy.task("addProject", project);
        });
      });
  });
  it("should show empty project id error", () => {
    cy.contains("button", /fetch project$/i).click();
    cy.contains(/project id is required$/i);
  });
});
