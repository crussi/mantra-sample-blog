import {Mongo} from 'meteor/mongo';

export default {
  Posts: new Mongo.Collection('posts'),
  UserCalendars: new Mongo.Collection('usercalendars')
};
