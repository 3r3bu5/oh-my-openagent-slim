import { describe, expect, test } from 'bun:test';
import type { PluginConfig } from '../config';
import { SUBAGENT_NAMES } from '../config';
import { createAgents, getAgentConfigs, isSubagent } from './index';

describe('agent alias backward compatibility', () => {
  test("applies 'explore' config to 'Horus' agent", () => {
    const config: PluginConfig = {
      agents: {
        explore: { model: 'test/old-explore-model' },
      },
    };
    const agents = createAgents(config);
    const Horus = agents.find((a) => a.name === 'Horus');
    expect(Horus).toBeDefined();
    expect(Horus?.config.model).toBe('test/old-explore-model');
  });

  test("applies 'frontend-ui-ux-engineer' config to 'Bastet' agent", () => {
    const config: PluginConfig = {
      agents: {
        'frontend-ui-ux-engineer': { model: 'test/old-frontend-model' },
      },
    };
    const agents = createAgents(config);
    const Bastet = agents.find((a) => a.name === 'Bastet');
    expect(Bastet).toBeDefined();
    expect(Bastet?.config.model).toBe('test/old-frontend-model');
  });

  test('new name takes priority over old alias', () => {
    const config: PluginConfig = {
      agents: {
        explore: { model: 'old-model' },
        Horus: { model: 'new-model' },
      },
    };
    const agents = createAgents(config);
    const Horus = agents.find((a) => a.name === 'Horus');
    expect(Horus?.config.model).toBe('new-model');
  });

  test('new agent names work directly', () => {
    const config: PluginConfig = {
      agents: {
        Horus: { model: 'direct-Horus' },
        Bastet: { model: 'direct-Bastet' },
      },
    };
    const agents = createAgents(config);
    expect(agents.find((a) => a.name === 'Horus')?.config.model).toBe(
      'direct-Horus',
    );
    expect(agents.find((a) => a.name === 'Bastet')?.config.model).toBe(
      'direct-Bastet',
    );
  });

  test('temperature override via old alias', () => {
    const config: PluginConfig = {
      agents: {
        explore: { temperature: 0.5 },
      },
    };
    const agents = createAgents(config);
    const Horus = agents.find((a) => a.name === 'Horus');
    expect(Horus?.config.temperature).toBe(0.5);
  });

  test('variant override via old alias', () => {
    const config: PluginConfig = {
      agents: {
        explore: { variant: 'low' },
      },
    };
    const agents = createAgents(config);
    const Horus = agents.find((a) => a.name === 'Horus');
    expect(Horus?.config.variant).toBe('low');
  });
});

describe('fixer agent fallback', () => {
  test('Anubis inherits Thoth model when no Anubis config provided', () => {
    const config: PluginConfig = {
      agents: {
        Thoth: { model: 'Thoth-custom-model' },
      },
    };
    const agents = createAgents(config);
    const Anubis = agents.find((a) => a.name === 'Anubis');
    const Thoth = agents.find((a) => a.name === 'Thoth');
    expect(Anubis?.config.model).toBe(Thoth?.config.model);
  });

  test('Anubis uses its own model when explicitly configured', () => {
    const config: PluginConfig = {
      agents: {
        Thoth: { model: 'Thoth-model' },
        Anubis: { model: 'Anubis-specific-model' },
      },
    };
    const agents = createAgents(config);
    const Anubis = agents.find((a) => a.name === 'Anubis');
    expect(Anubis?.config.model).toBe('Anubis-specific-model');
  });
});

describe('Ra agent', () => {
  test('Ra is first in agents array', () => {
    const agents = createAgents();
    expect(agents[0].name).toBe('Ra');
  });

  test('Ra has question permission set to allow', () => {
    const agents = createAgents();
    const Ra = agents.find((a) => a.name === 'Ra');
    expect(Ra?.config.permission).toBeDefined();
    expect((Ra?.config.permission as any).question).toBe('allow');
  });

  test('Ra accepts overrides', () => {
    const config: PluginConfig = {
      agents: {
        Ra: { model: 'custom-Ra-model', temperature: 0.3 },
      },
    };
    const agents = createAgents(config);
    const Ra = agents.find((a) => a.name === 'Ra');
    expect(Ra?.config.model).toBe('custom-Ra-model');
    expect(Ra?.config.temperature).toBe(0.3);
  });

  test('Ra accepts variant override', () => {
    const config: PluginConfig = {
      agents: {
        Ra: { variant: 'high' },
      },
    };
    const agents = createAgents(config);
    const Ra = agents.find((a) => a.name === 'Ra');
    expect(Ra?.config.variant).toBe('high');
  });

  test('Ra stores model array with per-model variants in _modelArray', () => {
    const config: PluginConfig = {
      agents: {
        Ra: {
          model: [
            { id: 'google/gemini-3-pro', variant: 'high' },
            { id: 'github-copilot/claude-3.5-haiku' },
            'openai/gpt-4',
          ],
        },
      },
    };
    const agents = createAgents(config);
    const Ra = agents.find((a) => a.name === 'Ra');
    expect(Ra?._modelArray).toEqual([
      { id: 'google/gemini-3-pro', variant: 'high' },
      { id: 'github-copilot/claude-3.5-haiku' },
      { id: 'openai/gpt-4' },
    ]);
    expect(Ra?.config.model).toBeUndefined();
  });
});

