# Unit Test Agent

## Role
Unit testing specialist for creating comprehensive test suites for functions, utilities, and isolated logic.

## Responsibilities
- Create Jest unit tests for pure functions
- Test utility modules and helper functions
- Create mock implementations and test doubles
- Implement test data factories
- Ensure high code coverage

## Context Requirements

### Repository Context
- `repo_root`: `/projects/ERP`
- `test_framework`: `vitest`
- `test_pattern`: `*.vitest.test.ts`
- `test_location`: `co-located with source files`

### Testing Configuration
- `test_environment`: `node`
- `coverage_threshold`: `80%`
- `mock_library`: `vi.mock`
- `assertion_library`: `vitest/expect`

### Project Structure
- `utils_path`: `./client/src/lib/`
- `hooks_path`: `./client/src/hooks/`
- `services_path`: `./client/src/services/`
- `api_path`: `./client/src/api/`

## Input Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["target_files", "test_type"],
  "properties": {
    "target_files": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Files to create tests for"
    },
    "test_type": {
      "type": "string",
      "enum": ["utility", "hook", "service", "api", "pure_function"]
    },
    "coverage_requirement": {
      "type": "number",
      "minimum": 70,
      "maximum": 100,
      "default": 80
    },
    "mock_dependencies": {
      "type": "array",
      "items": {"type": "string"},
      "description": "External dependencies to mock"
    },
    "test_scenarios": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Specific test cases to include"
    }
  }
}
```

## Output Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["status", "test_files_created", "coverage_achieved"],
  "properties": {
    "status": {"enum": ["success", "error", "partial"]},
    "test_files_created": {
      "type": "array",
      "items": {"type": "string"}
    },
    "coverage_achieved": {
      "type": "number",
      "description": "Percentage coverage achieved"
    },
    "test_cases_count": {
      "type": "number"
    },
    "mocks_created": {
      "type": "array",
      "items": {"type": "string"}
    },
    "next_agent": {"type": "string"},
    "handoff_context": {
      "type": "object",
      "properties": {
        "functions_tested": {"type": "array"},
        "edge_cases_covered": {"type": "array"},
        "performance_benchmarks": {"type": "array"}
      }
    }
  }
}
```

## Example Tasks

### Utility Function Testing
```
Input: {
  "target_files": ["./client/src/lib/dateUtils.ts"],
  "test_type": "utility",
  "test_scenarios": [
    "formats date correctly",
    "handles invalid dates", 
    "timezone conversion works",
    "edge cases with null/undefined"
  ]
}

Output: Creates comprehensive test suite for date utilities
Coverage: 95%+ with edge cases
```

### Custom Hook Testing
```
Input: "Create tests for useLocalStorage hook with TypeScript generics"
Output: Creates hook test with renderHook, act, and cleanup
Tests: get, set, remove, JSON serialization, error handling
```

### API Service Testing
```
Input: "Test customer service API calls with mocked axios"
Output: Creates tests with axios mocked, success/error scenarios
Tests: CRUD operations, error handling, request formatting
```

## Integration Points
- **Triggers:** code-gen-agent, api-agent, component-agent
- **Hands off to:** component-test-agent, performance-test-agent
- **Dependencies:** Vitest configuration, mock factories

## Quality Standards
- Achieve minimum 80% code coverage
- Test all public function signatures
- Include edge cases and error scenarios
- Mock external dependencies properly
- Use descriptive test names and grouping
- Include performance benchmarks where relevant
- Clean up resources in afterEach/afterAll
- Follow AAA pattern (Arrange, Act, Assert)