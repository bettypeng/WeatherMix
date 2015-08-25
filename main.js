// Declare global variables to be used in multiple functions:
var icon; // Short phrase that describes current weather. Used to determine background.
var today = "Today's Forecast"; //Saves information on today's forecast
var forecastarray = []; //Saves information in 4-day forecast
var conditions = []; //Saves information on current conditions

$(document).ready(function() {
  //Local variables:
  var ftemp = false; //Boolean for fahrenheit/celsius toggle
  //Saving HTML <p>s that hold high and low temps forecast: to be accessed during F/C toggle
  var phi0 = "phi0";
  var plo0 = "plo0";
  var phi1 = "phi1";
  var plo1 = "plo1";
  var phi2 = "phi2";
  var plo2 = "plo2";
  var phi3 = "phi3";
  var plo3 = "plo3";

  //Using Wunderground API for local weather information
  $.ajax({
    url: "http://api.wunderground.com/api/c91fc7a85fd626ee/geolookup/conditions/forecast/q/autoip.json",
    dataType: "jsonp",
    success: function(parsed_json) {
      var place = parsed_json['location'];
      conditions = parsed_json['current_observation'];
      icon = conditions['icon'];
      today = parsed_json['forecast']['txt_forecast']['forecastday']; //current conditions
      var v1 = parsed_json['forecast']['simpleforecast']['forecastday']; //4-day forecast

      background(); 
      $("#location").text(place['city'] + ", " + place['state']);
      $("#image").append("<img src='" + conditions['icon_url'] + "'/>");
      weather("F", "temp_f", "feelslike_f", "fcttext");
      $('#now').text("Current Conditions: " + conditions['weather']);

      for (i = 0; i < 4; i++) { 
        //Make a dictionary, key is day #, value is array of temps
        forecastarray[i] = [v1[i]['high']['fahrenheit'] + '°F', v1[i]['high']['celsius'] + '°C', v1[i]['low']['fahrenheit'] + '°F', v1[i]['low']['celsius'] + '°C'];
        // even indices (0,2) hold fahrenheit numbers, odd indices hold celsius numbers (1,3)
        var phiid = "phi" + i.toString();
        var ploid = "plo" + i.toString();
        $('.forecast_future').append('<div class = "forecol col-sm-3"><h4>' + v1[i]['date']['weekday_short'].toUpperCase() + '</h4><p>' + v1[i]['conditions'] + '</p><p id ="' + phiid + '"> High: ' + forecastarray[i][0] + ' </p><p id ="' + ploid + '">Low: ' + forecastarray[i][2] + '</p></div>');
      }
    }
  });

    $('button').click(function() { //Toggles temps between fahrenheit and celsius
      if (ftemp) {
        toggle("F", "temp_f", "feelslike_f", "fcttext", 0,2);
        ftemp = false;
    } else {
        toggle("C", "temp_c", "feelslike_c", "fcttext_metric", 1,3);
        ftemp = true;
    }
  });
});

//Method that displays the current actual temperature, the "feels like" temperature, and today's forecast. Parameters determine F/C.
function weather(degree, temp, feelslike, forecast){
    $('#temp').text(conditions[temp] + "°" +  degree);
    $('#feelslike').text("Feels Like " + conditions[feelslike] + "°" + degree);
    $('#today_fore').text("Today's Forecast: " + today[0][forecast]);
}

//Method that toggles the temperatures between F/C
function toggle(degree, temp, feelslike, forecast, hi, lo){
    weather(degree,temp,feelslike,forecast);
    for (i = 0; i < 4; i++) {
        var high = "#phi" + i.toString();
        var low = "#plo" + i.toString();
        $(high).text('High: ' + forecastarray[i][hi]);
        $(low).text('Low: ' + forecastarray[i][lo]);
    }
}

//Method that determines background image based on "icon" weather keyphrase
function background() {
    console.log(icon);
    var weather = 0;
    if (icon == "clear" || icon == "mostlysunny" || icon == "partlysunny" || icon == "sunny") {
        weather = 1;
    } else if (icon == "chancerain" || icon == "chancesleet" || icon == "rain" || icon == "sleet") {
        weather = 2;
    } else if (icon == "cloudy" || icon == "mostlycloudy" || icon == "partlycloudy") {
        weather = 3;
    } else if (icon == "fog" || icon == "hazy" || icon == "unknown") {
        weather = 4;
    } else if (icon == "chancetstorms" || icon == "hazy" || icon == "tstorms") {
        weather = 5;
    } else if (icon == "snow" || icon == "flurries" || icon == "chanceflurries") {
        weather = 6;
    } else {
        weather = 0;
    }

    switch (weather) {
    case 1:
      //Sunny
      $('body').css("background", "url('http://ilikewall.com/wp-content/uploads/2015/07/bright-sunny-day-desktop-background-602679.jpg') no-repeat center center fixed");
      soundtrack("sounds/sunny.mp3");
      break;
    case 2:
      //Rainy
      $('body').css("background", "url('http://sf.co.ua/14/01/wallpaper-353183.jpg') no-repeat center center fixed");
      soundtrack("sounds/rain.mp3");
      break;
    case 3:
      //Cloudy
      $('body').css("background", "url('http://www.footwa.com/wp-content/uploads/2010/05/Solitary-bird-in-the-sky.jpg') no-repeat center center fixed");
      soundtrack("sounds/cloudy.mp3");
      break;
    case 4:
      //Foggy
      $('body').css("background", "url('  http://pigpog.com/wp-content/uploads/2013/03/Foggy-Morning-Tree.jpg') no-repeat center center fixed");
      soundtrack("sounds/foggy.mp3");
      break;
    case 5:
      //Thunderstorms
      $('body').css("background", "url('http://www.desktopanimated.com/img/Preview/ThunderstormField1.jpg') no-repeat center center fixed");
      soundtrack("sounds/tstorm.mp3");
      break;
    case 6:
      // snow
      $('body').css("background", "url('    http://www.seattleweatherblog.com/wp-content/uploads/2012/02/snow.jpg') no-repeat center center fixed");
      soundtrack("sounds/snow.mp3");
      break;
    default:
      $('body').css("background", "url('http://www.hdwallpap.com/wp-content/uploads/2013/09/34.jpg') no-repeat center center fixed");
      soundtrack("sounds/sunny.mp3");
  }
}

//Create background sounds. Called in the background method- different sounds based on current weather conditions.
function soundtrack(music){
    $("#jplayer").jPlayer({
        ready: function() {
              $(this).jPlayer("setMedia", {
                mp3: music
              }).jPlayer("play");
        },
        swfPath: "/js",
        loop: true
    });
}