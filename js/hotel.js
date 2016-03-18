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
  
  var item = template.querySelector( ".articles__item" );
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
    template.style.backgroundImage = "url(" + this._data.images[0].file + ")";
    template.setAttribute( "data-photo", this._data.images.length );
  }
  else {
    template.setAttribute( "data-photo", 0 );
  }
  
  this.element = template;
  
  
  Hotel.prototype._onClick = function( event ) {
    if( event.target.classList.contains( "item__description" ) && event.currentTarget.getAttribute( "data-photo" ) !== "0" ) {
      if( typeof this._showGal === "function" ) {
        this._showGal();
      }
    }
  }
  this.element.addEventListener( "click", this._onClick.bind( this ) );
  
  Hotel.prototype.removeListener = function() {
    this.element.removeEventListener( "click", this._onClick );
  }
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

Hotel.prototype._showGal = null;

window.Hotel = Hotel;
  
  
})();