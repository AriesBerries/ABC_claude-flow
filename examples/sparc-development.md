# SPARC Development Mode - Complete Example

This is a comprehensive example showing the full SPARC methodology in action.

## What is SPARC?

SPARC is a structured development methodology:
- **S**pecification - Define clear requirements
- **P**seudocode - Outline the solution logic
- **A**rchitecture - Design the system structure
- **R**efinement - Implement and test
- **C**ompletion - Review and finalize

## Example: Building a REST API

### Task
Create a REST API for a todo list application with authentication.

### Running the Workflow

```bash
# Execute SPARC workflow
claude-flow run fullstack-dev --mode sparc --verbose

# Or with custom task
claude-flow run fullstack-dev \
  --mode sparc \
  --context '{"task":"Build REST API for todo app with auth"}'
```

## Phase Breakdown

### Phase 1: Specification (Architect Agent)

**Input:** "Build REST API for todo app with authentication"

**Output:**
```markdown
# Todo List API Specification

## Overview
RESTful API for managing todo items with user authentication

## Requirements
1. User authentication (JWT-based)
2. CRUD operations for todos
3. User-specific todo lists
4. Input validation
5. Error handling

## Endpoints
- POST /auth/register - Register new user
- POST /auth/login - Authenticate user
- GET /todos - List user's todos
- POST /todos - Create todo
- PUT /todos/:id - Update todo
- DELETE /todos/:id - Delete todo

## Data Models
- User: id, email, password_hash, created_at
- Todo: id, user_id, title, description, completed, created_at

## Security
- Password hashing (bcrypt)
- JWT tokens for auth
- Input sanitization
- Rate limiting

## Technology Stack
- Node.js + Express
- PostgreSQL
- JWT for auth
- bcrypt for passwords
```

### Phase 2: Pseudocode (Coder Agent)

**Input:** Specification from Phase 1

**Output:**
```javascript
// Pseudocode for Todo API

// 1. Setup and Configuration
INIT express app
LOAD environment variables
CONNECT to database

// 2. Authentication Middleware
FUNCTION authenticateToken(request)
  GET token from Authorization header
  IF token is missing
    RETURN 401 Unauthorized
  
  VERIFY token with secret
  IF verification fails
    RETURN 403 Forbidden
  
  ATTACH user to request
  CONTINUE

// 3. User Registration
ENDPOINT POST /auth/register
  VALIDATE email and password
  CHECK if user exists
  IF user exists
    RETURN 409 Conflict
  
  HASH password
  CREATE user in database
  GENERATE JWT token
  RETURN token and user info

// 4. User Login
ENDPOINT POST /auth/login
  VALIDATE credentials
  FIND user by email
  IF user not found
    RETURN 401 Unauthorized
  
  COMPARE password with hash
  IF passwords don't match
    RETURN 401 Unauthorized
  
  GENERATE JWT token
  RETURN token and user info

// 5. Todo Operations
ENDPOINT GET /todos
  AUTHENTICATE user
  QUERY todos WHERE user_id = authenticated_user.id
  RETURN todos

ENDPOINT POST /todos
  AUTHENTICATE user
  VALIDATE todo data
  CREATE todo with user_id = authenticated_user.id
  RETURN created todo

ENDPOINT PUT /todos/:id
  AUTHENTICATE user
  FIND todo by id
  IF todo.user_id != authenticated_user.id
    RETURN 403 Forbidden
  
  UPDATE todo
  RETURN updated todo

ENDPOINT DELETE /todos/:id
  AUTHENTICATE user
  FIND todo by id
  IF todo.user_id != authenticated_user.id
    RETURN 403 Forbidden
  
  DELETE todo
  RETURN 204 No Content

// 6. Error Handling
MIDDLEWARE errorHandler
  LOG error
  RETURN appropriate error response
```

### Phase 3: Architecture (Architect Agent)

**Input:** Specification + Pseudocode

**Output:**
```markdown
# Todo API Architecture

## System Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  API Layer  │
│  (Express)  │
└──────┬──────┘
       │
       ├──→ Auth Middleware
       ├──→ Validation Middleware
       ├──→ Rate Limiter
       │
       ↓
┌─────────────────────────────┐
│     Business Logic          │
│  ┌────────┐   ┌──────────┐ │
│  │  Auth  │   │   Todos  │ │
│  │ Service│   │  Service │ │
│  └────────┘   └──────────┘ │
└──────────┬──────────────────┘
           │
           ↓
┌──────────────────┐
│   Data Layer     │
│  (PostgreSQL)    │
└──────────────────┘
```

## Directory Structure

```
src/
├── app.js              # Express app setup
├── server.js           # Server entry point
├── config/
│   ├── database.js     # DB configuration
│   └── jwt.js          # JWT configuration
├── middleware/
│   ├── auth.js         # Authentication middleware
│   ├── validator.js    # Input validation
│   └── errorHandler.js # Error handling
├── routes/
│   ├── auth.js         # Auth routes
│   └── todos.js        # Todo routes
├── controllers/
│   ├── authController.js
│   └── todoController.js
├── services/
│   ├── authService.js
│   └── todoService.js
├── models/
│   ├── User.js
│   └── Todo.js
└── utils/
    ├── hash.js         # Password hashing
    └── jwt.js          # JWT utilities
```

