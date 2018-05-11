$(document).ready(function(){
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
       let coordinate = [position.coords.latitude, position.coords.longitude];
       $.getJSON("https://api.apixu.com/v1/current.json?key=6eec5db78911499ea2c192218180504&q="+coordinate[0]+","+coordinate[1], function(json){

         //variables
         let temp_c = json.current.temp_c;
         let temp_f = json.current.temp_f;
         let area = json.location.name;
         let region = json.location.region;
         let is_day = json.current.is_day;
         let conditionCode = json.current.condition.code;
         let month = json.location.localtime.slice(5,7);
         let codes = {
           rain : [1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1204, 1207, 1237, 1240, 1243, 1246, 1249, 1252, 1261, 1264, 1273, 1276],
           snow : [1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282],
           fog : [1030, 1135, 1147],
           cloudy : [1003, 1006],
           overcast : [1009, 1063, 1066, 1069, 1072, 1087, 1150, 1153, 1168],
           clear : 1000
         }
         //create functions to eliminate repetition
         function fadeText(target, content){
           return $(target).text(content).hide().fadeIn(2000);
         }
         function fadeHtml(target, content){
           return $(target).html(content).hide().fadeIn(2000);
         }
         function fadeCss(target, content1, content2){
           return $(target).css(content1, content2).hide().fadeIn(2000);
         }
         function fadeCss2(target, content1, content2){
           return $(target).css(content1, content2);
         }

         //add temperature and location data to html
         fadeText("#temp", temp_c);
         fadeText("#area", area+", "+region);
         fadeCss("#deg", "opacity", "1");
         fadeCss("#converter", "opacity", "1");

         //add background and tree (day or night)
         if(is_day == 0){
           fadeCss2("#night", "display", "block");
           if(conditionCode == codes.clear ||  codes.cloudy.indexOf(conditionCode) != -1) fadeCss2("#stars", "display", "block");
           switch(month){
             case "04":
             case "05":
               fadeCss2("#spring-night", "display", "block");
               break;
             case "06":
             case "07":
             case "08":
               fadeCss2("#summer-night", "display", "block");
               break;
             case "09":
             case "10":
               if(conditionCode == codes.clear) fadeCss2("#fall-night-wind", "display", "block");
               else fadeCss2("#fall-night-no-wind", "display", "block");
               break;
             case "11":
             case "12":
             case "01":
             case "02":
               fadeCss2("#winter", "display", "block");
           }
         }
         else  {
           fadeCss2("#day", "display", "block");
           switch(month){
             case "04":
             case "05":
               fadeCss2("#spring-day", "display", "block");
               break;
             case "06":
             case "07":
             case "08":
               fadeCss2("#summer-day", "display", "block");
               break;
             case "09":
             case "10":
               if(conditionCode == codes.clear) fadeCss2("#fall-day-wind", "display", "block");
               else fadeCss2("#fall-day-no-wind", "display", "block");
               break;
             case "11":
             case "12":
             case "01":
             case "02":
               fadeCss2("#winter", "display", "block");
               break;
           }
         }

         //add environment images (clouds, stars, rain, snow)
         let conditionKeys = Object.keys(codes);
         let weather = function(conditionCode){
           for(let key of conditionKeys){
               if (codes[key].indexOf(conditionCode) != -1) return key;
            }
         }

         function darkSky(weather){
           fadeCss2("#overcast", "display", "block");
           fadeCss2("#d-clouds", "display", "block");
           fadeCss2(weather, "display", "block");
         }

         switch(weather(conditionCode)){
           case "overcast":
             fadeCss2("#overcast", "display", "block");
             fadeCss2("#d-clouds", "display", "block");
             break;
           case "rain":
             darkSky("#rain")
             break;
           case "snow":
             darkSky("#snow");
             break;
           case "fog":
             darkSky("#fog")
             break;
           case "cloudy":
             if(is_day == 0) fadeCss2("#d-clouds", "display", "block");
             else fadeCss2("#l-clouds", "display", "block");
             break;
         }

           //toggle between celsius and farenheit
         $("#f").on("click", function(){
           $("#c").css({"color":"#909090", "border-color":"#909090"});
           $("#f").css({"color":"#f0f0f0", "border-color":"#f0f0f0"});
           $("#temp").text(temp_f);
           $("#deg").html("&deg;F");
         });
         $("#c").on("click", function(){
           $("#f").css({"color":"#909090", "border-color":"#909090"});
           $("#c").css({"color":"#f0f0f0", "border-color":"#f0f0f0"});
           $("#temp").text(temp_c);
           $("#deg").html("&deg;C");
         });
       });
      });
    }
  });

  //WEATHER API : APIXU