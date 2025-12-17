# Agent Coordination Guide

## Overview

This guide explains how agents coordinate and communicate in ABC Claude Flow's hive-mind architecture. Understanding coordination is key to building effective multi-agent workflows.

## Hierarchical Architecture

### Three-Tier System

```
┌─────────────────────────────────────────┐
│         Tier 1: Strategic Layer         │
│              (Architect)                │
│  • System design                        │
│  • Task delegation                      │
│  • Can spawn any agent                  │
└─────────────┬───────────────────────────┘
              │ delegates to
              ↓
┌─────────────────────────────────────────┐
│         Tier 2: Execution Layer         │
│    (Coder, Tester, Analyst)            │
│  • Implementation                       │
│  • Testing                              │
│  • Analysis                             │
│  • Can delegate to Tier 3               │
└─────────────┬───────────────────────────┘
              │ requests review
              ↓
┌─────────────────────────────────────────┐
│          Tier 3: Review Layer           │
│              (Reviewer)                 │
│  • Code review                          │
│  • Quality validation                   │
│  • Cannot delegate                      │
└─────────────────────────────────────────┘
```

### Delegation Rules

Defined in `config/coordination.json`:

```json
{
  "policies": {
    "tier1": {
      "can_delegate_to": ["tier1", "tier2", "tier3"],
      "max_concurrent_delegations": 5
    },
    "tier2": {
      "can_delegate_to": ["tier2", "tier3"],
      "max_concurrent_delegations": 3
    },
    "tier3": {
      "can_delegate_to": [],
      "max_concurrent_delegations": 1
    }
  }
}
```

## Communication Patterns

### 1. Message Passing

Agents communicate via messages:

```javascript
// Agent A sends message to Agent B
await agentA.communicate(agentB, 'Review this code');

// Agent B receives and processes
await agentB.receive(agentA, message);
```

Implementation:

```javascript
class Agent {
  async communicate(targetAgent, message) {
    console.log(`[${this.name}] → [${targetAgent.name}]: ${message}`);
    
    // Log coordination
    await memoryManager.logCoordination(
      this.name,
      targetAgent.name,
      message
    );
    
    return await targetAgent.receive(this, message);
  }

  async receive(sourceAgent, message) {
    console.log(`[${this.name}] ← [${sourceAgent.name}]: ${message}`);
    
    // Process message
    const response = await this.process(message);
    
    return {
      acknowledged: true,
      agent: this.name,
      response
    };
  }
}
```

### 2. Broadcast

Architect broadcasts to multiple agents:

```javascript
async broadcastTask(agents, task) {
  const results = await Promise.all(
    agents.map(agent => this.communicate(agent, task))
  );
  return results;
}
```

### 3. Pipeline

Sequential data passing:

```javascript
async pipeline(agents, data) {
  let result = data;
  
  for (const agent of agents) {
    result = await agent.process('Process data', {
      previousResults: result
    });
  }
  
  return result;
}
```

## Coordination Modes

### SPARC Coordination

**Specification Phase**
- Architect creates detailed spec
- No other agents involved

**Pseudocode Phase**
- Architect delegates to Coder
- Coder creates implementation plan

**Architecture Phase**
- Architect reviews and refines
- May consult Analyst for data flow

**Refinement Phase**
- Coder implements
- Tester creates tests
- Parallel execution

**Completion Phase**
- Reviewer validates everything
- Architect approves final result

Example flow:

```javascript
async coordinateSPARC(task) {
  // S - Specification
  const spec = await architect.process(`Specify: ${task}`);
  
  // P - Pseudocode
  const pseudo = await coder.process('Create pseudocode', {
    previousResults: spec
  });
  
  // A - Architecture
  const arch = await architect.process('Design architecture', {
    previousResults: { spec, pseudo }
  });
  
  // R - Refinement (parallel)
  const [impl, tests] = await Promise.all([
    coder.process('Implement', { previousResults: arch }),
    tester.process('Create tests', { previousResults: arch })
  ]);
  
  // C - Completion
  const review = await reviewer.process('Final review', {
    previousResults: { impl, tests }
  });
  
  return { spec, pseudo, arch, impl, tests, review };
}
```

### Parallel Coordination

Multiple agents work independently:

