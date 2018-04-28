
// Vars for Google Map
var latitude = 36.964;
var longitude = -122.015;

// Var for clickable usa-map
var mapClickedState = '';

// Gets called automatically, and upon park-click
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: latitude, lng: longitude },
    zoom: 18,
    mapTypeId: 'satellite'
  });
  map.setTilt(45);
}


$(document).ready(function () {

  $('#usa').usmap(
    {
      'click': function (event, data) {
        console.log('click1')

        mapClickedState = data.name;

        $('#clicked-state').text('You clicked: ' + mapClickedState)

        console.log("State: " + mapClickedState);
        $("#table-header-state").text(mapClickedState);
        displayParkInfo(mapClickedState);

        $("#table-header-state2").text(mapClickedState);

        $('#alert')
          .text('Click ' + data.name + ' on map 1')
          .stop()
          .css('backgroundColor', '#ff0')
          .animate({ backgroundColor: '#ddd' }, 1000);

        // here
        $("#myModal").modal('show');
        console.log("modal should pop up");

      }
    });


  function displayParkInfo(state) {

    // var state = $(this).attr("data-state");
    var queryURL = "https://developer.nps.gov/api/v1/parks?stateCode="
      + state + "&fields=images"
      + "&api_key=AIE9qvgTDNGyGQtR69wMNpjX7oRVXmYD1bFPlnmU";

    // Creating an AJAX call
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      console.log(response.data)

      // Clear the table
      $("#parks-table-body").empty();
      for (var i = 0; i < response.data.length; i++) {
        // console.log("Park-" + (i + 1) + " " + response.data[i])
        var parkObj = response.data[i];
        console.log(parkObj.designation);
        if (parkObj.designation !== 'National Scenic Trail') {
          $("#parks-table-body").append(`<tr class="park-row" data-latlon="${parkObj.latLong}"><td>${parkObj.fullName}</td><td><a href="${parkObj.url}" target="_blank">Park Website</a></td><td>${parkObj.description}</td><td style="display:none;">${parkObj.latLong}</td><td><img src=${parkObj.images[0].url} height=100 width=100></img></td></tr>`)
        }
      }
    });
  }

  // Click event listener for park row
  $(document.body).on("click", ".park-row", function () {
     var lat = parseInt($(this).attr('data-latlon').split(',')[0].slice(4,20));
     var lon = parseInt($(this).attr('data-latlon').split(',')[1].slice(6,20));
    //  console.log("lat: " + lat + " lon: " + lon)

     latitude = lat;
     longitude = lon;
     initMap();
  })


}); // On Doc Ready

// map looper


// array of state names
// to be collected from API
const states = ['al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'dc', 'fl', 'ga', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'wa', 'wv', 'wi', 'wy'];

// set counter
var i = 0;

// path for state map image
srcA = "https://www.nps.gov/state/";
srcB = "/index.htm";




// myLoop();                      //  start the loop

var a = setInterval(function(){
  document.getElementById("rotator").src = srcA + states[i] + srcB;
  i++;
  if (i == 50){
    i = 0;
  }
},10000);



function abortTimer() { // to be called when you want to stop the timer
  console.log("hello");
  clearInterval(a);
}

abortTimer();