// Agent names
export const AGENT_ALIASES: Record<string, string> = {
  explore: 'Horus',
  explorer: 'Horus',
  librarian: 'Thoth',
  oracle: 'Oracle',
  designer: 'Bastet',
  fixer: 'Anubis',
  orchestrator: 'Ra',
  'frontend-ui-ux-engineer': 'Bastet',
};

export const SUBAGENT_NAMES = [
  'Horus',
  'Thoth',
  'Oracle',
  'Bastet',
  'Anubis',
] as const;

export const ORCHESTRATOR_NAME = 'Ra' as const;

export const ALL_AGENT_NAMES = [ORCHESTRATOR_NAME, ...SUBAGENT_NAMES] as const;

// Agent name type (for use in DEFAULT_MODELS)
export type AgentName = (typeof ALL_AGENT_NAMES)[number];

// Subagent delegation rules: which agents can spawn which subagents
// Ra: can spawn all subagents (full delegation)
// Anubis: leaf node — prompt forbids delegation; use grep/glob for lookups
// Bastet: can spawn Horus (for research during design)
// Horus/Thoth/Oracle: cannot spawn any subagents (leaf nodes)
// Unknown agent types not listed here default to Horus-only access
export const SUBAGENT_DELEGATION_RULES: Record<AgentName, readonly string[]> = {
  Ra: SUBAGENT_NAMES,
  Anubis: [],
  Bastet: [],
  Horus: [],
  Thoth: [],
  Oracle: [],
};

// Default models for each agent
// Ra is undefined so its model is fully resolved at runtime via priority fallback
export const DEFAULT_MODELS: Record<AgentName, string | undefined> = {
  Ra: undefined,
  Oracle: 'openai/gpt-5.4',
  Thoth: 'openai/gpt-5.4-mini',
  Horus: 'openai/gpt-5.4-mini',
  Bastet: 'openai/gpt-5.4-mini',
  Anubis: 'openai/gpt-5.4-mini',
};

// Polling configuration
export const POLL_INTERVAL_MS = 500;
export const POLL_INTERVAL_SLOW_MS = 1000;
export const POLL_INTERVAL_BACKGROUND_MS = 2000;

// Timeouts
export const DEFAULT_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
export const MAX_POLL_TIME_MS = 5 * 60 * 1000; // 5 minutes
export const FALLBACK_FAILOVER_TIMEOUT_MS = 15_000;

// Polling stability
export const STABLE_POLLS_THRESHOLD = 3;