```javascript
async coordinateParallel(tasks) {
  // Load balance across available coders
  const coders = [
    hiveMind.getAgent('coder-1'),
    hiveMind.getAgent('coder-2')
  ];
  
  const assignments = tasks.map((task, i) => ({
    agent: coders[i % coders.length],
    task
  }));
  
  return await Promise.all(
    assignments.map(({ agent, task }) => 
      agent.process(task)
    )
  );
}
```

### Sequential Coordination

Chain of responsibility:

```javascript
async coordinateSequential(tasks) {
  const results = [];
  let context = {};
  
  for (const { agent, task } of tasks) {
    const result = await agent.process(task, {
      previousResults: context
    });
    
    results.push(result);
    context = { ...context, [agent.name]: result };
  }
  
  return results;
}
```

## Advanced Patterns

### 1. Feedback Loop

Agent requests clarification:

```javascript
async processWithFeedback(task) {
  let attempt = 0;
  let result;
  
  while (attempt < 3) {
    result = await agent.process(task);
    
    const review = await reviewer.process('Quick review', {
      previousResults: result
    });
    
    if (review.success) {
      break;
    }
    
    // Provide feedback for retry
    task = `${task}\n\nPrevious attempt feedback: ${review.issues}`;
    attempt++;
  }
  
  return result;
}
```

### 2. Consensus Building

Multiple agents vote on decision:

```javascript
async buildConsensus(task, agents) {
  const responses = await Promise.all(
    agents.map(agent => agent.process(task))
  );
  
  // Analyze responses for consensus
  const consensus = analyzeConsensus(responses);
  
  if (consensus.agreement < 0.7) {
    // Escalate to architect
    return await architect.process(
      'Resolve disagreement',
      { previousResults: responses }
    );
  }
  
  return consensus.decision;
}
```

### 3. Hierarchical Escalation

Tier 2 escalates to Tier 1:

```javascript
async processWithEscalation(task) {
  try {
    return await coder.process(task);
  } catch (error) {
    if (error.type === 'complexity_exceeded') {
      console.log('Escalating to architect...');
      return await architect.process(task);
    }
    throw error;
  }
}
```

### 4. Swarm Intelligence

Dynamic team formation:

```javascript
async createTaskForce(requirements) {
  const swarm = await hiveMind.createSwarm('task-force', [
    'architect',  // Leader
    'coder',
    'coder',      // Two coders
    'tester',
    'analyst'
  ]);
  
  // Architect coordinates the swarm
  const architect = swarm.agents[0];
  const team = swarm.agents.slice(1);
  
  // Architect distributes work
  const plan = await architect.process(
    `Create work breakdown for: ${requirements}`
  );
  
  // Team executes in parallel
  const results = await Promise.all(
    team.map(agent => agent.process(plan.tasks[agent.role]))
  );
  
  return results;
}
```

## Memory Isolation

### Agent-Scoped Memory

Each agent maintains isolated memory:

```javascript
class Agent {
  constructor(config) {
    this.memory = [];  // Private to this agent
    this.sharedContext = {};  // Shared via coordination
  }

  async process(task, context) {
    // Access only own memory
    const relevantMemory = this.memory.slice(-10);
    
    // Combine with shared context
    const fullContext = {
      ...context,
      memory: relevantMemory
    };
    
    // Process and update memory
    const result = await this.execute(task, fullContext);
    this.memory.push({ task, result });
    
    return result;
  }
}
```

### Cross-Agent Context Sharing

Share specific information:

```javascript
async shareContext(fromAgent, toAgent, contextKey) {
  const relevantMemory = fromAgent.memory
    .filter(m => m.context === contextKey);
  
  toAgent.sharedContext[fromAgent.name] = relevantMemory;
}
```

## Coordination Policies

### Rate Limiting

Prevent overwhelming the system:

```javascript
class CoordinationManager {
  constructor() {
    this.activeRequests = new Map();
    this.maxConcurrent = 5;
  }

  async coordinate(agent, task) {
    // Wait if too many active
    while (this.activeRequests.size >= this.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const requestId = Date.now();
    this.activeRequests.set(requestId, { agent, task });

    try {
      return await agent.process(task);
    } finally {
      this.activeRequests.delete(requestId);
    }
  }
}
```

### Priority Queuing

Handle urgent tasks first:

```javascript
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(task, priority) {
    this.queue.push({ task, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  async processAll() {
    while (this.queue.length > 0) {
      const { task } = this.queue.shift();
      await task.execute();
    }
  }
}
```

