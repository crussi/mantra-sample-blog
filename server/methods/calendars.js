//import {Posts} from '/libs/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import cronofyHelper from './cronofyhelper';
import Future from 'fibers/future';


Meteor.methods({
    'calendars.refreshAccessToken': function(){
        console.log("server method called calendars.refreshAccessToken");
        cronofyHelper(this.userId).refreshAccessToken(function(status,res){
           console.log('status: ' + status);
        });
    },
    'calendars.revokeAuthorization': function(){
        console.log("server method called calendars.revokeAuthorization");
        cronofyHelper(this.userId).revokeAuthorization(function(status,res){
            console.log('status: ' + status);
        });
    },

    'calendars.list': function() {
        console.log("server method called calendars.list");
        cronofyHelper(this.userId).calendarList(function(status,res){
            console.log('status: ' + status);
            console.dir(res);
        });
    },
    'calendars.profile': function(){
        console.log("meteor method calendars.profile");
        cronofyHelper(this.userId).userProfile(function(status,res){
            console.log('status: ' + status);
            console.dir(res);
        });
    },
    'calendars.freeBusy': function(){
        //Returns a list of free-busy information across all of a users calendars.
        console.log("meteor method calendars.freebusy");
        var date = new Date();
        var fromdate = new moment(date).subtract(5,'d').toDate();
        var from = fromdate.toISOString();
        var todate = new moment(date).add(1,'h').toDate();
        var to = todate.toISOString();

        var options = {
            from:from,
            to:to,
            tzid:"America/Los_Angeles"
        };

        cronofyHelper(this.userId).freeBusy(options, function(status,res){
            console.log('status: ' + status);
            console.dir(res);
        });
    },
    'calendars.createEvent': function(options){
        console.log("meteor method create event");
        console.dir(options);
        check(options,{
            calendar_id: String,
            event_id: String,
            start: String,
            end: String,
            summary: String,
            description: String,
            tzid:String
        });
        cronofyHelper(this.userId).createEvent(options, function(status,res){
            console.log('status: ' + status);
            console.dir(res);
        });
    },
    'calendars.deleteEvent': function(options){
        console.log("meteor method create event");
        check(options, {
            event_id: String
        });
        cronofyHelper(this.userId).deleteEvent(options, function(status,res){
            console.log('status: ' + status);
            console.dir(res);
        });
    },

    //'calendars.readEvents': function(options){
    //    console.log("meteor method readEvents");
    //    check(options, {
    //        from: String,
    //        to: String,
    //        tzid: String,
    //        include_deleted: Boolean,
    //        include_managed: Boolean
    //    });
    //    cronofyHelper(this.userId).readEvents(options, function(status,res){
    //        console.log('status: ' + status);
    //        console.dir(res);
    //    });
    //},
    'calendars.readEvents': function(options){
        console.log("meteor method readEventsNew");
        check(options, {
            from: String,
            to: String,
            tzid: String,
            include_deleted: Boolean,
            include_managed: Boolean
        });
        this.unblock();
        var future = new Future();
        cronofyHelper(this.userId).readEvents(options, function(status,res){
            let userevent = new UserEvent();
            if (status != 'error'){
                let page = new cal_Page();
                let i = 0, j = 0;
                page.set('current',res.pages.current);
                page.set('total',res.pages.total);
                page.set('next_page',res.pages.next_page ? res.pages.next_page : '');
                userevent.set('pages',page);
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
                    userevent.push('events',evt);
                }
            }
            future.return({"status":status,"res":userevent});

        });
        return future.wait();
    },
    'calendars.refresh': function(){
        //TODO: this should not be a method apart from the prototype
        console.log("meteor method refresh userId: " + this.userId);
        cronofyHelper(this.userId).updateUserCalendar(function(status,res){
           console.log('refresh status: ' + status);
        });
    }
});