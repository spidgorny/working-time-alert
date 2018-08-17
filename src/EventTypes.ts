// https://electronjs.org/docs/api/power-monitor

export enum EventTypes {
	WORKING = 'working',
	START = 'start',
	SUSPEND = 'suspend',
	RESUME = 'resume',
	ON_AC = 'on-ac',
	ON_BATTERY = 'on-battery',
	SHUTDOWN = 'shutdown'
}
