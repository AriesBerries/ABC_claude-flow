# Example: Sequential Testing Workflow

This example demonstrates a progressive testing pipeline where each testing phase builds on the previous one.

## Scenario

Implement a comprehensive testing strategy:
1. Unit tests (foundation)
2. Integration tests (component interaction)
3. End-to-end tests (full system)

## Workflow Definition

```javascript
{
  "name": "sequential-test",
  "mode": "sequential",
  "agents": ["tester"],
  "tasks": [
    {
      "agent": "tester",
      "description": "Create comprehensive unit tests",
      "context": {
        "coverage_target": 80,
        "framework": "Jest"
      }
    },
    {
      "agent": "tester",
      "description": "Design integration tests based on unit test results",
      "context": {
        "focus": "API endpoints and database interactions"
      }
    },
    {
      "agent": "tester",
      "description": "Build end-to-end tests validating full user workflows",
      "context": {
        "framework": "Playwright",
        "scenarios": "critical user paths"
      }
    }
  ]
}
```

## Running the Workflow

```bash
# Basic execution
claude-flow run sequential-test

# With verbose output to see each step
claude-flow run sequential-test --verbose

# Save results to file
claude-flow run sequential-test --verbose > test-results.txt
```

## Expected Output

```
🎯 Executing workflow: sequential-test
📝 Description: Progressive testing pipeline
⚙️  Mode: sequential

📝 Sequential Mode Coordination
  → tester: Create comprehensive unit tests

[tester] Agent initialized
[tester] Processing unit test creation...

  → tester: Design integration tests based on unit test results

[tester] Processing integration tests...
[tester] Using previous results from unit tests

  → tester: Build end-to-end tests validating full user workflows

[tester] Processing e2e tests...
[tester] Building on integration test insights

✓ Completed 3 sequential tasks
✓ Workflow completed successfully
```

## Key Features

### Result Chaining

Each step receives the output from the previous step:

```javascript
// Step 1 output
{
  "unitTests": {
    "total": 45,
    "coverage": 82,
    "failingCases": ["edge case A", "boundary test B"]
  }
}

// Step 2 receives this as context
// Step 2 output builds on it
{
  "integrationTests": {
    "apiTests": 12,
    "dbTests": 8,
    "focusAreas": ["edge case A", "boundary test B"]  // From step 1
  }
}

// Step 3 receives combined context from steps 1 & 2
```

### Progressive Refinement

Each phase refines the testing strategy:

1. **Unit Tests**: Identify individual component issues
2. **Integration Tests**: Focus on problem areas found in unit tests
3. **E2E Tests**: Validate fixes in real-world scenarios

## Use Cases

- **Test Pyramid Implementation**: Bottom-up testing strategy
- **Bug Fix Validation**: Test → Fix → Retest cycle
- **Performance Testing**: Load → Stress → Spike tests
- **Security Auditing**: Static → Dynamic → Penetration tests
- **Code Quality Pipeline**: Lint → Format → Analyze → Review

## Advanced Configuration

### Stop on Error

```json
{
  "sequential": {
    "stop_on_error": true
  }
}
```

### Conditional Branching

```javascript
// If unit tests fail, skip to debugging
if (unitTestResult.failed > 0) {
  skipTo("debugging-workflow");
}
```

### Checkpointing

Resume from specific step if workflow fails:

```bash
# Workflow fails at step 2
claude-flow run sequential-test --resume-from 2
```

## Practical Example

### Full Testing Pipeline

```javascript
const testingPipeline = {
  steps: [
    {
      name: "Unit Tests",
      agent: "tester",
      task: "Generate unit tests for UserService",
      expected: "90% coverage, all tests pass"
    },
    {
      name: "Integration Tests",
      agent: "tester",
      task: "Test UserService with AuthService integration",
      dependencies: ["Unit Tests"],
      expected: "All integration points validated"
    },
    {
      name: "E2E Tests",
      agent: "tester",
      task: "Test complete user registration flow",
      dependencies: ["Integration Tests"],
      expected: "Happy path and error cases covered"
    },
    {
      name: "Review",
      agent: "reviewer",
      task: "Review test coverage and quality",
      dependencies: ["E2E Tests"],
      expected: "Test strategy approval"
    }
  ]
};
```

### Running with Context

```bash
# Provide initial context
claude-flow run sequential-test \
  --context '{"project":"user-auth", "language":"TypeScript"}'
```

## Performance Tips

1. **Optimize Test Generation**: Be specific in requirements
2. **Limit Scope**: Focus on critical paths first
3. **Use Templates**: Reuse test patterns
4. **Monitor Costs**: Sequential can be API-intensive
5. **Cache Results**: Store intermediate outputs

## Comparison with Parallel

| Aspect | Sequential | Parallel |
|--------|-----------|----------|
| Execution | One after another | Simultaneous |
| Context | Shared between steps | Independent |
| Use case | Dependent tasks | Independent tasks |
| Time | Longer total time | Shorter total time |
| Complexity | Progressive refinement | Simpler tasks |

## Debugging

Enable detailed logging:

```bash
export DEBUG=claude-flow:sequential
claude-flow run sequential-test --verbose
```

View step-by-step results:

```bash
# After execution, check memory
claude-flow memory --stats

# Query specific workflow
sqlite3 data/memory.db \
  "SELECT * FROM decisions WHERE workflow='sequential-test'"
```

## Next Steps

1. Run the example: `claude-flow run sequential-test`
2. Customize for your testing needs
3. Combine with other workflows (parallel dev → sequential test)
4. Implement automated test execution
5. Build CI/CD integration

## Related Examples

- [Conditional Branching](./conditional-branching.md)
- [Stream Chaining](./stream-chaining.md)
- [SPARC Development](./sparc-development.md)
