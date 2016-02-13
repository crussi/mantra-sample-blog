import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
//import _ from 'lodash';
import cronofy from 'cronofy';

UserCalendars = new Meteor.Collection('usercalendars');
//if (Meteor.isServer) {
//    CalendarProvider = Astro.Class({
//        name: "CalendarProvider",
//        fields: {
//            name: 'string',
//            profileId: 'string',
//            profileName: 'string'
//        }
//    });

    LinkedCalendar = Astro.Class({
        name: "LinkedCalendar",
        fields: {
            provider_name: 'string',
            provider_id: 'string',
            profile_name: 'string',
            calendar_id: 'string',
            calendar_name: 'string',
            calendar_readonly: 'boolean',
            calendar_deleted: 'boolean',
            calendar_primary: 'boolean',
            selected: 'boolean'
        }
    });

//TODO: Need to make this multi-tenancy

    UserCalendar = Astro.Class({
        name: 'UserCalendar',
        collection: UserCalendars,
        fields: {
            userId: 'string',
            availCalendars: {
                type: 'array',
                nested:'LinkedCalendar',
                default: function() {
                    return [];
                }
            }
        },
        methods: {
            isLinked: function(){
                return (Meteor.user().services && Meteor.user().services.cronofy);
            }
            //expired: function(){
            //    if (this.isLinked()) {
            //        return  moment().toDate() > this.expiresAt;
            //    } else {
            //        return false;
            //    }
            //}

        },
        events: {
            afterInit: function () {
                var self = this;
                if (this.isLinked()){
                    this.userId = Meteor.userId();
                }

            }
        }
    });


//}