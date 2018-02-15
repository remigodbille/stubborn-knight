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