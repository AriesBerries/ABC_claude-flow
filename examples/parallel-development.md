# Example: Parallel Development Workflow

This example demonstrates how to use multiple agents in parallel to develop different features simultaneously.

## Scenario

Develop two independent features for a web application:
- Feature A: User authentication system
- Feature B: Data visualization dashboard

## Workflow Definition

```javascript
{
  "name": "parallel-dev",
  "mode": "parallel",
  "agents": ["coder-1", "coder-2"],
  "tasks": [
    {
      "agent": "coder-1",
      "description": "Implement user authentication with JWT tokens",
      "context": {
        "requirements": "Support email/password login, password reset, and session management"
      }
    },
    {
      "agent": "coder-2",
      "description": "Create interactive data visualization dashboard",
      "context": {
        "requirements": "Use D3.js for charts, support real-time updates, responsive design"
      }
    }
  ]
}
```

## Running the Workflow

```bash
# Basic execution
claude-flow run parallel-dev

# With verbose output
claude-flow run parallel-dev --verbose

# With specific agents
claude-flow run parallel-dev --agents coder-1,coder-2
```

## Expected Output

```
🎯 Executing workflow: parallel-dev
📝 Description: Multiple features developed in parallel
⚙️  Mode: parallel

🧠 HiveMind initialized with 6 agents
  ✓ Registered: architect (System Architect, Tier 1)
  ✓ Registered: coder-1 (Software Developer, Tier 2)
  ✓ Registered: coder-2 (Software Developer, Tier 2)
  ✓ Registered: tester (QA Engineer, Tier 2)
  ✓ Registered: analyst (Data Analyst, Tier 2)
  ✓ Registered: reviewer (Code Reviewer, Tier 3)

⚡ Parallel Mode Coordination
  → coder-1: Implement user authentication with JWT tokens
  → coder-2: Create interactive data visualization dashboard

[coder-1] Agent initialized
[coder-2] Agent initialized

✓ Completed 2 parallel tasks
✓ Workflow completed successfully
```

## Benefits

1. **Time Efficiency**: Both features developed simultaneously
2. **Resource Utilization**: Multiple agents work concurrently
3. **Independent Development**: No dependencies between tasks
4. **Scalability**: Can add more parallel tasks as needed

## Use Cases

- **Microservices Development**: Develop multiple services in parallel
- **Frontend/Backend Split**: UI and API development simultaneously
- **Feature Branches**: Multiple feature implementations
- **Component Library**: Develop UI components in parallel
- **Test Suite Creation**: Write different test suites concurrently

## Advanced Usage

### Custom Agent Configuration

```bash
# Create custom workflow file
cat > my-parallel-workflow.json << 'EOF'
{
  "name": "custom-parallel",
  "mode": "parallel",
  "tasks": [
    {
      "agent": "coder-1",
      "description": "Your task here",
      "context": {
        "framework": "React",
        "styling": "Tailwind CSS"
      }
    },
    {
      "agent": "coder-2",
      "description": "Another task",
      "context": {
        "api": "REST",
        "database": "PostgreSQL"
      }
    }
  ]
}
EOF

# Run custom workflow
claude-flow run-custom my-parallel-workflow.json
```

### Error Handling

By default, parallel mode continues even if one task fails:

```json
{
  "parallel": {
    "failure_handling": "continue"
  }
}
```

To stop on first error:

```json
{
  "parallel": {
    "failure_handling": "stop"
  }
}
```

## Performance Considerations

- **API Rate Limits**: Monitor concurrent API calls
- **Memory Usage**: Each agent maintains separate context
- **Cost**: Parallel execution may increase API costs
- **Coordination**: Ensure tasks are truly independent

## Next Steps

1. Try the example: `claude-flow run parallel-dev`
2. Customize for your project
3. Combine with sequential phases (design → parallel dev → review)
4. Monitor performance and costs
