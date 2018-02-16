function bindEvents() {
  dom['adventure'].addEventListener('click', function() { App.Observer.emit('buttonAdventureClicked'); });

  App.Observer.on('zoneChanged', toggleButtonAdventure);
  App.Observer.on('statChanged', setHealthBar);
}