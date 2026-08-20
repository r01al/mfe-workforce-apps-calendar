import { mountStandalone } from '@r01al/mfe-workforce-common-client/standalone';
import { demoWorkers } from '@r01al/mfe-workforce-common-client/testing';
import '@r01al/mfe-workforce-common-client/standalone.css';
import Calendar from './Calendar';

mountStandalone({
	component: Calendar,
	route: '/calendar',
	workers: demoWorkers,
});
