class Player {
  constructor() {
    this.MAX_HEALTH = 20;
    this.lastTurnHealth = 20;  
  }

  playTurn(warrior) {
    if (this.isHostileAhead(warrior)) {
      warrior.attack();
    } else if (this.needsRest(warrior) && !this.isTakingDamage(warrior)) {
      warrior.rest();
    } else if (this.isCaptiveAhead(warrior)) {
      warrior.rescue();
    } else warrior.walk();

    this.lastTurnHealth = warrior.health();
  }

  needsRest(warrior) {
    if (warrior.health() < (this.MAX_HEALTH)) {
      return true;
    }
    return false;
  }

  isHostileAhead(warrior) {
    return !warrior.feel().isEmpty() && !warrior.feel().isCaptive();
  }

  isTakingDamage(warrior) {
    return warrior.health() < this.lastTurnHealth;
  }

  isCaptiveAhead(warrior) {
    return warrior.feel().isCaptive();
  }
}
