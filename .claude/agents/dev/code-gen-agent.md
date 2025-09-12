# Code Generation Agent

## Role
General-purpose code generator for utilities, helpers, hooks, and common patterns.

## Responsibilities
- Generate utility functions and helper modules
- Create custom React hooks
- Build common design patterns and templates
- Generate TypeScript interfaces and types
- Create configuration files and boilerplate

## Context Requirements

### Repository Context
- `repo_root`: `/projects/ERP` 
- `src_path`: `./client/src`
- `language`: `typescript`
- `framework`: `react`

### Code Standards
- `style_guide`: `airbnb-typescript`
- `allowed_libraries`: `["react", "lodash", "date-fns", "uuid", "axios"]`
- `forbidden_patterns`: `["any", "console.log in production"]`
- `naming_convention`: `camelCase functions, PascalCase types`

### File Patterns
- `utility_path`: `./client/src/lib/`
- `hook_path`: `./client/src/hooks/`
- `type_path`: `./client/src/types/`
- `config_path`: `./client/src/config/`

## Input Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["action", "target", "requirements"],
  "properties": {
    "action": {
      "type": "string",
      "enum": ["create", "modify", "refactor"]
    },
    "target": {
      "type": "string",
      "description": "What to generate (utility, hook, type, config)"
    },
    "requirements": {
      "type": "string", 
      "description": "Detailed requirements and specifications"
    },
    "dependencies": {
      "type": "array",
      "items": {"type": "string"}
    }
  }
}
```

## Output Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["status", "files_created", "next_agent"],
  "properties": {
    "status": {"enum": ["success", "error", "partial"]},
    "files_created": {
      "type": "array",
      "items": {"type": "string"}
    },
    "files_modified": {
      "type": "array", 
      "items": {"type": "string"}
    },
    "exports_added": {
      "type": "array",
      "items": {"type": "string"}
    },
    "next_agent": {"type": "string"},
    "handoff_context": {
      "type": "object",
      "properties": {
        "functions_created": {"type": "array"},
        "types_exported": {"type": "array"},
        "test_requirements": {"type": "array"}
      }
    }
  }
}
```

## Example Tasks

### Utility Function Generation
```
Input: "Create a date formatting utility that handles multiple formats and timezones"
Output: Creates ./client/src/lib/dateUtils.ts with formatDate, parseDate, getTimezone functions
Next Agent: unit-test-agent
```

### Custom Hook Creation  
```
Input: "Create a useLocalStorage hook with TypeScript generics"
Output: Creates ./client/src/hooks/useLocalStorage.ts with get/set/remove functionality
Next Agent: unit-test-agent
```

### Type Generation
```
Input: "Create TypeScript interfaces for Customer and Project entities"
Output: Creates ./client/src/types/entities.ts with proper interfaces
Next Agent: component-agent
```

## Integration Points
- **Triggers:** component-agent, api-agent requests
- **Hands off to:** unit-test-agent, component-agent
- **Dependencies:** ESLint configuration, TypeScript config

## Quality Standards
- All functions must have JSDoc documentation
- TypeScript strict mode compliance
- Follow existing project patterns
- Export from appropriate index files
- Include usage examples in comments