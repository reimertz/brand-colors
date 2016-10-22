var companyContainer = document.getElementById('companies'),
    text = document.getElementById('brand-name'),
    initialText = text.innerHTML,
    hex = document.getElementById('hex'),
    initialHex = hex.innerHTML,
    search = document.getElementById('search'),
    body = document.body,

    isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1
              && navigator.userAgent && !navigator.userAgent.match('CriOS'),

    isIOS = navigator.userAgent && navigator.userAgent.indexOf('iPhone') > -1
            ||navigator.userAgent && navigator.userAgent.indexOf('iPad') > -1,

    sheet = (function() {
      var style = document.createElement("style");

      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);

      return style.sheet;
    })();


  function selectElementContents(el) { //http://stackoverflow.com/a/6150060/3809029
    var range, sel;

    range = document.createRange();
    range.selectNodeContents(el);

    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };


  function rgb2hex(rgb) { //http://stackoverflow.com/a/3971432/3809029
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

    function hex(x) {
        return ('0' + parseInt(x).toString(16)).slice(-2);
    }

    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }


  function getContrastYIQ(hexcolor){ //https://gist.github.com/StevenBlack/960189
    var r, g, b, yiq;

    r = parseInt(hexcolor.substr(0,2),16);
    g = parseInt(hexcolor.substr(2,2),16);
    b = parseInt(hexcolor.substr(4,2),16);
    yiq = ((r*299)+(g*587)+(b*114))/1000;

    return (yiq >= 128) ? 'black' : 'white';
  }


  function getStyle(oElm, strCssRule){ //http://stackoverflow.com/a/4172920/3809029
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
      strValue = document.defaultView.getComputedStyle(oElm, '').getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle){
      strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
        return p1.toUpperCase();
      });
      strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
  }

  function updateState(event) {
    var name = event.target.innerHTML,
        color, hexColor, textColor;

    if (event.target.tagName !== 'LI') return;
      
    color = getStyle(event.target, 'background-color');
    hexColor = rgb2hex(color);
    textColor = getContrastYIQ(hexColor.substring(1));

    text.innerHTML = name;
    hex.innerHTML = hexColor;

    body.style.color = textColor;
    body.style.backgroundColor = color;
  };

  function resetState(){
    text.innerHTML = initialText;
    hex.innerHTML = initialHex;

    body.style.color = 'black';
    body.style.backgroundColor = 'rgba(255,255,255,0.9)';
  }

  function setSearchCss(text){
    var search = 'li:not([class*="' + text + '"])';

    for(var i = 0; i < sheet.rules.length; i++) {
      sheet[(sheet.removeRule ? 'removeRule' : 'deleteRule')](0);
    }

    if(text.length == 0 ) return;

    sheet[(sheet.addRule ? 'addRule' : 'insertRule')]
      (search, 'width:0 !important',  0);
  }

  search.addEventListener('keyup', function(event){
    var text = event.target.value.toLowerCase();
    setSearchCss(text);
  });

  function checkIfSearchQuery(){
    var query = document.location.search.split('?search=');
    if(query.length == 2){
      setSearchCss(query[1]);
      search.value = query[1];
    }
  }

  // Initiate everything;
  companyContainer.addEventListener('mouseover', updateState);
  companyContainer.addEventListener('mouseout', resetState);
  checkIfSearchQuery();

  //clipboard.js implement event delegation iternally
  client = new Clipboard(companyContainer.children, {
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
      hex.setAttribute('aria-label', 'Press ' + ((isSafari) ? '⌘' : 'CTRL') + '-C to copy');
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

