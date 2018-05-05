
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
// var latitude = 36.964;
// var longitude = -122.015;

// Var for clickable usa-map
var mapClickedState = '';
var parkClicked = '';

// Gets called automatically, and upon park-click
// Signature must reamain w/o parameters as defined in url callback
// function initMap() {
//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: { lat: latitude, lng: longitude },
//     zoom: 18,
//     mapTypeId: 'satellite'
//   });
//   // map.setTilt(45);
// }



// On Document Ready
$(document).ready(function () {

  $(".usa-wrapper").hide("fast", function () {
  });

  // usmap click function
  $('#usa').usmap(
    {
      'click': function (event, data) {

        mapClickedState = data.name;

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
  // $(document.body).on("click", ".park-row", function () {
  //   var lat = parseFloat($(this).attr('data-latlon').split(',')[0].slice(4, 20));
  //   var lon = parseFloat($(this).attr('data-latlon').split(',')[1].slice(6, 20));

  //   // Set globals for initMap function
  //   latitude = lat;
  //   longitude = lon;
  //   // initMap();

  //   // Un-hide Google-btn
  //   // $("#google-modal-btn").show();
  // })


  // Click event listener for park row -> img
  $('body').on("click", ".park-row img", function () {
    var $tr = $(this).closest('tr');
    var parkName = $tr.find('td:first-child').text().trim();
    var parkDescription = $tr.find('td:nth-child(3)').text();
    var flickrFeed = `https://api.flickr.com/services/feeds/photos_public.gne?&tags=${parkName.replace(/\s/g, "+")}&tagmode=any&format=json&jsoncallback=?`;

    $("#pic-collage").empty();
    $("#pic-collage").append(`<p>${parkName}</p>`);
    $.getJSON(flickrFeed, function (data) {
      makeThemWait(true);
      for (var i = 0; i < data.items.length; i++) {
        $("#pic-collage").append(`<img style="margin:5px;" src="${data.items[i].media.m}">`)
      }
    }).then(function (result) {
      $("#pic-collage").append(`<p>${parkDescription}</p>`);
      makeThemWait(false);
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

  // nav bar
  $(document).ready(function () {
    $(".button-collapse").sidenav();
  });

  // sidenav bar (hamburger)
  $(document).ready(function () {
    $('.sidenav').sidenav();
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

  function makeThemWait(isLoading) {
    // Create the HTML string
    var element = '<div class="spinner-overlay"><div class="spinner"></div></div>',
      body = document.querySelector('body');

    // append HTML string to body
    if (isLoading === true) {
      body.insertAdjacentHTML('beforeend', element);

      var spinnerOverlay = document.querySelector(".spinner-overlay"), // your spinner overlay
        spinner = document.querySelector(".spinner"),
        overlayStyles = spinnerOverlay.style, // var to allow styles control
        spinnerStyles = spinner.style;

      // styling the overlay
      overlayStyles.display = "block";
      overlayStyles.position = "absolute";
      overlayStyles.top = "0";
      overlayStyles.left = "0";
      overlayStyles.right = "0";
      overlayStyles.bottom = "0";
      overlayStyles.backgroundColor = "rgba(255,255,255,0.5)";

      // styling the spinner
      spinnerStyles.width = "80px";
      spinnerStyles.height = "80px";
      spinnerStyles.borderRadius = "50%";
      spinnerStyles.borderTop = "8px solid #D51067";
      spinnerStyles.borderLeft = "8px solid transparent";
      spinnerStyles.borderRight = "8px solid transparent";
      spinnerStyles.borderBottom = "8px solid transparent";
      spinnerStyles.margin = "calc(48vh - 40px) auto";
      spinnerStyles.boxSizing = "border-box";

      // Below lines are tweakable to fit your needs in term of spin properties and time.
      // Here the spinner will make 2 full spins each seconds for 5 min. ((360deg * 2) * 300s)
      spinnerStyles.transition = "transform 300s linear";
      setTimeout(function () {
        spinnerStyles.transform = "rotate(216000deg)";
      }, 100);


    }

    if (!isLoading) {
      var spinnerOverlay = document.querySelector(".spinner-overlay"); // your spinner overlay
      body.removeChild(spinnerOverlay);
    }
  }


}); // On Doc Ready



function aud_play_pause() {
  var myAudio = document.getElementById("myTune");
  if (myAudio.paused) {
    myAudio.play();
  } else {
    myAudio.pause();
  }
}