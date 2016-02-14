import cronofy from 'cronofy';
import {UserCalendars} from '/libs/collections';

const cronofyHelper = {
        hasLinkedCalendar: function(){
            return Meteor.user() && Meteor.user().services.cronofy;
        },
        currentUserId: function(){
            return Meteor.userId() || "no user id";
        },
        addUserId: function(errMsg){
            check(errMsg,String);
            return errMsg + " for userId: " + this.currentUserId();
        },
        isExpired: function() {
            if (!this.hasLinkedCalendar()) {
                return moment().toDate() > Meteor.user().services.cronofy.expiresAt;
            } else {
                return true;
            }
        },
        config: function(){
            var config = ServiceConfiguration.configurations.findOne({service: 'cronofy'});
            if (!config) {
                Winston.log('error',this.addUserId("Service configuration error.  Service 'cronofy'"));
                throw new ServiceConfiguration.ConfigError();
            }
            return config;
        },
        checkLinkedCalendar: function(callback){
            check(callback,Function);
            if (!this.hasLinkedCalendar()) {
                Winston.log('error',this.addUserId("Cronofy - checkLinkedCalendar - no linked calendar found"));
                callback('error');
                return;
            }
        },
        refreshAccessToken: function(callback){
            check(callback,Function);
            this.checkLinkedCalendar(callback);
            var self = this;
            var config = this.config();
            var options = {
                client_id: config.client_id,
                client_secret: config.client_secret,
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
                    Winston.log('error',self.addUserId("Cronofy - refreshAccessToken - unable to refresh access token"),err);
                    callback('error');
                }
            }));
        },
        revokeAuthorization: function(callback){
            check(callback,Function);
            this.checkLinkedCalendar(callback);
            var self = this;
            var config = this.config();
            var options = {
                client_id: config.client_id,
                client_secret: config.client_secret,
                token: Meteor.user().services.cronofy.accessToken

            };
            cronofy.revokeAuthorization(options,Meteor.bindEnvironment(function(err,res){
                if (!err) {
                    var loggedInUser = Meteor.users.findOne({_id:Meteor.userId()});
                    callback('success',res);
                } else {
                    Winston.log('error',self.addUserId("Cronofy - revokeAuthorization - unable to revoke authorization"),err);
                    callback('error');
                }
            }));
        },
        calendarList: function(callback){
            check(callback,Function);
            this.checkLinkedCalendar(callback);
            var self = this;
            var options = {
                access_token: Meteor.user().services.cronofy.accessToken
            };
            cronofy.listCalendars(options,Meteor.bindEnvironment(function(err,res){
                if (!err) {
                    Winston.log('info','success in calendarList');
                    callback('success',res);
                } else {
                    Winston.log('error',self.addUserId("Cronofy - calendarList - unable to fetch calendar list"),err);
                    callback('error');
                }
            }));
        },
        userProfile:function(callback){
            check(callback,Function);
            this.checkLinkedCalendar(callback);
            var self = this;
            var options = {
                access_token: Meteor.user().services.cronofy.accessToken
            };
            cronofy.profileInformation(options,Meteor.bindEnvironment(function(err,res){
                if (!err) {
                    callback('success',res);
                } else {
                    Winston.log('error',self.addUserId("Cronofy - userProfile - unable to fetch profile information"),err);
                    callback('error');
                }
            }));
        },
        freeBusy:function(options, callback){
            check(options,{ from:String, to:String, tzid:String});
            check(callback,Function);
            this.checkLinkedCalendar(callback);
            var self = this;
            options = _.extend(options, {
                access_token: Meteor.user().services.cronofy.accessToken
            });
            cronofy.freeBusy(options,Meteor.bindEnvironment(function(err,res){
                if (!err) {
                    callback('success',res);
                } else {
                    Winston.log('error',self.addUserId("Cronofy - freeBusy - unable to fetch free-busy information."),options,err);
                    callback('error');
                }
            }));
        },
        createEvent: function(options,callback){
            check(options,{
                event_id: String,
                start: String,
                end: String,
                summary: String,
                description: String,
                tzid:String
            });
            check(callback,Function);
            this.checkLinkedCalendar(callback);
            var event_id = Random.id();
            var self = this;
            var options = _.extend({
                event_id:event_id,
                calendar_id: 'cal_Vpg1U7TM0HgKADQw_pjFndgu883IoFKuKDX0LyXw',
                access_token: Meteor.user().services.cronofy.accessToken
            },options);

            cronofy.createEvent(options,Meteor.bindEnvironment(function(err,res){
                if (!err) {
                    callback('success',res);
                } else {
                    Winston.log('error',self.addUserId("Cronofy - createEvent - unable to create event."),options,err);
                    callback('error');
                }
            }));
        },
        deleteEvent: function(options,callback){
            check(options, {
                event_id: String
            });
            check(callback,Function);
            this.checkLinkedCalendar(callback);
            var self = this;
            var options = _.extend({
                calendar_id: 'cal_Vpg1U7TM0HgKADQw_pjFndgu883IoFKuKDX0Lyw',
                access_token: Meteor.user().services.cronofy.accessToken
            },options);

            cronofy.deleteEvent(options,Meteor.bindEnvironment(function(err,res){
                if (!err) {
                    callback('success',res);
                } else {
                    Winston.log('error',self.addUserId("Cronofy - deleteEvent - unable to delete event."),options,err);
                    callback('error');
                }
            }));
        },
        readEvents: function(options,callback){
            check(options, {
                from: String,
                to: String,
                tzid: String,
                include_deleted: Boolean,
                include_managed: Boolean
            });
            check(callback,Function);
            this.checkLinkedCalendar(callback);
            var self = this;
            var options = _.extend({
                access_token: Meteor.user().services.cronofy.accessToken
            },options);

            cronofy.readEvents(options,Meteor.bindEnvironment(function(err,res){
                if (!err) {
                    callback('success',res);
                } else {
                    Winston.log('error',self.addUserId("Cronofy - readEvents - unable to read events."),options,err);
                    callback('error');
                }
            }));
        },
        newLinkedCalendar: function(cal){
            check(cal, { provider_name: String, profile_id: String, profile_name: String, calendar_id: String,
                    calendar_name: String, calendar_readonly: Boolean, calendar_deleted: Boolean, calendar_primary: Boolean
                }
            );
            var linkedCalendar = new LinkedCalendar();
            linkedCalendar.set('provider_name',cal.provider_name);
            linkedCalendar.set('provider_id',cal.provider_id);
            linkedCalendar.set('profile_name',cal.profile_name);
            linkedCalendar.set('calendar_id', cal.calendar_id);
            linkedCalendar.set('calendar_name', cal.calendar_name);
            linkedCalendar.set('calendar_readonly', cal.calendar_readonly);
            linkedCalendar.set('calendar_deleted', cal.calendar_deleted);
            linkedCalendar.set('calendar_primary', cal.calendar_primary);
            linkedCalendar.set('selected', false);
            return linkedCalendar;

        },
        updateLinkedCalendar: function(userCal,cal){
            //check(userCal,Object);
            check(cal, { provider_name: String, profile_id: String, profile_name: String, calendar_id: String,
                    calendar_name: String, calendar_readonly: Boolean, calendar_deleted: Boolean, calendar_primary: Boolean
                }
            );        var j = 0, match=false;
            for (j=0; j<userCal.availCalendars.length;j++){
                if (userCal.availCalendars[j].calendar_id == cal.calendar_id) {
                    match = true;
                    userCal.availCalendars[j].set('calendar_name', cal.calendar_name);
                    userCal.availCalendars[j].set('calendar_readonly', cal.calendar_readonly);
                    userCal.availCalendars[j].set('calendar_deleted', cal.calendar_deleted);
                    userCal.availCalendars[j].set('calendar_primary', cal.calendar_primary);
                    break;
                }
            }
            return match;
        },
        updateUserCalendar: function(callback){
            check(callback,Function);
            var self = this;
            this.calendarList(function(status,res){
                var match=false, newLinkedCals = [];
                if (status=='success') {
                    var userCal = UserCalendars.findOne({userId:Meteor.userId()});
                    if (userCal) {
                        res.calendars.map(function (cal, i) {
                            if (!self.updateLinkedCalendar(userCal,cal)) {
                                newLinkedCals.push(self.newLinkedCalendar(cal));
                            }
                        });
                        //Done this way due to mongo err: Exception in callback of async function: MongoError:
                        //Cannot update 'availCalendars' and 'availCalendars.0.calendar_name' at the same time
                        userCal.save();
                        for (n=0; n < newLinkedCals.length; n++){
                            userCal.push('availCalendars', newLinkedCals[n]);
                        }
                        userCal.save();
                    } else {
                        userCal = new UserCalendar();
                        res.calendars.map(function (cal, i) {
                            userCal.push('availCalendars', self.newLinkedCalendar(cal));
                        });
                        userCal.save();
                    }

                } else {
                    callback(status)
                }
            })
        }
    }
export default cronofyHelper;