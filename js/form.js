(function(){
  
  
"use strict";
  
  
var toggle = document.querySelector( ".range__toggle" );
var bar = document.querySelector( ".range__bar" );
var fill = document.querySelector( ".range__fill" );
var input = document.querySelector( ".range__output" );

toggle.addEventListener( "mousedown", function( event ) {
  
  toggle.addEventListener( "dragstart", function( event ) {
    event.preventDefault();
  });
  
  document.addEventListener( "mousemove", move );
  
  document.addEventListener( "mouseup", function() {
    document.removeEventListener( "mousemove", move );
  })
  
});

function move( event ) {
  event.preventDefault();
  
  var coordBar = bar.getBoundingClientRect();
  var coordToggle = toggle.getBoundingClientRect();
  var coordLeft = event.clientX - coordBar.left - ( coordToggle.width / 2 );
  
  if( coordLeft < 0 ) {
    toggle.style.left = 0 + "px";
    fill.style.width = 0 + "px";
  }
  else if( coordLeft > coordBar.width - coordToggle.width ) {
    toggle.style.left = coordBar.width - coordToggle.width + "px";
    fill.style.width = coordBar.width + "px";
  }
  else {
    toggle.style.left = coordLeft + "px";
    fill.style.width = coordLeft + ( coordToggle.width / 2 ) + "px";
  }
  input.value = Math.floor( parseInt( fill.style.width ) / 3 ) + "km";
}
})();
