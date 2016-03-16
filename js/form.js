/*jslint white: true, vars: true*/

/**
* @fileoverview Form scripts functional programming
* @author Stanislav Tyshchuk lolkokpol@gmail.com
*/
(function(){
  
"use strict";
  
  
var form = document.querySelector( ".form-record" );
  
  /*================================ Range slider drag&drop ==================================*/
  
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
  });
  
  /**
  * Moves toggle element across the bar of the range slider.
  * @param {object} event
  */
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
  };
});
  
  
  
  
/*=============================== Image preview =========================================*/
  
var inputFile = form.querySelector( "input[type='file']" );
  
if( "FileReader" in window ){  
  var previewArray = [];
  
  inputFile.addEventListener( "change", addImagesPreview );
  
  /**
  * Add to container preview of loaded images. For loading we are using input type file with FileReader API.
  * @param {object} event
  */

  function addImagesPreview ( event ) {
    var fileList = this.files;
    var photoContainer = form.querySelector( ".form-record__photo-container" );
    var fragment = document.createDocumentFragment();
    
    [].forEach.call( fileList, function( el ){
      createImagePreview( el );
    })
    this.value = "";    
    
    /**
    * If user loads image, creates preview of loaded image, is pushing Image info to prewievArray, which I will use in articles.js for future templating. Adds image wrap with all needed html/css to the photoContiner.
    * @param {node} el
    */
    function createImagePreview( el ) {
      if( el.type.match( /image.*/ ) ) {
        var reader = new FileReader();

        reader.addEventListener( "load", function( event ) {
          var img = new Image();
          img.src = event.target.result;
          img.alt = el.name;
          var dimension = photoDimension( img );
          
          previewArray.push( {
            file: event.target.result,
            alt: el.name,
            dimension: dimension
          } );
          
          var imgWrap = createPreview( img );
          imgWrap.classList.add( dimension );
          photoContainer.appendChild( imgWrap );
        });
        
        reader.readAsDataURL( el ); 
      };
      
      /**
      * Investigates the approximate dimension of uploaded photo.
      * @param {node} photo
      * @return {string} dimensionClass
      */
      function photoDimension( photo ) {
        var width = photo.naturalWidth || photo.width;
        var height = photo.naturalHeight || photo.heigth;
        var ratio = width / height;
        var dimensionClass;
        
        if( ratio < 1 ) {
          dimensionClass = "photo-tall";
        }
        else if( ratio >= 1 && ratio <= 1.4 ) {
          dimensionClass = "photo-square";
        }
        else {
          dimensionClass = "photo-wide"
        }
        
        return dimensionClass;
      };
      
      /**
      * Creates the wrap of image element with close button, adds dimension and decoration classes.
      * @param {node} photo
      * @return {node} divWrap
      */
      function createPreview( photo ) {
        var divWrap = document.createElement( "div" );
        var closeBtn = document.createElement( "span" );
        
        closeBtn.classList.add( "close-btn" );
        divWrap.appendChild( photo );
        divWrap.appendChild( closeBtn );
        divWrap.classList.add( "preview-container" );
        
        return divWrap;
      }
    };
  };
  
  form.addEventListener( "click", function( event ) {
    if( event.target.classList.contains( "close-btn" ) ) {
      removePreview( event );
    };
    
    /**
    * Removes preview of image from container with all maintaining html, removes image element from previewArray.
    * @param {object} event
    */
    
    function removePreview( event ) {
      var wrap = event.target.parentElement;
      var img = event.target.previousElementSibling;
      
      wrap.parentElement.removeChild( wrap );
      previewArray.forEach( function( el, i, arr) {
        if( el.img == img ) {
          previewArray.splice( i, 1 );
        };
      });
      
    };
  });
};
  
  
  
  
  
