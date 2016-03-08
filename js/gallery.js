(function(){
  
function Gallery() {
  this.element = document.querySelector( ".gallery" );
  this.closeBtn = document.querySelector( ".gallery__close-btn" )
};
  
Gallery.prototype.hide = function() {
  this.element.classList.add( "gallery--hidden" );
  
  this.closeBtn.removeEventListener( "click", this._onCloseClick.bind( this ) );
};

Gallery.prototype.show = function() {
  this.element.classList.remove( "gallery--hidden" );
  
  this.closeBtn.addEventListener( "click", this._onCloseClick.bind( this ) );
  
};

Gallery.prototype._onCloseClick = function() {
  console.log( this );
  this.hide();
}
  
window.Gallery = Gallery;
  
})();