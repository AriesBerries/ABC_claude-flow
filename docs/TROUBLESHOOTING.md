# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### Problem: `npm install` fails

**Symptoms:**
```
npm ERR! code EACCES
npm ERR! syscall access
```

**Solutions:**

1. **Fix npm permissions** (recommended)
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

2. **Use sudo** (not recommended)
   ```bash
   sudo npm install
   ```

3. **Use nvm** (best practice)
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   npm install
   ```

#### Problem: SQLite3 compilation fails

**Symptoms:**
```
node-pre-gyp ERR! build error
```

**Solutions:**

1. **Install build tools**
   
   On Ubuntu/Debian:
   ```bash
   sudo apt-get update
   sudo apt-get install build-essential python3
   ```
   
   On macOS:
   ```bash
   xcode-select --install
   ```
   
   On Windows:
   ```bash
   npm install --global windows-build-tools
   ```

2. **Use pre-built binaries**
   ```bash
   npm install sqlite3 --build-from-source=false
   ```

### Configuration Issues

#### Problem: "ANTHROPIC_API_KEY not set" error

**Symptoms:**
```
Error: ANTHROPIC_API_KEY not set
```

**Solutions:**

1. **Create .env file**
   ```bash
   echo "ANTHROPIC_API_KEY=your_key_here" > .env
   ```

2. **Verify .env location**
   ```bash
   ls -la .env
   # Should be in project root
   ```

3. **Check .env syntax**
   ```bash
   # Correct
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   
   # Incorrect (no quotes, no spaces)
   ANTHROPIC_API_KEY = "sk-ant-xxxxx"
   ```

4. **Set environment variable directly**
   ```bash
   export ANTHROPIC_API_KEY=sk-ant-xxxxx
   claude-flow run workflow
   ```

#### Problem: "Invalid API key" error

**Symptoms:**
```
Error: Authentication failed
Status: 401
```

**Solutions:**

1. **Verify key is correct**
   - Check for extra spaces
   - Ensure complete key copied
   - Verify key hasn't expired

2. **Generate new key**
   - Visit [Anthropic Console](https://console.anthropic.com/)
   - Create new API key
   - Update `.env` file

3. **Check API key format**
   ```bash
   # Should start with sk-ant-
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
   ```

### Runtime Issues

#### Problem: "Database locked" error

**Symptoms:**
```
Error: SQLITE_BUSY: database is locked
```

**Solutions:**

1. **Close other instances**
   ```bash
   # Find running instances
   ps aux | grep claude-flow
   
   # Kill if necessary
   kill <PID>
   ```

2. **Remove lock file**
   ```bash
   rm data/memory.db-journal
   ```

3. **Increase timeout**
   ```javascript
   // In src/memory/manager.js
   this.db.configure('busyTimeout', 10000);
   ```

#### Problem: Agent tasks timeout

**Symptoms:**
```
Error: Request timeout after 30000ms
```

**Solutions:**

1. **Increase timeout in config**
   ```json
   {
     "communication": {
       "timeout": 60000
     }
   }
   ```

2. **Break down complex tasks**
   ```bash
   # Instead of one large task
   claude-flow run large-workflow
   
   # Break into smaller workflows
   claude-flow run workflow-part-1
   claude-flow run workflow-part-2
   ```

3. **Use async mode for long tasks**
   ```bash
   claude-flow run long-task --mode async
   ```

#### Problem: Memory fills up quickly

**Symptoms:**
```
Error: ENOSPC: no space left on device
```

**Solutions:**

1. **Clear old memory**
   ```bash
   claude-flow memory --clear
   ```

2. **Configure automatic cleanup**
   ```javascript
   // Implement retention policy
   async cleanOldMemory(days = 30) {
     const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
     await this.run(
       'DELETE FROM conversations WHERE timestamp < ?',
       [cutoff]
     );
   }
   ```

3. **Use external database**
   ```bash
   DB_PATH=/mnt/storage/memory.db claude-flow init
   ```

### Performance Issues

#### Problem: Slow workflow execution

**Symptoms:**
- Workflows take much longer than expected
- High CPU usage
- Slow response times

**Solutions:**

1. **Use parallel mode for independent tasks**
   ```bash
   claude-flow run workflow --mode parallel
   ```

2. **Reduce agent count**
   ```bash
   # Instead of spawning many agents
   claude-flow run workflow --agents coder-1
   ```

3. **Optimize prompts**
   - Make tasks more specific
   - Reduce context size
   - Use appropriate max_tokens

4. **Monitor API rate limits**
   ```bash
   # Check rate limiting in config
   cat config/coordination.json | grep rate_limiting
   ```

#### Problem: High API costs

**Symptoms:**
- Unexpected API charges
- Many API calls for simple tasks

**Solutions:**

1. **Use verbose mode to audit calls**
   ```bash
   claude-flow run workflow --verbose
   ```

2. **Optimize agent prompts**
   - Reduce max_tokens where possible
   - Use more specific instructions
   - Cache common responses

3. **Implement request caching**
   ```javascript
   // Add caching layer for repeated queries
   const cache = new Map();
   if (cache.has(taskKey)) {
     return cache.get(taskKey);
   }
   ```

4. **Monitor usage**
   - Check Anthropic Console regularly
   - Set up usage alerts
   - Review coordination logs

### Workflow Issues

#### Problem: Workflow fails mid-execution

**Symptoms:**
```
Error: Workflow failed at step 3
```

**Solutions:**

1. **Enable checkpointing**
   ```json
   {
     "sparc": {
       "checkpoint_enabled": true
     }
   }
   ```

2. **Use error handling**
   ```javascript
   try {
     await workflow.execute();
   } catch (error) {
     console.error('Workflow failed:', error);
     // Resume from checkpoint
     await workflow.resume(lastCheckpoint);
   }
   ```

3. **Review logs**
   ```bash
   claude-flow run workflow --verbose
   ```

#### Problem: Agents can't communicate

**Symptoms:**
```
Error: Agent communication failed
```

**Solutions:**

1. **Verify agents are registered**
   ```bash
   claude-flow agents
   ```

2. **Check coordination policies**
   ```bash
   cat config/coordination.json
   ```

3. **Ensure proper initialization**
   ```javascript
   await hiveMind.initialize();
   ```

### Platform-Specific Issues

#### macOS Issues

**Problem: Permission denied on CLI**
```bash
chmod +x src/cli.js
```

**Problem: Node version mismatch**
```bash
brew install node@18
brew link node@18
```

#### Windows Issues

**Problem: Path issues**
```powershell
# Use forward slashes or double backslashes
$env:DB_PATH="./data/memory.db"
```

**Problem: Permission errors**
```powershell
# Run as Administrator
# Right-click terminal -> Run as Administrator
```

#### Linux Issues

**Problem: SQLite not found**
```bash
sudo apt-get install sqlite3 libsqlite3-dev
```

**Problem: Node not in PATH**
```bash
export PATH=$PATH:/usr/local/bin
echo 'export PATH=$PATH:/usr/local/bin' >> ~/.bashrc
```

### Debug Mode

Enable detailed debugging:

```bash
# Set debug environment variable
export DEBUG=claude-flow:*
claude-flow run workflow --verbose

