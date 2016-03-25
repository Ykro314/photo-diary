/*jslint white: true, vars: true*/
define( function(){
  
/**
* @enum {number}
*/
var keyCodes = {
  arrowLeft: 37,
  arrowRight: 39,
  escape: 27
}  


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
  this.previewsArray = [];
  
  this.index = 0;
  
  this.clickOnTrigger = this.clickOnTrigger.bind( this );
  this._onCloseClick = this._onCloseClick.bind( this );
  this.pressOnArrow = this.pressOnArrow.bind( this );
  this.clickOnPreviewImage = this.clickOnPreviewImage.bind( this );
  this.closeOnEscape = this.closeOnEscape.bind( this );
};
  
  
  
/**
* Hides gallery and removes eventListeners
*/
Gallery.prototype.hide = function() {
  this.element.classList.add( "gallery--hidden" );
  
  this.closeBtn.removeEventListener( "click", this._onCloseClick );
  this.controls.removeEventListener( "click", this.clickOnTrigger );
  this.controls.removeEventListener( "click", this.clickOnPreviewImage );
  
  document.removeEventListener( "keydown", this.pressOnArrow );
  document.removeEventListener( "keydown", this.closeOnEscape );
  
  var previewEl;
  while( previewEl = this.previewsArray.shift() ) {
    this.previewImagesWrapper.removeChild( previewEl );
  }
  
  this.index = 0;
};
/**
* Shows gallery and adds eventListeners
*/
Gallery.prototype.show = function() {
  this.element.classList.remove( "gallery--hidden" );
  
  this.closeBtn.addEventListener( "click", this._onCloseClick );
  this.controls.addEventListener( "click", this.clickOnTrigger );
  this.controls.addEventListener( "click", this.clickOnPreviewImage );
  
  document.addEventListener( "keydown", this.pressOnArrow );
  document.addEventListener( "keydown", this.closeOnEscape );
};

  
  
Gallery.prototype.closeOnEscape = function( event ) {
  if( event.keyCode === keyCodes.escape ) {
    this.hide();
  }
}
  
Gallery.prototype.loadImages = function() {
  
  for( var i = 0; i < this.data.getImages().length; i++ ) {
    var previewImage = document.createElement( "img" );
    
    this.previewImagesWrapper.appendChild( previewImage );
    previewImage.src = this.data.getImgFile( i );
    previewImage.classList.add( "gallery__preview-img" );
    previewImage.setAttribute( "data-preview", i );
    this.previewsArray.push( previewImage );
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
  
  this.mainImage.src = this.data.getImgFile( x );
  this.index = x;
  return;
}

/**
* Named method which is used to be able to quickly remove or add as a event listener function. Hides gallery by adding css-class.
*/
Gallery.prototype._onCloseClick = function() {
  this.hide();
}

Gallery.prototype.clickOnPreviewImage = function( event ) {
  var dataPreview = event.target.getAttribute( "data-preview" );
  if( event.target.tagName.toUpperCase() === "IMG" && dataPreview ) {
    this.setMainImage( dataPreview );
  }
}

Gallery.prototype.pressOnArrow = function( event ) {
  if( event.keyCode == keyCodes.arrowLeft ) {
    event.preventDefault();
    this.setMainImage( this.index - 1 );
  }
  else if( event.keyCode == keyCodes.arrowRight ) {
    event.preventDefault();
    this.setMainImage( this.index + 1 );
  }
}

Gallery.prototype.clickOnTrigger = function( event ) {
  if( event.target.id === "trigger-left" ) {
    this.setMainImage( this.index - 1 );
  }
  else if( event.target.id === "trigger-right" ) {
    this.setMainImage( this.index + 1 );
  }
}
  
return Gallery;
  
});