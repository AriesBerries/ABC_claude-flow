#!/bin/bash
# Quick start script for ABC Claude Flow

set -e

echo "🚀 ABC Claude Flow - Quick Start"
echo "================================"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required. Current: $(node -v)"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js $(node -v) detected"

# Check for .env file
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your ANTHROPIC_API_KEY"
    echo "   Get your API key from: https://console.anthropic.com/"
    echo ""
    read -p "Press Enter after you've added your API key to .env, or Ctrl+C to exit..."
fi

# Validate API key is set
if ! grep -q "ANTHROPIC_API_KEY=sk-ant-" .env 2>/dev/null; then
    echo ""
    echo "⚠️  Warning: ANTHROPIC_API_KEY not set in .env"
    echo "   The platform will not work without a valid API key."
    echo ""
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies already installed"
fi

# Initialize platform
echo ""
echo "🔧 Initializing platform..."
node src/cli.js init

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. List available workflows: node src/cli.js workflows"
echo "  2. List available agents: node src/cli.js agents"
echo "  3. Run a workflow: node src/cli.js run fullstack-dev --mode sparc"
echo ""
echo "Documentation:"
echo "  Setup: docs/SETUP.md"
echo "  Security: docs/SECURITY.md"
echo "  Examples: examples/"
echo ""
