YUI.add('fe-raphael-ext', function (Y) {
  
  //
  // Raphael extensions
  //
  
  Raphael.el.addClass = function(className) {
    var el = this.node, 
      clsName = el.getAttribute('class'), 
      clsName = (clsName) ? (clsName + ' ' + className) : className;

    el.setAttribute('class', clsName);
  
    return this;
  };
  
  Raphael.st.addClass = function (className) {
      this.forEach(function ($rpEl) {
        $rpEl.addClass(className);
      });
      
      return this;
  };
  
  
  Raphael.el.setAttribute = function(name, value) {
    var attrVal = Y.Lang.isString(value) ? Y.Escape.html(value) : value;
    
    this.node.setAttribute(name, attrVal);
    
    return this;
  };
  
  Raphael.st.setAttribute = function (name, value) {
      this.forEach(function ($rpEl) {
        $rpEl.setAttribute(name, value);
      });
      
      return this;
  };
  
  Raphael.el.isVisible = function() {
    return this.node.style.display !== 'none';
  };
  
  // As long as any parts in the set is visible, we consider the set is visible.
  Raphael.st.isVisible = function() {
      this.forEach(function ($rpEl) {
        var bVisible = $rpEl.isVisible();
        if (bVisible === true) {
          return true;
        }
      });
      
      return false;
  };


}, '3.4.1', { requires: ['escape'] });