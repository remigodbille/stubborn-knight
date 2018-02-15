function cacheDom(element) {
  if (element.id) {
    dom[element.id] = element;
  }
  
  for (var i = 0, length = element.childNodes.length; i < length; i++) {
    cacheDom(element.childNodes[i]);
  }
}