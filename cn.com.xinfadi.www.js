const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const today = moment().format('YYYY-MM-DD');
const StatsD = require('oneapm-ci-sdk').StatsD;
var statsd = new StatsD('127.0.0.1', 8251);

statsd.socket.unref();

const getPage = page=> {
	var url = `http://www.xinfadi.com.cn/marketanalysis/0/list/${page}.shtml`;
	console.log('request ', url);

	request.get(url, (error, response, body)=> {
		console.log('receive ', url);

		var $ = cheerio.load(body);
		var foundNotToday = false;

		$('.hq_table tr:not(:first-child)').each((i, tr)=> {
			row = $('td', tr).map((j, td)=> {
				return $(td).text();
			}).toArray();
			console.log(row);

			if (row[6] !== today) {
				foundNotToday = foundNotToday || true;
			} else {
				statsd.gauge(`livelihood.market`, parseFloat(row[1], 10), [`产品:${row[0]}-${row[5]}`, `source:新发地`]);
				statsd.gauge(`livelihood.market`, parseFloat(row[3], 10), [`产品:${row[0]}-${row[5]}`, `source:新发地`]);
			}
		})

		if (!foundNotToday) {
			getPage(page + 1);
		}
	})

}

getPage(1);

