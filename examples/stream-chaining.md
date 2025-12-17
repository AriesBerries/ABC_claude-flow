# Example: Stream-JSON Chaining Workflow

This example demonstrates how to stream data through a chain of agents, with each agent transforming and enriching the data.

## Scenario

Process customer feedback data through multiple analysis stages:
1. Analyst: Extract sentiment and key themes
2. Coder: Transform into structured format
3. Reviewer: Validate and provide recommendations

## Workflow Definition

```javascript
{
  "name": "stream-chain",
  "mode": "stream",
  "agents": ["analyst", "coder", "reviewer"],
  "tasks": [
    {
      "agent": "analyst",
      "description": "Analyze customer feedback and extract sentiment",
      "context": {
        "input_format": "raw_text",
        "output_format": "json"
      }
    },
    {
      "agent": "coder",
      "description": "Transform analysis into structured dashboard data",
      "context": {
        "output_format": "dashboard_json"
      }
    },
    {
      "agent": "reviewer",
      "description": "Validate data quality and suggest improvements",
      "context": {
        "validation_rules": "completeness, accuracy, format"
      }
    }
  ]
}
```

## Running the Workflow

```bash
# With sample data
claude-flow run stream-chain \
  --context '{"streamData": "Customer feedback text here..."}'

# From file
cat customer-feedback.txt | \
  claude-flow run stream-chain --stdin

# With verbose output
claude-flow run stream-chain --verbose
```

## Expected Output

```
🎯 Executing workflow: stream-chain
📝 Description: Streaming data through agent chain
⚙️  Mode: stream

📡 Stream workflow execution

[analyst] Processing input stream...
{
  "sentiment": "positive",
  "themes": ["usability", "performance"],
  "confidence": 0.87
}

[coder] Transforming data...
{
  "dashboard_data": {
    "sentiment_score": 87,
    "top_themes": [
      {"name": "usability", "count": 12},
      {"name": "performance", "count": 8}
    ],
    "trend": "improving"
  }
}

[reviewer] Validating output...
{
  "validation": "passed",
  "quality_score": 92,
  "recommendations": [
    "Add temporal analysis",
    "Include comparative metrics"
  ]
}

✓ Stream processing complete
✓ Workflow completed successfully
```

## Data Flow

```
Raw Input
    ↓
[Analyst Agent]
    ↓
Sentiment Analysis JSON
    ↓
[Coder Agent]
    ↓
Dashboard-Ready JSON
    ↓
[Reviewer Agent]
    ↓
Validated Output + Recommendations
```

## Key Features

### Incremental Processing

Each agent receives the output from the previous agent:

```javascript
// Step 1: Analyst output
const analysisResult = {
  sentiment: "positive",
  themes: ["usability", "performance"],
  keywords: ["fast", "easy", "intuitive"]
};

// Step 2: Coder receives analysisResult and transforms
const transformedData = {
  ...analysisResult,
  structured: {
    metrics: { /* computed from analysis */ },
    visualization: { /* chart config */ }
  }
};

// Step 3: Reviewer receives transformedData and validates
const finalOutput = {
  ...transformedData,
  validation: { /* quality checks */ },
  improvements: [ /* suggestions */ ]
};
```

### Backpressure Handling

Stream mode includes backpressure control:

```json
{
  "stream": {
    "buffer_size": 1024,
    "chunk_processing": true,
    "backpressure": true
  }
}
```

## Use Cases

### 1. ETL Pipelines
```
Extract (Analyst) → Transform (Coder) → Load (Reviewer)
```

### 2. Content Processing
```
Parse (Coder) → Analyze (Analyst) → Validate (Reviewer)
```

### 3. Data Enrichment
```
Raw Data → Add Context → Add Insights → Quality Check
```

### 4. Report Generation
```
Data Collection → Analysis → Formatting → Review
```

### 5. API Response Transformation
```
Raw API Response → Parse → Transform → Validate
```

## Advanced Example: Multi-Stage Pipeline

