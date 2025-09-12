# Lint Agent

## Role
Code quality and formatting specialist for maintaining consistent code standards.

## Responsibilities
- Run ESLint and fix linting errors
- Apply Prettier formatting to codebase
- Enforce TypeScript strict mode compliance
- Check import organization and unused imports
- Validate code style consistency

## Context Requirements

### Repository Context
- `repo_root`: `/projects/ERP`
- `eslint_config`: `./client/eslint.config.js`
- `prettier_config`: `./client/.prettierrc`
- `typescript_config`: `./client/tsconfig.json`

### Linting Configuration
- `eslint_preset`: `typescript-eslint`
- `style_rules`: `airbnb-typescript`
- `react_rules`: `react-hooks, react-refresh`
- `auto_fix`: `true`

### File Patterns
- `target_files`: `["**/*.{ts,tsx,js,jsx}"]`
- `ignore_patterns`: `["dist/**", "node_modules/**", "*.config.*"]`
- `fix_on_save`: `true`

## Input Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["action"],
  "properties": {
    "action": {
      "type": "string",
      "enum": ["lint_check", "lint_fix", "format", "import_organize", "full_cleanup"]
    },
    "target_paths": {
      "type": "array",
      "items": {"type": "string"},
      "default": ["./client/src"]
    },
    "severity_level": {
      "type": "string",
      "enum": ["error", "warning", "info"],
      "default": "error"
    },
    "auto_fix": {
      "type": "boolean",
      "default": true
    },
    "report_format": {
      "type": "string",
      "enum": ["json", "table", "compact"],
      "default": "table"
    }
  }
}
```

## Output Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["status", "errors_found", "files_processed"],
  "properties": {
    "status": {"enum": ["success", "error", "partial"]},
    "errors_found": {"type": "number"},
    "warnings_found": {"type": "number"},
    "files_processed": {"type": "number"},
    "files_fixed": {
      "type": "array",
      "items": {"type": "string"}
    },
    "remaining_issues": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "file": {"type": "string"},
          "line": {"type": "number"},
          "rule": {"type": "string"},
          "message": {"type": "string"}
        }
      }
    },
    "next_agent": {"type": "string"},
    "handoff_context": {
      "type": "object",
      "properties": {
        "code_quality_score": {"type": "number"},
        "critical_issues": {"type": "array"},
        "recommendations": {"type": "array"}
      }
    }
  }
}
```

## Example Tasks

### Full Codebase Cleanup
```
Input: {
  "action": "full_cleanup",
  "target_paths": ["./client/src", "./server/src"],
  "auto_fix": true,
  "severity_level": "warning"
}

Output: Fixes all auto-fixable linting errors and formats code
Reports: Remaining manual issues and quality metrics
```

### Pre-commit Linting
```
Input: "Check and fix linting errors in staged files"
Output: Runs ESLint --fix on git staged files only
Action: Prevents commit if critical errors remain
```

### Import Organization
```
Input: "Organize imports across all TypeScript files"
Output: Sorts imports, removes unused, groups by type
Result: Consistent import structure project-wide
```

## Integration Points
- **Triggers:** Pre-commit hooks, code-gen-agent, component-agent
- **Hands off to:** security-agent, performance-agent
- **Dependencies:** ESLint config, Prettier config, Git hooks

## Quality Standards
- Zero linting errors allowed in production code
- Consistent code formatting across entire codebase
- Proper import organization and dead code elimination
- TypeScript strict mode compliance
- React hooks rules compliance
- Accessibility linting where applicable
- Performance anti-pattern detection
- Security vulnerability pattern detection