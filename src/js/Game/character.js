/* Inherits from Entity, has an Experience bar, knows which Zone it is in. Forced to start at level 1 because of the variable component in its stats growth */
function Character(archetype, level, name) {
  Entity.call(this, archetype, level, name);

  this.exp = 0;
  this.currentZone = null;
}

Character.prototype = Object.create(Entity.prototype);
Character.prototype.constructor = Character;

/* Changes the Zone it is currently in. If it's a hostile Zone, initiates a fight, else recovers full stats */
Character.prototype.moveTo = function(zone) {
  this.currentZone = zone;
  console.log(this.archetype.name + ' moves to ' + zone.name);

  /* Used to disabled the "Adventure" button while already fighting */
  App.Observer.emit('zoneChanged', zone.fight);

  if (zone.fight) {
    setTimeout(this.fight.bind(this), 1000);
  }
  else {
    this.recover();
  }
};

/* Restores all stats to its max value */
Character.prototype.recover = function() {
  console.log(this.archetype.name + ' recovers fully');
  var self = this;

  config.stats.forEach(function(statName) {
    self.stats[statName].toMax();
  });
};

/* Resets the Experience bar to 0, increments level, earn variable stats progression */
Character.prototype.levelUp = function() {
  self.exp = 0; // Animation de barre d'xp
  Entity.prototype.levelUp.call(this);
};

/* Gets diminishing return for similar enemies, scaling down with level. Capped at 100 exp by fight (one full level) */
Character.prototype.calcExp = function(enemy) {
  var exp = Math.ceil(enemy.expValue * enemy.level / this.level);
  return Math.min(exp, 100); // Max one full level
};

/* Adds experience to the current experience bar. At 100, causes a level up. Leveling up doesn't reduce the remaning experience earned to ease calculations */
Character.prototype.earnExp = function(expEarned) {
  console.log(this.archetype.name + ' earns ' + expEarned + ' exp');
  var expToLevelUp = 100 - this.exp;
  var expConsumed = Math.min(expEarned, expToLevelUp);

  if (expEarned < expToLevelUp) {
    this.exp += expEarned; // Animation de barre d'xp
  }
  else {
    this.exp = 100; // Animation de barre d'xp
    this.levelUp();

    var expRemaining = expEarned - expToLevelUp;
    this.exp = expRemaining; // Animation de barre d'xp
  }
};