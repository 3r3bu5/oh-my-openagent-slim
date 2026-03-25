# Provider Configurations

oh-my-openagent-slim uses **OpenAI** as the default provider. This document shows how to configure alternative providers by editing your plugin config file.

## Config File Location

Edit `~/.config/opencode/oh-my-openagent-slim.json` (or `.jsonc` for comments support).

## Default: OpenAI

The installer generates this configuration automatically:

```json
{
  "preset": "openai",
  "presets": {
    "openai": {
      "Ra": { "model": "openai/gpt-5.4", "variant": "high", "skills": ["*"], "mcps": ["websearch"] },
      "Oracle": { "model": "openai/gpt-5.4", "variant": "high", "skills": [], "mcps": [] },
      "Thoth": { "model": "openai/gpt-5.4-mini", "variant": "low", "skills": [], "mcps": ["websearch", "context7", "grep_app"] },
      "Horus": { "model": "openai/gpt-5.4-mini", "variant": "low", "skills": [], "mcps": [] },
      "Bastet": { "model": "openai/gpt-5.4-mini", "variant": "medium", "skills": ["agent-browser"], "mcps": [] },
      "Anubis": { "model": "openai/gpt-5.4-mini", "variant": "low", "skills": [], "mcps": [] }
    }
  }
}
```

## Kimi For Coding

To use Kimi, add a `kimi` preset and set it as active:

```json
{
  "preset": "kimi",
  "presets": {
    "kimi": {
      "Ra": { "model": "kimi-for-coding/k2p5", "variant": "high", "skills": ["*"], "mcps": ["websearch"] },
      "Oracle": { "model": "kimi-for-coding/k2p5", "variant": "high", "skills": [], "mcps": [] },
      "Thoth": { "model": "kimi-for-coding/k2p5", "variant": "low", "skills": [], "mcps": ["websearch", "context7", "grep_app"] },
      "Horus": { "model": "kimi-for-coding/k2p5", "variant": "low", "skills": [], "mcps": [] },
      "Bastet": { "model": "kimi-for-coding/k2p5", "variant": "medium", "skills": ["agent-browser"], "mcps": [] },
      "Anubis": { "model": "kimi-for-coding/k2p5", "variant": "low", "skills": [], "mcps": [] }
    }
  }
}
```

Then authenticate:
```bash
opencode auth login
# Select "Kimi For Coding" provider
```

## GitHub Copilot

To use GitHub Copilot with Grok Code Fast:

```json
{
  "preset": "copilot",
  "presets": {
    "copilot": {
      "Ra": { "model": "github-copilot/claude-opus-4.6", "variant": "high", "skills": ["*"], "mcps": ["websearch"] },
      "Oracle": { "model": "github-copilot/claude-opus-4.6", "variant": "high", "skills": [], "mcps": [] },
      "Thoth": { "model": "github-copilot/grok-code-fast-1", "variant": "low", "skills": [], "mcps": ["websearch", "context7", "grep_app"] },
      "Horus": { "model": "github-copilot/grok-code-fast-1", "variant": "low", "skills": [], "mcps": [] },
      "Bastet": { "model": "github-copilot/gemini-3.1-pro-preview", "variant": "medium", "skills": ["agent-browser"], "mcps": [] },
      "Anubis": { "model": "github-copilot/claude-sonnet-4.6", "variant": "low", "skills": [], "mcps": [] }
    }
  }
}
```

Then authenticate:
```bash
opencode auth login
# Select "github-copilot" provider
```

## ZAI Coding Plan

To use ZAI Coding Plan with GLM 5:

```json
{
  "preset": "zai-plan",
  "presets": {
    "zai-plan": {
      "Ra": { "model": "zai-coding-plan/glm-5", "variant": "high", "skills": ["*"], "mcps": ["websearch"] },
      "Oracle": { "model": "zai-coding-plan/glm-5", "variant": "high", "skills": [], "mcps": [] },
      "Thoth": { "model": "zai-coding-plan/glm-5", "variant": "low", "skills": [], "mcps": ["websearch", "context7", "grep_app"] },
      "Horus": { "model": "zai-coding-plan/glm-5", "variant": "low", "skills": [], "mcps": [] },
      "Bastet": { "model": "zai-coding-plan/glm-5", "variant": "medium", "skills": ["agent-browser"], "mcps": [] },
      "Anubis": { "model": "zai-coding-plan/glm-5", "variant": "low", "skills": [], "mcps": [] }
    }
  }
}
```

Then authenticate:
```bash
opencode auth login
# Select "zai-coding-plan" provider
```

## Mixing Providers

You can mix models from different providers across agents. Create a custom preset:

```json
{
  "preset": "my-mix",
  "presets": {
    "my-mix": {
      "Ra": { "model": "openai/gpt-5.4", "skills": ["*"], "mcps": ["websearch"] },
      "Oracle": { "model": "openai/gpt-5.4", "variant": "high", "skills": [], "mcps": [] },
      "Thoth": { "model": "kimi-for-coding/k2p5", "variant": "low", "skills": [], "mcps": ["websearch", "context7", "grep_app"] },
      "Horus": { "model": "github-copilot/grok-code-fast-1", "variant": "low", "skills": [], "mcps": [] },
      "Bastet": { "model": "kimi-for-coding/k2p5", "variant": "medium", "skills": ["agent-browser"], "mcps": [] },
      "Anubis": { "model": "openai/gpt-5.4-mini", "variant": "low", "skills": [], "mcps": [] }
    }
  }
}
```

## Switching Presets

**Method 1: Edit the config file** — Change the `preset` field to match a key in your `presets` object.

**Method 2: Environment variable** (takes precedence over config file):
```bash
export OH_MY_OPENCODE_SLIM_PRESET=my-mix
opencode
```
