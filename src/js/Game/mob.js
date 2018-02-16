/* Inherits from Entity, has a level and an experience value it grants upon being defeated */
function Mob(archetype, level, name) {
  Entity.call(this, archetype, level, name);

  this.expValue = this.calcExpValue();
}

Mob.prototype = Object.create(Entity.prototype);
Mob.prototype.constructor = Mob;

/* Sets experience value from total stats. Grants this much experience to a character defeating it (decreased by the character's level) */
Mob.prototype.calcExpValue = function() {
  var self = this;
  var totalStats = 0;

  config.stats.forEach(function(statName) {
    totalStats += self.stats[statName].maxValue;
  });

  return Math.ceil(totalStats / 50);
};