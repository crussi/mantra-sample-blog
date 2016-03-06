import {UserCalendars} from '/libs/collections';
import {UserEvents} from '/libs/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import cronofyHelper from '../methods/cronofyhelper';

Meteor.publish('usercalendars.list', function () {
    const selector = {userId: this.userId};
    const options = {};

    return UserCalendars.find(selector, options);
});
var currUserId = this.userId;

Meteor.publish('cal-event-list', function () {
    var self = this;
    console.log("in publish userId: " + this.userId + " currUserId: " + currUserId);
    //const selector = {userId: this.userId};
    //const options = {};
    //return UserCalendars.find(selector, options);
    console.log("publish cal-event-list");

    var date = new Date();
    var from = moment(date).add(-2,'d').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
    var to = moment(date).add(2,'d').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
    var options = {
        from: from,
        to: to,
        tzid:"America/Los_Angeles",
        include_deleted: false,
        include_managed: true
    };

    cronofyHelper.readEvents(this.userId, options, function(status,res){
        let userevents = new UserEvents();
        if (status != 'error'){
            let page = new cal_Page();
            let i = 0, j = 0;
            page.set('current',res.pages.current);
            page.set('total',res.pages.total);
            page.set('next_page',res.pages.next_page ? res.pages.next_page : '');
            userevents.set('pages',page);
            for (i=0; i < res.events.length; i++){
                let evt = new cal_Event();
                let cronofy = res.events[i];

                evt.set('calendar_id',cronofy.calendar_id ? cronofy.calendar_id : '');
                evt.set('created',cronofy.created);
                evt.set('deleted',cronofy.deleted);
                evt.set('description',cronofy.description ? cronofy.description : '');
                evt.set('end',cronofy.end);
                evt.set('event_id',cronofy.event_id ? cronofy.event_id : '');
                evt.set('event_uid',cronofy.event_uid ? cronofy.event_uid : '');
                evt.set('event_status',cronofy.event_status ? cronofy.event_status : '');
                evt.set('participation_status',cronofy.participation_status ? cronofy.participation_status : '');
                evt.set('start',cronofy.start);
                evt.set('status',cronofy.status);
                evt.set('summary',cronofy.summary ? cronofy.summary : '');
                evt.set('transparency',cronofy.transparency ? cronofy.transparency : '');
                evt.set('updated',cronofy.updated);

                for (j=0; j < cronofy.attendees.length; j++){
                    let attendee = new cal_Attendee;
                    attendee.set('email',cronofy.attendees[j].email ? cronofy.attendees[j].email : '');
                    attendee.set('email',cronofy.attendees[j].display_name ? cronofy.attendees[j].display_name : '');
                    attendee.set('email',cronofy.attendees[j].status ? cronofy.attendees[j].status : '');
                    evt.push('attendees',attendee);
                }
                let loc = new cal_Location;
                loc.set('description',cronofy.location ? cronofy.location : '');
                evt.set('location',loc);
                userevents.push('events',evt);
            }
        } else {
            console.log("an error occurred");
        }





        return UserEvents.find({});
    });
});

//Meteor.publish('calendars.single', function (calendarId) {
//    check(calendarId, String);
//    const selector = {calendarId: calendarId};
//    return Calendars.find(selector);
//});
