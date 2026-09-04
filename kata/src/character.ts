export class Character {
  health = 1000;
  isAlive = true;

  dealDamage(target: Character, amount: number): void {
    target.health = Math.max(0, target.health - amount);
    if (target.health === 0) {
      target.isAlive = false;
    }
  }

  heal(amount: number): void {
    this.health += amount;
  }
}