# Or use Node.js inspector
node --inspect src/cli.js run workflow
```

### Getting Help

If you can't resolve the issue:

1. **Check existing issues**
   - Visit GitHub Issues
   - Search for similar problems

2. **Gather diagnostic information**
   ```bash
   node --version
   npm --version
   cat .env | grep -v "ANTHROPIC_API_KEY"
   claude-flow memory --stats
   ```

3. **Create a minimal reproduction**
   - Isolate the problem
   - Create smallest example that fails
   - Document steps to reproduce

4. **Open an issue**
   - Include Node.js version
   - Include error messages
   - Include steps to reproduce
   - Include relevant config (redact secrets)

### Emergency Recovery

If the platform is completely broken:

```bash
# 1. Backup current state
cp -r data/ data.backup/
cp .env .env.backup

# 2. Fresh install
rm -rf node_modules/
rm package-lock.json
npm install

# 3. Reset database
rm data/memory.db
claude-flow init

# 4. Restore from backup if needed
cp data.backup/memory.db data/
```

### Performance Monitoring

Track performance metrics:

```bash
# Monitor memory usage
node --max-old-space-size=4096 src/cli.js run workflow

# Profile execution
node --prof src/cli.js run workflow
node --prof-process isolate-*.log > profile.txt

# Monitor API calls
grep "API call" logs/*.log | wc -l
```

## Best Practices to Avoid Issues

1. ✅ Always use latest Node.js LTS version
2. ✅ Keep dependencies updated: `npm update`
3. ✅ Regular backups of `data/` directory
4. ✅ Monitor API usage and costs
5. ✅ Use version control for configs
6. ✅ Test workflows in isolation first
7. ✅ Clear memory periodically
8. ✅ Review logs regularly

## Still Having Issues?

Contact the maintainers:
- GitHub Issues: [Report a bug](https://github.com/AriesBerries/ABC_claude-flow/issues)
- Discussions: [Ask a question](https://github.com/AriesBerries/ABC_claude-flow/discussions)
