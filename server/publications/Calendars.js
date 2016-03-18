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



    cronofyHelper(this.userId).loadEvents(options, (status,res) => {
        console.log("back from loadEvents");
        if (status != 'error'){
            console.log('success');
        } else {
            console.log("an error occurred");
        }
        //console.log("before actual publish return");
        //return UserEvents.findOne({});
    });
    console.log("before actual publish return");
    return UserEvents.find({});
});

//Meteor.publish('calendars.single', function (calendarId) {
//    check(calendarId, String);
//    const selector = {calendarId: calendarId};
//    return Calendars.find(selector);
//});
