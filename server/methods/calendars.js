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
        cronofyHelper(this.userId).loadWklyEvents(options, (status,res) => {
            console.log("back from loadEvents");
            if (status != 'error'){
                console.log('success');
            } else {
                console.log("an error occurred");
            }
            //console.log("before actual publish return");
            //return UserEvents.findOne({});
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