var renderBtn = document.querySelector( ".articles__render" );
var articlesNav = document.querySelector( ".articles__buttons-nav" );

//renderBtn.addEventListener( "mousedown", renderArticles);

articlesNav.addEventListener( "mousedown", function( event ) {
  switch( event.target.id ) {
    case "render": 
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
  };
});

function setBtnToActive ( btn ) {
  var buttons = articlesNav.children;
  for( i = 0; i < buttons.length; i++ ) {
    buttons[i].classList.remove( "active" );
  }
  btn.classList.add( "active" );
}

function render( event, sortFunction ) {
  var noteArray = JSON.parse( localStorage.getItem( "noteArray" ) );
  var articlesContainer = document.querySelector( ".articles__container" );
  var fragment = document.createDocumentFragment();
  
  event.preventDefault();
  articlesContainer.innerHTML = "";
  
  if( noteArray ) {
    if ( sortFunction ) {
      var arrayCopy = noteArray.slice( 0 );
      noteArray = sortFunction( arrayCopy );
    }
    traverseAll( noteArray, fragment );
    articlesContainer.appendChild( fragment );
    for( i = 0; i < 4; i++ ){
      articlesContainer.innerHTML += articlesContainer.innerHTML;
    }
  }
  else {
    console.log( "localStorage is empty" );
    return;
  }
};

function traverseAll( array, fragment ) {
  var template = document.getElementById( "article-template" );
  
  array.forEach( function( el, i, arr) {
    var templ = template.content.children[0].cloneNode( true );
    var noteObject = array[i];
    fillArticlesTemplate( templ, noteObject );
    fragment.appendChild( templ );
  });
};

function sortByStarsIncrease( array ) {  
  return array.sort( function( a, b ) {
    return a.stars - b.stars;
  });
};
function sortByRangeDecrease( array ) {
  return array.sort( function( a, b ) {
    return parseInt( b.range ) - parseInt( a.range );
  });
};
function sortByPhotoAmount( array ) {
  return array.sort( function( a, b ) {
    return a.images.length - b.images.length;
  });
};


  
function fillArticlesTemplate( template, articleObj ) {
  var descr = template.querySelector( ".item__description" );
  var title = template.querySelector( ".item__title" );
  var date = template.querySelector( ".item__date" );
  var range = template.querySelector( ".item__range" );
  var stars = template.querySelector( ".item__stars" );
  var photos = template.querySelector( ".item__files" );
  var backgroundImg = template.querySelector( "img" );

  descr.textContent = articleObj.description.slice( 0, 250 )+ "...";
  title.textContent = articleObj.title;
  date.textContent = articleObj.date;
  range.textContent += articleObj.range;
  stars.textContent += articleObj.stars;
  photos.textContent += articleObj.images.length;
  if ( articleObj.images.length ) {
    backgroundImg.src = articleObj.images[0].file;
    backgroundImg.alt = articleObj.images[0].alt;
  };
}

//function renderArticles( event ) {
//  
//  var noteArray = JSON.parse( localStorage.getItem( "noteArray" ) );
//  var articlesContainer = document.querySelector( ".articles__container" );
//  articlesContainer.innerHTML = "";
//  
//  if ( noteArray ) {
//    var template = document.getElementById( "article-template" );
//
//    event.preventDefault();
//    renderBtn.textContent = "Refresh";
//    
//    noteArray.forEach( function( el, i, arr) {
//      var templ = template.content.children[0].cloneNode( true );
//      var noteObject = noteArray[i];
//
//      articlesContainer.appendChild( templ );
//      fillArticlesTemplate( templ, noteObject )
//    });
//  }
//  else {
//    console.log( "localStorage is empty" );
//  }
//}