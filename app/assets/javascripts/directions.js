$('document').ready( function() {

  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var map;

  function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var kansasCity = new google.maps.LatLng(39.091919, -94.5757195);
    var mapOptions = {
      zoom:7,
      center: kansasCity
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsDisplay.setMap(map);
  }

  function calcRoute() {
    var origin = gon.origin;
    var destination = gon.destination;
    var request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
      }
    });
  }
  
});
