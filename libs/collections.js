import {Mongo} from 'meteor/mongo';

export default {
  Posts: new Mongo.Collection('posts'),
  Calendars: new Mongo.Collection('calendars')
};
