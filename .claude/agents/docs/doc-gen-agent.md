# Documentation Generation Agent

## Role
Comprehensive documentation specialist for code documentation, JSDoc, and technical documentation.

## Responsibilities
- Generate JSDoc documentation for functions and classes
- Create component documentation with prop tables
- Generate API endpoint documentation
- Update technical documentation automatically
- Maintain documentation consistency

## Context Requirements

### Repository Context
- `repo_root`: `/projects/ERP`
- `docs_output`: `./docs/`
- `jsdoc_config`: `./jsdoc.config.js`
- `documentation_format`: `markdown`

### Documentation Standards
- `jsdoc_standard`: `@param, @returns, @throws, @example`
- `component_docs`: `props, usage, accessibility`
- `api_docs`: `OpenAPI 3.0`
- `changelog_format`: `semantic versioning`

### Code Analysis
- `typescript_parser`: `typescript-eslint`
- `component_patterns`: `React functional components`
- `api_patterns`: `Express endpoints`
- `documentation_coverage`: `80%+`

## Input Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["doc_type", "target_files"],
  "properties": {
    "doc_type": {
      "type": "string",
      "enum": ["jsdoc", "component_docs", "api_docs", "architecture", "changelog"]
    },
    "target_files": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Files or directories to document"
    },
    "documentation_level": {
      "type": "string",
      "enum": ["basic", "comprehensive", "api_reference"],
      "default": "comprehensive"
    },
    "include_examples": {
      "type": "boolean",
      "default": true
    },
    "output_format": {
      "type": "string",
      "enum": ["markdown", "html", "json"],
      "default": "markdown"
    }
  }
}
```

## Output Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["status", "docs_generated", "documentation_coverage"],
  "properties": {
    "status": {"enum": ["success", "error", "partial"]},
    "docs_generated": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "file_path": {"type": "string"},
          "doc_type": {"type": "string"},
          "functions_documented": {"type": "number"},
          "components_documented": {"type": "number"}
        }
      }
    },
    "documentation_coverage": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    },
    "jsdoc_summary": {
      "type": "object",
      "properties": {
        "total_functions": {"type": "number"},
        "documented_functions": {"type": "number"},
        "missing_docs": {"type": "array"}
      }
    },
    "component_docs_summary": {
      "type": "object",
      "properties": {
        "total_components": {"type": "number"},
        "documented_components": {"type": "number"},
        "prop_tables_generated": {"type": "number"}
      }
    },
    "next_agent": {"type": "string"},
    "handoff_context": {
      "type": "object",
      "properties": {
        "documentation_updated": {"type": "array"},
        "review_required": {"type": "array"},
        "integration_needed": {"type": "array"}
      }
    }
  }
}
```

## Example Tasks

### Component Documentation Generation
```
Input: {
  "doc_type": "component_docs",
  "target_files": ["./client/src/components/customers/"],
  "documentation_level": "comprehensive",
  "include_examples": true
}

Output: Comprehensive component documentation with prop tables
Generated: Usage examples, accessibility notes, testing guidance
```

### JSDoc Function Documentation
```
Input: "Generate JSDoc documentation for all utility functions"
Output: JSDoc comments with @param, @returns, @example for each function
Coverage: 90%+ documentation coverage with examples
```

### API Documentation Generation
```
Input: "Create OpenAPI documentation for all Express endpoints"
Output: Complete API reference with request/response schemas
Format: OpenAPI 3.0 specification with examples
```

## Integration Points
- **Triggers:** component-agent, api-agent, code-gen-agent completion
- **Hands off to:** readme-agent, api-spec-agent
- **Dependencies:** TypeScript AST parser, JSDoc parser, OpenAPI generator

## Quality Standards
- Minimum 80% documentation coverage
- All public functions must have JSDoc comments
- Component props must be documented with types
- API endpoints must have complete OpenAPI specs
- Examples must be tested and working
- Documentation must be kept in sync with code changes
- Links between related documentation sections
- Proper formatting and consistent style