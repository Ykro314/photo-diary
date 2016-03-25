define( function(){
"use strict"
/**
* @constructor
* @param {object} data
*/
  
function HotelData( data ) {
  this.params = data;
}
  
  
  
HotelData.prototype.getTitle = function() {
  return this.params.title;
}
HotelData.prototype.getDateString = function() {
  return this.params.date[0];
}
HotelData.prototype.getDateInMilliseconds = function() {
  return this.params.date[1];
}
HotelData.prototype.getDescription = function() {
  return this.params.description;
}
HotelData.prototype.getRange = function() {
  return this.params.range;
}
HotelData.prototype.getStars = function() {
  return this.params.stars;
}
HotelData.prototype.getImages = function() {
  return this.params.images;
}
HotelData.prototype.getImagesLength = function() {
  return this.params.images.length;
}
HotelData.prototype.getImgFile = function( x ) {
  return this.params.images[x].file
}



//window.HotelData = HotelData;
return HotelData;  
});