import { describe, it, expect } from "vitest";
import { Character } from "../src/character.js";

describe("Character creation", () => {
  it("starts with 1000 health", () => {
    const character = new Character();

    expect(character.health).toBe(1000);
  });

  it("starts alive", () => {
    const character = new Character();

    expect(character.isAlive).toBe(true);
  });
});

describe("Dealing damage", () => {
  it("reduces the target's health by the damage amount", () => {
    const attacker = new Character();
    const target = new Character();

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(900);
  });

  it("brings health to 0 and kills the target when damage exceeds current health", () => {
    const attacker = new Character();
    const target = new Character();

    attacker.dealDamage(target, 1500);

    expect(target.health).toBe(0);
    expect(target.isAlive).toBe(false);
  });

  it("throws when a character deals damage to itself", () => {
    const character = new Character();

    expect(() => character.dealDamage(character, 100)).toThrow();
  });
});

describe("Healing", () => {
  it("increases the character's own health by the heal amount", () => {
    const character = new Character();
    const other = new Character();
    other.dealDamage(character, 300);

    character.heal(100);

    expect(character.health).toBe(800);
  });

  it("caps health at 1000 when healing would exceed the maximum", () => {
    const character = new Character();
    const other = new Character();
    other.dealDamage(character, 100);

    character.heal(500);

    expect(character.health).toBe(1000);
  });

  it("throws when a dead character tries to heal", () => {
    const character = new Character();
    const other = new Character();
    other.dealDamage(character, 1000);

    expect(() => character.heal(100)).toThrow();
  });
});
