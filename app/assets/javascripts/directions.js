var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
var map;
var start;
var end;
var geocoder;
var service;
var waypoints;
var index;

function initialize() {
  var mapOptions = {
    zoom: 4,
    center: {lat: 39.091919, lng: -94.5757195},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("directions-panel"));
}

function geocodeAddress(input, callback) {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': input }, callback);
}

function convertGeocodeObjectToLatLng(results) {
  var latlng = results[0].geometry.location;
  return new google.maps.LatLng(latlng["H"], latlng["L"]);
}

function calculateMidpoint(origin, destination) {
  var midpoint = google.maps.geometry.spherical.interpolate(origin, destination, 0.5);
  return midpoint
}

function calculateDistance(origin, destination) {
  var distance = google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
  return distance;
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
  var place = results[index];
  if (place) {
    waypoints.push({
      location: place.geometry.location,
      stopover: true
    });
    createMarker(place);
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

function displayRoute(start, end, place) {
  $('#place-title').append(place.name);
  $('#next-button').append("<a class='btn btn-default btn-lg' id='next-button' href='#' role='button'>Try something else</a>");
  $('#directions-button').append("<a class='btn btn-default btn-lg' id='directions-button' href='#' role='button'>See directions</a>");
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
  $('#place-title').append("You may have to stay on the beaten path this time...");
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

function execute() {
  $('#place-title').empty();
  $('#next-button').empty();
  $('#directions-button').empty();
  waypoints = [];
  start = document.getElementById("origin-field").value;
  end = document.getElementById("destination-field").value;
  initialize();

  geocodeAddress(start, function(results) {
    debugger;
    var origin = convertGeocodeObjectToLatLng(results);
    debugger;
    geocodeAddress(end, function (results) {
      var destination = convertGeocodeObjectToLatLng(results);
      debugger;
      var distance = calculateDistance(origin, destination);
      var midpoint = calculateMidpoint(origin, destination);
      conductSearch(midpoint, distance);
      var placeTitle = $('#place-title');
      $('body').animate({scrollTop: placeTitle.offset().top},'slow');
    })
  });
}

$(document).ready(function() {
  index = 0;
  $('#route-submit').click();
  initialize();
  
  $('#route-submit').on('click', function() {
    execute();
  });
  
  $('#directions-button').on('click', function() {
    var directions = $('#directions-row');
    $('body').animate({scrollTop: directions.offset().top},'slow');
  });
  
  $('#next-button').on('click', function() {
    index += 1;
    initialize();
    execute();
  })
});
