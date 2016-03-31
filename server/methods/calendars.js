//import {Posts} from '/libs/collections';
import {Meteor} from 'meteor/meteor';
import {UserEvents} from '/libs/collections';
import {check} from 'meteor/check';
import cronofyHelper from './cronofyhelper';
import Future from 'fibers/future';


Meteor.methods({
    'calendars.refreshAccessToken': function(){
        console.log("server method called calendars.refreshAccessToken");
        this.unblock();
        var future = new Future();
        cronofyHelper(this.userId).refreshAccessToken(function(status,res){
            if (status != 'error') {
                console.dir(res);
                future.return(status);
            } else {
                future.throw(new Meteor.Error("calendar error","Unable to refresh access token for linked calendar."));
            }        });
        return future.wait();
    },
    'calendars.revokeAuthorization': function(){
        console.log("server method called calendars.revokeAuthorization");
        this.unblock();
        var future = new Future();
        cronofyHelper(this.userId).revokeAuthorization(function(status,res){
            if (status != 'error') {
                console.dir(res);
                future.return(status);
            } else {
                future.throw(new Meteor.Error("calendar error","Unable to revoke authorization for linked calendar."));
            }
        });
        return future.wait();
    },

    'calendars.list': function() {
        console.log("server method called calendars.list");
        this.unblock();
        var future = new Future();
        cronofyHelper(this.userId).calendarList(function(status,res){
            if (status != 'error') {
                console.dir(res);
                future.return(status);
            } else {
                future.throw(new Meteor.Error("calendar error","Unable to get list of available linked calendars."));
            }
        });
        return future.wait();
    },
    'calendars.profile': function(){
        console.log("meteor method calendars.profile");
        this.unblock();
        var future = new Future();
        cronofyHelper(this.userId).userProfile(function(status,res){
            if (status != 'error') {
                console.dir(res);
                future.return(status);
            } else {
                future.throw(new Meteor.Error("calendar error","Unable to get linked calendar user profile."));
            }
        });
        return future.wait();
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

        this.unblock();
        var future = new Future();
        cronofyHelper(this.userId).freeBusy(options, function(status,res){
            if (status != 'error') {
                console.dir(res);
                future.return(status);
            } else {
                future.throw(new Meteor.Error("calendar error","Unable to determine free-busy status for linked calendar."));
            }
        });
        return future.wait();
    },
    'calendars.createEvent': function(options){
        console.log("meteor method create event");
        check(options,{
            calendar_id: String,
            event_id: String,
            start: String,
            end: String,
            summary: String,
            description: String,
            tzid:String
        });

        this.unblock();
        var future = new Future();
        cronofyHelper(this.userId).createEvent(options, (status,res)=>{
            console.dir(res);
            if (status != 'error') {
                console.dir(res);
                future.return(status);
            } else {
                future.throw(new Meteor.Error("calendar error","Unable to create event for linked calendar."));
            }
        });
        return future.wait();
    },
    'calendars.deleteEvent': function(options){
        console.log("meteor method delete event");
        console.dir(options);
        check(options, {
            //_id: String,
            calendar_id: String,
            event_id: String
        });
        //let deleteOptions = {
        //    calendar_id: options.calendar_id,
        //    event_id: options.event_id
        //};
        //let _id = options._id;
        //let event_id = options.event_id;
        //let userevent = UserEvents.findOne({_id:options._id});
        //delete options._id;
        this.unblock();
        var future = new Future();
        cronofyHelper(this.userId).deleteEvent(options, (status,res)=>{
            if (status != 'error') {
                console.dir(res);
                future.return(status);
            } else {
                future.throw(new Meteor.Error("calendar error","Unable to delete event for linked calendar."));
            }

        });
        return future.wait();
    },
    'calendars.db.deleteEvent': function(options){
        console.log("meteor method delete event");
        //console.dir(options);
        check(options, {
            _id: String,
            event_id: String
        });

        console.log("delete event method success");
        userevent = UserEvents.findOne({_id:options._id});
        let clone = userevent.events.slice();
        for (var i = 0; i < clone.length; i++){
            //console.log("uevent.event_id: " + clone[i].event_id);
            //console.log("options.event_id: " + options.event_id);

            if (clone[i].event_id == options.event_id){
                console.log("found match will delete ...");
                //console.dir(clone);
                clone.splice(i,1);
                //console.dir(clone);
                //console.dir(userevent);
                userevent.set('events',clone);
                //console.dir(userevent);
                userevent.save();
                break;
            }
        }
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
    //    this.unblock();
    //    var future = new Future();
    //    cronofyHelper(this.userId).readEvents(options, (status,res) => {
    //        console.log("back from readEvents");
    //        if (status != 'error') {
    //            console.dir(res);
    //            future.return(status);
    //        } else {
    //            future.throw(new Meteor.Error("calendar error","Unable to read events from linked calendar."));
    //        }
    //    });
    //    return future.wait();
    //},
    'calendars.loadWklyEvents': function(options){
        console.log("meteor method loadWklyEvents");
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
            console.log("back from loadWklyEvents");
            if (status != 'error') {
                console.dir(res);
                future.return(status);
            } else {
                future.throw(new Meteor.Error("calendar error","Unable to load weekly events from linked calendar."));
            }
        });
        return future.wait();
    },
    'calendars.refresh': function(){
        //TODO: this should not be a method apart from the prototype
        console.log("meteor method refresh userId: " + this.userId);
        this.unblock();
        var future = new Future();
        cronofyHelper(this.userId).updateUserCalendar(function(status,res){
            console.log('back from updateUserCalendar');
            if (status != 'error') {
                //console.dir(res);
                console.log('status: ' + status);
                future.return(status);
            } else {
                future.throw(new Meteor.Error("calendar error","Unable to update list of user's linked calendars."));
            }
        });
        return future.wait();
    }
});