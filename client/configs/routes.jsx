import React from 'react';
import {injectDeps} from 'react-simple-di';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

import MainLayout from '../components/layouts.main/index.jsx';
import PostList from '../containers/postlist';
import Post from '../containers/post';
import NewPost from '../containers/newpost';
import LinkCalendar from '../containers/linkcalendar';
import CalendarList from '../containers/calendarlist';
import CalEventList from '../containers/caleventlist';
import CalEventCreate from '../containers/caleventcreate';

export const initRoutes = (context, actions) => {
  const MainLayoutCtx = injectDeps(context, actions)(MainLayout);

  // Move these as a module and call this from a main file
  FlowRouter.route('/', {
    name: 'posts.list',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<PostList />)
      });
    }
  });

  FlowRouter.route('/post/:postId', {
    name: 'posts.single',
    action({postId}) {
      mount(MainLayoutCtx, {
        content: () => (<Post postId={postId}/>)
      });
    }
  });

  FlowRouter.route('/new-post', {
    name: 'newpost',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<NewPost/>)
      });
    }
  });
  FlowRouter.route('/link-calendar', {
    name: 'authcronofy',
    action() {
        mount(MainLayoutCtx, {
            content: () => (<LinkCalendar/>)
        });
    }
  });
  FlowRouter.route('/calendar-list', {
    name: 'calendar.list',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<CalendarList />)
      });
    }
  });
  FlowRouter.route('/cal-event-create/:calendarId', {
    name: 'cal-event.create',
    action({calendarId}) {
      mount(MainLayoutCtx, {
        content: () => (<CalEventCreate calendarId={calendarId} />)
      });
    }
  });
  FlowRouter.route('/cal-event-list', {
    name: 'cal-event.list',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<CalEventList />)
      });
    }
  });
  FlowRouter.route('/_oauth/cronofy', {
    name: 'cronofy',
    action(code) {
        console.log('route: cronofy');
        console.log(code);
      mount(MainLayoutCtx, {
        content: () => (<LinkCalendar/>)
      });
    }
  });
};
