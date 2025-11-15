const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

/**
 * Memory Manager - Persistent storage for agent interactions
 */
class MemoryManager {
  constructor(dbPath = null) {
    this.dbPath = dbPath || path.join(process.cwd(), 'data', 'memory.db');
    this.db = null;
  }

  /**
   * Initialize the database
   */
  async initialize() {
    // Ensure data directory exists
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        this.createTables()
          .then(() => {
            console.log('💾 Memory system initialized:', this.dbPath);
            resolve();
          })
          .catch(reject);
      });
    });
  }

  /**
   * Create database tables
   */
  async createTables() {
    const tables = [
      // Conversations table
      `CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_name TEXT NOT NULL,
        role TEXT,
        task TEXT,
        result TEXT,
        metadata TEXT,
        timestamp INTEGER
      )`,
      
      // Decisions table
      `CREATE TABLE IF NOT EXISTS decisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workflow TEXT,
        decision_type TEXT,
        context TEXT,
        outcome TEXT,
        timestamp INTEGER
      )`,
      
      // Agent state table
      `CREATE TABLE IF NOT EXISTS agent_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_name TEXT UNIQUE,
        state TEXT,
        last_updated INTEGER
      )`,
      
      // Coordination logs
      `CREATE TABLE IF NOT EXISTS coordination_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_agent TEXT,
        target_agent TEXT,
        message TEXT,
        timestamp INTEGER
      )`
    ];

    for (const sql of tables) {
      await this.run(sql);
    }
  }

  /**
   * Store a conversation
   */
  async storeConversation(agentName, role, task, result, metadata = {}) {
    const sql = `INSERT INTO conversations (agent_name, role, task, result, metadata, timestamp)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    return await this.run(sql, [
      agentName,
      role,
      task,
      JSON.stringify(result),
      JSON.stringify(metadata),
      Date.now()
    ]);
  }

  /**
   * Store a decision
   */
  async storeDecision(workflow, decisionType, context, outcome) {
    const sql = `INSERT INTO decisions (workflow, decision_type, context, outcome, timestamp)
                 VALUES (?, ?, ?, ?, ?)`;
    
    return await this.run(sql, [
      workflow,
      decisionType,
      JSON.stringify(context),
      JSON.stringify(outcome),
      Date.now()
    ]);
  }

  /**
   * Store agent state
   */
  async storeAgentState(agentName, state) {
    const sql = `INSERT OR REPLACE INTO agent_state (agent_name, state, last_updated)
                 VALUES (?, ?, ?)`;
    
    return await this.run(sql, [
      agentName,
      JSON.stringify(state),
      Date.now()
    ]);
  }

  /**
   * Log coordination between agents
   */
  async logCoordination(sourceAgent, targetAgent, message) {
    const sql = `INSERT INTO coordination_logs (source_agent, target_agent, message, timestamp)
                 VALUES (?, ?, ?, ?)`;
    
    return await this.run(sql, [
      sourceAgent,
      targetAgent,
      message,
      Date.now()
    ]);
  }

  /**
   * Get conversations for an agent
   */
  async getConversations(agentName, limit = 10) {
    const sql = `SELECT * FROM conversations 
                 WHERE agent_name = ?
                 ORDER BY timestamp DESC
                 LIMIT ?`;
    
    return await this.all(sql, [agentName, limit]);
  }

  /**
   * Get recent decisions
   */
  async getDecisions(workflow = null, limit = 10) {
    let sql = `SELECT * FROM decisions`;
    const params = [];
    
    if (workflow) {
      sql += ` WHERE workflow = ?`;
      params.push(workflow);
    }
    
    sql += ` ORDER BY timestamp DESC LIMIT ?`;
    params.push(limit);
    
    return await this.all(sql, params);
  }

  /**
   * Get agent state
   */
  async getAgentState(agentName) {
    const sql = `SELECT * FROM agent_state WHERE agent_name = ?`;
    const row = await this.get(sql, [agentName]);
    
    if (row) {
      return {
        ...row,
        state: JSON.parse(row.state)
      };
    }
    
    return null;
  }

  /**
   * Get coordination history
   */
  async getCoordinationHistory(agentName = null, limit = 50) {
    let sql = `SELECT * FROM coordination_logs`;
    const params = [];
    
    if (agentName) {
      sql += ` WHERE source_agent = ? OR target_agent = ?`;
      params.push(agentName, agentName);
    }
    
    sql += ` ORDER BY timestamp DESC LIMIT ?`;
    params.push(limit);
    
    return await this.all(sql, params);
  }

  /**
   * Get memory statistics
   */
  async getStats() {
    const conversations = await this.get('SELECT COUNT(*) as count FROM conversations');
    const decisions = await this.get('SELECT COUNT(*) as count FROM decisions');
    const agents = await this.get('SELECT COUNT(*) as count FROM agent_state');
    
    // Get database file size
    let size = 0;
    try {
      const stats = fs.statSync(this.dbPath);
      size = stats.size;
    } catch (e) {
      // Ignore
    }
    
    return {
      conversations: conversations.count,
      decisions: decisions.count,
      agents: agents.count,
      size
    };
  }

  /**
   * Clear all memory (use with caution)
   */
  async clear() {
    const tables = ['conversations', 'decisions', 'agent_state', 'coordination_logs'];
    
    for (const table of tables) {
      await this.run(`DELETE FROM ${table}`);
    }
  }

  /**
   * Helper: Run a SQL command
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  /**
   * Helper: Get a single row
   */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Helper: Get all rows
   */
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Close the database connection
   */
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = { MemoryManager };
