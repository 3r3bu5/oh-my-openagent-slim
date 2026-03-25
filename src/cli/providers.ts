import { DEFAULT_AGENT_MCPS } from '../config/agent-mcps';
import { RECOMMENDED_SKILLS } from './skills';
import type { InstallConfig } from './types';

// Model mappings by provider - only 4 supported providers
export const MODEL_MAPPINGS = {
  openai: {
    Ra: { model: 'openai/gpt-5.4' },
    Oracle: { model: 'openai/gpt-5.4', variant: 'high' },
    Thoth: { model: 'openai/gpt-5.4-mini', variant: 'low' },
    Horus: { model: 'openai/gpt-5.4-mini', variant: 'low' },
    Bastet: { model: 'openai/gpt-5.4-mini', variant: 'medium' },
    Anubis: { model: 'openai/gpt-5.4-mini', variant: 'low' },
  },
  kimi: {
    Ra: { model: 'kimi-for-coding/k2p5' },
    Oracle: { model: 'kimi-for-coding/k2p5', variant: 'high' },
    Thoth: { model: 'kimi-for-coding/k2p5', variant: 'low' },
    Horus: { model: 'kimi-for-coding/k2p5', variant: 'low' },
    Bastet: { model: 'kimi-for-coding/k2p5', variant: 'medium' },
    Anubis: { model: 'kimi-for-coding/k2p5', variant: 'low' },
  },
  copilot: {
    Ra: { model: 'github-copilot/claude-opus-4.6' },
    Oracle: { model: 'github-copilot/claude-opus-4.6', variant: 'high' },
    Thoth: { model: 'github-copilot/grok-code-fast-1', variant: 'low' },
    Horus: { model: 'github-copilot/grok-code-fast-1', variant: 'low' },
    Bastet: {
      model: 'github-copilot/gemini-3.1-pro-preview',
      variant: 'medium',
    },
    Anubis: { model: 'github-copilot/claude-sonnet-4.6', variant: 'low' },
  },
  'zai-plan': {
    Ra: { model: 'zai-coding-plan/glm-5' },
    Oracle: { model: 'zai-coding-plan/glm-5', variant: 'high' },
    Thoth: { model: 'zai-coding-plan/glm-5', variant: 'low' },
    Horus: { model: 'zai-coding-plan/glm-5', variant: 'low' },
    Bastet: { model: 'zai-coding-plan/glm-5', variant: 'medium' },
    Anubis: { model: 'zai-coding-plan/glm-5', variant: 'low' },
  },
} as const;

export function generateLiteConfig(
  installConfig: InstallConfig,
): Record<string, unknown> {
  const config: Record<string, unknown> = {
    preset: 'openai',
    presets: {},
  };

  const createAgentConfig = (
    agentName: string,
    modelInfo: { model: string; variant?: string },
  ) => {
    const isOrchestrator = agentName === 'Ra';

    const skills = isOrchestrator
      ? ['*']
      : RECOMMENDED_SKILLS.filter(
          (s) =>
            s.allowedAgents.includes('*') ||
            s.allowedAgents.includes(agentName),
        ).map((s) => s.skillName);

    if (agentName === 'Bastet' && !skills.includes('agent-browser')) {
      skills.push('agent-browser');
    }

    return {
      model: modelInfo.model,
      variant: modelInfo.variant,
      skills,
      mcps:
        DEFAULT_AGENT_MCPS[agentName as keyof typeof DEFAULT_AGENT_MCPS] ?? [],
    };
  };

  const buildPreset = (mappingName: keyof typeof MODEL_MAPPINGS) => {
    const mapping = MODEL_MAPPINGS[mappingName];
    return Object.fromEntries(
      Object.entries(mapping).map(([agentName, modelInfo]) => [
        agentName,
        createAgentConfig(agentName, modelInfo),
      ]),
    );
  };

  // Always use OpenAI as default
  (config.presets as Record<string, unknown>).openai = buildPreset('openai');

  if (installConfig.hasTmux) {
    config.tmux = {
      enabled: true,
      layout: 'main-vertical',
      main_pane_size: 60,
    };
  }

  return config;
}
