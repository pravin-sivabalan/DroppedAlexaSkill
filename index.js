var Alexa = require('alexa-sdk');
var request = require('request');
var lambdaConfig = require('./configs/lambda-config.json');

const skillName = 'Dropped';

var handlers = {
    "DefaultIntent": function(){
      request.get('https://rss.itunes.apple.com/api/v1/us/apple-music/new-music/5/explicit/json', (err, response, body) => {
        if(err || response.statusCode != 200) return this.emit(':tell', 'I am having some issues connecting to external services');
        var results = JSON.parse(body).feed.results;
        var speechOutput = "";
        for(result of results){
          speechOutput += result.artistName + ' released a new ' + result.kind + ' '  + result.name + '. ';
        }
        return this.emit(':tell', speechOutput);
      });
    },

    "GenreIntent": function(){
      var genre = this.event.request.intent.slots.Genre.value.toLowerCase();
      if(genre === 'hip hop') genre = 'hip-hop';
      if(genre === 'rap') genre = 'hip-hop/rap';
      request.get('https://rss.itunes.apple.com/api/v1/us/apple-music/new-music/100/explicit/json', (err, response, body) => {
        if(err || response.statusCode != 200) return this.emit(':tell', 'I am having some issues connecting to external services');
        var results = JSON.parse(body).feed.results;
        var speechOutput = "";
        var count = 0;
        for(result of results){
          if(count == 5) break;
          if(genre.indexOf(result.primaryGenreName.toLowerCase()) !== -1){
            speechOutput += result.artistName + ' released a new ' + result.kind + ' '  + result.name + '. ';
            count++;
          }
        }
        if(speechOutput === "") speechOutput = 'Sorry, I could not find any new music from this genre';
        return this.emit(':tell', speechOutput);
      });
    },

    "LimitIntent": function(){
      var limit = this.event.request.intent.slots.Limit.value;
      request.get('https://rss.itunes.apple.com/api/v1/us/apple-music/new-music/'+limit+'/explicit/json', (err, response, body) => {
        if(err || response.statusCode != 200) return this.emit(':tell', 'I am having some issues connecting to external services');
        var results = JSON.parse(body).feed.results;
        var speechOutput = "";
        for(result of results){
          speechOutput += result.artistName + ' released a new ' + result.kind + ' '  + result.name + '. ';
        }
        return this.emit(':tell', speechOutput);
      });
    },

    'LaunchRequest': function(){
      request.get('https://rss.itunes.apple.com/api/v1/us/apple-music/new-music/5/explicit/json', (err, response, body) => {
        if(err || response.statusCode != 200) return this.emit(':tell', 'I am having some issues connecting to external services');
        var results = JSON.parse(body).feed.results;
        var speechOutput = "";
        for(result of results){
          speechOutput += result.artistName + ' released a new ' + result.kind + ' '  + result.name + '. ';
        }
        return this.emit(':tell', speechOutput);
      });
    },

    "AMAZON.HelpIntent": function(){
      var speechOutput = "";
      speechOutput += "Here are some things you can say: ";
      speechOutput += "Alexa, open Dropped Music. ";
      speechOutput += "Alexa, ask Dropped Music what's new. ";
      speechOutput += "Alexa, ask Dropped for new Rap songs. ";
      speechOutput += "So how can I help?";
      this.emit(':ask', speechOutput, speechOutput);
    },

    "AMAZON.StopIntent": function(){
        this.emit(':tell', "Goodbye");
    },

    "AMAZON.CancelIntent": function(){
        this.emit(':tell', "Goodbye");
    },

    'Unhandled': function () {
      var speechOutput = "";
      speechOutput += "Here are some things you can say: ";
      speechOutput += "Alexa, open Dropped Music. ";
      speechOutput += "Alexa, ask Dropped Music what's new. ";
      speechOutput += "Alexa, ask Dropped for new Rap songs. ";
      speechOutput += "So how can I help?";
      this.emit(':ask', speechOutput, speechOutput);
  }
};

exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = lambdaConfig.appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
