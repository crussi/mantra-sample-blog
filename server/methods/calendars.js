//import {Posts} from '/libs/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import cronofy from 'cronofy';

Meteor.methods({
    'calendars.refreshAccessToken': function(){
        //client_id - Your client id.
        //client_secret - Your client secret.
        //grant_type - a string of "refresh_token".
        //refresh_token - The refresh token for the user.
        console.log("server method called calendars.refreshAccessToken");

        if (Meteor.user() && Meteor.user().services.cronofy) {
            var options = {
                client_id: 'p7RnSo-0arld61IThftToaOd7wKJN4qx',
                client_secret:'eC34_meTGi05QtQcC7XJ-YSub6VJ-8r3HshSk67Kpt6_fBN_zYP4Sw9FVZhT-y0czGByN_DgX8SdLOawrw50OQ',
                grant_type: 'refresh_token',
                refresh_token: Meteor.user().services.cronofy.refreshToken

            };
            cronofy.refreshAccessToken(options,Meteor.bindEnvironment(function(err,res){
                //"accessToken" : "i-_pNe0kMG68smcdSyrc7TjStqxbbuTK",
                //"refreshToken" : "uXzPhzqUp6wDbRi1wfBtSdf0YoxDPy2m",
                //"expiresAt" : ISODate("2016-01-27T06:51:51.074Z"),
                //2016-01-27T07:18:26.799Z
                if (!err) {
                    console.log("refreshAccessToken callback info: access_token: " +  res.access_token);
                    console.log("refreshAccessToken callback info: refresh_token: " +  res.refresh_token);
                    console.dir(res);
                    var loggedInUser = Meteor.users.findOne({_id:Meteor.userId()});
                    Meteor.users.update({_id:loggedInUser._id},{$set:{"services.cronofy.accessToken":res.access_token}});
                    Meteor.users.update({_id:loggedInUser._id},{$set:{"services.cronofy.refreshToken":res.refresh_token}});
                    Meteor.users.update({_id:loggedInUser._id},{$set:{"services.cronofy.expiresAt":moment().add(res.expires_in,'s').toDate()}});
                    console.log('expires in: ' + moment().add(res.expires_in,'s').toDate().toISOString());
                } else {
                    console.log("error encountered with refreshAccessToken:")
                    console.dir(err);
                }
            }));
        }
    },
    'calendars.list': function() {
        console.log("server method called calendars.list");

        if (Meteor.user() && Meteor.user().services.cronofy) {
            var options = {
                access_token: Meteor.user().services.cronofy.accessToken
            };
            cronofy.listCalendars(options,function(err,res){
                if (!err) {
                    console.log("listCalendars callback info:");
                    console.dir(res);
                } else {
                    console.log("error encountered with listCalendars:")
                    console.dir(err);
                }
            });
        }

    },
    'calendars.profile': function(){
        console.log("meteor method calendars.profile");
        if (Meteor.user() && Meteor.user().services.cronofy) {
            var options = {
                access_token: Meteor.user().services.cronofy.accessToken
            };
            cronofy.profileInformation(options,function(err,res){
                if (!err) {
                    console.log("profileInformation callback info:");
                    console.dir(res);
                } else {
                    console.log("error encountered with profileInformation:")
                    console.dir(err);
                }
            });
        }
    },
    'calendars.freeBusy': function(){
        //Returns a list of free-busy information across all of a users calendars.
        console.log("meteor method calendars.freebusy");
        if (Meteor.user() && Meteor.user().services.cronofy) {
            var date = new Date();
            var fromdate = new moment(date).subtract(5,'d').toDate();
            var from = fromdate.toISOString();
            console.log('next');
            var todate = new moment(date).add(1,'h').toDate();
            var to = todate.toISOString();
            console.log("from: " + from + " to: " + to);
            var options = {
                access_token: Meteor.user().services.cronofy.accessToken,
                from:from,
                to:to,
                tzid:"America/Los_Angeles"
            };
            cronofy.freeBusy(options,function(err,res){
                if (!err) {
                    console.log("freeBusy callback info:");
                    console.dir(res);
                } else {
                    console.log("error encountered with freeBusy:")
                    console.dir(err);
                }
            });
        }
    },
    'calendars.createEvent': function(options){
        console.log("meteor method create event");
        check(options,{
            event_id: String,
            start: String,
            end: String,
            summary: String,
            description: String,
            tzid:String
        });
        //calendar_id - required - the id of the calender that the event will be created one.
        //access_token - required - The access_token.
        //event_id - required - An id for the event you want to create
        //summary - required - The name or title of the event
        //description - required - The Description or notes for the event
        //tzid - The Timezone id of the event.
        //start - required -The Start time of the event as an ISO string.
        //end - required - The end time of the event as an ISO string.
        //location - An object containing a single key of 'description', whos value is a string of the event location.
        var event_id = Random.id();

        if (Meteor.user() && Meteor.user().services.cronofy) {
            var options = _.extend({
                event_id:event_id,
                calendar_id: 'cal_Vpg1U7TM0HgKADQw_pjFndgu883IoFKuKDX0Lyw',
                access_token: Meteor.user().services.cronofy.accessToken
            },options);
            console.dir(options);

            cronofy.createEvent(options,function(err,res){
                if (!err) {
                    console.log("createEvent callback info:");
                    console.dir(res);
                } else {
                    console.log("error encountered with createEvent:");
                    console.dir(err);
                }
            });
        }
    },
    'calendars.deleteEvent': function(options){
        console.log("meteor method create event");
        check(options, {
            event_id: String
        });
        var options = _.extend({
            calendar_id: 'cal_Vpg1U7TM0HgKADQw_pjFndgu883IoFKuKDX0Lyw',
            access_token: Meteor.user().services.cronofy.accessToken
        },options);
        if (Meteor.user() && Meteor.user().services.cronofy) {
            cronofy.deleteEvent(options,function(err,res){
                if (!err) {
                    console.log("deleteEvent callback info:");
                    console.dir(res);
                } else {
                    console.log("error encountered with deleteEvent:");
                    console.dir(err);
                }
            });
        }
    },

    'calendars.readEvents': function(options){
        console.log("meteor method readEvents");
        //access_token - required - the access_token.
        //from - required - the start date as an ISO string.
        //to - required - the end date as an ISO string.
        //tzid - the timezone id for the query.
        check(options, {
            from: String,
            to: String,
            tzid: String,
            include_deleted: Boolean,
            include_managed: Boolean
        });
        var options = _.extend({
            access_token: Meteor.user().services.cronofy.accessToken
        },options);
        if (Meteor.user() && Meteor.user().services.cronofy) {
            cronofy.readEvents(options,function(err,res){
                if (!err) {
                    console.log("readEvents callback info:");
                    console.dir(res);
                } else {
                    console.log("error encountered with readEvents:");
                    console.dir(err);
                }
            });
        }
    },
});
