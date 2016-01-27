// Document Ready
function r(f){/in/.test(document.readyState)?setTimeout(r,9,f):f()}

// Auto-scroll function. Pure js implementation of jQuery lib of same name.
// arctic_scroll -(uses)-> smooth_scroll --> (currentYPosition, elmYPosition)
function arctic_scroll(e) {
  // Passes currentYPosition (position of current top of screen) and
  // elmYPosition (position of element) to smooth_scroll
  e.preventDefault();

  const startY = currentYPosition();
  var loc = e.target.href.split('#')[1]
  console.log(loc);

  //Grab id location after load
  if(document.readyState === 'complete'){
    smooth_scroll(startY, elmYPosition(loc));
  } else {
    r(smooth_scroll(startY, elmYPosition(loc)));
  }
  return false;
}

function smooth_scroll(startY, stopY){
  // Uses distance between stopY (end location) and startY (start location) to
  // determine speed, step distance and uses setTimeout to perform transition
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
      scrollTo(0, stopY); return;
  }
  var speed = Math.round(distance / 100);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
      for ( var i=startY; i<stopY; i+=step ) {
          setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
          leapY += step; if (leapY > stopY) leapY = stopY; timer++;
      } return;
  }
  for ( var i=startY; i>stopY; i-=step ) {
      setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
      leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
  }
  return false;
}

function currentYPosition() {
    // Polyfill for finding currentYPosition
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
};

function elmYPosition(eID) {
    // Polyfill for finding element position.
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } return y;
};

export { r, arctic_scroll, currentYPosition, elmYPosition, smooth_scroll };
