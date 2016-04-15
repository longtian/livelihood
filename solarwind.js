const request = require('request');
const StatsD = require('oneapm-ci-sdk').StatsD;
var statsd = new StatsD('127.0.0.1', 8251);

statsd.socket.unref();

request.get('http://services.swpc.noaa.gov/products/summary/solar-wind-speed.json', (error, res, resContent)=> {
	console.log(JSON.parse(resContent).WindSpeed);
});


