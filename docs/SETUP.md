# ABC Claude Flow - Setup Guide

## Overview

ABC Claude Flow is a local CLI orchestration platform for multi-agent AI coordination. It provides a hierarchical hive-mind architecture for coordinating multiple Claude AI agents to work together on complex tasks.

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **NPM**: Latest version
- **Anthropic API Key**: Required for Claude AI access

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AriesBerries/ABC_claude-flow.git
cd ABC_claude-flow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Required: Anthropic API Key
ANTHROPIC_API_KEY=your_api_key_here

# Optional: Database location
DB_PATH=./data/memory.db

# Optional: Logging
LOG_LEVEL=info
```

**How to get your Anthropic API Key:**

1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

⚠️ **Security Note**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 4. Initialize the Platform

```bash
npm start init
```

This will:
- Create the SQLite database for persistent memory
- Initialize the data directory
- Verify your API key configuration

## Quick Start

### List Available Commands

```bash
claude-flow --help
```

### List Available Agents

```bash
claude-flow agents
```

### List Available Workflows

```bash
claude-flow workflows
```

### Run a Workflow

```bash
# Basic execution
claude-flow run fullstack-dev

# With SPARC mode
claude-flow run fullstack-dev --mode sparc

# With verbose output
claude-flow run code-review --verbose

# With specific agents
claude-flow run parallel-dev --agents coder-1,coder-2
```

## Agent Architecture

### Hierarchical Tiers

**Tier 1: Strategic Layer**
- **Architect Agent**: System design, architecture planning, task delegation

**Tier 2: Execution Layer**
- **Coder Agents**: Code implementation, debugging, refactoring
- **Tester Agent**: Testing, quality assurance, bug detection
- **Analyst Agent**: Data analysis, pattern recognition, insights

**Tier 3: Review Layer**
- **Reviewer Agent**: Code review, security audit, quality validation

### Agent Capabilities

Each agent has specialized capabilities defined in `config/agents.json`:

```json
{
  "architect": {
    "tier": 1,
    "capabilities": [
      "system_design",
      "architecture_planning",
      "technology_selection"
    ]
  }
}
```

## Workflow Modes

### 1. SPARC Mode (Default)

Follows the SPARC development methodology:
- **S**pecification
- **P**seudocode
- **A**rchitecture
- **R**efinement
- **C**ompletion

```bash
claude-flow run fullstack-dev --mode sparc
```

### 2. Parallel Mode

Executes multiple tasks concurrently:

```bash
claude-flow run parallel-dev --mode parallel
```

### 3. Sequential Mode

Executes tasks in order, passing results between steps:

```bash
claude-flow run sequential-test --mode sequential
```

### 4. Conditional Mode

Branches based on runtime conditions:

```bash
claude-flow run conditional-branch --mode conditional
```

### 5. Stream Mode

Streams data through agent chain:

```bash
claude-flow run stream-chain --mode stream
```

## Memory Management

### View Memory Statistics

```bash
claude-flow memory --stats
```

### Clear Memory

```bash
claude-flow memory --clear
```

⚠️ **Warning**: This will delete all conversation history and agent state.

## Configuration

### Agent Configuration

Edit `config/agents.json` to customize agent behavior:
- Model selection
- Temperature settings
- Token limits
- Capabilities
- Permissions

### Coordination Policies

Edit `config/coordination.json` to customize:
- Communication protocols
- Delegation rules
- Memory isolation
- Security policies
- MCP tool configuration

## Directory Structure

```
ABC_claude-flow/
├── src/
│   ├── cli.js              # Main CLI entry point
│   ├── agents/             # Agent implementations
│   │   ├── base.js         # Base agent class
│   │   └── specialized.js  # Specialized agents
│   ├── coordination/       # Coordination system
│   │   └── hivemind.js     # HiveMind coordinator
│   ├── workflows/          # Workflow engine
│   │   └── engine.js       # Workflow execution
│   └── memory/             # Memory management
│       └── manager.js      # SQLite memory manager
├── config/                 # Configuration files
│   ├── agents.json         # Agent configurations
│   └── coordination.json   # Coordination policies
├── docs/                   # Documentation
├── examples/               # Example workflows
├── data/                   # SQLite database (created on init)
└── package.json
```

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## Security Best Practices

See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

## Performance Optimization

See [PERFORMANCE.md](./PERFORMANCE.md) for tips on optimizing agent coordination.

## Next Steps

1. ✅ Complete setup and initialization
2. 📖 Read the [Agent Coordination Guide](./COORDINATION.md)
3. 🎯 Try example workflows in `examples/`
4. 🔧 Customize agent configurations
5. 🚀 Create your own workflows

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/AriesBerries/ABC_claude-flow).
