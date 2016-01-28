import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import cronofy from 'cronofy';

//UserCalendars = new Meteor.Collection('usercalendars');
if (Meteor.isServer) {
    CalendarProvider = Astro.Class({
        name: "CalendarProvider",
        fields: {
            name: 'string',
            id: 'string',
            name: 'string'
        }
    });

    LinkedCalendar = Astro.Class({
        name: "LinkedCalendar",
        fields: {
            id: 'string',
            name: 'string',
            readonly: 'boolean',
            deleted: 'boolean',
            primary: 'boolean'
        }
    });

    UserCalendar = Astro.Class({
        name: 'UserCalendar',
        //collection: Meteor.users,
        fields: {
            accessToken: 'string',
            refreshToken: 'string',
            expiresAt: 'date',
            calendars: {
                type: 'array',
                default: function() {
                    return [];
                }
            }
        },
        methods: {
            isLinked: function(){
                return (Meteor.user().services && Meteor.user().services.cronofy);
            },
            expired: function(){
                if (this.isLinked()) {
                    return  moment().toDate() > this.expiresAt();
                } else {
                    return false;
                }
            },

        },
        events: {
            afterInit: function () {
                if (this.isLinked()){
                    this.accessToken = Meteor.user().services.cronofy.accessToken;
                    this.refreshToken = Meteor.user().services.cronofy.refreshToken;
                    this.expiresAt = Meteor.user().services.cronofy.expiresAt;

                    var options = {
                        access_token: Meteor.user().services.cronofy.accessToken
                    };

                    cronofy.listCalendars(options,function(err,res){
                        if (!err) {
                            console.log("astro afterInit listCalendars callback info:");
                            //console.dir(res);
                            res.calendars.map(function(cal){
                                if (!cal.calendar_deleted){
                                    console.log(cal.calendar_name);
                                }
                            });
                        } else {
                            console.log("error encountered with listCalendars:")
                            console.dir(err);
                        }
                    });
                }

            }
        }
    });


}