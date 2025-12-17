# ABC Claude Flow

> Local CLI multi-agent orchestration platform for coordinating Claude AI agents

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## 🌟 Overview

ABC Claude Flow is a powerful local CLI platform for orchestrating multiple Claude AI agents in a hierarchical hive-mind architecture. Coordinate specialized agents (architect, coder, tester, analyst, reviewer) to work together on complex tasks using advanced patterns like SPARC development mode, parallel execution, and stream chaining.

## ✨ Features

- 🧠 **Hive-Mind Architecture**: Hierarchical agent swarms with tier-based coordination
- 🎯 **SPARC Development Mode**: Specification → Pseudocode → Architecture → Refinement → Completion
- ⚡ **Multiple Execution Modes**: Parallel, Sequential, Conditional, Stream-based
- 💾 **Persistent Memory**: SQLite-based memory system with conversation history
- 🔒 **Security First**: Local execution, credential management, memory isolation
- 🛠️ **MCP Tools Support**: Enhanced agent capabilities through tool integration
- 📊 **Built-in Workflows**: Full-stack dev, code review, data analysis, and more

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18.0.0
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/AriesBerries/ABC_claude-flow.git
cd ABC_claude-flow

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Initialize the platform
npm start init
```

### Your First Workflow

```bash
# List available workflows
claude-flow workflows

# Run a workflow
claude-flow run fullstack-dev --mode sparc --verbose

# List agents
claude-flow agents

# Get help
claude-flow --help
```

## 📋 Agent Architecture

### Hierarchical Tiers

**Tier 1: Strategic Layer**
- 🏗️ **Architect**: System design, architecture planning, task delegation

**Tier 2: Execution Layer**
- 💻 **Coder**: Code implementation, debugging, refactoring
- 🧪 **Tester**: Testing, quality assurance, bug detection
- 📊 **Analyst**: Data analysis, pattern recognition, insights

**Tier 3: Review Layer**
- 🔍 **Reviewer**: Code review, security audit, quality validation

Each agent has specialized capabilities and can coordinate with others based on delegation policies.

## 🎬 Workflow Modes

### SPARC Mode
```bash
claude-flow run fullstack-dev --mode sparc
```
Follows the SPARC methodology for comprehensive development cycles.

### Parallel Mode
```bash
claude-flow run parallel-dev --mode parallel
```
Execute multiple independent tasks simultaneously for faster completion.

### Sequential Mode
```bash
claude-flow run sequential-test --mode sequential
```
Chain tasks together, passing results between steps.

### Conditional Mode
```bash
claude-flow run conditional-branch --mode conditional
```
Branch execution based on runtime conditions.

### Stream Mode
```bash
claude-flow run stream-chain --mode stream
```
Stream data through a chain of agents for processing.

## 📚 Documentation

- **[Setup Guide](docs/SETUP.md)** - Installation and configuration
- **[Security Best Practices](docs/SECURITY.md)** - Credential management and security
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Examples](examples/)** - Workflow examples and tutorials

## 🎯 Example Workflows

### Full-Stack Development
```bash
claude-flow run fullstack-dev
```
Complete application development with architecture, backend, frontend, testing, and review.

### Code Review
```bash
claude-flow run code-review
```
Automated code review with security audit, quality checks, and test coverage analysis.

### Data Analysis
```bash
claude-flow run data-analysis
```
Comprehensive data analysis pipeline with insights generation and validation.

### Parallel Development
```bash
claude-flow run parallel-dev
```
Develop multiple features simultaneously with independent agent teams.

See [examples/](examples/) for detailed usage examples.

## 🔧 Configuration

### Agent Configuration
Edit `config/agents.json` to customize:
- Model selection (Claude 3.5 Sonnet, etc.)
- Temperature settings
- Token limits
- Agent capabilities
- Permission scopes

### Coordination Policies
Edit `config/coordination.json` to configure:
- Communication protocols
- Delegation rules
- Memory isolation
- Security policies
- MCP tool configuration

## 💾 Memory Management

```bash
# View memory statistics
claude-flow memory --stats

# Clear memory
claude-flow memory --clear
```

All interactions are stored in a local SQLite database for persistence and analysis.

## 🔒 Security

- ✅ Local execution only
- ✅ API keys in environment variables
- ✅ Memory isolation per agent
- ✅ No data sent to third parties (except Claude API)
- ✅ Rate limiting and timeout controls

See [SECURITY.md](docs/SECURITY.md) for detailed security guidelines.

## 🛠️ MCP Tools Integration

ABC Claude Flow supports Model Context Protocol (MCP) tools for enhanced agent capabilities:

- **File Operations**: Read, write, and manipulate files
- **Code Analysis**: Linting, formatting, and static analysis
- **Data Processing**: Transform, aggregate, and visualize data
- **Test Execution**: Run unit, integration, and E2E tests

Configure tools in `config/coordination.json` under the `mcp_tools` section.

## 📊 Use Cases

- **Software Development**: Full-stack applications with coordinated teams
- **Code Review**: Automated review with security and quality checks
- **Data Analysis**: Complex data processing and insights generation
- **Testing**: Comprehensive test suite creation and execution
- **Documentation**: Automated documentation generation and sync
- **Research**: Multi-perspective analysis and synthesis

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Claude 3.5 Sonnet](https://www.anthropic.com/claude) by Anthropic
- Inspired by [ruvnet/claude-flow](https://github.com/ruvnet/claude-flow) v2.7+ patterns
- Uses SPARC development methodology

## 📞 Support

- 📖 [Documentation](docs/)
- 💬 [GitHub Discussions](https://github.com/AriesBerries/ABC_claude-flow/discussions)
- 🐛 [Issue Tracker](https://github.com/AriesBerries/ABC_claude-flow/issues)

---

**Made with ❤️ for the AI orchestration community**
