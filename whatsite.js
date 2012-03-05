//
// The WhatSite object
//
function WhatSite(userOpts) {
  if (typeof userOpts !== 'undefined' && typeof userOpts !== 'object') {
    if (console && console.log) {
      console.log('WhatSite: invalid options passed to WhatSite().');
    }
    return false;
  }

  this.defaults = {
    'affects': [
      'favicon',
      'body',
    ],
    'sites': {
      'dev': {
        'host_match': '\.dev\.|\.local(host)?',
        'color': '#66ccff' // Sky
      },
      'test': {
        'host_match': '\.(test|qa)\.',
        'color': '#ffcc66' // Cantaloupe
      }
    }
  };

  this.opts = this.extend(this.defaults, userOpts);
  var realm = this.thisSite();
  if (realm !== false) {
    this.affect(realm);
  }
};


// See: http://stackoverflow.com/a/383245/806988
WhatSite.prototype.extend = function(obj, defaults) {
  for (var p in defaults) {
    try {
      // Property in destination object set; update its value.
      if (defaults[p].constructor == Object) {
        obj[p] = this.extend(obj[p], defaults[p]);
      } else {
        obj[p] = defaults[p];
      }
    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj[p] = defaults[p];
    }
  }

  return obj;
};


// Should this site be affected?
WhatSite.prototype.thisSite = function() {
  for (var realm in this.opts.sites) {
    var host_match = this.opts.sites[realm].host_match;

    if (typeof host_match !== 'undefined') {
      var patt = new RegExp(host_match);

      if (window.location.hostname.match(patt) !== -1) {
        return realm;
      }
    }
  }

  return false;
};


// Apply changes
WhatSite.prototype.affect = function(realm) {
  var affects = this.extend(this.opts.affects, this.opts.sites[realm].affects);
  var color = this.opts.sites[realm].color;

  for (var i in affects) {
    if (typeof affects[i] === 'undefined') {
      continue;
    } else if (typeof affects[i] === 'function') {
      affects[i](color, realm);
    } else {
      switch (affects[i]) {
        case 'favicon': this.affectFavicon(color); break;
        case 'body':    this.affectBody(color); break;
      }
    }
  }
};


// Applies a coloured bar to the favicon
WhatSite.prototype.affectFavicon = function(color) {
  var linkTags = document.getElementsByTagName('link');
  var icon = null;

  for (var i in linkTags) {
    if (typeof linkTags[i] !== 'object') continue;
    var rel = linkTags[i].getAttribute('rel');
    if (typeof rel === 'undefined') continue;

    if (rel === 'shortcut icon') {
      icon = linkTags[i];
      break;
    }
  }

  var iconImg = new Image();
  var flatColor = this.splitColor(color).join(',');

  // See: https://developer.mozilla.org/en/Canvas_tutorial/Using_images
  iconImg.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', '16px');
    canvas.setAttribute('height', '16px');
    var ctx = canvas.getContext('2d');  

    ctx.lineCap = 'butt';
    ctx.drawImage(iconImg, 0, 0);  

    ctx.beginPath();
      ctx.strokeStyle = 'rgba(' + flatColor + ',1)';
      ctx.lineWidth = 4;
      ctx.moveTo(0, 0);
      ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    ctx.beginPath();
      ctx.strokeStyle = 'rgba(0,0,0,0.7)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, 2.5);
      ctx.lineTo(canvas.width, 2.5);
    ctx.stroke();

    // See: http://www.p01.org/releases/DEFENDER_of_the_favicon/
    try {
      (newIcon = icon.cloneNode(true)).setAttribute('href', ctx.canvas.toDataURL());
      icon.parentNode.replaceChild(newIcon, icon);
    } catch (e) {
      // Nobody cares if a favicon goes untweaked
    }
  };
  iconImg.src = icon.href;
};


// Applies coloured bar to the body element
WhatSite.prototype.affectBody = function(color) {
  var stripe = document.createElement('div');
  stripe.style['backgroundColor'] = color;
  stripe.style['zIndex'] = 1000; // Ensure it is higher than 999 for Drupal's admin_menu
  stripe.style['position'] = 'absolute';
  stripe.style['top'] = '0px';
  stripe.style['left'] = '0px';
  stripe.style['width'] = '100%';
  stripe.style['height'] = '3px';
  var body = document.getElementsByTagName('body')[0];
  body.insertBefore(stripe, body.childNodes[0]);
}


// See: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
WhatSite.prototype.splitColor = function(color) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}
