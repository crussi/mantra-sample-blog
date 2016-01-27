import {Posts} from '/libs/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import cronofy from 'cronofy';

Meteor.methods({
  'posts.create'(_id, title, content) {
    check(_id, String);
    check(title, String);
    check(content, String);

    // Show the latency compensations
    Meteor._sleepForMs(500);

    // XXX: Do some user authorization
    const createdAt = new Date();
    const post = {_id, title, content, createdAt};
    Posts.insert(post);
  },
  'cronofy.requestAccessToken'(code) {
    check(code, String);
    console.log('hello from posts.create code: ' + code);

      var config = ServiceConfiguration.configurations.findOne({service: 'cronofy'});
      if (!config) {
          credentialRequestCompleteCallback && credentialRequestCompleteCallback(
              new ServiceConfiguration.ConfigError());
          return;
      }
var redirectUrl = OAuth._redirectUri('cronofy', config);

      var options = {
          client_id: '_QOoOhBwuUfl3ZDBhN9lsNGXPdKJwZqP',
          client_secret: 'CMlCEvq12kk_Ogrt_5KOHvHnpRiEfgRELxDsxoZHDxO0gyx6xGlQ2hnU6HPJOo-Gm2l6hTXvWZPNJylveEqIhw',
          grant_type: 'authorization_code',
          code: code,

          redirect_uri: "http://localhost:3000/_oauth/cronofy"
      };

      console.dir(options);

      cronofy.requestAccessToken(options, function(err, response){
          if(err) {
              //throw err;
              console.log('error requesting access token');
              console.dir(err);
          } else {
              console.dir(response);
          }
      })

  }
});
