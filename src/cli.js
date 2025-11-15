#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
require('dotenv').config();

const { HiveMind } = require('./coordination/hivemind');
const { WorkflowEngine } = require('./workflows/engine');
const { MemoryManager } = require('./memory/manager');

const program = new Command();

program
  .name('claude-flow')
  .description('Local CLI multi-agent orchestration platform')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize the orchestration platform')
  .action(async () => {
    console.log(chalk.blue('🚀 Initializing ABC Claude Flow...'));
    
    try {
      const memoryManager = new MemoryManager();
      await memoryManager.initialize();
      console.log(chalk.green('✓ Memory system initialized'));
      
      console.log(chalk.green('✓ Platform ready!'));
      console.log(chalk.yellow('\nNext steps:'));
      console.log('  1. Set ANTHROPIC_API_KEY in .env file');
      console.log('  2. Run: claude-flow run <workflow>');
    } catch (error) {
      console.error(chalk.red('✗ Initialization failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('run <workflow>')
  .description('Execute a workflow')
  .option('-m, --mode <mode>', 'Execution mode: sparc, parallel, sequential', 'sparc')
  .option('-a, --agents <agents>', 'Comma-separated list of agents to spawn')
  .option('-v, --verbose', 'Verbose output')
  .action(async (workflow, options) => {
    console.log(chalk.blue(`🎯 Executing workflow: ${workflow}`));
    console.log(chalk.gray(`Mode: ${options.mode}`));
    
    try {
      const hiveMind = new HiveMind();
      const engine = new WorkflowEngine(hiveMind);
      
      const result = await engine.execute(workflow, {
        mode: options.mode,
        agents: options.agents ? options.agents.split(',') : undefined,
        verbose: options.verbose
      });
      
      console.log(chalk.green('✓ Workflow completed successfully'));
      if (options.verbose) {
        console.log(chalk.gray('\nResults:'));
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error(chalk.red('✗ Workflow failed:'), error.message);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program
  .command('agents')
  .description('List available agents')
  .action(() => {
    console.log(chalk.blue('📋 Available Agents:\n'));
    
    const agents = [
      { name: 'architect', role: 'System design and architecture', tier: 1 },
      { name: 'coder', role: 'Code implementation', tier: 2 },
      { name: 'tester', role: 'Testing and quality assurance', tier: 2 },
      { name: 'analyst', role: 'Data analysis and insights', tier: 2 },
      { name: 'reviewer', role: 'Code review and feedback', tier: 3 }
    ];
    
    agents.forEach(agent => {
      console.log(chalk.yellow(`  ${agent.name}`) + chalk.gray(` (Tier ${agent.tier})`));
      console.log(chalk.gray(`    → ${agent.role}\n`));
    });
  });

program
  .command('workflows')
  .description('List available workflows')
  .action(() => {
    console.log(chalk.blue('📋 Available Workflows:\n'));
    
    const workflows = [
      { name: 'fullstack-dev', description: 'Full-stack development workflow' },
      { name: 'data-analysis', description: 'Data analysis and insights' },
      { name: 'code-review', description: 'Automated code review' },
      { name: 'parallel-dev', description: 'Parallel development example' },
      { name: 'sequential-test', description: 'Sequential testing example' },
      { name: 'conditional-branch', description: 'Conditional branching example' },
      { name: 'stream-chain', description: 'Stream-json chaining example' }
    ];
    
    workflows.forEach(wf => {
      console.log(chalk.yellow(`  ${wf.name}`));
      console.log(chalk.gray(`    → ${wf.description}\n`));
    });
  });

program
  .command('memory')
  .description('Manage persistent memory')
  .option('-c, --clear', 'Clear all memory')
  .option('-s, --stats', 'Show memory statistics')
  .action(async (options) => {
    try {
      const memoryManager = new MemoryManager();
      await memoryManager.initialize();
      
      if (options.clear) {
        await memoryManager.clear();
        console.log(chalk.green('✓ Memory cleared'));
      } else if (options.stats) {
        const stats = await memoryManager.getStats();
        console.log(chalk.blue('📊 Memory Statistics:\n'));
        console.log(chalk.gray(`  Conversations: ${stats.conversations}`));
        console.log(chalk.gray(`  Decisions: ${stats.decisions}`));
        console.log(chalk.gray(`  Total Size: ${stats.size} bytes`));
      } else {
        console.log(chalk.yellow('Use --clear or --stats option'));
      }
    } catch (error) {
      console.error(chalk.red('✗ Memory operation failed:'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
