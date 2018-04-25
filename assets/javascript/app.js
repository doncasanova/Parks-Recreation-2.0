// $(".test").text('<p>test one two three</p>')


$(document).ready(function() {
    $('#map').usmap({
      'stateSpecificStyles': {
        'AK' : {fill: '#f00'}
      },
      'stateSpecificHoverStyles': {
        'HI' : {fill: '#ff0'}
      },
      
      'mouseoverState': {
        'HI' : function(event, data) {
          //return false;
        }
      },
      
      
      'click' : function(event, data) {
        $('#alert')
          .text('Click '+data.name+' on map 1')
          .stop()
          .css('backgroundColor', '#ff0')
          .animate({backgroundColor: '#ddd'}, 1000);
      }
    });
    
    $('#map2').usmap({
      'stateStyles': {
        fill: '#025', 
        "stroke-width": 1,
        'stroke' : '#036'
      },
      'stateHoverStyles': {
        fill: 'teal'
      },
      
      'click' : function(event, data) {
        $('#alert')
          .text('Click '+data.name+' on map 2')
          .stop()
          .css('backgroundColor', '#af0')
          .animate({backgroundColor: '#ddd'}, 1000);
      }
    });
    
    $('#over-md').click(function(event){
      $('#map').usmap('trigger', 'MD', 'mouseover', event);
    });
    
    $('#out-md').click(function(event){
      $('#map').usmap('trigger', 'MD', 'mouseout', event);
    });
  });

  $('#map').usmap({
    // The click action
    click: function(event, data) {
      $('#clicked-state')
        .text('You clicked: '+data.name)
        // .parent().effect('highlight', {color: '#C7F464'}, 2000);
    }
  });