describe('per-model variant in array config', () => {
  test('subagent stores model array with per-model variants', () => {
    const config: PluginConfig = {
      agents: {
        Horus: {
          model: [
            { id: 'google/gemini-3-flash', variant: 'low' },
            'openai/gpt-4o-mini',
          ],
        },
      },
    };
    const agents = createAgents(config);
    const Horus = agents.find((a) => a.name === 'Horus');
    expect(Horus?._modelArray).toEqual([
      { id: 'google/gemini-3-flash', variant: 'low' },
      { id: 'openai/gpt-4o-mini' },
    ]);
    expect(Horus?.config.model).toBeUndefined();
  });

  test('top-level variant preserved alongside per-model variants', () => {
    const config: PluginConfig = {
      agents: {
        Ra: {
          model: [
            { id: 'google/gemini-3-pro', variant: 'high' },
            'openai/gpt-4',
          ],
          variant: 'low',
        },
      },
    };
    const agents = createAgents(config);
    const Ra = agents.find((a) => a.name === 'Ra');
    // top-level variant still set as default
    expect(Ra?.config.variant).toBe('low');
    // per-model variants stored in _modelArray
    expect(Ra?._modelArray?.[0]?.variant).toBe('high');
    expect(Ra?._modelArray?.[1]?.variant).toBeUndefined();
  });
});

describe('skill permissions', () => {
  test('Ra gets cartography skill allowed by default', () => {
    const agents = createAgents();
    const Ra = agents.find((a) => a.name === 'Ra');
    expect(Ra).toBeDefined();
    const skillPerm = (Ra?.config.permission as Record<string, unknown>)
      ?.skill as Record<string, string>;
    // Ra gets wildcard allow (from RECOMMENDED_SKILLS wildcard entry)
    expect(skillPerm?.['*']).toBe('allow');
    // CUSTOM_SKILLS loop must also add a named cartography entry for Ra
    expect(skillPerm?.cartography).toBe('allow');
  });

  test('Horus gets cartography skill allowed by default', () => {
    const agents = createAgents();
    const Horus = agents.find((a) => a.name === 'Horus');
    expect(Horus).toBeDefined();
    const skillPerm = (Horus?.config.permission as Record<string, unknown>)
      ?.skill as Record<string, string>;
    expect(skillPerm?.cartography).toBe('allow');
  });

  test('Oracle gets requesting-code-review skill allowed by default', () => {
    const agents = createAgents();
    const Oracle = agents.find((a) => a.name === 'Oracle');
    expect(Oracle).toBeDefined();
    const skillPerm = (Oracle?.config.permission as Record<string, unknown>)
      ?.skill as Record<string, string>;
    expect(skillPerm?.['requesting-code-review']).toBe('allow');
  });
});

describe('isSubagent type guard', () => {
  test('returns true for valid subagent names', () => {
    expect(isSubagent('Horus')).toBe(true);
    expect(isSubagent('Thoth')).toBe(true);
    expect(isSubagent('Oracle')).toBe(true);
    expect(isSubagent('Bastet')).toBe(true);
    expect(isSubagent('Anubis')).toBe(true);
  });

  test('returns false for Ra', () => {
    expect(isSubagent('Ra')).toBe(false);
  });

  test('returns false for invalid agent names', () => {
    expect(isSubagent('invalid-agent')).toBe(false);
    expect(isSubagent('')).toBe(false);
    expect(isSubagent('explore')).toBe(false); // old alias, not actual agent name
  });
});

describe('agent classification', () => {
  test('SUBAGENT_NAMES excludes Ra', () => {
    expect(SUBAGENT_NAMES).not.toContain('Ra');
    expect(SUBAGENT_NAMES).toContain('Horus');
    expect(SUBAGENT_NAMES).toContain('Anubis');
  });

  test('getAgentConfigs applies correct classification visibility and mode', () => {
    const configs = getAgentConfigs();

    // Primary agent
    expect(configs.Ra.mode).toBe('primary');

    // Subagents
    for (const name of SUBAGENT_NAMES) {
      expect(configs[name].mode).toBe('subagent');
    }
  });
});

describe('createAgents', () => {
  test('creates all agents without config', () => {
    const agents = createAgents();
    const names = agents.map((a) => a.name);
    expect(names).toContain('Ra');
    expect(names).toContain('Horus');
    expect(names).toContain('Bastet');
    expect(names).toContain('Oracle');
    expect(names).toContain('Thoth');
    expect(names).toContain('Anubis');
  });

  test('creates exactly 6 agents (1 primary + 5 subagents)', () => {
    const agents = createAgents();
    expect(agents.length).toBe(6);
  });
});

describe('getAgentConfigs', () => {
  test('returns config record keyed by agent name', () => {
    const configs = getAgentConfigs();
    expect(configs.Ra).toBeDefined();
    expect(configs.Horus).toBeDefined();
    // Ra has no hardcoded default model; resolved at runtime via
    // chat.message hook when _modelArray is configured, or left to the user
    expect(configs.Horus.model).toBeDefined();
  });

  test('includes description in SDK config', () => {
    const configs = getAgentConfigs();
    expect(configs.Ra.description).toBeDefined();
    expect(configs.Horus.description).toBeDefined();
  });
});
