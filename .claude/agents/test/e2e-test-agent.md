# E2E Test Agent

## Role
End-to-end testing specialist using Cypress for complete user journey testing.

## Responsibilities
- Create Cypress end-to-end test scenarios
- Test complete user workflows and journeys  
- Verify cross-browser functionality
- Test API integrations and data persistence
- Implement visual testing and screenshots

## Context Requirements

### Repository Context
- `repo_root`: `/projects/ERP`
- `e2e_framework`: `cypress`
- `test_pattern`: `*.cy.ts`
- `test_location`: `./client/cypress/e2e/`

### Application Context
- `base_url`: `http://localhost:5173`
- `api_base_url`: `http://localhost:5001`
- `auth_provider`: `firebase-auth`
- `database`: `firestore-emulator`

### Test Environment
- `emulator_ports`: `{"auth": 9099, "firestore": 8080, "functions": 5001}`
- `test_user`: `cypress@test.com`
- `test_data_path`: `./client/cypress/fixtures/`
- `custom_commands`: `./client/cypress/support/commands.ts`

## Input Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["test_name", "user_journey", "test_type"],
  "properties": {
    "test_name": {
      "type": "string",
      "description": "Descriptive test scenario name"
    },
    "user_journey": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "step": {"type": "string"},
          "action": {"type": "string"},
          "expected_result": {"type": "string"}
        }
      }
    },
    "test_type": {
      "type": "string",
      "enum": ["authentication", "crud_operations", "navigation", "form_submission", "error_handling"]
    },
    "test_data": {
      "type": "object",
      "description": "Test data fixtures to use"
    },
    "authentication_required": {
      "type": "boolean",
      "default": true
    }
  }
}
```

## Output Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["status", "test_file_created", "test_scenarios_count"],
  "properties": {
    "status": {"enum": ["success", "error", "partial"]},
    "test_file_created": {"type": "string"},
    "test_scenarios_count": {"type": "number"},
    "user_flows_tested": {
      "type": "array",
      "items": {"type": "string"}
    },
    "api_endpoints_tested": {
      "type": "array",
      "items": {"type": "string"}
    },
    "screenshots_captured": {
      "type": "array",
      "items": {"type": "string"}
    },
    "next_agent": {"type": "string"},
    "handoff_context": {
      "type": "object",
      "properties": {
        "test_coverage": {"type": "string"},
        "critical_paths": {"type": "array"},
        "performance_metrics": {"type": "object"}
      }
    }
  }
}
```

## Example Tasks

### Authentication Flow Testing
```
Input: {
  "test_name": "user_login_registration_flow",
  "user_journey": [
    {"step": "1", "action": "Navigate to login page", "expected_result": "Login form visible"},
    {"step": "2", "action": "Click register link", "expected_result": "Register form appears"},
    {"step": "3", "action": "Fill registration form", "expected_result": "User account created"},
    {"step": "4", "action": "Login with new account", "expected_result": "Dashboard visible"}
  ],
  "test_type": "authentication"
}

Output: Creates comprehensive auth flow test with Firebase emulator
```

### CRUD Operations Testing
```
Input: "Test complete customer management workflow - create, read, update, delete"
Output: Creates test covering customer CRUD with database verification
Tests: form submission, list view updates, edit modal, delete confirmation
```

### Error Handling Testing
```
Input: "Test application behavior with network failures and API errors"
Output: Creates test with network simulation and error state verification
Tests: offline behavior, API timeouts, error notifications
```

## Integration Points
- **Triggers:** component-test-agent completion, feature completion
- **Hands off to:** performance-test-agent, deploy-agent
- **Dependencies:** Firebase emulators, test data fixtures, custom commands

## Quality Standards
- Test critical user paths and business workflows
- Use data-cy attributes for element selection
- Include both happy path and error scenarios  
- Verify data persistence across page reloads
- Test responsive behavior on different viewports
- Capture screenshots for visual verification
- Clean up test data after each test
- Use custom commands for common actions