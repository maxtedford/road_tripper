$(document).ready( function() {
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var geocoder;
  var map;
  var service;
  var waypoints;
  var start;
  var end;
  
  $('#route-submit').on('click', function() {

    waypoints = [];
    start = document.getElementById("origin-field").value;
    end = document.getElementById("destination-field").value;
    initialize();

    geocodeAddress(start, function (results) {
      var origin = convertGeocodeObjectToLatLng(results);
      geocodeAddress(end, function (results) {
        var destination = convertGeocodeObjectToLatLng(results);
        
        var distance = calculateDistance(origin, destination);
        var midpoint = calculateMidpoint(origin, destination);
        conductSearch(midpoint, distance);
      })
    });
  });

  function geocodeAddress(input, callback) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': input }, callback); 
  }
  
  function convertGeocodeObjectToLatLng(results) {
    return new google.maps.LatLng(results[0].geometry.location["G"], results[0].geometry.location["K"]);
  }

  function initialize() {
    map = new google.maps.Map(document.getElementById("map-canvas"));
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
    $('#place-title').append(results[0].name);
    waypoints.push({
      location: results[0].geometry.location,
      stopover: true 
    });
    createMarker(results[0]);
    displayRoute(start, end);
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

  function displayRoute(start, end) {
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
});
