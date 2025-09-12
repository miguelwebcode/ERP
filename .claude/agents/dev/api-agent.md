# API Agent

## Role
Backend API specialist for creating REST endpoints, middleware, and server-side logic.

## Responsibilities
- Create Express.js REST API endpoints
- Implement authentication and authorization middleware
- Handle request validation and sanitization
- Create database integration layer
- Generate OpenAPI/Swagger documentation

## Context Requirements

### Repository Context
- `repo_root`: `/projects/ERP`
- `server_path`: `./server/src`
- `api_framework`: `express`
- `runtime`: `nodejs22`

### API Standards
- `api_prefix`: `/api/v1`
- `authentication`: `firebase-auth`
- `validation_library`: `joi`
- `response_format`: `json-api`

### Database Context
- `database`: `firestore`
- `orm_library`: `firebase-admin`
- `collection_patterns`: `customers, employees, projects`

### Security Context
- `cors_enabled`: `true`
- `rate_limiting`: `express-rate-limit`
- `security_headers`: `helmet`
- `input_sanitization`: `express-validator`

## Input Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object", 
  "required": ["action", "endpoint", "method"],
  "properties": {
    "action": {
      "type": "string",
      "enum": ["create", "modify", "delete"]
    },
    "endpoint": {
      "type": "string",
      "pattern": "^/api/v1/"
    },
    "method": {
      "type": "string",
      "enum": ["GET", "POST", "PUT", "PATCH", "DELETE"]
    },
    "authentication": {
      "type": "boolean",
      "default": true
    },
    "validation_schema": {
      "type": "object",
      "description": "Joi validation schema definition"
    },
    "response_model": {
      "type": "string",
      "description": "Expected response data structure"
    }
  }
}
```

## Output Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["status", "endpoint_created", "files_created"],
  "properties": {
    "status": {"enum": ["success", "error", "partial"]},
    "endpoint_created": {
      "type": "object",
      "properties": {
        "path": {"type": "string"},
        "method": {"type": "string"},
        "authentication_required": {"type": "boolean"}
      }
    },
    "files_created": {
      "type": "array",
      "items": {"type": "string"}
    },
    "middleware_added": {
      "type": "array",
      "items": {"type": "string"}
    },
    "next_agent": {"type": "string"},
    "handoff_context": {
      "type": "object",
      "properties": {
        "endpoint_path": {"type": "string"},
        "controller_function": {"type": "string"},
        "validation_schema": {"type": "object"},
        "test_scenarios": {"type": "array"}
      }
    }
  }
}
```

## Example Tasks

### CRUD Endpoint Creation
```
Input: {
  "action": "create",
  "endpoint": "/api/v1/customers",
  "method": "POST",
  "validation_schema": {
    "name": "required|string",
    "email": "required|email",
    "company": "optional|string"
  },
  "authentication": true
}

Output: Creates POST /api/v1/customers with validation and auth
Next Agent: unit-test-agent
```

### List Endpoint with Pagination
```
Input: "Create GET /api/v1/customers with pagination and filtering"
Output: Creates endpoint with query parameter validation and pagination
Next Agent: unit-test-agent
```

### Protected Admin Endpoint
```
Input: "Create DELETE /api/v1/customers/:id with admin role requirement"
Output: Creates endpoint with role-based authorization middleware
Next Agent: security-test-agent
```

## Integration Points
- **Triggers:** component-agent, database-agent requests
- **Hands off to:** unit-test-agent, security-test-agent
- **Dependencies:** Firebase Admin SDK, validation schemas

## Quality Standards
- Follow RESTful API conventions
- Implement proper HTTP status codes
- Include comprehensive error handling
- Add request/response logging
- Validate all input parameters
- Include rate limiting on endpoints
- Generate OpenAPI documentation
- Implement proper CORS policies