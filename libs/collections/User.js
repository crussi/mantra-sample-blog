
//ServerTime = new Meteor.Collection('serverTime');
//CalendarList = new Meteor.Collection('calendarList');
//CalendarEvents = new Meteor.Collection('calendarEvents');

//Users = new Mongo.Collection('users');

UserProfile = Astro.Class({
    name: 'UserProfile',
    fields: {
        nickname: 'string',
        calendars: {
            type: 'array',
            default: function(){
                return [];
            }
        }
        /* Any other fields you want to be published to the client */
    }
});


User = Astro.Class({
    name: 'User',
    collection: Meteor.users,
    fields: {
        createdAt: 'date',
        emails: {
            type: 'array',
            default: function() {
                return [];
            }
        },
        profile: {
            type: 'object',
            nested: 'UserProfile',
            default: function() {
                return {};
            }
        }
    }
});

if (Meteor.isServer) {
    console.log('isserver user.extend ...');
    User.extend({
        fields: {
            services: 'object'
        }
    });
}