const request = require('request');
const StatsD = require('oneapm-ci-sdk').StatsD;
var statsd = new StatsD('127.0.0.1', 8251);

statsd.socket.unref();

request.get('http://services.swpc.noaa.gov/products/summary/solar-wind-speed.json', (error, res, resContent)=> {
	console.log('solar.wind.speed = %d', JSON.parse(resContent).WindSpeed);
	statsd.gauge('solar.wind.speed', parseFloat(JSON.parse(resContent).WindSpeed, 10))
});
