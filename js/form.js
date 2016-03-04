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
  
  inputFile.addEventListener( "change", function( event ){
    
    var fileList = this.files;
    var photoContainer = form.querySelector( ".form-record__photo-container" )
    
    fileList.forEach = [].forEach;
    fileList.forEach( function( el, i, arr) {
      preview( el );
    });
    this.value = "";    

    function preview( el ) {
      if( el.type.match( /image.*/ ) ) {
        var reader = new FileReader();

        reader.addEventListener( "load", function( event ) {
          var img = new Image();
          img.src = event.target.result;
          img.alt = el.name;
          var dimension = photoDimension( img );
          
          previewArray.push( {
            img: img,
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
  });
  
  form.addEventListener( "click", function( event ) {
    if( event.target.classList.contains( "close-btn" ) ) {
      removePreview( event );
    };
    
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
var lat = document.querySelector( ".google-map__coord-lat" );
var lng = document.querySelector( ".google-map__coord-lng" );
var changeCoordsBtn = form.querySelector( ".google-map__coord-change" );
  
document.addEventListener( "DOMContentLoaded", initMap );
  
function initMap() {
  var mapCanvas = document.getElementById( "map" );
  var mapOptions = {
    center: { lat: 48.286750, lng: 25.945248 },
    zoom: 12
  };
    
  var map = new google.maps.Map( mapCanvas, mapOptions )
  var mark;
  
  map.addListener( "click", function( event ) {
    setCoords( event );
    
    if( mark ) {
      mark.setMap( null );
      mark = addMark( event );
    }
    else {
      mark = addMark( event );
    }
    
  });
  
  function setCoords( event ) {
    lat.value = event.latLng.lat();
    lng.value = event.latLng.lng();
  }
  function addMark( event ) {
    var coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    
    var marker = new google.maps.Marker({
      position: coords,
      map: map
    })
    
    return marker;
  }
};
  
changeCoordsBtn.addEventListener( "click", changeCoordsPermit );
  
function changeCoordsPermit() {
  event.preventDefault();
  lat.readOnly = false;
  lng.readOnly = false;
};
  
  
  
  
  
/*==================== Save data ================================*/
  
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
  
function saveOnClickTo( event, callback ) {
  var note = saveNotation( event );
  
  if( note ){
    callback( note );
  }
  else { 
    return;
  }
}

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
  
function saveNotation( event ) {
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
  function createErrorMessage( emptyInputs ) {
    var errorElement = document.querySelector( ".form-record__error-message" );
    var message = "";
    
    form.setAttribute( "data-error", "invalid" )
    emptyInputs.forEach( function( el, i, arr ) {
      if( i == ( arr.length - 1 ) ) {
        message += "<a href=#" + el + "> " + el + "</a>" + ".";
      }
      else {
        message += "<a href=#" + el + "> " + el + "</a>" + ", ";
      }
    });

    errorElement.innerHTML = "Please fill empty fields:" + message;
  };
  function deleteErrorMessage() {
    var errorElement = form.querySelector( ".form-record__error-message" );
    
    if( form.getAttribute( "data-error" ) == "invalid" && errorElement ) {
      errorElement.parentElement.removeChild( errorElement );
      form.setAttribute( "data-error", "valid" )
    }
    else {
      return;
    }
  };
  function getStarsValue( starsArray ){
    for( var i = 0; i < starsArray.length; i++ ) {

      if( starsArray[i].checked == true ) {
        return starsArray[i];
      }
    }
  };
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
  function Notation( inputsArray, imagesArray ) {
    for( var i = 0; i < inputsArray.length; i++ ){
      var name = inputsArray[i].name;
      var value = inputsArray[i].value;
      this[name] = value;
    }
    this.images = imagesArray;
  };
};

  
  
  
  

/*  
function checkInputsValue( inputs ) {
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
}
function createErrorMessage( emptyInputs ) {
  var errorElement = document.querySelector( ".form-record__error-message" );
  var message = "";
  
  emptyInputs.forEach( function( el, i, arr ) {
    if( i == ( arr.length - 1 ) ) {
      message += "<a href=#" + el + "> " + el + "</a>" + ".";
    }
    else {
      message += "<a href=#" + el + "> " + el + "</a>" + ", ";
    }
  });
  
  errorElement.innerHTML = "Please fill empty fields:" + message;
}


function getStarChecked( starsArray ){
  for( var i = 0; i < starsArray.length; i++ ) {
    
    if( starsArray[i].checked == true ) {
      return starsArray[i];
    }
  }
}

function toArray( inputsList, starInput ) {
  var array = [];
  
  for( var i = 0; i < inputsList.length; i++ ) {
    array[i] = inputsList[i];
  }
  
  if( starInput ){
    array.push( starInput );
  }
  
  return array;
}  
  
function Record( inputsArray, imagesArray ) {
  for( var i = 0; i < inputsArray.length; i++ ){
    var name = inputsArray[i].name;
    var value = inputsArray[i].value;
    this[name] = value;
  }
  this.images = imagesArray;
}
  */
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
})();
