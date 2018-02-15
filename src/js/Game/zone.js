/* A Zone that can either be hospitable (e.g. The City) or hostile, in which case a random Mob is spawned based on the Zone's level */
function Zone(name, level, fight) {
  this.name = name;
  this.level = level;
  this.fight = fight;
  this.enemy = null;

  if (this.fight) {
    this.summonEnemy();
  }
}

/* Draws a random Mob Archetype and creates a Mob for this Archetype and the Zone's level */
Zone.prototype.summonEnemy = function() {
  var keys = Object.keys(mobArchetypes);
  var archetype = mobArchetypes[keys[keys.length * Math.random() << 0]];

  this.enemy = new Mob(archetype, this.level);
};