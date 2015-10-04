/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.'
  
});

main.show();

main.on('click', 'up', function(e) {
  console.log("clicked up af");
  
  //ajax request to backend
  ajax({
    url: 'http://localhost:3000/orders',
    method: 'GET',
    type: 'json',
  },
  function(data) {
    console.log("succeeded ajax");
    //console.log(data);
    var menu = new UI.Menu({
      sections: [{
        items: [{
          title: data.message,
          subtitle: data.orderNums
        }]
      }]
    });
    
    menu.on('select', function(e) {
      console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
      console.log('The item is titled "' + e.item.title + '"');
    });
  
    menu.show();
  },
  function(error) {
    // Failure!
    console.log(error);
  }
);
  
});
  
