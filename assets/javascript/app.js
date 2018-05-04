
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBdH8fV6qTKI6xTkplHXw-rhvDXGU5fpKI",
  authDomain: "parksandrecreation2-69d5a.firebaseapp.com",
  databaseURL: "https://parksandrecreation2-69d5a.firebaseio.com",
  projectId: "parksandrecreation2-69d5a",
  storageBucket: "",
  messagingSenderId: "253408839338"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Vars for Google Map
var latitude = 36.964;
var longitude = -122.015;

// Var for clickable usa-map
var mapClickedState = '';
var parkClicked = '';

// Gets called automatically, and upon park-click
// Signature must reamain w/o parameters as defined in url callback
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: latitude, lng: longitude },
    zoom: 18,
    mapTypeId: 'satellite'
  });
  // map.setTilt(45);
}



// On Document Ready
$(document).ready(function () {

  $(".usa-wrapper").hide("fast", function () {
  });

  // usmap click function
  $('#usa').usmap(
    {
      'click': function (event, data) {

        mapClickedState = data.name;

        // $('#clicked-state').text('You clicked: ' + mapClickedState)

        $("#table-header-state").text(mapClickedState);
        displayParkInfo(mapClickedState);
        $("#table-box").show();


        //brings list div in
        $('.hidden-stuff').addClass('active');
        
        // Upvote the state's popularity in firebase
        upsertStateClicks(mapClickedState);

      }
    });


  function displayParkInfo(state) {

    var queryURL = "https://developer.nps.gov/api/v1/parks?stateCode="
      + state + "&fields=images"
      + "&api_key=AIE9qvgTDNGyGQtR69wMNpjX7oRVXmYD1bFPlnmU";

    // Creating an AJAX call
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      // Clear the table
      $("#parks-table-body").empty();
      for (var i = 0; i < response.data.length; i++) {
        parkClicked = response.data[i];
        var parkObj = response.data[i];
        if (parkObj.designation.toLowerCase().indexOf("trail") == -1 && parkObj.images.length > 0) {
          $("#parks-table-body").append(`<tr class="park-row" data-latlon="${parkObj.latLong}">
                                         <td>${parkObj.fullName}</td>
                                         <td><a href="${parkObj.url}" target="_blank">Park Website</a></td>
                                         <td style="display:none;">${parkObj.description}</td>
                                         <td style="display:none;">${parkObj.latLong}</td>
                                         <td><img src=${parkObj.images[0].url} height=100 width=100></img></td>
                                         <td><a href="https://www.google.com/search?q=hotels+near+${parkObj.fullName.replace(/\s/g, "+")},${mapClickedState}" target="_blank">Hotels</a></td></tr>`)
        }
      }
    });
  }

  // Click event listener for park row
  $(document.body).on("click", ".park-row", function () {
    var lat = parseFloat($(this).attr('data-latlon').split(',')[0].slice(4, 20));
    var lon = parseFloat($(this).attr('data-latlon').split(',')[1].slice(6, 20));

    // Set globals for initMap function
    latitude = lat;
    longitude = lon;
    // initMap();

    // Un-hide Google-btn
    // $("#google-modal-btn").show();
  })


  // Click event listener for park row -> img
  $('body').on("click", ".park-row img", function () {
    console.log("Building Modal, add Spinner!")
    var $tr = $(this).closest('tr');
    var parkName = $tr.find('td:first-child').text().trim();
    var parkDescription = $tr.find('td:nth-child(3)').text();
    var flickrFeed = `https://api.flickr.com/services/feeds/photos_public.gne?&tags=${parkName.replace(/\s/g, "+")}&tagmode=any&format=json&jsoncallback=?`;

    $("#pic-collage").empty();
    $("#pic-collage").append(`<p>${parkName}</p>`);
    $.getJSON(flickrFeed, function (data) {
      for (var i = 0; i < data.items.length; i++) {
        $("#pic-collage").append(`<img style="margin:5px;" src="${data.items[i].media.m}">`)
      }
    }).then(function (result) {
      $("#pic-collage").append(`<p>${parkDescription}</p>`);
      $("#modal2").modal('open');
    })
  })

  // A user has just upvoted (clicked) a state, 
  //    so either increment its current popularity if it has an existing record
  //    or else create a new database record for the state and start it at 1
  function upsertStateClicks(state) {
    var hitCount = 0;
    var curClicks = 1;
    var pKey = '';

    // Query dbref and get pkey if state record exists
    database.ref().once("value", snapshot => snapshot.forEach(
      function (child) {
        var dbRec = child.val();
        if (dbRec.stateName == state) {
          hitCount++;
          curClicks = dbRec.numClicks;
          pKey = child.key;
        }
      }))
      .then(function (result) {
        // Use the Firebase .push() method for New and .update() for Existing record
        if (hitCount > 0 && pKey) {
          database.ref().child(pKey).update({
            stateName: state,
            numClicks: curClicks + 1
          })
        } else {
          database.ref().push({
            stateName: state,
            numClicks: 1
          })
        }
      })

  }

}); // On Doc Ready



// set counter
// var i = 0;
var ii = 0;


// path for national park images
srcC = "assets/img/";
srcD = ".jpg";

// nav bar
$(document).ready(function () {
  $(".button-collapse").sidenav();
});

$(document).ready(function () {
  $('.sidenav').sidenav();
});

// carousel
$(document).ready(function () {
  $('.carousel').carousel();

  setInterval(function () {
    $('.carousel').carousel('next');
  }, 4500);
});



//modal button
$(document).ready(function () {
  $('.modal').modal();
});

$(".btn-floating").on("click", function () {
  $('.hidden-stuff').removeClass('active');

})

$("#start").on("click", function () {
  $('#start').hide();
  $(".usa-wrapper").show("slow", function () {
  });
})