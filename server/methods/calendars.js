//import {Posts} from '/libs/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import cronofy from 'cronofy';

cronofyHelper = {
    hasLinkedCalendar: function(){
        return Meteor.user() && Meteor.user().services.cronofy;
    },
    isExpired: function() {
        if (!this.hasLinkedCalendar()) {
            return moment().toDate() > Meteor.user().services.cronofy.expiresAt;
        } else {
            return true;
        }
    },
    checkLinkedCalendar: function(callback){
        if (!this.hasLinkedCalendar()) {
            //TODO: log error here
            console.log("No linked calendar found.");
            callback('error');
            return;
        }
    },
    refreshAccessToken: function(callback){
        this.checkLinkedCalendar(callback);
        var options = {
            client_id: 'p7RnSo-0arld61IThftToaOd7wKJN4qx',
            client_secret:'eC34_meTGi05QtQcC7XJ-YSub6VJ-8r3HshSk67Kpt6_fBN_zYP4Sw9FVZhT-y0czGByN_DgX8SdLOawrw50OQ',
            grant_type: 'refresh_token',
            refresh_token: Meteor.user().services.cronofy.refreshToken

        };
        cronofy.refreshAccessToken(options,Meteor.bindEnvironment(function(err,res){
            if (!err) {
                var loggedInUser = Meteor.users.findOne({_id:Meteor.userId()});
                Meteor.users.update({_id:loggedInUser._id},{$set:{"services.cronofy.accessToken":res.access_token}});
                Meteor.users.update({_id:loggedInUser._id},{$set:{"services.cronofy.refreshToken":res.refresh_token}});
                Meteor.users.update({_id:loggedInUser._id},{$set:{"services.cronofy.expiresAt":moment().add(res.expires_in,'s').toDate()}});
                callback('success',res);
            } else {
                //TODO: log error here
                console.log("error encountered with refreshAccessToken:");
                console.dir(err);
                callback('error');
            }
        }));
    },
    revokeAuthorization: function(callback){
        this.checkLinkedCalendar(callback);
        var options = {
            client_id: 'p7RnSo-0arld61IThftToaOd7wKJN4qx',
            client_secret:'eC34_meTGi05QtQcC7XJ-YSub6VJ-8r3HshSk67Kpt6_fBN_zYP4Sw9FVZhT-y0czGByN_DgX8SdLOawrw50OQ',
            token: Meteor.user().services.cronofy.accessToken

        };
        cronofy.revokeAuthorization(options,Meteor.bindEnvironment(function(err,res){
            if (!err) {
                var loggedInUser = Meteor.users.findOne({_id:Meteor.userId()});
                callback('success',res);
            } else {
                console.log("error encountered with revokeAuthorization:");
                console.dir(err);
                callback('error');
            }
        }));
    },
    calendarList: function(callback){
        this.checkLinkedCalendar(callback);
        var options = {
            access_token: Meteor.user().services.cronofy.accessToken
        };
        cronofy.listCalendars(options,function(err,res){
            if (!err) {
                callback('success',res);
            } else {
                console.log("error encountered with calendarList:");
                console.dir(err);
                callback('error');
            }
        });
    },
    userProfile:function(callback){
        this.checkLinkedCalendar(callback);
        var options = {
            access_token: Meteor.user().services.cronofy.accessToken
        };
        cronofy.profileInformation(options,function(err,res){
            if (!err) {
                callback('success',res);
            } else {
                console.log("error encountered with profileInformation:")
                console.dir(err);
                callback('error');
            }
        });
    },
    freeBusy:function(options, callback){
        this.checkLinkedCalendar(callback);
        options = _.extend(options, {
            access_token: Meteor.user().services.cronofy.accessToken
        });
        cronofy.freeBusy(options,function(err,res){
            if (!err) {
                callback('success',res);
            } else {
                console.log("error encountered with freeBusy:");
                console.dir(err);
                callback('error');
            }
        });
    },
    createEvent: function(options,callback){
        this.checkLinkedCalendar(callback);
        var event_id = Random.id();

        var options = _.extend({
            event_id:event_id,
            calendar_id: 'cal_Vpg1U7TM0HgKADQw_pjFndgu883IoFKuKDX0Lyw',
            access_token: Meteor.user().services.cronofy.accessToken
        },options);

        cronofy.createEvent(options,function(err,res){
            if (!err) {
                callback('success',res);
            } else {
                console.log("error encountered with createEvent:");
                console.dir(err);
                callback('error');
            }
        });
    },
    deleteEvent: function(options,callback){
        this.checkLinkedCalendar(callback);

        var options = _.extend({
            calendar_id: 'cal_Vpg1U7TM0HgKADQw_pjFndgu883IoFKuKDX0Lyw',
            access_token: Meteor.user().services.cronofy.accessToken
        },options);

        cronofy.deleteEvent(options,function(err,res){
            if (!err) {
                callback('success',res);
            } else {
                console.log("error encountered with deleteEvent:");
                console.dir(err);
                callback('error');
            }
        });
    },
    readEvents: function(options,callback){
        this.checkLinkedCalendar(callback);

        var options = _.extend({
            access_token: Meteor.user().services.cronofy.accessToken
        },options);

        cronofy.readEvents(options,function(err,res){
            if (!err) {
                callback('success',res);
            } else {
                console.log("error encountered with readEvents:");
                console.dir(err);
                callback('error');
            }
        });
    },
    updateUserCalendar: function(callback){
        this.calendarList(function(status,res){
            if (status=='success') {
                var userCal = UserCalendars.findOne({userId:Meteor.userId()});
                if (userCal) {

                } else {

                }
                res.calendars.map(function (cal, i) {
                    if (i == 0) {
                        var provider = new CalendarProvider();
                        provider.set('name', cal.provider_name);
                        provider.set('profileId', cal.profile_id);
                        provider.set('profileName', cal.profile_name);
                        //console.log('self:');
                        userCalendar.set('provider', provider);
                        //console.dir(self);
                    }
                    //if (!cal.calendar_deleted) {
                        console.log(cal.calendar_name);
                        var linkedCalendar = new LinkedCalendar();
                        linkedCalendar.set('calendarId', cal.calendar_id);
                        linkedCalendar.set('name', cal.calendar_name);
                        linkedCalendar.set('readonly', cal.calendar_readonly);
                        linkedCalendar.set('deleted', cal.calendar_deleted);
                        linkedCalendar.set('primary', cal.calendar_primary);

                        userCalendar.push('availCalendars', linkedCalendar);
                    //}

                });
            } else {
                callback(status)
            }
        })

        userCalendar.save();
    }
}

