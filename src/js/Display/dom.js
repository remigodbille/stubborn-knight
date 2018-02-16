function cacheDom(element) {
  if (dom[element.id] !== undefined) {
    return;
  }
  
  element.template = element.innerHTML;
  
  if (element.id) {
    dom[element.id] = element;
  }
  
  for (var i = 0, length = element.childNodes.length; i < length; i++) {
    cacheDom(element.childNodes[i]);
  }
}