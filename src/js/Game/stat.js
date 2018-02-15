/* A stat that's related to an Archetype rather than an Entity in particular */
function ArchetypeStat(baseValue, fixedGrowth, variableGrowth) {
  this.baseValue = baseValue;
  this.fixedGrowth = fixedGrowth;
  this.variableGrowth = variableGrowth;
}

/* Return the growth upon level up, factoring in a variable part */
ArchetypeStat.prototype.getGrowth = function() {
  var growth = this.fixedGrowth + Math.round(Math.random() * this.variableGrowth);
  return growth;
};

/* A stat that is related to an Entity in particular rather than an Archetype */
function EntityStat(value) {
  this.maxValue = value;
  this.currentValue = value;
}

/* When the max value for a stat increases, the current value gets increased by the same amount */
EntityStat.prototype.increaseMax = function(amount) {
  this.maxValue += amount;
  this.currentValue += amount;
};

/* When a stat gets raised, it can't exceed its max value */
EntityStat.prototype.increase = function(amount) {
  var newValue = this.currentValue + amount;
  this.currentValue = Math.min(newValue, this.maxValue);
};

/* When a stat gets lowered, it can't go below zero */
EntityStat.prototype.decrease = function(amount) {
  var newValue = this.currentValue - amount;
  this.currentValue = Math.max(newValue, 0);
};