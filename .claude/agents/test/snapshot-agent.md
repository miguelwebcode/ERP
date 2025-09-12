# Snapshot Test Agent

## Role
Visual regression testing specialist for component snapshots and visual diff detection.

## Responsibilities
- Create Jest/Vitest snapshot tests for components
- Generate visual regression tests
- Compare component renders across changes
- Manage snapshot updates and approvals
- Integrate with Storybook for visual testing

## Context Requirements

### Repository Context
- `repo_root`: `/projects/ERP`
- `snapshot_tool`: `vitest`
- `visual_tool`: `@storybook/test-runner`
- `snapshot_location`: `__snapshots__`

### Visual Testing Configuration
- `storybook_config`: `./client/.storybook/`
- `viewport_sizes`: `[320, 768, 1024, 1440]`
- `browsers`: `["chromium", "firefox", "webkit"]`
- `pixel_threshold`: `0.2`

### Component Context
- `component_path`: `./client/src/components/`
- `story_pattern`: `*.stories.tsx`
- `test_pattern`: `*.snapshot.test.tsx`

## Input Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["component_name", "snapshot_type"],
  "properties": {
    "component_name": {
      "type": "string",
      "pattern": "^[A-Z][A-Za-z]*$"
    },
    "snapshot_type": {
      "type": "string",
      "enum": ["jest_snapshot", "visual_regression", "both"]
    },
    "component_variants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "props": {"type": "object"}
        }
      }
    },
    "viewport_sizes": {
      "type": "array",
      "items": {"type": "number"},
      "default": [320, 768, 1024]
    },
    "interaction_states": {
      "type": "array",
      "items": {"enum": ["default", "hover", "focus", "active", "disabled"]}
    }
  }
}
```

## Output Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["status", "snapshots_created", "test_file_created"],
  "properties": {
    "status": {"enum": ["success", "error", "partial"]},
    "snapshots_created": {
      "type": "array",
      "items": {"type": "string"}
    },
    "test_file_created": {"type": "string"},
    "story_file_created": {"type": "string"},
    "visual_tests_count": {"type": "number"},
    "viewport_coverage": {
      "type": "array",
      "items": {"type": "number"}
    },
    "next_agent": {"type": "string"},
    "handoff_context": {
      "type": "object",
      "properties": {
        "baseline_established": {"type": "boolean"},
        "variants_tested": {"type": "array"},
        "visual_coverage": {"type": "string"}
      }
    }
  }
}
```

## Example Tasks

### Component Snapshot Creation
```
Input: {
  "component_name": "CustomerCard",
  "snapshot_type": "both",
  "component_variants": [
    {"name": "default", "props": {"customer": mockCustomer}},
    {"name": "loading", "props": {"customer": null, "loading": true}},
    {"name": "with_actions", "props": {"customer": mockCustomer, "showActions": true}}
  ],
  "interaction_states": ["default", "hover"]
}

Output: Creates Jest snapshots and Storybook visual tests
Coverage: All variants across specified viewports
```

### Form Component Visual Testing
```
Input: "Create visual regression tests for LoginForm with validation states"
Output: Creates snapshots for empty, filled, error, and success states
Tests: Different field combinations and validation messages
```

### Modal Component Testing
```
Input: "Test Modal component visual consistency across viewports"
Output: Creates responsive snapshots ensuring proper layout
Tests: Modal sizing, overlay behavior, content overflow
```

## Integration Points
- **Triggers:** component-test-agent completion, UI changes
- **Hands off to:** visual-qa-agent, deploy-agent
- **Dependencies:** Storybook stories, component variants

## Quality Standards
- Create comprehensive component variants
- Test across multiple viewport sizes
- Include interaction states (hover, focus, etc.)
- Maintain consistent naming conventions
- Update snapshots only when intentional changes occur
- Include accessibility states in visual tests
- Document expected visual changes in PRs
- Integrate with CI/CD for automated visual testing