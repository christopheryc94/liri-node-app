//grab the data from keys.js, store keys in variable
var keys = require("./keys.js");
var twitter = require("twitter");
var client = new twitter(keys.twitterKeys);
//npm for fs and request
var fs = require("fs");
var request = require("request");
//spotify keys id & secret
var spotifyKeys = require("node-spotify-api");
var spotify = new spotifyKeys(keys.spotifyKeys);
//omdb npm
var omdb = require("omdb");
//first arg
var command = process.argv[2];
var userChoice = process.argv[3];
//if userChoice is more than one word, combine them
for(let i = 4; i < process.argv.length; i++){
	    userChoice += '+' + process.argv[i];
}
//switch case statements to see which function to run
//off of user command
function switchCommand(){
	switch(command){
		case "my-tweets":
			myTweets();
			break;
		case "spotify-this-song":
			spotifyThisSong(userChoice);
			break;
		case "movie-this":
			movieThis(userChoice);
			break;
		case "do-what-it-says":
			doWhatItSays();
			break;
		default:
			console.log("Please enter a valid command.");
			console.log('"my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"');
			break;
	}
}

function myTweets(){
	var params = {
		screen_name: "Christopher_yc",
		count: 20
	};
	client.get("statuses/user_timeline", params, function(error, tweets, response){
		if(!error){
			for(var i = 0; i < tweets.length; i++){
				console.log("-----------------------");
				console.log("Tweet: " + tweets[i].text);
				console.log("Created: " + tweets[i].created_at);
			}
		}else{
			console.log(error);
		}
	});
}

function spotifyThisSong(song) {
	//if empty or undefined, make song "The Sign"
	if(!song){
		song = "The Sign Ace of Base";
	}

	spotify.search({type: "track", query: song}, function(error, data){
		if(error){
			console.log(error);
			return;
		}
		//if no error console log song info
		console.log("Spotify Song Information");
		console.log("------------------");
		console.log("Artist/Band: " + data.tracks.items[0].artists[0].name);
		console.log("Song: " + data.tracks.items[0].name);
		console.log("Preview: " + data.tracks.items[0].preview_url);
		console.log("Album: " + data.tracks.items[0].album.name);
		console.log("------------------");

	});
}

function movieThis(movie){
	//if empty or undefined, make movie "Mr. Nobody"
	if(!movie){
		movie = "Mr. Nobody";
	}
	//queryURL with KEY!!
	var query = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey="+keys.omdbKey;
	request(query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        	console.log("Movie Information");
        	console.log("------------------");
        	console.log("Title: " + JSON.parse(body)["Title"]);
            console.log("Release Year: " + JSON.parse(body)["Year"]);
            console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
            console.log("Country: " + JSON.parse(body)["Country"]);
            console.log("Language: " + JSON.parse(body)["Language"]);
            console.log("Plot: " + JSON.parse(body)["Plot"]);
            console.log("Actors: " + JSON.parse(body)["Actors"]);
        } else{
        	console.log(error);
        }
    });
}

function doWhatItSays(){
	//use fs to read from random.txt file, using utf8 to read
	fs.readFile("random.txt", "utf8", function(error, data){
		if(error){
			console.log(error);
		}
		//seperate by "," to get song name
		var randomSong = data.split(",");
		//index[1] will be song
		spotifyThisSong(randomSong[1]);
	});
}
//call function to run all other functions
switchCommand();










