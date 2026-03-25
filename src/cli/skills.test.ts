import { describe, expect, it } from 'bun:test';
import { getSkillPermissionsForAgent } from './skills';

describe('skills permissions', () => {
  it('should allow all skills for orchestrator by default', () => {
    const permissions = getSkillPermissionsForAgent('Ra');
    expect(permissions['*']).toBe('allow');
  });

  it('should deny all skills for other agents by default', () => {
    const permissions = getSkillPermissionsForAgent('Bastet');
    expect(permissions['*']).toBe('deny');
  });

  it('should allow recommended skills for specific agents', () => {
    // Designer should have agent-browser allowed
    const designerPerms = getSkillPermissionsForAgent('Bastet');
    expect(designerPerms['agent-browser']).toBe('allow');

    // Developer (orchestrator) should have simplify allowed (and everything else via *)
    const orchPerms = getSkillPermissionsForAgent('Ra');
    expect(orchPerms.simplify).toBe('allow');
  });

  it('should honor explicit skill list overrides', () => {
    // Override with empty list
    const emptyPerms = getSkillPermissionsForAgent('Ra', []);
    expect(emptyPerms['*']).toBe('deny');
    expect(Object.keys(emptyPerms).length).toBe(1);

    // Override with specific list
    const specificPerms = getSkillPermissionsForAgent('Bastet', [
      'my-skill',
      '!bad-skill',
    ]);
    expect(specificPerms['*']).toBe('deny');
    expect(specificPerms['my-skill']).toBe('allow');
    expect(specificPerms['bad-skill']).toBe('deny');
  });

  it('should honor wildcard in explicit list', () => {
    const wildcardPerms = getSkillPermissionsForAgent('Bastet', ['*']);
    expect(wildcardPerms['*']).toBe('allow');
  });
});
