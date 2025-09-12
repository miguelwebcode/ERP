# Claude Agent System - ERP Project

## 📋 Project Context

**Project Type:** Enterprise Resource Planning (ERP) System  
**Architecture:** React/TypeScript Frontend + Express/Firebase Backend  
**Agent Teams:** 17 Specialized Agents across 5 Teams  

### Technology Stack
- **Frontend:** React 18, TypeScript 5.6, Vite 6, Tailwind CSS
- **Backend:** Express, Firebase Functions, Firestore, Firebase Auth
- **State:** Zustand (global), Formik (forms), React Router (navigation)
- **Testing:** Vitest + React Testing Library (unit/component), Cypress (e2e)
- **Build:** Vite bundler, ESLint, TypeScript compiler
- **Deploy:** Firebase Hosting + Functions

### Repository Structure
```
├── client/src/
│   ├── components/[domain]/[ComponentName]/
│   ├── api/, hooks/, services/, stores/, types/
│   └── views/
├── server/src/
├── firebase.json
└── .claude/
    ├── agents/          # Agent specifications
    ├── templates/       # Code templates
    ├── schemas/         # JSON schemas
    └── scripts/         # CLI tools
```

## 🏗️ Agent Team Architecture

```
                    ┌─────────────────────────────────────────┐
                    │         MASTER ORCHESTRATOR             │
                    │  ┌─────────────┬─────────────────────────┐ │
                    │  │ Task Parser │ Agent Router & Queue    │ │
                    │  │ & Planner   │ Manager                 │ │
                    │  └─────────────┴─────────────────────────┘ │
                    └─────┬───────────┬───────────┬─────────────┘
                          │           │           │
                    ┌─────┼───────────┼───────────┼─────────────┐
                    │     │           │           │             │
                    ▼     ▼           ▼           ▼             ▼
            ┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
            │    DEV      │    TEST     │     QA      │   DEPLOY    │    DOCS     │
            │   AGENTS    │   AGENTS    │   AGENTS    │   AGENTS    │   AGENTS    │
            │ (4 agents)  │ (4 agents)  │ (3 agents)  │ (3 agents)  │ (3 agents)  │
            └─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

## 👥 Agent Teams & Responsibilities

### **Development Team (4 Agents)**
- **code-gen-agent**: Utility functions, helpers, and common patterns
- **component-agent**: React components with TypeScript and testing
- **api-agent**: Express endpoints, middleware, and validation
- **db-agent**: Firestore collections, security rules, and queries

### **Testing Team (4 Agents)**
- **unit-test-agent**: Vitest tests for functions and utilities
- **component-test-agent**: React Testing Library component tests
- **e2e-test-agent**: Cypress end-to-end user journey tests
- **snapshot-test-agent**: Visual regression and component snapshots

### **Quality Assurance Team (3 Agents)**
- **lint-agent**: ESLint, Prettier, and code quality checks
- **security-agent**: Vulnerability scanning and security audits
- **perf-agent**: Performance analysis and optimization

### **Deployment Team (3 Agents)**
- **build-agent**: Vite builds, TypeScript compilation, optimization
- **deploy-agent**: Firebase deployment and environment management
- **rollback-agent**: Emergency rollbacks and disaster recovery

### **Documentation Team (3 Agents)**
- **doc-gen-agent**: JSDoc generation and code documentation
- **readme-agent**: README updates and project documentation
- **api-spec-agent**: OpenAPI specifications and API documentation

## 🔄 Development Workflows

### **CLI Commands**
```bash
# Development
claude-dev create component UserCard --props="user,onClick"
claude-dev create api "GET /api/v1/users" --auth=jwt
claude-dev create feature user-management

# Testing
claude-test unit src/utils/
claude-test component UserCard
claude-test e2e user-registration-flow
claude-test all

# Quality Assurance
claude-qa lint --fix
claude-qa security --report
claude-qa performance --analyze

# Deployment
claude-deploy build staging
claude-deploy deploy production
claude-deploy rollback production v1.1.0
```

### **Agent Workflow Example**
```
Developer Request: "Create UserProfile component with edit functionality"
├── component-agent → Creates React component with TypeScript
├── component-test-agent → Generates RTL tests
├── doc-gen-agent → Adds JSDoc documentation
├── lint-agent → Fixes formatting and linting
└── Ready for review
```

## 📋 Agent Communication

### **Standardized Result Schema**
All agents return results in this format:
```json
{
  "status": "success|error|partial",
  "agent": "agent-name",
  "task_id": "unique-task-id",
  "timestamp": "2024-01-01T12:00:00Z",
  "files_created": ["path/to/file.ts"],
  "files_modified": ["path/to/existing.ts"],
  "next_agent": "suggested-next-agent",
  "handoff_context": {
    "component_name": "UserProfile",
    "test_scenarios": ["rendering", "user_interactions"]
  }
}
```

### **Task Input Schema**
```json
{
  "task_id": "unique-identifier",
  "agent": "target-agent",
  "action": "create|modify|refactor",
  "requirements": "Detailed task description",
  "context": {
    "repo_root": "/projects/ERP",
    "target_files": ["specific/files/to/target"]
  }
}
```

## 🚀 Getting Started

### **1. Initialize System**
```bash
# Run initialization script
./.claude/scripts/claude-init

# Add scripts to PATH (optional)
export PATH="$PATH:$(pwd)/.claude/scripts"
```

### **2. Basic Usage**
```bash
# Create a new component
claude-dev create component CustomerCard

# Run tests
claude-test component CustomerCard

# Deploy changes
claude-deploy build development
```

### **3. Agent Configuration**
Each agent has detailed configuration in `.claude/agents/[team]/[agent-name].md`

## 📈 Roadmap & Extensions

### **Phase 1: Core Functionality (Current)**
- ✅ 17 specialized agents across 5 teams
- ✅ CLI tools and workflow automation
- ✅ Standardized schemas and templates

### **Phase 2: Advanced Features (Next)**
- **refactor-agent**: Code refactoring and optimization
- **migration-agent**: Database and code migrations
- **integration-agent**: Third-party service integrations

### **Phase 3: Intelligence Layer (Future)**
- **ai-agent**: ML features and recommendations
- **workflow-agent**: Business process automation
- **analytics-agent**: Code metrics and insights

## 🛡️ Security & Best Practices

### **Environment Security**
```bash
# Environment variables (never commit)
FIREBASE_API_KEY=xxx
DATABASE_URL=xxx
SERVICE_ACCOUNT_KEY=xxx

# .gitignore entries
.env*
serviceAccount.json
.claude/logs/
```

### **Human Approval Gates**
- **Auto-Execute**: Formatting, documentation, basic tests
- **Review Required**: API changes, database schema, production deploys
- **Manual Only**: Security configurations, external integrations

## 📖 Documentation

### **Agent Specifications**
- Individual agent docs: `.claude/agents/[team]/[agent-name].md`
- Templates: `.claude/templates/`
- Schemas: `.claude/schemas/`

### **Examples**
See `.claude/agents/` directory for detailed agent specifications and examples.

---

## 🎯 Quick Reference

**Most Common Commands:**
- `claude-dev create component ComponentName`
- `claude-test component ComponentName`
- `claude-deploy build staging`

**Agent Status:**
- `claude-agent list` - Show all agents
- `claude-agent status` - Current activity

**Help:**
- `claude-dev help` - Development commands
- `claude-test help` - Testing commands
- `claude-deploy help` - Deployment commands

---

*Claude Agent System v1.0 - Production Ready*  
*17 Specialized Development Agents*  
*React/TypeScript/Firebase Stack*