/* Inherits from Entity, has a level and an experience value it grants upon being defeated */
function Mob(archetype, level) {
  this.level = level;

  Entity.call(this, archetype);

  this.expValue = this.calcExpValue();
}

Mob.prototype = Object.create(Entity.prototype);
Mob.prototype.constructor = Mob;

/* Builds the Mob's stats object. Override Entity's initStats. Mobs don't have a variable component in their stats growth, so they can easily start at any level */
Mob.prototype.initStats = function() {
  var self = this;

  config.stats.forEach(function(statName) {
    var stat = self.archetype.stats[statName].baseValue;
    stat += self.archetype.stats[statName].fixedGrowth * (self.level - 1);
    var entityStat = new EntityStat(stat);
    self.stats[statName] = entityStat;
  });
};

/* Sets experience value from total stats. Grants this much experience to a character defeating it (decreased by the character's level) */
Mob.prototype.calcExpValue = function() {
  var self = this;
  var totalStats = 0;

  config.stats.forEach(function(statName) {
    totalStats += self.stats[statName].maxValue;
  });

  return Math.ceil(totalStats / 50);
};