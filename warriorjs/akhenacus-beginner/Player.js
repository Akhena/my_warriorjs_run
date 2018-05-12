class Player {
  constructor() {
    this.MAX_HEALTH = 20;    
  }

  playTurn(warrior) {
    if (this.isHostileAhead(warrior)) {
      warrior.attack();
    } else if (this.needsRest(warrior)) {
      warrior.rest();
    } else warrior.walk();    
  }

  needsRest(warrior) {
    if (warrior.health() < (this.MAX_HEALTH)) {
      return true;
    }
    return false;
  }

  isHostileAhead(warrior) {
    return !warrior.feel().isEmpty();
  }
}
