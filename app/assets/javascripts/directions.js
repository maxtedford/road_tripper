var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
var geocoder;
var map;
var service;
var waypoints;
var start;
var end;

function geocodeAddress(input, callback) {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': input }, callback);
}

function convertGeocodeObjectToLatLng(results) {
  var latlng = results[0].geometry.location;
  return new google.maps.LatLng(latlng["G"], latlng["K"]);
}

function extractCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(coords);
    debugger;
  } else {
    var x = document.getElementById("map-canvas");
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function coords(position) {
  var coordinates = new google.maps.LatLng({ 
    lat: position.coords.latitude,
    lng: position.coords.longitude });
  initialize(coordinates)
}

function initialize() {
  var mapOptions = {
    zoom: 4,
    center: {lat: 39.091919, lng: -94.5757195},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  directionsDisplay.setMap(map);
}

function conductSearch(midpoint, distance) {
  service = new google.maps.places.PlacesService(map);
  if (distance > 50000) {
    distance = '50000'
  } else {
    distance = distance.toString()
  }
  var request = {
    location: midpoint,
    radius: distance,
    types: ["amusement_park", "aquarium", "art_gallery", "museum", "zoo"],
    rankBy: google.maps.places.RankBy.PROMINENCE
  };
  service.nearbySearch(request, renderPointOfInterest);
}

function renderPointOfInterest(results) {
  var place = results[0];
  if (place) {
    waypoints.push({
      location: place.geometry.location,
      stopover: true
    });
    createMarker(results[0]);
    displayRoute(start, end, place);
  } else {
    displaySimpleRoute(start, end);
  }
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    position: place.geometry.location,
    title: place.html_attributions.name
  });
  marker.setMap(map);
}

function calculateMidpoint(origin, destination) {
  var midpoint = google.maps.geometry.spherical.interpolate(origin, destination, 0.5);
  return midpoint
}

function calculateDistance(origin, destination) {
  var distance = google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
  return distance;
}

function displayRoute(start, end, place) {
  $('#place-title').append(place.name);
  var request = {
    origin : start,
    destination : end,
    travelMode : google.maps.TravelMode.DRIVING,
    waypoints : waypoints,
    optimizeWaypoints: true
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function displaySimpleRoute(start, end) {
  $('#place-title').append("You may have to stay on the beaten path for this one...");
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

$(document).ready(function() {
  
  initialize();
  
  $('#route-submit').click();
  
  $('#route-submit').on('click', function(e) {

    var placeTitle = $('#place-title');
    $('body').animate({scrollTop: placeTitle.offset().top},'slow');

    $('#place-title').empty();
    waypoints = [];
    start = document.getElementById("origin-field").value;
    end = document.getElementById("destination-field").value;
    initialize();

    geocodeAddress(start, function(results) {
      var origin = convertGeocodeObjectToLatLng(results);
      geocodeAddress(end, function (results) {
        var destination = convertGeocodeObjectToLatLng(results);
        
        var distance = calculateDistance(origin, destination);
        var midpoint = calculateMidpoint(origin, destination);
        conductSearch(midpoint, distance);
      })
    });
  });
});
