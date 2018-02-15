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