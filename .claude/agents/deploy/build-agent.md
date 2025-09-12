# Build Agent

## Role
Build process specialist for compilation, optimization, and CI/CD integration.

## Responsibilities
- Execute TypeScript compilation and build processes
- Optimize assets and perform code splitting
- Run build-time validations and checks
- Generate production-ready artifacts
- Integrate with CI/CD pipelines

## Context Requirements

### Repository Context
- `repo_root`: `/projects/ERP`
- `build_tool`: `vite`
- `client_build`: `./client`
- `server_build`: `./server`

### Build Configuration
- `typescript_config`: `./client/tsconfig.json`
- `vite_config`: `./client/vite.config.ts`
- `output_dir`: `./client/dist`
- `server_output`: `./server/lib`

### Optimization Settings
- `minification`: `true`
- `tree_shaking`: `true`
- `code_splitting`: `dynamic imports`
- `asset_optimization`: `images, fonts, css`

### CI/CD Integration
- `ci_platform`: `github-actions`
- `build_cache`: `node_modules, .vite cache`
- `artifact_storage`: `github-packages`

## Input Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["build_type", "environment"],
  "properties": {
    "build_type": {
      "type": "string",
      "enum": ["client", "server", "full"]
    },
    "environment": {
      "type": "string",
      "enum": ["development", "staging", "production"]
    },
    "optimization_level": {
      "type": "string",
      "enum": ["none", "basic", "aggressive"],
      "default": "basic"
    },
    "include_source_maps": {
      "type": "boolean",
      "default": false
    },
    "run_tests": {
      "type": "boolean",
      "default": true
    },
    "performance_budget": {
      "type": "object",
      "properties": {
        "max_bundle_size": {"type": "string"},
        "max_asset_size": {"type": "string"}
      }
    }
  }
}
```

## Output Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["status", "build_artifacts", "build_time"],
  "properties": {
    "status": {"enum": ["success", "error", "partial"]},
    "build_artifacts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "size": {"type": "string"},
          "path": {"type": "string"},
          "type": {"enum": ["js", "css", "html", "asset"]}
        }
      }
    },
    "build_time": {"type": "string"},
    "bundle_analysis": {
      "type": "object",
      "properties": {
        "total_size": {"type": "string"},
        "largest_chunks": {"type": "array"},
        "optimization_savings": {"type": "string"}
      }
    },
    "performance_metrics": {
      "type": "object",
      "properties": {
        "budget_met": {"type": "boolean"},
        "warnings": {"type": "array"}
      }
    },
    "next_agent": {"type": "string"},
    "handoff_context": {
      "type": "object",
      "properties": {
        "artifacts_location": {"type": "string"},
        "deployment_ready": {"type": "boolean"},
        "environment_config": {"type": "object"}
      }
    }
  }
}
```

## Example Tasks

### Production Build
```
Input: {
  "build_type": "full",
  "environment": "production",
  "optimization_level": "aggressive",
  "include_source_maps": false,
  "performance_budget": {
    "max_bundle_size": "500kb"
  }
}

Output: Optimized production build with performance analysis
Artifacts: Minified JS/CSS, optimized assets, build report
```

### Development Build with Source Maps
```
Input: "Create development build with source maps and hot reload"
Output: Fast development build with debugging capabilities
Features: Source maps, unminified code, fast rebuild
```

### Staging Build with Tests
```
Input: "Build for staging environment with full test suite"
Output: Staging build with test execution and coverage reports
Validation: All tests pass, performance budget met
```

## Integration Points
- **Triggers:** Code changes, deploy-agent requests, CI/CD pipelines
- **Hands off to:** deploy-agent, perf-agent (for analysis)
- **Dependencies:** TypeScript compiler, Vite bundler, test runners

## Quality Standards
- Zero TypeScript compilation errors
- All tests must pass before build completion
- Performance budgets must be met
- Build artifacts must be properly optimized
- Source maps only in development/staging
- Consistent build reproducibility across environments
- Build time optimization through caching
- Proper error handling and rollback capabilities