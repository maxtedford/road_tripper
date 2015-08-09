$(document).ready( function() {
  
  $('#route-submit').on('click', function() {
    var map;
    var service;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var geocoder = new google.maps.Geocoder();
    var startPoint = document.getElementById("origin-field").value;
    var endPoint = document.getElementById("destination-field").value;
    var origin = codePoint(startPoint, geocoder);
    var destination = codePoint(endPoint, geocoder);
    initialize();
    displayRoute(startPoint, endPoint, directionsService, directionsDisplay);

    
    function initialize() {
      map = new google.maps.Map(document.getElementById("map-canvas"));
      directionsDisplay.setMap(map);
    }
  });
});

function codePoint(input, geocoder) {
  geocoder.geocode( { 'address': input }, function(results, status) {
    debugger;
    if (status == google.maps.GeocoderStatus.OK) {
      return new google.maps.LatLng(results[0].geometry.location["G"], results[0].geometry.location["K"]);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function displayRoute(startPoint, endPoint, directionsService, directionsDisplay) {
  var request = {
    origin : startPoint, 
    destination : endPoint,
    travelMode : google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function searchPlaces(service) {
  console.log(origin);
  service = new google.maps.places.PlacesService();
  var searchArea = new google.maps.LatLngBounds(origin, destination);
  var request = {
    bounds:searchArea,
    types:["amusement_park", "aquarium", "art_gallery", "museum", "stadium", "zoo"]
  };
  service.radarSearch(request, function(response, status) {
    if (status == google.maps.PlacesServiceStatus.OK) {
    }
  })
}