/*=============================== Google maps ======================================*/  
var latInput = document.querySelector( ".google-map__coord-lat" );
var lngInput = document.querySelector( ".google-map__coord-lng" );
var changeCoordsBtn = form.querySelector( ".google-map__coord-change" );
  
document.addEventListener( "DOMContentLoaded", initMap );
  
/**
* Initialize google map, and all useful environment
*/
function initMap() {
  var mapCanvas = document.getElementById( "map" );
  var mapOptions = {
    center: { lat: 48.286750, lng: 25.945248 },
    zoom: 12
  };
    
  var map = new google.maps.Map( mapCanvas, mapOptions )
  var mark;
  
  map.addListener( "click", function( event ) {
    if( mark ) {
      mark.setMap( null );
      mark = createMarker( event );
    }
    else {
      mark = createMarker( event );
    }
  });
  
  /**
  * Creats and returns google map marker with coords in clicked place.
  * @param {object} event
  * @return {object} marker
  */
  function createMarker( event ) {
    var coords = { 
      lat: event.latLng.lat(), 
      lng: event.latLng.lng() 
    };
    setCoordsInInputs( coords.lat, coords.lng );
    
    var marker = new google.maps.Marker({
      position: coords,
      map: map
    });
    
    return marker;
  };
  /**
  * Sets value in following to map inputs to the coords of the clicked marker place.
  * @param {number} lat
  * @param {number} lng
  */
  function setCoordsInInputs( lat, lng ) {
    latInput.value = lat;
    lngInput.value = lng;
  };
};
  
changeCoordsBtn.addEventListener( "click", changeCoordsPermit );
/**
* Changes coord inputs readOnly attribute to false.
* @param {object} event
*/
function changeCoordsPermit( event ) {
  event.preventDefault();
  latInput.readOnly = false;
  lngInput.readOnly = false;
};
  
  
  
  
  
/*=========================== Save data ================================*/
  
var saveBtn = document.querySelector( ".form-record__save--local-storage" );
var privateInputs = document.querySelectorAll( "*[data-info]" );
var starsInput = document.querySelectorAll( "input[type=radio]" );
  
form.addEventListener( "click", function( event ) {
  if( event.target.classList.contains( "form-record__save--local-storage" ) ) {
    saveOnClickTo( event, saveToLocalStorage );
  }
  else if( event.target.classList.contains( "form-record__save--ajax" ) ) {
    saveOnClickTo( event, sendToServer );
  }
  
});
  
/**
* Calls function that checks inputs and create notation. Calls callback function from params if the notation is ready to save.
* @param {object} event
* @param {function} callback
*/
function saveOnClickTo( event, callback ) {
  var note = checkInputsCreateNotation( event );
  
  if( note ){
    callback( note );
//    window.location.reload();
  }
  else { 
    return;
  }
}
  
/**
* Sends notation to the server by ajax request.
* @param {object} notation
*/
function sendToServer( notation ) {
  var xhr = new XMLHttpRequest();
  xhr.open( "POST", "test.json", true );
  xhr.send( JSON.stringify( notation ) );
  xhr.addEventListener( "readystatechange", function ( event ){
    if( this.readyState == 4 ) {
      console.log( this.responseText );
    }
  });
};
  
/**
* Works with localStorage data, if localStorage is empty - creates empty array, saves object and pushes it into a localStorage, otherwise pushes object to array, alredy parsed from localStorage.
* @param {object} notation
*/
function saveToLocalStorage( notation ) {
  var noteArray = localStorage.getItem( "noteArray" );
  
  if( noteArray ) {
    var temporaryArray = JSON.parse( noteArray );
    temporaryArray.push( notation );
    localStorage.setItem( "noteArray", JSON.stringify( temporaryArray ) );
  }
  else {
    var temporaryArray = [];
    temporaryArray.push( notation );
    localStorage.setItem( "noteArray", JSON.stringify( temporaryArray ) );
  }
};
  

