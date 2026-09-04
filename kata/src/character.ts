const MAX_HEALTH = 1000;

export class Character {
  private currentHealth = MAX_HEALTH;

  get health(): number {
    return this.currentHealth;
  }

  get isAlive(): boolean {
    return this.currentHealth > 0;
  }

  dealDamage(target: Character, amount: number): void {
    if (target === this) {
      throw new Error("A character cannot deal damage to itself");
    }
    target.receiveDamage(amount);
  }

  heal(amount: number): void {
    if (!this.isAlive) {
      throw new Error("A dead character cannot heal");
    }
    this.currentHealth = Math.min(MAX_HEALTH, this.currentHealth + amount);
  }

  private receiveDamage(amount: number): void {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
  }
}
