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