/**
* Checks inputs in form, if there are any empty inputs - creates error message. Otherwise creates and returns notation.
* @param {object} event
* @return {object} new Notation
*/
function checkInputsCreateNotation( event ) {
  event.preventDefault();
  var emptyInputs = checkInputsNotEmpty( privateInputs );
  
  if( emptyInputs ) {
    createErrorMessage( emptyInputs );
  }
  else {
    deleteErrorMessage();
    var inputs = collectionToArray( privateInputs, getStarsValue( starsInput ) ); 
    return new Notation( inputs, previewArray );
  }
  
  /**
  * Creates empty array. Checks inputs value. Empty inputs adds to array. If array is filled with at least one input  - retuns array.
  * @param {nodelist} inputs
  * @return {nodelist} emptyInputs || undefined
  */
  function checkInputsNotEmpty( inputs ) {
    var emptyInputs = [];

    for( var i = 0; i < inputs.length; i++ ) {
      if( !inputs[i].value ) {
        emptyInputs.push( inputs[i].name );
      }
    }

    if( emptyInputs.length ) {
      return emptyInputs;
    }
    else {
      return;
    }
  };
  
  /**
  * Filles div in marking with string, which represent names empty inputs. Changes form data-error attribute to "invalid".
  * @param {nodelist} emptyInputs
  */
  function createErrorMessage( emptyInputs ) {
    var clickedBtn = event.target;
    var errorElement = document.querySelector( ".form-record__error-message" );
    var message = "";
    
    form.setAttribute( "data-error", "invalid" )
    clickedBtn.classList.add( "error" );
    emptyInputs.forEach( function( el, i, arr ) {
      if( i == ( arr.length - 1 ) ) {
        message += "<a href=#" + el + "> " + el + "</a>" + ".";
      }
      else {
        message += "<a href=#" + el + "> " + el + "</a>" + ", ";
      }
    });
    
    errorElement.innerHTML = "Please fill empty fields: " + message;
  };
  /**
  * Deletes Error message if it exists, otherwise - returns undefined. Changes form data-error attribute to "valid".
  */
  function deleteErrorMessage() {
    var clickedBtn = event.target;
    var errorElement = form.querySelector( ".form-record__error-message" );
    
    if( form.getAttribute( "data-error" ) == "invalid" ) {
      errorElement.textContent = "";
      clickedBtn.classList.remove( "error" )
      form.setAttribute( "data-error", "valid" )
    }
    else {
      return;
    }
  };
  
  /**
  * Investigates stars amount, returns checked star input.
  * @param {nodelist} starsArray
  * @return {node} starsArray checked element
  */
  function getStarsValue( starsArray ){
    for( var i = 0; i < starsArray.length; i++ ) {

      if( starsArray[i].checked == true ) {
        return starsArray[i];
      }
    }
  };
  /**
  * Converts nodelists into array
  * @param {nodelist} inputsList
  * @param {node} starInput
  * @return {array} array
  */
  function collectionToArray( inputsList, starInput ) {
    var array = [];

    for( var i = 0; i < inputsList.length; i++ ) {
      array[i] = inputsList[i];
    }

    if( starInput ){
      array.push( starInput );
    }

    return array;
  };
  /**
  * Creates object notation from list of inputs and images. 
  * @constructor 
  * @param {array.<Nodes} inputsArray
  * @param {array.<Object>} imagesArray
  */
  function Notation( inputsArray, imagesArray ) {
    
    for( var i = 0; i < inputsArray.length; i++ ) {
      
      if( inputsArray[i].name == "date") {
        var milliseconds = new Date( inputsArray[i].value ).getTime();
        var name = inputsArray[i].name;
        var value = [ inputsArray[i].value, milliseconds ];
        this[name] = value;
      }
      else {
        var name = inputsArray[i].name;
        var value = inputsArray[i].value;
        this[name] = value;
      }
    };
    
    this.images = imagesArray;
  };
};

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
})();
