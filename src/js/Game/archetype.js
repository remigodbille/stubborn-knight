/* Every Entity has an Archetype that dictates its based stats and growth */
function Archetype(name, stats) {
  this.name = name;
  this.stats = {};

  this.initStats(stats);
}

/* Builds the Archetype's stats object from the config */
Archetype.prototype.initStats = function(stats) {
  var self = this;

  config.stats.forEach(function(statName) {
    var stat = stats[statName];
    var archetypeStat = new ArchetypeStat(stat[0], stat[1], stat[2]);
    self.stats[statName] = archetypeStat;
  });
};