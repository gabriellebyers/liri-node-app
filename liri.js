
require("dotenv").config();


var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");




// Make it so liri.js can take in one of the following commands:

// concert-this

// spotify-this-song

// movie-this

// do-what-it-says





var ArtistNames = function(artist) {
    return artist.name;
  };
  

  var spotifythissong = function(songName) {
    if (songName === undefined) {
      songName = "Take Care";
    }
  
    spotify.search(
      {
        type: "track",
        query: songName
      },
      function(err, data) {
        if (err) {
          console.log("Error occurred: " + err);
          return;
        }
  
        var songs = data.tracks.items;
  
        for (var i = 0; i < songs.length; i++) {
          console.log(i);
          console.log("artist(s): " + songs[i].artists.map(ArtistNames));
          console.log("song name: " + songs[i].name);
          console.log("preview: " + songs[i].preview_url);
          console.log("album: " + songs[i].album.name);
        }
      }
    );
  };
  
  var concerthis = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    axios.get(queryURL).then(
      function(response) {
        var jsonData = response.data;
  
        if (!jsonData.length) {
          console.log("No results found.");
          return;
        }
  
        console.log("Upcoming concerts:");
  
        for (var i = 0; i < jsonData.length; i++) {
          var show = jsonData[i];
  
     
          console.log(
            show.venue.city + "," + show.venue.region +  " at " +  show.venue.name + " " + moment(show.datetime).format("MM/DD/YYYY")
          );
        }
      }
    );
  };
  
  // Function for running a Movie Search
  var moviethis = function(movieName) {
    if (movieName === undefined) {
      movieName = "Titanic";
    }
  
    var urlHit =
      "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  
    axios.get(urlHit).then(
      function(response) {
        var jsonData = response.data;
  
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
      }
    );
  };
  
 
  var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
  
      var dataArr = data.split(",");
  
      if (dataArr.length === 2) {
        pick(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        pick(dataArr[0]);
      }
    });
  };
  

  var pick = function(caseData, functionData) {
    switch (caseData) {
    case "concert-this":
      concerthis(functionData);
      break;
    case "spotify-this-song":
      spotifythissong(functionData);
      break;
    case "movie-this":
      moviethis(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
    }
  };
  

  var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  
  runThis(process.argv[2], process.argv.slice(3).join(" "));