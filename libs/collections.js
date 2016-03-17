import {Mongo} from 'meteor/mongo';

export default {
  Posts: new Mongo.Collection('posts'),
  UserCalendars: new Mongo.Collection('usercalendars'),
  UserEvents: new Mongo.Collection('userevents')
};
