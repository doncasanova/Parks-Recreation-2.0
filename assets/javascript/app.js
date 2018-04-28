
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 36.964, lng: -122.015 },
    zoom: 18,
    mapTypeId: 'satellite'
  });
  map.setTilt(45);
}

// $(".test").text('<p>test one two three</p>')
var mapClickedState = '';

$(document).ready(function () {

  $('#usa').usmap({
    'stateSpecificStyles': {
      'AK': { fill: '#f00' }
    },
    'stateSpecificHoverStyles': {
      'HI': { fill: '#ff0' }
    },

    'mouseoverState': {
      'HI': function (event, data) {
        //return false;
      }
    },


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

  // $('#map2').usmap({
  //   'stateStyles': {
  //     fill: '#025',
  //     "stroke-width": 1,
  //     'stroke': '#036'
  //   },
  //   'stateHoverStyles': {
  //     fill: 'teal'
  //   },

  //   'click': function (event, data) {
  //     console.log('click2')
  //     $('#alert')
  //       .text('Click ' + data.name + ' on map 2')
  //       .stop()
  //       .css('backgroundColor', '#af0')
  //       .animate({ backgroundColor: '#ddd' }, 1000);
  //   }
  // });

  $('#over-md').click(function (event) {
    $('#usa').usmap('trigger', 'MD', 'mouseover', event);
  });

  $('#out-md').click(function (event) {
    $('#usa').usmap('trigger', 'MD', 'mouseout', event);
  });


  $('#usa').usmap({
    // The click action
    click: function (event, data, ) {

      console.log('usa map click');

      $('#clicked-state').text('You clicked: ' + data.name)
      mapClickedState = data.name;
      console.log("State: " + mapClickedState);
      $("#table-header-state").text(stateClicked);
      displayParkInfo(mapClickedState);
      // .parent().effect('highlight', {color: '#C7F464'}, 2000);
    }
  });
  // From HTML2   /////////////////////////////////////

  // var states = ["Wisconsin", "Minnesota", "Iowa", "Michigan"];
  // var states = ["WI", "MN", "IA", "MI"];

  function displayParkInfo(state) {


    // var state = $(this).attr("data-state");
    var queryURL = "https://developer.nps.gov/api/v1/parks?stateCode="
      + state
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
        $("#parks-table-body").append(`<tr class="park-row"><td>${parkObj.parkCode}</td><td>${parkObj.designation}</td><td>${parkObj.description}</td><td>${parkObj.latLong}</td></tr>`)

      }

    });

  }

  // function renderButtons() {
  //   $("#buttons-view").empty();

  //   // Looping through the array of states
  //   for (var i = 0; i < states.length; i++) {
  //     var a = $("<button>");
  //     // Adding a class
  //     a.addClass("state-btn");
  //     // Adding a data-attribute
  //     a.attr("data-name", states[i]);
  //     // Providing the initial button text
  //     a.text(states[i]);
  //     // Adding the button to the buttons-view div
  //     $("#buttons-view").append(a);
  //   }
  // }
  // renderButtons();


  // Adding a click event listener
  // $(document).on("click", ".state-btn", displayParkInfo($(this).attr('data-name')));
  $(document).on("click", ".state-btn", function () {
    // console.log("State: " + $(this).attr('data-name'));
    var stateClicked = $(this).attr('data-name');
    $("#table-header-state").text(stateClicked);
    displayParkInfo(stateClicked);
   
  })


  // From HTML3  ///////////////////////////////////

});