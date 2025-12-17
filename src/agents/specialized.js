const { Agent } = require('./base');

/**
 * Architect Agent - Tier 1
 * Responsible for system design and high-level architecture decisions
 */
class ArchitectAgent extends Agent {
  constructor(config = {}) {
    super({
      ...config,
      name: config.name || 'architect',
      role: 'System Architect',
      tier: 1,
      capabilities: [
        'system design',
        'architecture planning',
        'technology selection',
        'component orchestration',
        'task delegation'
      ]
    });
  }

  getSystemPrompt() {
    return `You are an expert System Architect agent.
Your role is to:
- Design system architecture and high-level structure
- Break down complex problems into manageable components
- Select appropriate technologies and patterns
- Coordinate other agents (coders, testers, analysts)
- Make strategic technical decisions

Provide clear, structured outputs that other agents can execute.
Use SPARC methodology: Specification, Pseudocode, Architecture, Refinement, Completion.`;
  }

  async designSystem(requirements) {
    return await this.process(`Design a system architecture for: ${requirements}`, {
      requirements
    });
  }
}

/**
 * Coder Agent - Tier 2
 * Responsible for code implementation
 */
class CoderAgent extends Agent {
  constructor(config = {}) {
    super({
      ...config,
      name: config.name || 'coder',
      role: 'Software Developer',
      tier: 2,
      capabilities: [
        'code implementation',
        'debugging',
        'refactoring',
        'documentation',
        'best practices'
      ]
    });
  }

  getSystemPrompt() {
    return `You are an expert Software Developer agent.
Your role is to:
- Implement code based on architectural designs
- Write clean, maintainable, and efficient code
- Follow best practices and coding standards
- Debug and fix issues
- Document code appropriately

Produce production-ready code with proper error handling and documentation.`;
  }

  async implementFeature(specification, architecture) {
    return await this.process(`Implement the following feature: ${specification}`, {
      requirements: specification,
      previousResults: { architecture }
    });
  }
}

/**
 * Tester Agent - Tier 2
 * Responsible for testing and quality assurance
 */
class TesterAgent extends Agent {
  constructor(config = {}) {
    super({
      ...config,
      name: config.name || 'tester',
      role: 'QA Engineer',
      tier: 2,
      capabilities: [
        'test design',
        'test execution',
        'quality assurance',
        'bug detection',
        'test automation'
      ]
    });
  }

  getSystemPrompt() {
    return `You are an expert QA Engineer agent.
Your role is to:
- Design comprehensive test strategies
- Create test cases and scenarios
- Identify edge cases and potential bugs
- Validate code quality and functionality
- Ensure robustness and reliability

Provide detailed test plans and identify potential issues proactively.`;
  }

  async createTestPlan(codebase, requirements) {
    return await this.process('Create a comprehensive test plan', {
      requirements,
      previousResults: { codebase }
    });
  }
}

/**
 * Analyst Agent - Tier 2
 * Responsible for data analysis and insights
 */
class AnalystAgent extends Agent {
  constructor(config = {}) {
    super({
      ...config,
      name: config.name || 'analyst',
      role: 'Data Analyst',
      tier: 2,
      capabilities: [
        'data analysis',
        'pattern recognition',
        'performance analysis',
        'metrics generation',
        'insights extraction'
      ]
    });
  }

  getSystemPrompt() {
    return `You are an expert Data Analyst agent.
Your role is to:
- Analyze data and extract meaningful insights
- Identify patterns and trends
- Generate performance metrics
- Provide data-driven recommendations
- Create visualizations and reports

Deliver clear, actionable insights backed by data.`;
  }

  async analyzeData(data, objectives) {
    return await this.process(`Analyze data for: ${objectives}`, {
      requirements: objectives,
      previousResults: { data }
    });
  }
}

/**
 * Reviewer Agent - Tier 3
 * Responsible for code review and quality feedback
 */
class ReviewerAgent extends Agent {
  constructor(config = {}) {
    super({
      ...config,
      name: config.name || 'reviewer',
      role: 'Code Reviewer',
      tier: 3,
      capabilities: [
        'code review',
        'quality assessment',
        'security audit',
        'performance review',
        'best practices validation'
      ]
    });
  }

  getSystemPrompt() {
    return `You are an expert Code Reviewer agent.
Your role is to:
- Review code for quality, security, and performance
- Identify potential bugs and vulnerabilities
- Ensure adherence to best practices
- Provide constructive feedback
- Validate implementation against requirements

Provide specific, actionable feedback with examples.`;
  }

  async reviewCode(code, requirements) {
    return await this.process('Review the following code', {
      requirements,
      previousResults: { code }
    });
  }
}

module.exports = {
  ArchitectAgent,
  CoderAgent,
  TesterAgent,
  AnalystAgent,
  ReviewerAgent
};