```javascript
const complexStream = {
  name: "advanced-stream",
  mode: "stream",
  stages: [
    {
      name: "Ingestion",
      agent: "analyst",
      task: "Parse and validate input data",
      streaming: true
    },
    {
      name: "Analysis",
      agent: "analyst",
      task: "Perform statistical analysis",
      dependencies: ["Ingestion"]
    },
    {
      name: "Transformation",
      agent: "coder",
      task: "Convert to target format",
      dependencies: ["Analysis"]
    },
    {
      name: "Enrichment",
      agent: "analyst",
      task: "Add contextual information",
      dependencies: ["Transformation"]
    },
    {
      name: "Validation",
      agent: "reviewer",
      task: "Final quality check",
      dependencies: ["Enrichment"]
    }
  ]
};
```

## Practical Example: Log Analysis

### Input
```json
{
  "logs": [
    "2024-01-15 10:23:45 ERROR: Connection timeout",
    "2024-01-15 10:24:12 WARN: High memory usage",
    "2024-01-15 10:25:03 ERROR: Database connection failed"
  ]
}
```

### Stream Processing

```bash
# Run stream analysis
claude-flow run stream-chain \
  --context '{"streamData": {"logs": [...]}}'
```

### Stage 1: Analyst Output
```json
{
  "parsed_logs": [
    {
      "timestamp": "2024-01-15T10:23:45Z",
      "level": "ERROR",
      "message": "Connection timeout",
      "category": "network"
    }
  ],
  "summary": {
    "error_count": 2,
    "warning_count": 1,
    "critical_issues": ["connection_timeout", "db_failure"]
  }
}
```

### Stage 2: Coder Output
```json
{
  "dashboard_data": {
    "time_series": [
      {"time": "10:23", "errors": 1, "warnings": 0}
    ],
    "error_distribution": {
      "network": 1,
      "database": 1
    },
    "alerts": [
      {
        "severity": "high",
        "type": "database_failure",
        "requires_action": true
      }
    ]
  }
}
```

### Stage 3: Reviewer Output
```json
{
  "validation": {
    "data_quality": "high",
    "completeness": 100,
    "accuracy": "verified"
  },
  "recommendations": [
    "Investigate database connection pooling",
    "Add retry logic for network timeouts",
    "Set up monitoring for connection health"
  ],
  "priority_actions": [
    "Fix database connection immediately",
    "Review network configuration"
  ]
}
```

## Performance Optimization

### Chunked Processing

For large datasets:

```javascript
// Process in chunks
const chunkSize = 100;
for (let i = 0; i < data.length; i += chunkSize) {
  const chunk = data.slice(i, i + chunkSize);
  await streamWorkflow.processChunk(chunk);
}
```

### Parallel Streams

Combine with parallel mode:

```javascript
// Multiple parallel streams
const streams = [
  { data: dataset1, workflow: "stream-chain" },
  { data: dataset2, workflow: "stream-chain" },
  { data: dataset3, workflow: "stream-chain" }
];

await Promise.all(
  streams.map(s => executeStream(s.data, s.workflow))
);
```

## Error Handling

### Stream Interruption

```javascript
try {
  await streamWorkflow.execute(data);
} catch (error) {
  if (error.type === 'stream_interrupted') {
    // Resume from last successful stage
    await streamWorkflow.resume(error.lastStage);
  }
}
```

### Data Validation

Each stage can validate data before processing:

```javascript
validateStageInput(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid stream data format');
  }
  return true;
}
```

## Monitoring

Track stream progress:

```bash
# Enable stream monitoring
export STREAM_MONITORING=true
claude-flow run stream-chain --verbose

# View stream metrics
claude-flow memory --stats
```

## Comparison with Other Modes

| Feature | Stream | Sequential | Parallel |
|---------|--------|------------|----------|
| Data flow | Continuous | Step-by-step | Independent |
| Memory | Low (streaming) | Medium | High |
| Best for | Large data | Dependencies | Speed |
| Complexity | High | Medium | Low |

## Next Steps

1. Try the example: `claude-flow run stream-chain`
2. Process real data through the pipeline
3. Combine with other modes for complex workflows
4. Build custom stream processors
5. Monitor and optimize performance

## Related Examples

- [Sequential Testing](./sequential-testing.md)
- [Parallel Development](./parallel-development.md)
- [Conditional Branching](./conditional-branching.md)
