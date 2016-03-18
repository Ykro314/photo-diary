/*jslint white: true, vars: true*/
(function(){
  
/**
* Creates Gallery object
* @constructor
*/
function Gallery() {
  this.element = document.querySelector( ".gallery" );
  this.closeBtn = document.querySelector( ".gallery__close-btn" )
  this.previewImagesWrapper = document.querySelector( ".gallery__preview-wrapper" );
  this.mainImage = document.querySelector( ".gallery__image--main" );
  this.controls = document.querySelector( ".gallery__controls" );
  this.index = 0;
  this.clickOnTrigger = this.clickOnTrigger.bind( this );
  this._onCloseClick = this._onCloseClick.bind( this );
};
  
/**
* Hides gallery and removes eventListeners
*/
Gallery.prototype.hide = function() {
  this.element.classList.add( "gallery--hidden" );
  this.closeBtn.removeEventListener( "click", this._onCloseClick );
  this.controls.removeEventListener( "click", this.clickOnTrigger );
  this.previewImagesWrapper.innerHTML = "";
};
/**
* Shows gallery and adds eventListeners
*/
Gallery.prototype.show = function() {
  this.element.classList.remove( "gallery--hidden" );
  this.closeBtn.addEventListener( "click", this._onCloseClick );
  this.controls.addEventListener( "click", this.clickOnTrigger );
};

Gallery.prototype.loadImages = function() {
  
  for( var i = 0; i < this.data.images.length; i++ ) {
    var previewImage = document.createElement( "img" );
    
    this.previewImagesWrapper.appendChild( previewImage );
    previewImage.src = this.data.images[i].file;
    previewImage.classList.add( "gallery__preview-img" );
  }
  
  this.setMainImage( this.index );
}

Gallery.prototype.setMainImage = function( x ) {
  var previews = this.previewImagesWrapper.querySelectorAll( ".gallery__preview-img" );
  var currentPreview = previews[x]
  
  if( currentPreview ) {
    [].forEach.call( previews, function( el ){
      el.classList.remove( "gallery__preview-img--active" );
    });
    currentPreview.classList.add( "gallery__preview-img--active" );
  }
  else {
    this.setMainImage( 0 );
    return;
  }
  
  this.mainImage.src = this.data.images[x].file
  this.index = x;
  return;
}

/**
* Named method which is used to be able to quickly remove or add as a event listener function. Hides gallery by adding css-class.
*/
Gallery.prototype._onCloseClick = function() {
  this.hide();
}

Gallery.prototype.clickOnTrigger = function( event ) {
  if( event.target.id === "trigger-left" ) {
    this.setMainImage( this.index - 1 );
  }
  else if( event.target.id === "trigger-right" ) {
    this.setMainImage( this.index + 1 );
  }
}
  
window.Gallery = Gallery;
  
})();