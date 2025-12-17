const path = require('path');
const fs = require('fs').promises;

/**
 * Workflow Engine - Executes predefined workflows
 */
class WorkflowEngine {
  constructor(hiveMind) {
    this.hiveMind = hiveMind;
    this.workflows = new Map();
    this.loadBuiltInWorkflows();
  }

  /**
   * Load built-in workflows
   */
  loadBuiltInWorkflows() {
    // Full-stack development workflow
    this.registerWorkflow('fullstack-dev', {
      name: 'Full-Stack Development',
      description: 'Complete full-stack application development',
      mode: 'sparc',
      steps: [
        { agent: 'architect', task: 'design_system' },
        { agent: 'coder-1', task: 'implement_backend' },
        { agent: 'coder-2', task: 'implement_frontend' },
        { agent: 'tester', task: 'create_tests' },
        { agent: 'reviewer', task: 'review_code' }
      ]
    });

    // Data analysis workflow
    this.registerWorkflow('data-analysis', {
      name: 'Data Analysis',
      description: 'Comprehensive data analysis pipeline',
      mode: 'sequential',
      steps: [
        { agent: 'analyst', task: 'analyze_data' },
        { agent: 'analyst', task: 'generate_insights' },
        { agent: 'reviewer', task: 'validate_findings' }
      ]
    });

    // Code review workflow
    this.registerWorkflow('code-review', {
      name: 'Code Review',
      description: 'Automated code review process',
      mode: 'sequential',
      steps: [
        { agent: 'reviewer', task: 'security_audit' },
        { agent: 'reviewer', task: 'quality_check' },
        { agent: 'tester', task: 'test_coverage' }
      ]
    });

    // Parallel development example
    this.registerWorkflow('parallel-dev', {
      name: 'Parallel Development',
      description: 'Multiple features developed in parallel',
      mode: 'parallel',
      steps: [
        { agent: 'coder-1', task: 'feature_a' },
        { agent: 'coder-2', task: 'feature_b' }
      ]
    });

    // Sequential testing example
    this.registerWorkflow('sequential-test', {
      name: 'Sequential Testing',
      description: 'Progressive testing pipeline',
      mode: 'sequential',
      steps: [
        { agent: 'tester', task: 'unit_tests' },
        { agent: 'tester', task: 'integration_tests' },
        { agent: 'tester', task: 'e2e_tests' }
      ]
    });

    // Conditional branching example
    this.registerWorkflow('conditional-branch', {
      name: 'Conditional Branching',
      description: 'Workflow with conditional logic',
      mode: 'conditional',
      steps: [
        { agent: 'architect', task: 'assess_requirements' },
        { condition: 'simple', agent: 'coder-1', task: 'simple_implementation' },
        { condition: 'complex', agent: 'architect', task: 'detailed_design' }
      ]
    });

    // Stream-json chaining example
    this.registerWorkflow('stream-chain', {
      name: 'Stream Chain',
      description: 'Streaming data through agent chain',
      mode: 'stream',
      steps: [
        { agent: 'analyst', task: 'process_stream' },
        { agent: 'coder', task: 'transform_data' },
        { agent: 'reviewer', task: 'validate_output' }
      ]
    });
  }

  /**
   * Register a custom workflow
   */
  registerWorkflow(name, definition) {
    this.workflows.set(name, definition);
  }

  /**
   * Execute a workflow
   */
  async execute(workflowName, options = {}) {
    const workflow = this.workflows.get(workflowName);
    
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowName}`);
    }

    console.log(`\n🎬 Starting workflow: ${workflow.name}`);
    console.log(`📝 Description: ${workflow.description}`);
    console.log(`⚙️  Mode: ${workflow.mode}\n`);

    // Initialize hive mind if not already done
    if (this.hiveMind.agents.size === 0) {
      await this.hiveMind.initialize();
    }

    const mode = options.mode || workflow.mode;
    let results;

    switch (mode) {
      case 'sparc':
        results = await this.executeSPARCWorkflow(workflow, options);
        break;
      case 'parallel':
        results = await this.executeParallelWorkflow(workflow, options);
        break;
      case 'sequential':
        results = await this.executeSequentialWorkflow(workflow, options);
        break;
      case 'conditional':
        results = await this.executeConditionalWorkflow(workflow, options);
        break;
      case 'stream':
        results = await this.executeStreamWorkflow(workflow, options);
        break;
      default:
        throw new Error(`Unknown workflow mode: ${mode}`);
    }

    return {
      workflow: workflowName,
      mode,
      results,
      timestamp: Date.now()
    };
  }

  /**
   * Execute SPARC mode workflow
   */
  async executeSPARCWorkflow(workflow, options) {
    const task = options.task || 'Execute workflow tasks';
    return await this.hiveMind.coordinateSPARC(task, options);
  }

  /**
   * Execute parallel workflow
   */
  async executeParallelWorkflow(workflow, options) {
    const tasks = workflow.steps.map(step => ({
      agent: step.agent,
      description: step.task,
      context: options.context || {}
    }));

    return await this.hiveMind.coordinateParallel(tasks);
  }

  /**
   * Execute sequential workflow
   */
  async executeSequentialWorkflow(workflow, options) {
    const tasks = workflow.steps.map(step => ({
      agent: step.agent,
      description: step.task,
      context: options.context || {}
    }));

    return await this.hiveMind.coordinateSequential(tasks);
  }

  /**
   * Execute conditional workflow
   */
  async executeConditionalWorkflow(workflow, options) {
    console.log('🔀 Conditional workflow execution');
    
    const results = [];
    const condition = options.condition || 'simple';
    
    for (const step of workflow.steps) {
      if (!step.condition || step.condition === condition) {
        const agent = this.hiveMind.getAgent(step.agent);
        if (agent) {
          const result = await agent.process(step.task, options.context || {});
          results.push(result);
        }
      }
    }
    
    return results;
  }

  /**
   * Execute stream workflow
   */
  async executeStreamWorkflow(workflow, options) {
    console.log('📡 Stream workflow execution');
    
    const results = [];
    let streamData = options.streamData || null;
    
    for (const step of workflow.steps) {
      const agent = this.hiveMind.getAgent(step.agent);
      if (agent) {
        const result = await agent.process(step.task, {
          ...options.context,
          streamData
        });
        results.push(result);
        streamData = result; // Chain the output
      }
    }
    
    return results;
  }

  /**
   * List available workflows
   */
  listWorkflows() {
    return Array.from(this.workflows.values());
  }

  /**
   * Get workflow details
   */
  getWorkflow(name) {
    return this.workflows.get(name);
  }
}

module.exports = { WorkflowEngine };
