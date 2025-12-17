const Anthropic = require('@anthropic-ai/sdk');
const { v4: uuidv4 } = require('uuid');

/**
 * Base Agent class for the multi-agent system
 */
class Agent {
  constructor(config = {}) {
    this.id = config.id || uuidv4();
    this.name = config.name || 'agent';
    this.role = config.role || 'generic';
    this.tier = config.tier || 1;
    this.capabilities = config.capabilities || [];
    this.memory = [];
    this.client = null;
    
    if (process.env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
  }

  /**
   * Initialize the agent
   */
  async initialize() {
    if (!this.client) {
      throw new Error('ANTHROPIC_API_KEY not set');
    }
    console.log(`[${this.name}] Agent initialized`);
  }

  /**
   * Process a task using Claude
   */
  async process(task, context = {}) {
    if (!this.client) {
      throw new Error('Agent not initialized');
    }

    const systemPrompt = this.getSystemPrompt();
    const userMessage = this.formatTask(task, context);

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      const result = response.content[0].text;
      this.memory.push({ task, result, timestamp: Date.now() });
      
      return {
        success: true,
        result,
        metadata: {
          agent: this.name,
          role: this.role,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      console.error(`[${this.name}] Error processing task:`, error.message);
      return {
        success: false,
        error: error.message,
        metadata: {
          agent: this.name,
          role: this.role,
          timestamp: Date.now()
        }
      };
    }
  }

  /**
   * Get the system prompt for this agent
   */
  getSystemPrompt() {
    return `You are a ${this.role} agent in a multi-agent orchestration system.
Your primary capabilities are: ${this.capabilities.join(', ')}.
Work collaboratively with other agents and provide clear, actionable outputs.`;
  }

  /**
   * Format the task for Claude
   */
  formatTask(task, context) {
    let message = `Task: ${task}\n`;
    
    if (context.previousResults) {
      message += `\nPrevious Results:\n${JSON.stringify(context.previousResults, null, 2)}\n`;
    }
    
    if (context.requirements) {
      message += `\nRequirements:\n${context.requirements}\n`;
    }
    
    return message;
  }

  /**
   * Communicate with another agent
   */
  async communicate(targetAgent, message) {
    console.log(`[${this.name}] → [${targetAgent.name}]: ${message}`);
    return await targetAgent.receive(this, message);
  }

  /**
   * Receive a message from another agent
   */
  async receive(sourceAgent, message) {
    console.log(`[${this.name}] ← [${sourceAgent.name}]: ${message}`);
    return { acknowledged: true, agent: this.name };
  }

  /**
   * Get agent status
   */
  getStatus() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      tier: this.tier,
      capabilities: this.capabilities,
      memorySize: this.memory.length
    };
  }
}

module.exports = { Agent };
