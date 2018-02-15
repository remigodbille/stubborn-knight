var App = App || {};

App.Observer = (function(my) {
/* Event handler for the Observer pattern */

/* Each type of event becomes a property which value is an array of callbacks */
var events = {};

/* Attach a callback to an event */
my.on = function(eventName, fn) {
  events[eventName] = events[eventName] || [];
  events[eventName].push(fn);
};

/* Detach a callback from an event */
my.off = function(eventName, fn) {
  if (events[eventName]) {
    for (var i = 0, len = events[eventName].length; i < len; i++) {
      if (events[eventName][i] === fn) {
        events[eventName].splice(i, 1);
      }
    }
  }
};

/* Execute every callback for an event, with any data passed as parameter */
my.emit = function(eventName, data) {
  if (events[eventName]) {
    events[eventName].forEach(function(fn) {
      fn(data);
    });
  }
};


return my;
})(App.Observer || {});

App.Display = (function(my) {
var views = {};
var dom = {};

initTemplates();
bindEvents();

/* Shows or hides the "Adventure" button whether the character is already fighting or not */
function toggleButtonAdventure(fighting) {
  if (fighting) {
    setView('hp');
  }
  else {
    setView('city');
  }
}

/* Sets the color and size of the health bar as well as the text it contains */
function setHealthBar(data) {
  var ratio = data.hp / data.maxHp;
  var color;
  var container;
  var bar;
  var info;

  if (ratio > 0.5) {
    color = '#0A0';
  }
  else if (ratio > 0.1) {
    color = '#A50';
  }
  else {
    color = '#A00';
  }

  if (data.type === 'character') {
    container = dom['character-hp-container'];
    bar = dom['character-hp-bar'];
    info = dom['character-hp'];
  }
  else {
    container = dom['mob-hp-container'];
    bar = dom['mob-hp-bar'];
    info = dom['mob-hp'];
  }

  bar.style.backgroundColor = color;
  bar.style.width = ratio * container.offsetWidth + 'px';
  info.innerHTML = data.hp + ' / ' + data.maxHp;
}

function cacheDom(element) {
  if (element.id) {
    dom[element.id] = element;
  }
  
  for (var i = 0, length = element.childNodes.length; i < length; i++) {
    cacheDom(element.childNodes[i]);
  }
}

function bindEvents() {
  dom['adventure'].addEventListener('click', function() { App.Observer.emit('buttonAdventureClicked'); });

  App.Observer.on('zoneChanged', toggleButtonAdventure);
  App.Observer.on('hpChanged', setHealthBar);
}

function initTemplates() {
  var templates = document.querySelectorAll('script[type="text/template"]');
  
  templates.forEach(function(template) {
    parseTemplate(template);
  });
}

function parseTemplate(template) {
  if (views[template.id] !== undefined) {
    return views[template.id];
  }
  else {
    var view = document.createElement('div');
    view.innerHTML = template.innerHTML;

    views[template.id] = view;
    cacheDom(view);

    return view;
  }
}

function setView(id) {
  while (frame.firstChild) {
    frame.removeChild(frame.firstChild);
  }
  
  var view = views[id];
  frame.appendChild(view);
}


return my;
})(App.Display || {});

App.Game = (function(my) {
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

/* Inherits from Entity, has an Experience bar, knows which Zone it is in. Forced to start at level 1 because of the variable component in its stats growth */
function Character(archetype) {
  Entity.call(this, archetype);

  this.level = 1;
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
    self.stats[statName].currentValue = self.stats[statName].maxValue;
  });
};

/* Resets the Experience bar to 0, increments level, earn variable stats progression */
Character.prototype.levelUp = function() {
  console.log(this.archetype.name + ' levels up');
  var self = this;
  self.level++;
  self.exp = 0; // Animation de barre d'xp
  console.log(self.archetype.name + ' is now level ' + self.level);

  config.stats.forEach(function(statName) {
    var growth = self.archetype.stats[statName].getGrowth();
    self.stats[statName].increaseMax(growth);
  });
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

var config = {
  stats: ['hp', 'atk', 'def'],
  characterArchetypes: [
    {name: 'knight', stats: {hp: [1000, 50, 15], atk: [150, 10, 3], def: [120, 8, 2]}}
  ],
  mobArchetypes: [
    {name: 'orc', stats: {hp: [800, 45, 0], atk: [180, 12, 0], def: [40, 5, 0]}},
    {name: 'goblin', stats: {hp: [500, 20, 0], atk: [130, 7, 0], def: [45, 6, 0]}}
  ]
};

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

/* Fights a round against the current Zone's enemy */
Character.prototype.fight = function() {
  var character = this;
  var enemy = character.currentZone.enemy;
  var nextZone;
  var eventData;

  console.log(character.archetype.name + ' starts fighting ' + enemy.archetype.name);

  /* The hero strikes first */
  character.attack(enemy);

  eventData = {
    hp: enemy.stats.hp.currentValue,
    maxHp: enemy.stats.hp.maxValue,
    type: 'mob'
  };

  /* Used to update the HP bar in the display */
  App.Observer.emit('hpChanged', eventData);

  /* If the enemy has been slain, gets rewards and prepare to move to the next hostile Zone */
  if (! enemy.isAlive()) {
    console.log('victory');

    var exp = character.calcExp(enemy);
    character.earnExp(exp);
  
    // Get Golds
  
    var nextLevel = character.currentZone.level + 1;
    var nextName = 'the Road ' + nextLevel;
    nextZone = new Zone(nextName, nextLevel, true);
  }
  /* If the enemy is still alive, it strikes back */
  else {
    enemy.attack(character);
  
    eventData = {
      hp: character.stats.hp.currentValue,
      maxHp: character.stats.hp.maxValue,
      type: 'character'
    };
  
    /* Used to update the HP bar in the display */
    App.Observer.emit('hpChanged', eventData);
  
    /* If the enemy slew the hero, head back to the city */
    if (! character.isAlive()) {
      console.log('defeat');
      nextZone = city;
    }
  }

  /* If both opponents are still alive, they go for another round */
  if (character.isAlive() && enemy.isAlive()) {
    setTimeout(character.fight.bind(character), 1000);
  }
  /* If either was slain, proceed to move to the appropriate Zone */
  else {
    character.moveTo(nextZone);
  }
};

var characterArchetypes = {};
var mobArchetypes = {};
var mainCharacter = null;
var city = null;

/* Reads every Playable and Mob Archetypes from the config, creates a single instance for each of them and stores them. Don't recreate any other Archetype instances, use the objects containing them.
Instianciates the hero as well as The City
Binds an event to start adventuring */
my.init = function() {
  config.characterArchetypes.forEach(function(config) {
    var archetype = new Archetype(config.name, config.stats);
    characterArchetypes[archetype.name] = archetype;
  });

  config.mobArchetypes.forEach(function(config) {
    var archetype = new Archetype(config.name, config.stats);
    mobArchetypes[archetype.name] = archetype;
  });

  mainCharacter = new Character(characterArchetypes.knight);
  city = new Zone('the City', 0, false);
  mainCharacter.moveTo(city);

  App.Observer.on('buttonAdventureClicked', play);
}

/* Start adventuring on the first level of the road */
function play() {
  var road = new Zone('the Road', 1, true);
  mainCharacter.moveTo(road);
}

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


return my;
})(App.Game || {});

