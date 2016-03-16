/*jslint white: true, vars: true*/
(function(){
"use strict";
  
/**
* Creates hotel object
* @constructor
*/
function Hotel( data ) {
  this._data = data;
}
/**
* Creates template node and filles it with data from local storage.
*/
Hotel.prototype.createHotel = function() {
  var templElement = document.getElementById( "article-template" );
  var template = templElement.content.children[0].cloneNode( true );
  
  var descr = template.querySelector( ".item__description" );
  var title = template.querySelector( ".item__title" );
  var date = template.querySelector( ".item__date" );
  var range = template.querySelector( ".item__range" );
  var stars = template.querySelector( ".item__stars" );
  var photos = template.querySelector( ".item__files" );
  var backgroundImg = template.querySelector( "img" );

  title.textContent = cutText( this._data.title, 20 );
  date.textContent = this._data.date[0];
  
  descr.textContent = cutText( this._data.description, 250 );
  range.textContent += this._data.range;
  stars.textContent += this._data.stars;
  photos.textContent += this._data.images.length;
  
  if ( this._data.images.length ) {
    backgroundImg.src = this._data.images[0].file;
    backgroundImg.alt = this._data.images[0].alt;
  }
  
  this.element = template;
  /**
  * Cuts text in message for better looking in the preview.
  * @param {string} text
  * @param {number} length
  * @return {string} text
  */
  function cutText( text, maxLength ) {
    if( text.length > maxLength ) {
      return text.slice( 0, maxLength ) + "...";
    } 
    else {
      return text;
    }
  };
}

window.Hotel = Hotel;
  
  
})();