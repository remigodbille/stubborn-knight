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