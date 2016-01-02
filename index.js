var companySquares = document.getElementById('companies').children,
      text = document.getElementById('brand-name'),
      hex = document.getElementById('hex'),
      hasClicked = false,
      background = document.body,
      textColor = 'black',
      hexColor = '#FFF',
      filter = document.getElementById('filter');


  client = new Clipboard(companySquares, {
    text: function(trigger) {
      return document.getElementById('hex').innerHTML;
    }
  });

  client.on('success', function(event){
    event.trigger.setAttribute('aria-label', 'Copied!');
    event.trigger.classList.add('tooltipped');
    event.trigger.classList.add('tooltipped-n');
    setTimeout(function(){
      event.trigger.classList.add('tooltipped');
      event.trigger.classList.remove('tooltipped-n');
    },3000)

  })

  function changeBackground(event) {
    if (hasClicked) return;

      var name = event.currentTarget.innerHTML,
        color = getStyle(event.currentTarget, "background-color");
      hexColor = rgb2hex(color);
      textColor = getContrastYIQ(hexColor.substring(1));

      text.innerHTML = name;
      hex.innerHTML = hexColor;
      hex.setAttribute('data-clipboard-text', hexColor);


      background.style.color = textColor;
      background.style.backgroundColor = color;
  };

  function selectColor(event){
    if (hasClicked) {
        event.currentTarget.classList.remove('clicked');
        document.body.classList.remove('copy');
        document.body.classList.remove('copied');
        hasClicked = false;

        return;
      }

      hasClicked = true;
      event.currentTarget.classList.add('clicked');
      document.body.classList.add('copy');
  }

  function resetState(){
    if (hasClicked) return;

    text.innerHTML = 'brand-colors';
    hex.innerHTML = 'A collection available in sass, less, stylus and css.';

    background.style.color = 'black';
    background.style.backgroundColor = 'rgba(255,255,255,0.9)';
  }

  function getStyle(oElm, strCssRule){
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
      strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle){
      strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
        return p1.toUpperCase();
      });
      strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
  }

  function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }

  function getContrastYIQ(hexcolor){
    var r = parseInt(hexcolor.substr(0,2),16),
        g = parseInt(hexcolor.substr(2,2),16),
        b = parseInt(hexcolor.substr(4,2),16),
        yiq = ((r*299)+(g*587)+(b*114))/1000;

    return (yiq >= 128) ? 'black' : 'white';
  }

  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }


  document.getElementById('companies').addEventListener('mouseout', resetState);


  [].forEach.call(companySquares ,function(div) {
      div.addEventListener('mouseover', changeBackground);
    }
  );

  var sheet = (function() {
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));

    //sheet.addRule('body', 'color: inherit;',  0);
    document.head.appendChild(style);
    return style.sheet;
  })();

  filter.addEventListener('keyup', function(event){
    var text = event.target.value;
    var filter = 'li:not([class*="' + text + '"])';

    if (hasClicked) return;

    for(var i = 0; i < sheet.rules.length; i++) {
      sheet.removeRule(0);
    }
    if(text.length == 0 ) return;
    sheet.addRule(filter, 'width:0 !important',  0);
  })

  document.body.style.opacity = 1;

window.onload = function(e) {
  window.scrollTo( 0, 350 );
}