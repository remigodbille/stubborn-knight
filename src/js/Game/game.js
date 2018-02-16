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

  mainCharacter = new Character(characterArchetypes.knight, 1, "knight");
  city = new Zone('the City', 0, false);
  mainCharacter.moveTo(city);

  App.Observer.on('buttonAdventureClicked', play);
}

/* Start adventuring on the first level of the road */
function play() {
  var road = new Zone('the Road', 1, true);
  mainCharacter.moveTo(road);
}