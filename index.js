var companySquares = document.getElementById('companies').children,
    isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                navigator.userAgent && !navigator.userAgent.match('CriOS'),
    isIOS = navigator.userAgent && navigator.userAgent.indexOf('iPhone') > -1 ||
            navigator.userAgent && navigator.userAgent.indexOf('iPad') > -1,
    text = document.getElementById('brand-name'),
    hex = document.getElementById('hex'),
    hasClicked = false,
    background = document.body,
    textColor = 'black',
    hexColor = '#FFF',
    filter = document.getElementById('filter');

  // Helper Functions

  function selectElementContents(el) {
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
  }

  function changeBackground(event) {
    if (hasClicked) return;

      var name = event.currentTarget.innerHTML,
        color = getStyle(event.currentTarget, "background-color");
      hexColor = rgb2hex(color);
      textColor = getContrastYIQ(hexColor.substring(1));

      text.innerHTML = name;
      hex.innerHTML = hexColor;

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

  document.getElementById('companies').addEventListener('mouseout', resetState);


  [].forEach.call(companySquares ,function(div) {
      div.addEventListener('mouseover', changeBackground);
    }
  );

    client = new Clipboard(companySquares, {
    text: function(trigger) {
      return document.getElementById('hex').innerHTML;
    }
  });

  client.on('success', function(event){
    event.trigger.setAttribute('aria-label', event.text + ' copied!');
    event.trigger.classList.add('tooltipped');
    event.trigger.classList.add('tooltipped-n');
    setTimeout(function(){
      event.trigger.classList.add('tooltipped');
      event.trigger.classList.remove('tooltipped-n');
    },3000)

  })

  client.on('error', function(event){
    if(!isIOS){
      hex.setAttribute('aria-label', 'Press ' + ((isSafari) ? '⌘' : 'CTRL') + '-S to copy');
      hex.classList.add('tooltipped');
      hex.classList.add('tooltipped-s');

      setTimeout(function(){
        hex.classList.remove('tooltipped');
        hex.classList.remove('tooltipped-s');
      }, 2000)
    }

    hex.focus();
    requestAnimationFrame(function() {
      selectElementContents(hex);
    });
  })

  var sheet = (function() {
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));

    //sheet.addRule('body', 'color: inherit;',  0);
    document.head.appendChild(style);
    return style.sheet;
  })();

  filter.addEventListener('keyup', function(event){
    var text = event.target.value.toLowerCase();
    var filter = 'li:not([class*="' + text + '"])';

    if (hasClicked) return;

    for(var i = 0; i < sheet.rules.length; i++) {
      sheet.removeRule(0);
    }
    if(text.length == 0 ) return;
    sheet.addRule(filter, 'width:0 !important',  0);
  })