Meteor.methods({
    'calendars.refreshAccessToken': function(){
        console.log("server method called calendars.refreshAccessToken");
        cronofyHelper.refreshAccessToken(function(status,res){
           console.log('status: ' + status);
        });
    },
    'calendars.revokeAuthorization': function(){
        console.log("server method called calendars.revokeAuthorization");
        cronofyHelper.revokeAuthorization(function(status,res){
            console.log('status: ' + status);
        });
    },

    'calendars.list': function() {
        console.log("server method called calendars.list");
        cronofyHelper.calendarList(function(status,res){
            console.log('status: ' + status);
            console.dir(res);
        });
    },
    'calendars.profile': function(){
        console.log("meteor method calendars.profile");
        cronofyHelper.userProfile(function(status,res){
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

        cronofyHelper.freeBusy(options, function(status,res){
            console.log('status: ' + status);
            console.dir(res);
        });
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
        cronofyHelper.createEvent(options, function(status,res){
            console.log('status: ' + status);
            console.dir(res);
        });
    },
    'calendars.deleteEvent': function(options){
        console.log("meteor method create event");
        check(options, {
            event_id: String
        });
        cronofyHelper.deleteEvent(options, function(status,res){
            console.log('status: ' + status);
            console.dir(res);
        });
    },

    'calendars.readEvents': function(options){
        console.log("meteor method readEvents");
        check(options, {
            from: String,
            to: String,
            tzid: String,
            include_deleted: Boolean,
            include_managed: Boolean
        });
        cronofyHelper.readEvents(options, function(status,res){
            console.log('status: ' + status);
            console.dir(res);
        });
    },
    'calendars.refresh': function(){
        console.log("meteor method refresh");

        if (Meteor.user() && Meteor.user().services.cronofy) {
            //note: currentUser declared in accounts.js
            //currentUser = User.findOne({_id:user.user._id});

            //userCalendar = new UserCalendar();
            userCalendar = UserCalendar.findOne({userId:Meteor.userId()});
            console.log('*** userCalendar ***');
            //console.dir(userCalendar);
            //console.dir(userCalendar);
            //console.dir(currentUser);
            //Meteor.setTimeout(function(){
            //    console.log("after setTimeout");
            //    console.dir(userCalendar.provider);
            //    userCalendar.availCalendars.map(function(cal,i){
            //        console.log("here is cal i=" + i + " " + cal.name);
            //
            //    });
            //},2000);
            if (userCalendar.expired()){

            }
            if (!userCalendar.expired()) {
                var options = {
                    access_token: Meteor.user().services.cronofy.accessToken
                };

                cronofy.listCalendars(options, Meteor.bindEnvironment(function (err, res) {
                    if (!err) {
                        console.log("astro afterInit listCalendars callback info:");
                        //console.dir(res);
                        res.calendars.map(function (cal, i) {
                            if (i == 0) {
                                var provider = new CalendarProvider();
                                provider.set('name',cal.provider_name);
                                provider.set('profileId',cal.profile_id);
                                provider.set('profileName',cal.profile_name);
                                //console.log('self:');
                                userCalendar.set('provider',provider);
                                //console.dir(self);
                            }
                            if (!cal.calendar_deleted) {
                                console.log(cal.calendar_name);
                                var linkedCalendar = new LinkedCalendar();
                                linkedCalendar.set('calendarId',cal.calendar_id);
                                linkedCalendar.set('name',cal.calendar_name);
                                linkedCalendar.set('readonly',cal.calendar_readonly);
                                linkedCalendar.set('deleted',cal.calendar_deleted);
                                linkedCalendar.set('primary',cal.calendar_primary);

                                userCalendar.push('availCalendars',linkedCalendar);
                            }

                        });
                        userCalendar.save();
                    } else {
                        console.log("error encountered with listCalendars:")
                        console.dir(err);
                    }
                }));
            }

        }
    },
});
