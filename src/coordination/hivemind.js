const {
  ArchitectAgent,
  CoderAgent,
  TesterAgent,
  AnalystAgent,
  ReviewerAgent
} = require('../agents/specialized');

/**
 * HiveMind - Hierarchical agent swarm coordinator
 */
class HiveMind {
  constructor() {
    this.agents = new Map();
    this.activeSwarms = new Map();
    this.policies = this.loadPolicies();
  }

  /**
   * Initialize the hive mind with default agents
   */
  async initialize() {
    // Tier 1: Strategic layer
    await this.registerAgent(new ArchitectAgent());
    
    // Tier 2: Execution layer
    await this.registerAgent(new CoderAgent({ name: 'coder-1' }));
    await this.registerAgent(new CoderAgent({ name: 'coder-2' }));
    await this.registerAgent(new TesterAgent());
    await this.registerAgent(new AnalystAgent());
    
    // Tier 3: Review layer
    await this.registerAgent(new ReviewerAgent());
    
    console.log('🧠 HiveMind initialized with', this.agents.size, 'agents');
  }

  /**
   * Register an agent in the hive
   */
  async registerAgent(agent) {
    await agent.initialize();
    this.agents.set(agent.name, agent);
    console.log(`  ✓ Registered: ${agent.name} (${agent.role}, Tier ${agent.tier})`);
  }

  /**
   * Spawn a new agent dynamically
   */
  async spawnAgent(type, config = {}) {
    let agent;
    
    switch (type) {
      case 'architect':
        agent = new ArchitectAgent(config);
        break;
      case 'coder':
        agent = new CoderAgent(config);
        break;
      case 'tester':
        agent = new TesterAgent(config);
        break;
      case 'analyst':
        agent = new AnalystAgent(config);
        break;
      case 'reviewer':
        agent = new ReviewerAgent(config);
        break;
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }
    
    await this.registerAgent(agent);
    return agent;
  }

  /**
   * Create a swarm for a specific task
   */
  async createSwarm(name, agentTypes) {
    const swarm = {
      name,
      agents: [],
      created: Date.now(),
      status: 'active'
    };
    
    for (const type of agentTypes) {
      const agent = await this.spawnAgent(type, { name: `${type}-${name}` });
      swarm.agents.push(agent);
    }
    
    this.activeSwarms.set(name, swarm);
    console.log(`🐝 Created swarm: ${name} with ${swarm.agents.length} agents`);
    return swarm;
  }

  /**
   * Coordinate agents in SPARC mode
   */
  async coordinateSPARC(task, options = {}) {
    console.log('\n🎯 SPARC Mode Coordination');
    console.log('  S - Specification');
    console.log('  P - Pseudocode');
    console.log('  A - Architecture');
    console.log('  R - Refinement');
    console.log('  C - Completion\n');
    
    const results = {};
    
    // S - Specification (Architect)
    const architect = this.agents.get('architect');
    console.log('📋 Phase 1: Specification');
    results.specification = await architect.process(`Create detailed specification for: ${task}`);
    
    // P - Pseudocode (Architect + Coder)
    console.log('📝 Phase 2: Pseudocode');
    const coder = this.agents.get('coder-1');
    results.pseudocode = await coder.process('Create pseudocode implementation', {
      previousResults: { specification: results.specification.result }
    });
    
    // A - Architecture (Architect)
    console.log('🏗️  Phase 3: Architecture');
    results.architecture = await architect.process('Design system architecture', {
      previousResults: {
        specification: results.specification.result,
        pseudocode: results.pseudocode.result
      }
    });
    
    // R - Refinement (Coder + Tester)
    console.log('🔧 Phase 4: Refinement');
    const tester = this.agents.get('tester');
    results.implementation = await coder.process('Implement refined solution', {
      previousResults: {
        architecture: results.architecture.result
      }
    });
    results.tests = await tester.process('Create test suite', {
      previousResults: {
        implementation: results.implementation.result
      }
    });
    
    // C - Completion (Reviewer)
    console.log('✅ Phase 5: Completion');
    const reviewer = this.agents.get('reviewer');
    results.review = await reviewer.process('Final review and validation', {
      previousResults: {
        implementation: results.implementation.result,
        tests: results.tests.result
      }
    });
    
    return results;
  }

  /**
   * Coordinate agents in parallel mode
   */
  async coordinateParallel(tasks) {
    console.log('\n⚡ Parallel Mode Coordination');
    
    const promises = tasks.map(async (task, index) => {
      const agentName = task.agent || `coder-${(index % 2) + 1}`;
      const agent = this.agents.get(agentName);
      
      if (!agent) {
        throw new Error(`Agent ${agentName} not found`);
      }
      
      console.log(`  → ${agentName}: ${task.description}`);
      return await agent.process(task.description, task.context);
    });
    
    const results = await Promise.all(promises);
    console.log(`✓ Completed ${results.length} parallel tasks`);
    return results;
  }

  /**
   * Coordinate agents in sequential mode
   */
  async coordinateSequential(tasks) {
    console.log('\n📝 Sequential Mode Coordination');
    
    const results = [];
    let previousResult = null;
    
    for (const task of tasks) {
      const agentName = task.agent || 'coder-1';
      const agent = this.agents.get(agentName);
      
      if (!agent) {
        throw new Error(`Agent ${agentName} not found`);
      }
      
      console.log(`  → ${agentName}: ${task.description}`);
      
      const context = {
        ...task.context,
        previousResults: previousResult
      };
      
      const result = await agent.process(task.description, context);
      results.push(result);
      previousResult = result;
    }
    
    console.log(`✓ Completed ${results.length} sequential tasks`);
    return results;
  }

  /**
   * Load coordination policies
   */
  loadPolicies() {
    return {
      // Tier 1 agents can delegate to any tier
      tier1: {
        canDelegate: ['tier1', 'tier2', 'tier3'],
        maxConcurrent: 5
      },
      // Tier 2 agents can delegate to tier 2 and 3
      tier2: {
        canDelegate: ['tier2', 'tier3'],
        maxConcurrent: 3
      },
      // Tier 3 agents cannot delegate
      tier3: {
        canDelegate: [],
        maxConcurrent: 1
      }
    };
  }

  /**
   * Get all agents
   */
  getAgents() {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by name
   */
  getAgent(name) {
    return this.agents.get(name);
  }

  /**
   * Get swarm status
   */
  getSwarmStatus() {
    return {
      totalAgents: this.agents.size,
      activeSwarms: this.activeSwarms.size,
      agents: this.getAgents().map(a => a.getStatus())
    };
  }
}

module.exports = { HiveMind };
