/*jslint white: true, vars: true*/

requirejs.config({
  baseUrl: "js"
});
define([
  "hotel",
  "gallery",
  "hotel-data",
  "form",
  "https://maps.googleapis.com/maps/api/js",
], function ( Hotel, Gallery, HotelData ){
   
//"use strict";

var form = document.querySelector( ".form-record" );
var renderBtn = document.querySelector( ".articles__render" );
var articlesNav = document.querySelector( ".articles__buttons-nav" );
var articlesContainer = document.querySelector( ".articles__container" );
var timeoutId;
var gallery = new Gallery();
var renderedHotels = [];
var activeFilter = localStorage.getItem( "filter" )
  
document.addEventListener( "scroll", function( event ){
  debounce( renderArticlesOnScroll, 100, event );
});

/**
* Debounce function. Uses for creating debounce effect, which gives us improved performance on eventListeners, that are repeating many times. 
* @param {function} callback
* @param {number} delay
*/
function debounce( callback, delay, event ) {
  clearTimeout( timeoutId );
  timeoutId = setTimeout( function() {
    callback( event );
  }, delay );
};

/**
* Starts rendering articles when user is scrolling to the bottom of the page, and the articles container is not filled with articles already.
*/
function renderArticlesOnScroll( event ) {
  var coords = form.getBoundingClientRect();
  if( coords.bottom < window.innerHeight && !articlesContainer.getAttribute( "data-fill" ) ) {
    render( event );
  }
};

articlesNav.addEventListener( "click", function( event ) {
  var filterId = event.target.id
  switch( filterId ) {
    case "all": 
      localStorage.setItem( "filter", filterId );
      setBtnToActive( event.target );
      render( event );
      break;
    case "stars-increase":
      localStorage.setItem( "filter", filterId );
      setBtnToActive( event.target );
      render( event, sortFunctions[ filterId ] );
      break;
    case "range-decrease": 
      localStorage.setItem( "filter", filterId );
      setBtnToActive( event.target );
      render( event, sortFunctions[ filterId ] );
      break;
    case "photo-amount":
      localStorage.setItem( "filter", filterId );
      setBtnToActive( event.target );
      render( event, sortFunctions[ filterId ] );
      break;
    case "date-journey": 
      localStorage.setItem( "filter", filterId );
      setBtnToActive( event.target );
      render( event, sortFunctions[ filterId ] );
      break;
  }
});


/**
* Makes all the work of rendering articles to the page. At first function checks hotels in the container. If conteiner is filled - cleans container and removes event listeners. If array with notations is present in local storage and we have a sort function passed through the arguments - copies the array and sorts it, while preparing to traversing. Otherwise starts traversing articles immediately
* @param {object} event
* @param {function} sortFunction
*/
function render( event, sortFunction ) {
  console.time("ar");
  var hotels = articlesContainer.querySelectorAll( ".articles__item" );
  var fragment = document.createDocumentFragment();
  
  
  var noteArray = JSON.parse( localStorage.getItem( "noteArray" ) );
  noteArray = noteArray.map( function( hotelData ) {
    return new HotelData( hotelData );
  })
  
  var el;
  while( el = renderedHotels.shift() ) {
    articlesContainer.removeChild( el.element );
    el._showGal = null;
    el.removeListener();
  }
  
  if( noteArray ) {
    if ( event.type !== "click" && activeFilter ) {
      var filterBtn = document.getElementById( activeFilter );
      setBtnToActive( filterBtn );
      sortFunction = sortFunctions[ activeFilter ];
    }
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
  console.timeEnd("ar")
}; 
/**
* Creates variables with hotel objects wich are producting by constructor function, starts method createHotel, which will do all the work with templating and creating node element. Then adds already created element to the documentFragment and adds event listener to the element.
* @param {array} array
* @param {node object} fragment 
*/
function traverseAll( array, fragment ) {
  var template = document.getElementById( "article-template" );
  
  array.forEach( function( el, i, arr) {
    var noteObject = array[i];

    var hotel = new Hotel( noteObject );
    hotel.createHotel();
    fragment.appendChild( hotel.element );
    
    hotel._showGal = function() {
      gallery.data = hotel._data;
      gallery.show();
      gallery.loadImages();
    }
    
    renderedHotels.push( hotel );
  });
};

/**
* Shows gallery markup
*/
//function galleryShow() {
//  gallery.show();
//}

/**
* Sets filter button to active, by adding "active" class with all maintaining css-rules
* @param {node} btn
*/
function setBtnToActive ( btn ) {
  var buttons = articlesNav.children;
  for( var i = 0; i < buttons.length; i++ ) {
    buttons[i].classList.remove( "active" );
  }
  btn.classList.add( "active" );
}
  
/**
* Adds message to the contanier with warning that there are no articles saved in the local storage.
* @param {node} container
*/
function addEmptyStorageMessage( container ) {
  var emptyMessage = container.getAttribute( "data-empty" );
  
  if( !emptyMessage ) {
    var divError = document.createElement( "div" );

    divError.textContent = "Your storage is empty. Please save notation to proceed."
    divError.classList.add( "articles__storage-empty" );

    container.appendChild( divError )
    container.setAttribute( "data-empty", true );
  }
  else {
    return;
  }
}

/**
* @enum {function} sortFunctions
*/
var sortFunctions = {
  "stars-increase": sortByStarsIncrease,
  "range-decrease": sortByRangeDecrease,
  "photo-amount": sortByPhotoAmount,
  "date-journey": sortByDate
}
/**
* Sorting functions which are used to prepare array with notations to traversing with all restrictions.
* @param {array} array
*/
function sortByStarsIncrease( array ) {  
  return array.sort( function( a, b ) {
    return b.getStars() - a.getStars();
  });
};
function sortByRangeDecrease( array ) {
  return array.sort( function( a, b ) {
    return parseInt( b.getRange() ) - parseInt( a.getRange() );
  });
};
function sortByPhotoAmount( array ) {
  return array.sort( function( a, b ) {
    return b.getImagesLength() - a.getImagesLength();
  });
};
function sortByDate( array ) {
  return array.sort( function( a, b ) {
    return b.getDateInMilliseconds() - a.getDateInMilliseconds();
  });
};
  
});
