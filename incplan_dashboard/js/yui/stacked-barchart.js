YUI.add('fe-stacked-barchart', function (Y) {

  // Constructor
  function StackedBarChart(strId, nWidth, nHeight, config) {

    // Style registry
    var S = {
      CHART_W: nWidth,
      CHART_H: nHeight,
      
      HORIZONTAL_LINE_COLOR: '#ffde57', 
      HORIZONTAL_LINE_CLASS_NAME: 'yui3-fe-stacked-barchart-horizontal-line', 
      
      AXIS_LINE_COLOR: '#bbb', 
      XAXES_H: 60,
      XAXES_FONT_SIZE: 12,
      XAXES_NAME_COLOR: '#4c4c4c', 
      XAXES_CAT_NAME_CLASS_NAME: 'yui3-fe-stacked-barchart-xaxes-cat-name', 
      XAXES_CAT_VALUE_CLASS_NAME: 'yui3-fe-stacked-barchart-xaxes-cat-value', 
      XAXES_CAT_H: null,
      XAXES_CAT_COLOR: '#4c4c4c', 
      XAXES_CAT_HIGHLIGHT_COLOR: '#fff',
      XAXES_CAT_HIGHLIGHT_BG_COLOR: '#7fbaef', 

      YAXIS_W: 50,
      YAXIS_MARK_H: null,
      YAXIS_FONT_SIZE: 15,
      YAXIS_MARK_CLASS_NAME: 'yui3-fe-stacked-barchart-yaxis-mark', 
      YAXIS_MARK_COLOR: '#8e8e8e', 
      YAXIS_MARK_PADDING_BOT: 5, 

      BUBBLE_MARGIN_H: 5,
      BUBBLE_MAX_H: 0, 

      BARS_CONTAINER_W: null,
      BARS_CONTAINER_H: null, 

      BARS_BODY_MARGIN_TOP: null,
      BARS_BODY_W: null,
      BARS_BODY_H: null,
      
      BARS_COUNT: (function () {
        var count = 0;
        for (var i = 0, ii = config.series.length; i < ii; i++) {
          count = Math.max(count, config.series[i].data.length);
        }
        return count;
      })(), 

      BAR_SEG_CLASS_NAME: 'yui3-fe-stacked-barchart-bar-seg', 
      BAR_GAP: 2,
      BAR_W: null
    };

    S.XAXES_CAT_H = Math.floor(S.XAXES_H / config.axesX.length);
    S.BARS_CONTAINER_W = S.CHART_W - S.YAXIS_W;
    S.BARS_CONTAINER_H = S.CHART_H - S.XAXES_H;
    S.BARS_BODY_W = S.BARS_CONTAINER_W;
    S.BAR_W = (S.BARS_BODY_W - (S.BARS_COUNT - 1) * S.BAR_GAP) / S.BARS_COUNT;
    

    this.id = strId;
    this.config = config || {};
    this.styles = S;

    this.paper = Raphael(this.id, this.styles.CHART_W, this.styles.CHART_H);
    
    // Raphael element registry
    this._bubbles = null;
    this._$rpBars = null; // 2-dim array. 1st dimension is bars, 2nd is segments in a bar.
    this._$rpCats = null; // 2-dim array. 1st dimension is the category rows, 2nd is category columns. 
    this._$rpCatHighlight = null; // Category highlight box.

    StackedBarChart.superclass.constructor.apply(this);
  }


  StackedBarChart.NAME = 'fe-stacked-barchart';


  // Extend
  Y.extend(StackedBarChart, Y.Widget, {
    
    initializer: function() {
      this.publish('rendered', { context: this });
      this.publish('barClick', { context: this });
    }, 
    

    renderUI: function () {
      var S = this.styles, 
        C = this.config, 
        bubbleMaxH, 
        bubbleX, 
        bubbleY;

      // Create bubbles first. 
      // The tallest bubble's height will be used to calculate bar body height and mark height.
      this._bubbles = this._createBubbles();

      S.BARS_BODY_MARGIN_TOP = S.BUBBLE_MAX_H + S.BUBBLE_MARGIN_H * 2;
      S.BARS_BODY_H = S.BARS_CONTAINER_H - S.BARS_BODY_MARGIN_TOP;
      S.YAXIS_MARK_H = Math.floor(S.BARS_BODY_H / C.axisY.marks.length);

      this._$rpCats = this._createXAxes();
      this._createYAxis();

      this._$rpBars = this._createBars();
      
      this._$rpHorizontalLines = this._createHorizontalLines();
      
      if (C.showSeriesColor === false) {
        this.hideSeriesColor();
      }

      // Align bubbles to bars
      this._alignBubbles();
      
      // Show bubble if a bar is selected by default
      if (Y.Lang.isNumber(C.selectedBarIndex)) {
        this.showBubble(C.selectedBarIndex);
      }
    }, 


    syncUI: function() {
      this.fire('rendered');
    }, 


    _createBubbles: function() {
      var S = this.styles, 
        C = this.config, 
        bubbles = [], 
        maxH = 0; // Max height of all bubbles

      if (C.bubbles) {

        Y.Array.each(C.bubbles, function(cfgBubble, index) {

          bubble = new Y.FE.Bubble(this.id + '-bubble-' + index, this.paper, {
            labels: cfgBubble.labels, 
            minX: S.YAXIS_W + 1, 
            maxX: S.CHART_W
          });
          bubble.render();

          maxH = Math.max(maxH, bubble.getRaphaelEl().getBBox().height);

          bubble.hide();

          bubbles.push(bubble);

        }, this);
      }

      S.BUBBLE_MAX_H = maxH;

      return bubbles;
    }, 
    

    _getBarTopCoord: function(bar) {
      var bb = bar[bar.length - 1].getBBox();

      return {
        x: bb.x2 - bb.width / 2, 
        y: bb.y
      };
    }, 


    /**
     * Align bubbles to their correspondent bars.
     */
    _alignBubbles: function() {
      var S = this.styles;

      Y.Array.each(this._$rpBars, function(bar, index) {
        var coord = this._getBarTopCoord(bar), 
          bubble = this._bubbles[index];

        bubble.move(coord.x, coord.y - S.BUBBLE_MARGIN_H);

      }, this);
    }, 


    _createXAxes: function () {
      var S = this.styles,
        $rpXAxis, 
        $rpCats = []; // 2-dimension array. 1st dimension is cat rows, 2nd is cat columns.
      
      $rpXAxis = this.paper.path([
        'M', S.YAXIS_W, S.CHART_H - S.XAXES_H + 0.5,
        'h', S.BARS_CONTAINER_W
      ]);

      $rpXAxis.attr({
        'stroke': S.AXIS_LINE_COLOR,
        'stroke-width': 1
      });

      Y.Array.each(this.config.axesX, function(axisX, i) {
        
        var y = S.BARS_CONTAINER_H + S.XAXES_CAT_H * i,
          yOffset, 
          $rpName, 
          catName = axisX.name;

        $rpName = this.paper.text(0, y, catName);
        $rpName.attr({
          'text-anchor': 'start',
          'font-size': S.XAXES_FONT_SIZE,
          'font-weight': 'bold', 
          'fill': S.XAXES_NAME_COLOR
        });
        yOffset = Math.floor((i == 0) ? $rpName.getBBox().height : $rpName.getBBox().height / 2);
        $rpName.transform(['t', 0, yOffset]);
        
        $rpName.setAttribute('data-cat-name', Y.Escape.html(catName));
        $rpName.addClass(S.XAXES_CAT_NAME_CLASS_NAME);
        
        $rpCats[i] = [];

        Y.Array.each(axisX.categories, function(catValue, j) {
          
          var x = S.YAXIS_W + (S.BAR_W + S.BAR_GAP) * j + S.BAR_W / 2,
            $rpCat;

          $rpCat = this.paper.text(x, y, catValue);
          $rpCat.attr({
            'text-anchor': 'middle',
            'font-size': S.XAXES_FONT_SIZE,
            'fill': S.XAXES_CAT_COLOR
          });
          $rpCat.transform(['t', 0, yOffset]);

          $rpCat.setAttribute('data-cat-name', Y.Escape.html(catName));
          $rpCat.setAttribute('data-cat-value', Y.Escape.html(catValue));
          $rpCat.setAttribute('data-cat-row-index', i);
          $rpCat.setAttribute('data-cat-col-index', j);
          $rpCat.setAttribute('data-cat-highlighted', false);
          $rpCat.addClass(S.XAXES_CAT_VALUE_CLASS_NAME);
          
          $rpCats[i][j] = $rpCat;
          
        }, this);

        // Shorten long names
        while (catName.length > 3 && $rpName.getBBox().width > S.YAXIS_W) {
          catName = catName.substring(0, catName.length - 4) + '...';
          $rpName.attr('text', catName);
        }
        
      }, this);
      
      return $rpCats;
    }, 
    

    _createYAxis: function() {
      var S = this.styles, 
        $rpYAxis;
      
      $rpYAxis = this.paper.path([
        'M', S.YAXIS_W - 0.5, 0,
        'v', S.BARS_CONTAINER_H
      ]);
      $rpYAxis.attr({
        'stroke': S.AXIS_LINE_COLOR,
        'stroke-width': 1
      });

      // Marks
      Y.Array.each(this.config.axisY.marks, function(markText, i) {
        
        var y = S.BARS_CONTAINER_H - (i + 1) * S.YAXIS_MARK_H + 0.5,
          $rpMarkLine, 
          $rpMarkText;

        $rpMarkLine = this.paper.path([
          'M', 0, y,
          'h', S.CHART_W
        ]);
        $rpMarkLine.attr({
          'stroke': S.AXIS_LINE_COLOR,
          'stroke-width': 1,
          'opacity': 0.5
        });

        $rpMarkText = this.paper.text(0, y, markText);
        $rpMarkText.attr({
          'text-anchor': 'start',
          'fill': S.YAXIS_MARK_COLOR, 
          'font-size': S.YAXIS_FONT_SIZE
        });
        $rpMarkText.transform(['t', 0, -($rpMarkText.getBBox().height / 2 + S.YAXIS_MARK_PADDING_BOT)]);
        
        $rpMarkText.setAttribute('data-mark', Y.Escape.html(markText));
        $rpMarkText.addClass(S.YAXIS_MARK_CLASS_NAME);
        
      }, this);
    }, 
    
    
    _createBars: function() {
      var S = this.styles,
        $rpSeg, 
        bars = []; // 2-dimension array. 1st dimension is bars, 2nd is segments in a bar.

      Y.Array.each(this.config.series, function(series, i) {
        
        Y.Array.each(series.data, function(data, j) {
          
          var x = S.YAXIS_W + (S.BAR_W + S.BAR_GAP) * j,
            y, 
            w = S.BAR_W,
            h;

          h = Math.ceil(data / (this.config.axisY.max - this.config.axisY.min) * S.BARS_BODY_H);

          y = S.BARS_CONTAINER_H - h;
          if (bars[j]) {
            if (bars[j].length > 0) {
              y = bars[j][bars[j].length - 1].getBBox().y - h;
            }
          } else {
            bars[j] = [];
          }

          $rpSeg = this._createSegment({
            'x': x, 
            'y': y, 
            'width': w, 
            'height': h, 
            'barIndex': j, 
            'barColor': this.config.barColor, 
            'color': series.color, 
            'type': series.name, 
            'value': series.data[j]
          });

          bars[j].push($rpSeg);
          
        }, this);
        
      }, this);

      return bars;
    }, 


    _createSegment: function(spec) {
      var S = this.styles, 
        $rpSeg, 
        y = spec.y, 
        color;
      
      // For VML, we have to push down the segment by 0.5 pixel in order to "glue" 
      // all segments together so no gap will appear among them
      if (Raphael.type == 'VML') {
        y += 0.5;
        if (y + spec.height > S.CHART_H - S.XAXES_H + 0.5) {
          // However, if the segment crosses the x axis, don't push down the segment.  
          y = spec.y;
        } 
      }
      $rpSeg = this.paper.rect(spec.x, y, spec.width, spec.height);

      $rpSeg.attr({
        'stroke-width': 0
      });

      if (Y.Lang.isValue(spec.type)) {
        $rpSeg.data('type', spec.type)  
        $rpSeg.setAttribute('data-seg-type', Y.Escape.html(spec.type));
      }
      if (Y.Lang.isValue(spec.value)) {
        $rpSeg.data('value', spec.value);
        $rpSeg.setAttribute('data-seg-value', Y.Escape.html(spec.value));
      }
      
      if (Y.Lang.isString(spec.barColor)) {
        color = spec.barColor;
        $rpSeg.data('barColor', spec.barColor);
      }
      if (Y.Lang.isString(spec.color)) {
        color = spec.color; // seg color overrides bar color
        $rpSeg.data('color', spec.color);
      }
      if (color) {
        $rpSeg.attr('fill', color);
      }
      
      $rpSeg.data('barIndex', spec.barIndex);
      $rpSeg.setAttribute('data-bar-index', Y.Escape.html(spec.barIndex));

      $rpSeg.addClass(S.BAR_SEG_CLASS_NAME);
      
      // Attach click event listeners
      $rpSeg.click(Y.bind(this._onBarClick, this));

      return $rpSeg;
    }, 
    
    
    _createHorizontalLines: function() {
      var S = this.styles, 
        C = this.config, 
        $rpHorizontalLines = [];
      
      Y.Array.each(C.horizontalLines, function(line, i) {
        
        var h = Math.ceil(line.value / (C.axisY.max - C.axisY.min) * S.BARS_BODY_H), 
          y = S.BARS_CONTAINER_H - h + 1.5, 
          $rpLine;
        
        $rpLine = this.paper.path([
            'M', S.YAXIS_W, y, 
            'h', S.BARS_CONTAINER_W
        ]);
        $rpLine.attr({
          'stroke': S.HORIZONTAL_LINE_COLOR,
          'stroke-width': 4,
          'opacity': 1
        });
        $rpLine.addClass(S.HORIZONTAL_LINE_CLASS_NAME)
          .setAttribute('data-horizontal-line-value', line.value)
          .setAttribute('data-horizontal-line-index', i);
        
        $rpHorizontalLines.push($rpLine);
        
      }, this);
      
      return $rpHorizontalLines;
    }, 


    _onBarClick: function(e) {
      var elSeg = e.target || e.srcElement, 
        eventArgs = {
          barIndex: parseInt(elSeg.getAttribute('data-bar-index'), 10), 
          segType: elSeg.getAttribute('data-seg-type'), 
          segValue: elSeg.getAttribute('data-seg-value')
        };
      
      this.showBubble(eventArgs.barIndex);

      this.fire('barClick', eventArgs);
    }, 

    
    _setSegColor: function($rpSeg, color, animate) {
      if ($rpSeg && color) {
        if (animate) {
          $rpSeg.animate({
            'fill': color
          }, 500);
        } else {
          $rpSeg.attr({
            'fill': color
          });
        }
      }
    }, 

    // colors is either a color string, or a map of series/segment types to color strings.
    setSeriesColor: function(colors, animate) {
      if (typeof colors === 'string') {

        Y.Array.each(this._$rpBars, function(bar) {
          Y.Array.each(bar, function($rpSeg) {
            this._setSegColor($rpSeg, colors, animate);
          }, this);
        }, this);
      } else if (Y.Lang.isObject(colors) && Y.Lang.isFunction(colors) == false && Y.Lang.isArray(colors) == false) {
        
        Y.Array.each(this._$rpBars, function(bar) {
          Y.Array.each(bar, function($rpSeg) {
            var color = colors[$rpSeg.data('type')];
            this._setSegColor($rpSeg, color, animate);
          }, this);
        }, this);
      }
    }, 
    
    
    showSeriesColor: function(animate) {
      Y.Array.each(this._$rpBars, function(bar) {
        Y.Array.each(bar, function($rpSeg) {
          var color = $rpSeg.data('color');
          
          if (Y.Lang.isString(color)) {
            this._setSegColor($rpSeg, color, animate);
          }
        }, this);
      }, this);
    }, 


    hideSeriesColor: function(animate) {
      Y.Array.each(this._$rpBars, function(bar) {
        Y.Array.each(bar, function($rpSeg) {
          var color = $rpSeg.data('barColor');
          
          if (Y.Lang.isString(color)) {
            this._setSegColor($rpSeg, color, animate);
          }
        }, this);
      }, this);
    }, 
    
    
    /**
     * Show a bubble specified by index, and hide all the other bubbles. 
     * If the index is omitted, the selectedBarIndex from the configuration 
     * will be used. 
     */
    showBubble: function(index) {
      var C = this.config, 
        ndx;

      ndx = Y.Lang.isNumber(index) ? index : -1;

      if (ndx < 0) {
        ndx = Y.Lang.isNumber(C.selectedBarIndex) ? C.selectedBarIndex : -1;
      }
      
      Y.Array.each(this._bubbles, function(bubble, i) {
        if (i === ndx) {
          bubble.toFront();
          bubble.show();

          // Highlight the associated category
          this.highlightCategory(0, index);
        }
        else {
          bubble.hide();
        }
      }, this);
    }, 


    /**
     * Hide a bubble specified by index. If the index is omitted, 
     * hide all bubbles.
     */
    hideBubble: function(index) {
      if (Y.Lang.isNumber(index)) {
        if (index >=0 && index < this._bubbles.length) {
          this._bubbles[index].hide();
        }
      }
      else {
        Y.Array.each(this._bubbles, function(bubble) {
          bubble.hide();
        }, this);
      }
    }, 
    
    
    showHorizontalLine: function(index) {
      var $rpLine = this._$rpHorizontalLines[index];
      
      $rpLine.show();
    }, 
    
    
    hideHorizontalLine: function(index) {
      var $rpLine = this._$rpHorizontalLines[index];
      
      $rpLine.hide();
    }, 
    
    
    /**
     * Highlight the category. 
     */
    highlightCategory: function(rowIndex, colIndex) {
      var S = this.styles, 
        $rpCat = this._$rpCats[rowIndex][colIndex],  
        bb, 
        xPadding, 
        yPadding;
      
      if ($rpCat) {
        
        bb = $rpCat.getBBox();
        xPadding = (S.BAR_W > bb.width) ? (S.BAR_W - bb.width) / 2 : 0;
        yPadding = (bb.y - S.BARS_CONTAINER_H) / 2;
        
        if (!this._$rpCatHighlight) {
          
          // Highlight box doesn't exist. Create one
          this._$rpCatHighlight = this.paper.rect(0, 0, bb.width + 2 * xPadding, bb.height + 2 * yPadding);
          this._$rpCatHighlight.attr({
            'fill': S.XAXES_CAT_HIGHLIGHT_BG_COLOR, 
            'stroke-width': 0
          });
          this._$rpCatHighlight.toBack();
        }
        
        // Move the highlight box close to the category
        this._$rpCatHighlight.transform(['T', bb.x - xPadding, bb.y - yPadding]);
        
        // Restore all categories to un-highlighted states
        Y.Array.each(this._$rpCats, function($rpCatRow) {
          Y.Array.each($rpCatRow, function($rpCatCol) {
            $rpCatCol.setAttribute('data-cat-highlighted', false).attr({ 'fill': S.XAXES_CAT_COLOR });
          }, this);
        }, this);
        
        // Change the selected category to highlight states
        $rpCat.setAttribute('data-cat-highlighted', true).attr({ 'fill': S.XAXES_CAT_HIGHLIGHT_COLOR });
      }
    }
  });


  // Export
  Y.namespace('FE').StackedBarChart = StackedBarChart;


}, '3.4.1', { requires: ['widget', 'fe-raphael-ext', 'fe-bubble', 'array-extras'] });