### Load Balancing

Distribute work evenly:

```javascript
class LoadBalancer {
  constructor(agents) {
    this.agents = agents;
    this.loads = new Map(agents.map(a => [a.name, 0]));
  }

  async assign(task) {
    // Find least loaded agent
    const agent = this.agents.reduce((min, agent) =>
      this.loads.get(agent.name) < this.loads.get(min.name) 
        ? agent 
        : min
    );

    // Increment load
    this.loads.set(agent.name, this.loads.get(agent.name) + 1);

    try {
      return await agent.process(task);
    } finally {
      // Decrement load
      this.loads.set(agent.name, this.loads.get(agent.name) - 1);
    }
  }
}
```

## Monitoring Coordination

### Track Communication

```javascript
async logCoordination(source, target, message) {
  await memoryManager.logCoordination(source, target, message);
}

// Query coordination history
async getCoordinationGraph() {
  const logs = await memoryManager.getCoordinationHistory();
  
  // Build graph of interactions
  const graph = {};
  logs.forEach(log => {
    const key = `${log.source_agent}->${log.target_agent}`;
    graph[key] = (graph[key] || 0) + 1;
  });
  
  return graph;
}
```

### Performance Metrics

```javascript
class CoordinationMetrics {
  constructor() {
    this.metrics = {
      messages: 0,
      delegations: 0,
      escalations: 0,
      avgResponseTime: 0
    };
  }

  track(event) {
    this.metrics[event.type]++;
    
    if (event.duration) {
      this.metrics.avgResponseTime = 
        (this.metrics.avgResponseTime + event.duration) / 2;
    }
  }

  report() {
    console.log('Coordination Metrics:');
    console.log(JSON.stringify(this.metrics, null, 2));
  }
}
```

## Best Practices

### ✅ DO:

1. **Respect hierarchy**: Follow delegation rules
2. **Use appropriate tier**: Don't use architect for simple tasks
3. **Batch communications**: Group related messages
4. **Monitor coordination**: Track patterns and bottlenecks
5. **Implement timeouts**: Prevent hanging operations
6. **Log all interactions**: Enable debugging and analysis
7. **Handle failures gracefully**: Implement retry and escalation

### ❌ DON'T:

1. **Cross tier inappropriately**: Tier 3 can't delegate to Tier 2
2. **Circular dependencies**: A→B→A coordination loops
3. **Excessive delegation**: Architect shouldn't delegate everything
4. **Ignore failures**: Always handle communication errors
5. **Unlimited recursion**: Set maximum delegation depth
6. **Block on communication**: Use async patterns
7. **Skip logging**: Makes debugging impossible

## Example: Complex Coordination

```javascript
async function fullStackDevelopment(requirements) {
  // Phase 1: Architecture (Tier 1)
  const architecture = await architect.process(
    `Design system for: ${requirements}`
  );

  // Phase 2: Parallel Development (Tier 2)
  const [backend, frontend, database] = await Promise.all([
    coder1.process('Implement backend', { 
      previousResults: architecture 
    }),
    coder2.process('Implement frontend', { 
      previousResults: architecture 
    }),
    analyst.process('Design database schema', { 
      previousResults: architecture 
    })
  ]);

  // Phase 3: Integration Testing (Tier 2)
  const integrationTests = await tester.process(
    'Create integration tests',
    { previousResults: { backend, frontend, database } }
  );

  // Phase 4: Review and Validation (Tier 3)
  const review = await reviewer.process(
    'Comprehensive review',
    { 
      previousResults: { 
        backend, 
        frontend, 
        database, 
        integrationTests 
      } 
    }
  );

  // Phase 5: Architect Final Approval (Tier 1)
  if (review.issues.length > 0) {
    // Escalate back to architect
    const resolution = await architect.process(
      'Resolve review issues',
      { previousResults: review }
    );
    
    // Redistribute work
    return await redistributeWork(resolution);
  }

  return {
    architecture,
    implementation: { backend, frontend, database },
    tests: integrationTests,
    review,
    status: 'approved'
  };
}
```

## Troubleshooting Coordination

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common coordination issues and solutions.

## Further Reading

- [Agent Base Class](../src/agents/base.js)
- [HiveMind Implementation](../src/coordination/hivemind.js)
- [Coordination Policies](../config/coordination.json)
