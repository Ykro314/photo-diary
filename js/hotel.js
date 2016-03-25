/*jslint white: true, vars: true*/
define ( function(){
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

  title.textContent = cutText( this._data.getTitle(), 20 );
  date.textContent = this._data.getDateString();
  
  descr.textContent = cutText( this._data.getDescription(), 250 );
  range.textContent += this._data.getRange();
  stars.textContent += this._data.getStars();
  
  var imagesLength = this._data.getImagesLength()
  photos.textContent += imagesLength || 0;
  
  if ( imagesLength ) {
    template.style.backgroundImage = "url(" + this._data.getImgFile( 0 ) + ")";
    template.setAttribute( "data-photo", imagesLength );
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

return Hotel;
//window.Hotel = Hotel;
  
  
});