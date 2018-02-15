/* An entity defined by its archetype. Can either be a playable character or a hostile mob */
function Entity(archetype) {
  this.archetype = archetype;
  this.stats = {};

  this.initStats();
}

/* Builds the Entity's stats object from its Archetype at level 1 */
Entity.prototype.initStats = function() {
  var self = this;

  config.stats.forEach(function(statName) {
    var stat = self.archetype.stats[statName].baseValue;
    var entityStat = new EntityStat(stat);
    self.stats[statName] = entityStat;
  });
};

/* Determine the amount of damage (can't be less than zero) and inflict it upon the target of the attack */
Entity.prototype.attack = function(target) {
  var damage = this.stats.atk.currentValue - target.stats.def.currentValue;
  damage = Math.max(damage, 0);
  //console.log(this.archetype.name + ' deals ' + damage);
  target.receiveDamage(damage);
};

/* Lowers the HP of the recipient of an attack */
Entity.prototype.receiveDamage = function(damage) {
  this.stats.hp.decrease(damage);
};

/* Returns a boolean, can be used in conditions */
Entity.prototype.isAlive = function() {
  return (this.stats.hp.currentValue > 0);
};