$(document).ready( function() {
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var geocoder;
  var map;
  var service;
  
  $('#route-submit').on('click', function() {

    var start = document.getElementById("origin-field").value;
    var end = document.getElementById("destination-field").value;
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
    
    displayRoute(start, end);
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
      types: ["amusement_park", "aquarium", "art_gallery", "museum", "stadium", "zoo"],
      rankBy: google.maps.places.RankBy.PROMINENCE
    };
    service.nearbySearch(request, callback);
  }

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var waypoints = [];
      var place = results.slice(0, 1);
      waypoints.push({
        location: place.geometry.location,
        stopover: false
      });
      createMarker(place[0]);
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

  function displayRoute(start, end, waypoints) {
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
