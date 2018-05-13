class Player {
  constructor() {
    this.MAX_HEALTH = 20;
    this.HEALING_THREASHOLD = 0.5;  //warrior needs to rest when HP belown 80%

    this.lastTurnHealth = this.MAX_HEALTH;
    this.allDirections = ["forward", "backward", "left", "right"];
    this.turnNumber = 0;
  }

  playTurn(warrior) {
    /*if (this.turnNumber == 0) {
      warrior.walk("backward");
    } else */if (this.isTakingDamage && this.isLiveCritical(warrior)) {
      /* prioritize retreat when health critical */
      this.retreat(warrior);
    } else if (this.isTakingDamage && (this.getHostileAround(warrior) != undefined 
                                        && this.getHostileAround(warrior) != "forward")) {
      /* check if we don't need rotating to face the supposed attacking enemy */
      this.faceEnemy(warrior);
    } else if (this.isHealing(warrior) && warrior.health() < this.MAX_HEALTH) {
      /* once warrior starts healing, he will heal until full health */
      warrior.rest();
    } else if (this.getHostileAround(warrior) != undefined) {
      /* if an enemy stands next to warrior, he will atack it */
      warrior.attack(this.getHostileAround(warrior));
    } else if (this.isEnemyInSight(warrior)
      && !this.isTakingDamage(warrior)) {
      /* otherwise we try to range attack ONLY if not being attacked*/
      warrior.shoot();
    } else if (this.needsRest(warrior) 
      && !this.isTakingDamage(warrior)
      && !this.isEnemyInSight(warrior)) {
      /* if not taking damage and health below threshold and not enemy in danger reach,
       warrior will heal */
      warrior.rest();
    } else if (this.getCaptiveAround(warrior) != undefined) {
      /* if a captive is around, warrior will rescue him */
      warrior.rescue(this.getCaptiveAround(warrior));
    } else if (this.isCaptiveInSightBehind(warrior)) {
      /* if a captive is behind, move in his direction */
      warrior.pivot();
    } else this.moveInBestDirection(warrior);

    this.lastTurnHealth = warrior.health();
    this.turnNumber++;
  }

  moveInBestDirection(warrior) {
    /*if (this.isTakingDamage(warrior)) warrior.walk("backward");
    else */
    if (warrior.feel().isWall()) {
      warrior.pivot();
    } else warrior.walk();
  }

  needsRest(warrior) {
    if (warrior.health() < (this.MAX_HEALTH * this.HEALING_THREASHOLD)) {
      return true;
    }
    return false;
  }

  getHostileAround(warrior) {
    var foundDirection = this.allDirections.find(
      direction => {
        return (!warrior.feel(direction).isEmpty() 
        && !warrior.feel(direction).isWall()
        && !warrior.feel(direction).isCaptive())
      });
    return foundDirection;
  }

  faceEnemy(warrior) {
    var foundDirection = this.getHostileAround(warrior);
    if (foundDirection != "forward") {
      warrior.pivot(foundDirection);
      return true;
    }
    return false;
  }

  isEnemyInSight(warrior) {
    const unit = warrior.look().find(space => !space.isEmpty());
    return unit && unit.isEnemy();
  }

  isCaptiveInSightBehind(warrior) {
    const unit = warrior.look("backward").find(space => !space.isEmpty());
    return unit && unit.isCaptive();
  }

  isTakingDamage(warrior) {
    return warrior.health() < this.lastTurnHealth;
  }

  isHealing(warrior) {
    return warrior.health() > this.lastTurnHealth;
  }

  getCaptiveAround(warrior) {
    var foundDirection = this.allDirections.find(
      direction => {
        return (!warrior.feel(direction).isEmpty()
        && warrior.feel(direction).isCaptive());
      });
    return foundDirection;
  }

  isLiveCritical(warrior) {
    return warrior.health() < (this.MAX_HEALTH / 4);
  }

  retreat(warrior) {
    if (warrior.feel("backward").isEmpty()) {
      warrior.walk("backward");
    } else {
      warrior.rest();
    }
  }


}