## Component Interactions

1. Request Flow:
   Client → Routes → Middleware → Controller → Service → Model → Database

2. Authentication Flow:
   Login → authService → JWT generation → Return token
   Protected Route → auth middleware → Verify token → Proceed

3. Todo Operations:
   Request → Auth check → Validate input → todoService → Database → Response

## Security Layers
1. HTTPS (production)
2. JWT authentication
3. Input validation
4. SQL injection prevention (parameterized queries)
5. Rate limiting
6. CORS configuration

## Scalability Considerations
- Stateless authentication (JWT)
- Database indexing (user_id, created_at)
- Connection pooling
- Caching strategy (Redis optional)
```

### Phase 4: Refinement (Coder + Tester - Parallel)

**Coder Agent Output:**

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;
```

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
```

**Tester Agent Output:**

```javascript
// tests/auth.test.js
describe('Authentication', () => {
  test('Register new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  test('Login with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('Reject invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword'
      });
    
    expect(response.status).toBe(401);
  });
});

// tests/todos.test.js
describe('Todo Operations', () => {
  let authToken;

  beforeAll(async () => {
    // Get auth token
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'SecurePass123!' });
    authToken = response.body.token;
  });

  test('Create todo', async () => {
    const response = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Todo',
        description: 'Test description'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Todo');
  });

  test('Get user todos', async () => {
    const response = await request(app)
      .get('/todos')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Reject unauthenticated request', async () => {
    const response = await request(app)
      .get('/todos');
    
    expect(response.status).toBe(401);
  });
});
```

### Phase 5: Completion (Reviewer Agent)

**Input:** Implementation + Tests from Phase 4

**Output:**

```markdown
# Code Review Report

## ✅ Strengths

1. **Security**
   - JWT authentication properly implemented
   - Password hashing with bcrypt
   - Rate limiting in place
   - Helmet.js for security headers

2. **Architecture**
   - Clean separation of concerns
   - Middleware pattern well-used
   - RESTful endpoint design
   - Proper error handling

3. **Testing**
   - Good coverage of auth flows
   - Todo CRUD operations tested
   - Edge cases considered
   - Auth rejection tested

## ⚠️ Recommendations

1. **Environment Variables**
   - Add validation for required env vars
   - Document all env vars needed
   - Add .env.example file

2. **Error Messages**
   - Consider more detailed error responses
   - Add error codes for client handling
   - Log errors for debugging

3. **Database**
   - Add database migration files
   - Include connection pooling config
   - Add indexes on frequently queried fields

4. **Tests**
   - Add integration tests for full workflows
   - Test rate limiting behavior
   - Add performance tests
   - Test edge cases (long inputs, special chars)

5. **Documentation**
   - Add API documentation (Swagger/OpenAPI)
   - Include setup instructions
   - Add deployment guide
   - Document rate limits

## 🔧 Required Changes

1. Add input validation for:
   - Email format
   - Password strength
   - Todo title length
   - Description length

2. Implement:
   - Proper logging (Winston/Morgan)
   - Database migrations
   - Health check endpoint

3. Security improvements:
   - Add CSRF protection
   - Implement refresh tokens
   - Add account lockout after failed attempts

## Overall Assessment

**Quality Score: 85/100**

The implementation follows best practices and has a solid foundation. 
With the recommended improvements, this would be production-ready.

**Status: APPROVED WITH MINOR REVISIONS**
```

## Execution Flow Visualization

```
Start
  │
  ├─► [1. SPECIFICATION]
  │   └─► Architect defines requirements
  │       └─► Output: Detailed spec document
  │
  ├─► [2. PSEUDOCODE]
  │   └─► Coder creates implementation logic
  │       └─► Input: Spec from phase 1
  │       └─► Output: Pseudocode algorithms
  │
  ├─► [3. ARCHITECTURE]
  │   └─► Architect designs system structure
  │       └─► Input: Spec + Pseudocode
  │       └─► Output: Architecture diagram + structure
  │
  ├─► [4. REFINEMENT] ◄─── Parallel Execution
  │   ├─► Coder implements features
  │   │   └─► Input: Architecture
  │   │   └─► Output: Working code
  │   │
  │   └─► Tester creates test suite
  │       └─► Input: Architecture
  │       └─► Output: Test cases
  │
  └─► [5. COMPLETION]
      └─► Reviewer validates everything
          └─► Input: Code + Tests
          └─► Output: Review report + approval
          └─► Status: APPROVED/NEEDS_REVISION
```

## Running This Example

```bash
# Full SPARC workflow
claude-flow run fullstack-dev --mode sparc --verbose

# View results
claude-flow memory --stats

# Check coordination history
sqlite3 data/memory.db "SELECT * FROM coordination_logs ORDER BY timestamp DESC LIMIT 10"
```

## Learning Points

1. **SPARC ensures quality** - Each phase builds on previous work
2. **Parallel refinement** - Coder and Tester work simultaneously
3. **Multiple reviews** - Architect involved in phases 1, 3, and approves phase 5
4. **Documentation** - Each phase produces clear documentation
5. **Iterative** - Can loop back if reviewer finds issues

## Next Steps

After SPARC completion:
1. Address reviewer feedback
2. Run the workflow again if major changes needed
3. Deploy using the architecture documentation
4. Monitor and iterate based on real usage
