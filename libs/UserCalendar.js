import {Meteor} from 'meteor/meteor';
import {UserCalendars} from '/libs/collections';

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


