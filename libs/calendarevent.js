import {Meteor} from 'meteor/meteor';
import {UserEvents} from '/libs/collections';

cal_Location = Astro.Class({
    name: 'cal_Location',
    fields:{
       description: 'string'
    }
});

cal_Attendee = Astro.Class({
    name: 'cal_Attendee',
    fields:{
        email:'string',
        display_name: 'string',
        status: 'string'
    }
});

cal_Event = Astro.Class({
    name: 'cal_Event',
    fields:{
        attendees:{
            type: 'array',
            nested: 'cal_Attendee',
            default: function(){
                return [];
            }
        },
        linkedCalendar:{
            type: 'object',
            nested: 'LinkedCalendar',
            default: function(){
                return {};
            }
        },
        calendar_id: 'string',
        created: 'date',
        deleted: 'boolean',
        description: 'string',
        end:'date',
        event_id: 'string',
        event_uid: 'string',
        event_status: 'string',
        location:{
            type: 'object',
            nested: 'cal_Location',
            default: function(){
                return {};
            }
        },
        participation_status: 'string',
        start: 'date',
        status: 'string',
        summary: 'string',
        transparency: 'string',
        updated: 'date'
    }
});

cal_Page = Astro.Class({
    name: 'cal_Page',
    fields:{
        current: 'number',
        total: 'number',
        next_page: 'string'
    }
});

UserEvent = Astro.Class({
    name: 'UserEvents',
    collection: UserEvents,
    fields:{
        userId: 'string',
        year: 'number',
        weekno: 'number',
        weekstart: 'date',
        weekend: 'date',
        expiration: 'date',
        events:{
            type: 'array',
            nested: 'cal_Event',
            default: function(){
                return [];
            }
        },
        pages:{
            type: 'object',
            nested: 'cal_Page',
            default: function(){
                return {};
            }
        }

    }
    //events: {
    //    afterInit: function () {
    //        //var self = this;
    //        //if (this.isLinked()){
    //            this.userId = Meteor.userId();
    //        //}
    //
    //    }
    //}
});