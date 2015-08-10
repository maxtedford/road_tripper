$(document).ready( function() {
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var geocoder;
  var map;
  var service;
  //geocodeAddress(start);
  //geocodeAddress(end);
  
  $('#route-submit').on('click', function() {

    var start = document.getElementById("origin-field").value;
    var end = document.getElementById("destination-field").value;
    var origin = new google.maps.LatLng(34.0522342, -118.2436849);
    var destination = new google.maps.LatLng(40.7127837, -74.00594130000002);
    var midpoint = calculateMidpoint(origin, destination);
    var midDistance = calculateDistance(origin, midpoint);
    
    initialize();
    conductSearch(midpoint, midDistance);
    displayRoute(start, end);
    
    //function geocodeAddress(input) {
    //  geocoder = new google.maps.Geocoder();
    //  geocoder.geocode( { 'address': input}, function(results, status) {
    //   if (status == google.maps.GeocoderStatus.OK) {
    //     latlng = new google.maps.LatLng(results[0].geometry.location["G"], results[0].geometry.location["K"]);
    //     return latlng;
    //   } else {
    //     alert("Geocode was not successful for the following reason: " + status);
    //   }
    //  })
    //}
    
  });

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
    request = {
      location: midpoint,
      radius: distance,
      types: ["amusement_park", "aquarium", "art_gallery", "museum", "stadium", "zoo"],
      rankBy: google.maps.places.RankBy.PROMINENCE
    };
    service.nearbySearch(request, callback);
  }

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var waypts = [];
      place = results.slice(0, 1);
      createMarker(place);
      waypts.push({
        location:place.geometry.location,
        stopover:true
      });
      return waypts;
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
    midpoint = google.maps.geometry.spherical.interpolate(origin, destination, 0.5);
    return midpoint
  }
  
  function calculateDistance(origin, destination) {
    distance = google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
    return distance;
  }

  function displayRoute(start, end) {
    var request = {
      origin : start,
      destination : end,
      travelMode : google.maps.TravelMode.DRIVING,
      waypoints : waypts,
      optimizeWaypoints: true
    };
    debugger;
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  }
});
