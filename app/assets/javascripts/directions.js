$(document).ready( function() {
  
  $('#route-submit').on('click', function() {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var map;
    initialize();
    displayRoute();

    function initialize() {
      map = new google.maps.Map(document.getElementById("map-canvas"));
      directionsDisplay.setMap(map);
    }

    function displayRoute() {

      var start = document.getElementById("origin-field").value;
      var end = document.getElementById("destination-field").value;

      var request = {
        origin : start,
        destination : end,
        travelMode : google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });
    }
  });
});
