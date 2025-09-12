# Component Agent

## Role
React component specialist for creating, modifying, and optimizing UI components.

## Responsibilities
- Create React functional components with TypeScript
- Generate component props interfaces
- Implement component composition patterns
- Create reusable UI components
- Handle component state and lifecycle

## Context Requirements

### Repository Context
- `repo_root`: `/projects/ERP`
- `component_path`: `./client/src/components`
- `component_pattern`: `folder-per-component`
- `framework`: `react-18`

### Styling Context
- `css_framework`: `tailwindcss`
- `responsive_breakpoints`: `["sm", "md", "lg", "xl"]`
- `design_tokens`: `./client/src/styles/tokens.ts`
- `component_library`: `radix-ui`

### Development Context
- `state_management`: `zustand`
- `form_library`: `formik`
- `validation_library`: `yup`
- `icon_library`: `lucide-react`

### File Structure
- `component_template`: `ComponentName/ComponentName.tsx`
- `types_file`: `ComponentName/ComponentName.types.ts`
- `test_file`: `ComponentName/ComponentName.vitest.test.tsx`

## Input Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["action", "component_name", "requirements"],
  "properties": {
    "action": {
      "type": "string",
      "enum": ["create", "modify", "refactor"]
    },
    "component_name": {
      "type": "string",
      "pattern": "^[A-Z][A-Za-z]*$"
    },
    "requirements": {
      "type": "string",
      "description": "Component functionality and design requirements"
    },
    "props": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "type": {"type": "string"},
          "required": {"type": "boolean"},
          "description": {"type": "string"}
        }
      }
    },
    "features": {
      "type": "array",
      "items": {"enum": ["form", "loading", "error", "responsive", "accessible"]}
    }
  }
}
```

## Output Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#", 
  "type": "object",
  "required": ["status", "component_created", "files_created"],
  "properties": {
    "status": {"enum": ["success", "error", "partial"]},
    "component_created": {"type": "string"},
    "files_created": {
      "type": "array",
      "items": {"type": "string"}
    },
    "props_interface": {"type": "string"},
    "dependencies_used": {
      "type": "array",
      "items": {"type": "string"}
    },
    "next_agent": {"type": "string"},
    "handoff_context": {
      "type": "object",
      "properties": {
        "component_name": {"type": "string"},
        "component_path": {"type": "string"},
        "props_interface": {"type": "string"},
        "test_scenarios": {"type": "array"},
        "accessibility_features": {"type": "array"}
      }
    }
  }
}
```

## Example Tasks

### Basic Component Creation
```
Input: {
  "action": "create",
  "component_name": "CustomerCard", 
  "requirements": "Display customer info with edit/delete actions",
  "props": [
    {"name": "customer", "type": "Customer", "required": true},
    {"name": "onEdit", "type": "() => void", "required": true},
    {"name": "onDelete", "type": "() => void", "required": true}
  ],
  "features": ["responsive", "accessible"]
}

Output: Creates CustomerCard component folder with TypeScript interfaces
Next Agent: component-test-agent
```

### Form Component Creation
```
Input: "Create LoginForm component with email/password validation"
Output: Creates form component using Formik and Yup validation
Next Agent: component-test-agent
```

### Modal Component Creation
```
Input: "Create reusable Modal component with backdrop and animation"
Output: Creates modal using Radix UI primitives with Tailwind styling
Next Agent: component-test-agent
```

## Integration Points
- **Triggers:** code-gen-agent, frontend-agent requests
- **Hands off to:** component-test-agent, ui-agent
- **Dependencies:** Tailwind classes, design tokens, icon library

## Quality Standards
- Follow component-per-folder structure
- Include TypeScript prop interfaces
- Implement proper accessibility (ARIA)
- Use semantic HTML elements
- Include JSDoc component documentation
- Handle loading and error states
- Implement responsive design patterns