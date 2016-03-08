/*jslint white: true*/
(function (){
  
"use strict";


var renderBtn = document.querySelector( ".articles__render" );
var articlesNav = document.querySelector( ".articles__buttons-nav" );
var timeoutId;
var gallery = new Gallery();

document.addEventListener( "scroll", function( event ){
  scrollDebounce( renderArticlesOnScroll, 100 );
});

function scrollDebounce( callback, delay ) {
  clearTimeout( timeoutId );
  timeoutId = setTimeout( callback, delay );
};

function renderArticlesOnScroll() {
  var articlesContainer = document.querySelector( ".articles__container" );
  var coords = articlesContainer.getBoundingClientRect();
  
  if( coords.bottom < window.innerHeight && !articlesContainer.getAttribute( "data-fill" ) ) {
    render( event );
  }
};

articlesNav.addEventListener( "click", function( event ) {
  switch( event.target.id ) {
    case "all": 
      setBtnToActive( event.target );
      render( event );
      break;
    case "stars-increase":
      setBtnToActive( event.target );
      render( event, sortByStarsIncrease );
      break;
    case "range-decrease": 
      setBtnToActive( event.target );
      render( event, sortByRangeDecrease );
      break;
    case "photo-amount":
      setBtnToActive( event.target );
      render( event, sortByPhotoAmount );
      break;
    case "date": 
      setBtnToActive( event.target );
      render( event, sortByDate );
      break;
  }
});

function render( event, sortFunction ) {
  var articlesContainer = document.querySelector( ".articles__container" );
  var fragment = document.createDocumentFragment();
  var noteArray = JSON.parse( localStorage.getItem( "noteArray" ) );
  var hotels = articlesContainer.querySelectorAll( ".articles__item" );
  
  if( hotels ){
    [].forEach.call( hotels, function( el, i, arr) {
      el.removeEventListener( "click", galleryShow );
      articlesContainer.removeChild( el );
    })
  }
  
  if( noteArray ) {
    
    if ( sortFunction ) {
      var arrayCopy = noteArray.slice( 0 );
      noteArray = sortFunction( arrayCopy );
    }
    
    traverseAll( noteArray, fragment );
    articlesContainer.appendChild( fragment );
    articlesContainer.setAttribute( "data-fill", true );
  }
  else {
    addEmptyStorageMessage( articlesContainer );
    return;
  };
  
};
  
function galleryShow() {
  gallery.show();
}
  
function traverseAll( array, fragment ) {
  var template = document.getElementById( "article-template" );
  
  array.forEach( function( el, i, arr) {
    var noteObject = array[i];

    var hotel = new Hotel( noteObject );
    hotel.createHotel();
    fragment.appendChild( hotel.element );
    
    hotel.element.addEventListener( "click", galleryShow );
    
  });
};

function setBtnToActive ( btn ) {
  var buttons = articlesNav.children;
  for( var i = 0; i < buttons.length; i++ ) {
    buttons[i].classList.remove( "active" );
  }
  btn.classList.add( "active" );
}
  
  
function addEmptyStorageMessage( container ) {
  var divError = document.createElement( "div" );

  divError.textContent = "Your storage is empty. Please save notation to proceed."
  divError.classList.add( "articles__storage-empty" );

  container.appendChild( divError )
}

  
function sortByStarsIncrease( array ) {  
  return array.sort( function( a, b ) {
    return b.stars - a.stars;
  });
};
function sortByRangeDecrease( array ) {
  return array.sort( function( a, b ) {
    return parseInt( b.range ) - parseInt( a.range );
  });
};
function sortByPhotoAmount( array ) {
  return array.sort( function( a, b ) {
    return b.images.length - a.images.length;
  });
};
function sortByDate( array ) {
  return array.sort( function( a, b ) {
    return b.date[1] - a.date[1];
  });
};
  
  
  
  
/*function fillArticlesTemplate( template, articleObj ) {
  var descr = template.querySelector( ".item__description" );
  var title = template.querySelector( ".item__title" );
  var date = template.querySelector( ".item__date" );
  var range = template.querySelector( ".item__range" );
  var stars = template.querySelector( ".item__stars" );
  var photos = template.querySelector( ".item__files" );
  var backgroundImg = template.querySelector( "img" );

  title.textContent = cutText( articleObj.title, 20 );
  date.textContent = articleObj.date[0];
  
  descr.textContent = cutText( articleObj.description, 250 );
  range.textContent += articleObj.range;
  stars.textContent += articleObj.stars;
  photos.textContent += articleObj.images.length;
  
  if ( articleObj.images.length ) {
    backgroundImg.src = articleObj.images[0].file;
    backgroundImg.alt = articleObj.images[0].alt;
  }
  
  function cutText( text, maxLength ) {
    if( text.length > maxLength ) {
      return text.slice( 0, maxLength ) + "...";
    } 
    else {
      return text;
    }
  } 
}*/
  
  
  
  
  
  
  
  
  
  
})();
