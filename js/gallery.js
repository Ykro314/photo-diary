/*jslint white: true, vars: true*/
(function(){
  
/**
* Creates Gallery object
* @constructor
*/
function Gallery() {
  this.element = document.querySelector( ".gallery" );
  this.closeBtn = document.querySelector( ".gallery__close-btn" )
};
  
/**
* Hides gallery and removes eventListeners
*/
Gallery.prototype.hide = function() {
  this.element.classList.add( "gallery--hidden" );
  this.closeBtn.removeEventListener( "click", this._onCloseClick.bind( this ) );
};
/**
* Shows gallery and adds eventListeners
*/
Gallery.prototype.show = function() {
  this.element.classList.remove( "gallery--hidden" );
  this.closeBtn.addEventListener( "click", this._onCloseClick.bind( this ) );
  
};

/**
* Named method which is used to be able to quickly remove or add as a event listener function. Hides gallery by adding css-class.
*/
Gallery.prototype._onCloseClick = function() {
  this.hide();
}
  
window.Gallery = Gallery;
  
})();