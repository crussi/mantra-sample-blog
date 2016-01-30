import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
//import _ from 'lodash';
import cronofy from 'cronofy';

UserCalendars = new Meteor.Collection('usercalendars');
//if (Meteor.isServer) {
    CalendarProvider = Astro.Class({
        name: "CalendarProvider",
        fields: {
            name: 'string',
            profileId: 'string',
            profileName: 'string'
        }
    });

    LinkedCalendar = Astro.Class({
        name: "LinkedCalendar",
        fields: {
            calendarId: 'string',
            name: 'string',
            readonly: 'boolean',
            deleted: 'boolean',
            primary: 'boolean',
            selected: 'boolean'
        }
    });

    UserCalendar = Astro.Class({
        name: 'UserCalendar',
        collection: UserCalendars,
        fields: {
            userId: 'string',
            provider: {
                type: 'object',
                nested: 'CalendarProvider',
                default: function(){
                    return {};
                }
            },
            accessToken: {
                type: 'string',
                transient: true
            },
            refreshToken: {
                type: 'string',
                transient: true
            },
            expiresAt: {
                type: 'date',
                transient: true
            },
            availCalendars: {
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
                    return  moment().toDate() > this.expiresAt;
                } else {
                    return false;
                }
            }

        },
        events: {
            afterInit: function () {
                var self = this;
                if (this.isLinked()){
                    this.userId = Meteor.userId();
                    this.accessToken = Meteor.user().services.cronofy.accessToken;
                    this.refreshToken = Meteor.user().services.cronofy.refreshToken;
                    this.expiresAt = Meteor.user().services.cronofy.expiresAt;
                }

            }
        }
    });


//}