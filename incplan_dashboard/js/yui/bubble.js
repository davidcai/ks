YUI.add('fe-bubble', function (Y) {
  
  /**
   * Creates a round-corner bubble with a downward pointer. 
   * Takes a Raphael paper instance, and a configuration object 
   * which supports the following attributes:
   * 
   * labels - A list of labels displayed inside the bubble, e.g.
   * 
   *          [
   *            { text: '$51,000' },
   *            { text: 'per year', fontSize: 16, fontWeight: 'bold', color: '#c4c4c4' }
   *          ]
   * 
   *          fontSize   - Default is 16. 
   *          fontWeight - Default is 'normal'.
   *          color      - Default is '#8c8c8c'. 
   * 
   * minX - Min x coord of where the bubble can go. Default is 0. 
   * maxX - Max x coord of where the bubble can go. Default is the paper width. 
   * x - X coord of the anchor point. 
   * y - Y coord of the anchor point. 
   * 
   * accent - A boolean flag to determine if the first label should 
   *          have accent styles. Default is true.
   * 
   * Returns a Raphael object representing the bubble.
   */
  function Bubble(strId, paper, config) {
    
    // Style registry
    var S = {
      BUBBLE_LABEL_CLASS_NAME: 'yui3-fe-bubble-label', 
      PADDING_W: 10, 
      PADDING_H: 8, 
      RADIUS: 4,
      ARROW_W: 15,
      ARROW_H: 10, 
      FONT_SIZE: 16,
      FONT_WEIGHT: 'normal', 
      ACCENT_FONT_SIZE: 28,
      ACCENT_FONT_WEIGHT: 'bold', 
      COLOR: '#8c8c8c', 
      ACCENT_COLOR: '#4e86ae', 
      BORDER_W: 3, 
      BORDER_COLOR: '#4e86ae', 
      BG_COLOR: '#fff', 
      GLOW_W: 5
    };

    this.id = strId;
    this.paper = paper;
    this.config = config || {};
    this.config.minX = Y.Lang.isNumber(this.config.minX) ? this.config.minX : 0; 
    this.config.maxX = Y.Lang.isNumber(this.config.maxX) ? this.config.maxX : this.paper.width; 
    this.styles = S;
    
    // Raphael element registry
    this._$rpBubble = null; // Bubble set
    this._$rpLabels = null; // Labels set
    this._$rpRect = null;
    this._$rpArrow = null; // Arrow set
    this._$rpBorder = null; // Border set
    this._$rpGlow = null;

    Bubble.superclass.constructor.apply(this);
  }
  
  
  Bubble.NAME = 'fe-bubble';
  
  
  //
  // Attributes
  //
  
  Bubble.ATTRS = {
    texts: {
      value: null
    }
  };
  

  // Extend
  Y.extend(Bubble, Y.Widget, {
    
    initializer: function() {
      this.publish('rendered', { context: this });
    }, 
    

    renderUI: function () {

      var S = this.styles, 
        C = this.config, 
        x = C.minX + (C.maxX - C.minX) / 2, // We will honor config.x later
        y = S.GLOW_W, // We will honor config.y later
        w = 0, 
        h = 0; 

      // Create labels
      this._$rpLabels = this._createLabels(x, y);
      w = this._$rpLabels.contentWidth + S.PADDING_W * 2;
      h = this._$rpLabels.contentHeight + S.PADDING_H * 2;

      // Create rectangle and arrow
      this._$rpRect = this._createRect(x - w / 2, y, w, h);
      this._$rpArrow = this._createArrow(x, y + h);

      // Assemble everything into bubble
      this._reorderBubbleComponents();

      // Honor config.x and config.y if both are specified
      if (Y.Lang.isNumber(this.config.x) && Y.Lang.isNumber(this.config.y)) {
        this.move(this.config.x, this.config.y);
      }
    },
    
    
    _createLabels: function(x, y) {
      var S = this.styles, 
        accent = Y.Lang.isBoolean(this.config.accent) ? this.config.accent : true, 
        $rpLabels, // Labels set
        w = 0, // Total width of all labels
        h = 0; // Total height of all labels
      
      $rpLabels = this.paper.set();
      
      Y.Array.each(this.config.labels, function(label, i) {

        var fontSize = label.fontSize || S.FONT_SIZE,
          fontWeight = label.fontWeight || S.FONT_WEIGHT, 
          color = label.color || S.COLOR, 
          yOffset, // y-coord offset of the current label
          labelW, // Width of a single label
          labelH, // Height of a single label
          $rpLabel;
        
        if (i == 0 && accent === true) {
          fontSize = label.fontSize || S.ACCENT_FONT_SIZE;
          fontWeight = label.fontWeight || S.ACCENT_FONT_WEIGHT;
          color = label.color || S.ACCENT_COLOR;
        }

        yOffset = S.PADDING_H + fontSize / 2;
        $rpLabel = this.paper.text(x, y + h + yOffset, label.text);
        $rpLabel.attr({
          'text-anchor': 'middle',
          'font-size': fontSize,
          'font-weight': fontWeight, 
          'fill': color
        });
        
        $rpLabel
          .addClass(S.BUBBLE_LABEL_CLASS_NAME)
          .addClass(this.id)
          .setAttribute('data-label-text', label.text)
          .setAttribute('data-label-index', i);

        labelW = $rpLabel.getBBox().width;
        labelH = $rpLabel.getBBox().height;

        $rpLabels.push($rpLabel);

        w = Math.max(w, labelW);
        h += labelH;

      }, this); // /Y.Array.each
      
      $rpLabels.contentWidth = w;
      $rpLabels.contentHeight = h;
      
      return $rpLabels;
    }, 


    _createRect: function(x, y, w, h) {
      var S = this.styles;

      return this.paper.rect(x, y, w, h, S.RADIUS).attr({
        'fill': S.BG_COLOR,
        'stroke': this.config.borderColor || S.BORDER_COLOR,
        'stroke-width': S.BORDER_W,
        'stroke-opacity': 1
      });
    }, 


    _createArrow: function(x, y) {
      var S = this.styles, 
        C = this.config, 
        minX = C.minX + S.GLOW_W + S.RADIUS + S.ARROW_W / 2, // min x to display standard arrow
        maxX = C.maxX - S.GLOW_W - S.RADIUS - S.ARROW_W / 2, // max x to display standard arrow
        leftW = S.ARROW_W / 2, // Width of the arrow's left half
        rightW = S.ARROW_W / 2, // Width of the arrow's right half
        coverH = S.BORDER_W / 2 + 1, // Height of a cover that hides the rectangle border at background
        $rpArrow, // Arrow set
        $rpArrowBody, 
        $rpArrowBorder;

      $rpArrow = this.paper.set();

      //
      // Reduce the width of left or right half of an arrow if x is less than minX or greater than maxX. 
      // We display a narrow arrow to cope with the situation where arrow and rectangle pathes won't connect.
      //

      if (x < minX) {
        leftW -= (minX - x);
      }
      if (x > maxX) {
        rightW -= (x - maxX);
      }

      //
      // Fill arrow body with background color. 
      // The top part stick out a bit to cover the rectangle border at background.
      //

      $rpArrowBody = this.paper.path([
        'M', x - leftW, y - coverH, 
        'v', coverH,  
        'l', leftW, S.ARROW_H, 
        'l', rightW, -S.ARROW_H, 
        'v', -coverH, 
        'z'
      ]).attr({
        'fill': S.BG_COLOR, 
        'stroke-width': 0
      });

      // Draw a V shape to define the border
      $rpArrowBorder = this.paper.path([
        'M', x - leftW - 1, y, 
        'h', 1, 
        'l', leftW, S.ARROW_H, 
        'l', rightW, -S.ARROW_H, 
        'h', 1
      ]).attr({
        'stroke': this.config.borderColor || S.BORDER_COLOR,
        'stroke-width': S.BORDER_W, 
        'stroke-opacity': 1, 
        'stroke-linecap': 'butt'
      });

      $rpArrow.push($rpArrowBody, $rpArrowBorder);

      return $rpArrow;
    }, 
    
    
    _createGlow: function($rpBorder) {
      return $rpBorder.glow({
        'width': this.styles.GLOW_W, 
        'opacity': 0.2
      });
    }, 


    _reorderBubbleComponents: function() {

      // Group rectangle and arrow into border
      if (!this._$rpBorder) {
        this._$rpBorder = this.paper.set();
      }
      else {
        this._$rpBorder.clear();
      }
      this._$rpBorder.push(this._$rpRect, this._$rpArrow);
      
      // Glow has to be (re)created every time the border changed.
      if (this._$rpGlow) {
        this._$rpGlow.remove();
      }
      this._$rpGlow = this._createGlow(this._$rpBorder);

      // Group everything together into bubble
      if (!this._$rpBubble) {
        this._$rpBubble = this.paper.set();
      }
      else {
        this._$rpBubble.clear();
      }
      this._$rpBubble.push(this._$rpGlow, this._$rpBorder, this._$rpLabels);

      // Bring forward
      this.toFront();
    }, 
    
    
    bindUI: function() {
      this.after('textsChange', this._afterTextsChange);
    }, 
    
    
    syncUI: function() {
      this.fire('rendered');
    },  
    
    
    _afterTextsChange: function(e) {
      var S = this.styles, 
        texts = e.newVal;
      
      this._$rpLabels.forEach(function($rpLabel, index) {
        var strText = texts[index];
        
        if (index < texts.length) {
          
          $rpLabel.attr({
            'text': strText
          });
          
          $rpLabel.setAttribute('data-label-text', strText);
          
          return true;
        }
        
        return false;
      });
    }, 

    
    /**
     * Move the bubble to a new coordinates. The coordinates indicate the tip point of the arrow.
     */
    move: function(toX, toY) {
      var S = this.styles,
        C = this.config, 
        bb = this._$rpBubble.getBBox(), 
        // Original (x, y)
        fromX = bb.x2 - bb.width / 2, 
        fromY = bb.y2, 
        // We need to adjust the arrow if toX is beyond the range of (minX, maxX)
        minX = C.minX + bb.width / 2, // + S.GLOW_W / 2, 
        maxX = C.maxX - bb.width / 2 - S.GLOW_W / 2, 
        toXAdjusted = toX; // Track the adjusted X. We will NOT adjust toY

      if (toX < minX) {
        toXAdjusted = minX;
      }

      if (toX > maxX) {
        toXAdjusted = maxX;
      }
      
      if (fromX != toXAdjusted || fromY != toY) {
        
        FE.log('Move bubble from (' + fromX + ', ' + fromY + ') to (' + toXAdjusted + ', ' + toY + ')');

        // Move the entire bubble
        this._$rpBubble.transform(['t', toXAdjusted - fromX, toY - fromY]);

        // Start to re-align the arrow
        if (toXAdjusted != toX) {

          // Re-create arrow
          this._$rpArrow.remove();
          this._$rpArrow = this._createArrow(toX, toY - S.ARROW_H);

          this._reorderBubbleComponents();
        }
      }
    }, 
    
    
    show: function() {
      this._$rpBubble.show();
    },
    
    
    hide: function() {
      this._$rpBubble.hide();
    }, 
    
    
    isVisible: function() {
      return this._$rpBubble.isVisible();
    }, 
    
    
    getWidth: function() {
      var S = this.styles;
      
      return this._$rpBubble.getBBox().width + S.GLOW_W;
    }, 
    
    
    getHeight: function() {
      var S = this.styles;
      
      return this._$rpBubble.getBBox().height + S.GLOW_W;
    }, 
    
    
    toFront: function() {
      this._$rpBubble.toFront();
    }, 
    
    
    getRaphaelEl: function() {
      return this._$rpBubble;
    }
  });


  // Export
  Y.namespace('FE').Bubble = Bubble;


}, '3.4.1', { requires: ['widget', 'fe-raphael-ext'] });