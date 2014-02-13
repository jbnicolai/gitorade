var GithubCanvas = function (canvas) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext('2d');
  this.typeDraw = 'line';

  var draw = this[this.typeDraw]();

  var mouseEvent = function (event) {
    if (event.offsetX || event.offsetX == 0) {
      event._x = event.offsetX;
      event._y = event.offsetY;
    }

    var func = draw[event.type];
    if (func) { 
      func(event) 
    }
  }

  this.canvas.addEventListener('mousedown', mouseEvent, false);
  this.canvas.addEventListener('mousemove', mouseEvent, false);
  this.canvas.addEventListener('mouseup', mouseEvent, false);
}

GithubCanvas.prototype = {
  /*
   *  Set the background of the canvas before drawing on it.
   */
  setBackground: function (background) {
    var that = this;

    if (!background) {
      background = this.canvas.toDataURL('image/png');
    }

    that.background = background;

    var image = new Image();
    image.src = background;
    image.onload = function () {
      that.ctx.drawImage(
        image,
        0,
        0,
        that.canvas.getAttribute('width').replace('px', ''),
        that.canvas.getAttribute('width').replace('px', '') * image.height / image.width
      );
    }
  },

  getImg: function () {
    var dataURL = this.canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  },

  getDataUrl: function () {
    return this.canvas.toDataURL('image/png');
  },

  line: function () {
    var that = this;

    this.start = false;

    this._mousemove = function (event) {
      if (!this.start) return;

      this.ctx.strokeStyle = '#FF0000';
      this.ctx.lineTo(event._x, event._y);
      this.ctx.stroke();
    };

    this._mousedown = function (event) {
      this.ctx.beginPath();
      this.ctx.moveTo(event._x, event._y);
      this.start = true;
    };

    this._mouseup = function (event) {
      if (!this.start) return;

      this._mousemove(event);
      this.start = false;
    };

    return {
      mousedown: function (event) {
        that._mousedown(event);
      },

      mouseup: function (event) {
        that._mouseup(event);
      },

      mousemove: function (event) {
        that._mousemove(event);
      }
    };
  }
};