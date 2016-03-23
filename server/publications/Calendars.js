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
    //var from = moment(date).add(-2,'d').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
    //var to = moment(date).add(2,'d').utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
    var from = moment().startOf('isoweek').format();
    var to = moment().endOf('isoweek').format();
    var options = {
        from: from,
        to: to,
        tzid:"Etc/UTC",
        include_deleted: false,
        include_managed: true
    };

    //var d = moment(12-25-2015);
    //var x = d.isoWeek();
    //var y = d.week();
    //console.log("weekno: " + x + ' y: ' + y);



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
    console.log("before actual publish return");
    return UserEvents.find({});
});

//Meteor.publish('calendars.single', function (calendarId) {
//    check(calendarId, String);
//    const selector = {calendarId: calendarId};
//    return Calendars.find(selector);
//});
