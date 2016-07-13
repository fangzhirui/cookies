var nodemailer = require('nodemailer');
var superagent = require('superagent');

var sendEmail = function(content){
	
	//HERE WRITE THE PASSWORD
	var transporter = nodemailer.createTransport('smtps://{EMAIL_ADDRESS|URLENCODED}:{EMAIL_PASSWORD}@smtp.gmail.com');
	var mailOptions = {
		from: 'fangzhirui@gmail.com', // sender address
		to: 'fangzhirui@gmail.com,fangzhirui@126.com', // list of receivers
		//to: 'fangzhirui@126.com', // list of receivers
		subject: content, // Subject line == title
		text: content, // plaintext body
		html: content // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
};

setInterval(function(){

	superagent.get('http://yupiao.info/api/yp/%E6%BC%A0%E6%B2%B3-%E5%93%88%E5%B0%94%E6%BB%A8-K7040/2016-06-22')
		.end(function (err, sres) {
			if(err){
				console.log(err);
			} else {
				var text = sres.text.trim();
				if(text.slice(0, 1) == '{' || text.charAt(0) == '['){
					var arr = JSON.parse(text).data.split(',');
					if(arr[8] != '无'){
						sendEmail('22号K4070漠河到哈尔滨硬卧' + arr[8] + '张票');
					} else if (arr[9] != '无'){
						sendEmail('22号K4070漠河到哈尔滨软卧' + arr[8] + '张票');
					}
				}
			}
		});

	superagent.get('http://yupiao.info/api/yp/%E5%8A%A0%E6%A0%BC%E8%BE%BE%E5%A5%87-%E5%93%88%E5%B0%94%E6%BB%A8-k7040/2016-06-22')
		.end(function (err, sres) {
			if(err){
				console.log(err);
			} else {
				var text = sres.text.trim();
				if(text.slice(0, 1) == '{' || text.charAt(0) == '['){
					var arr = JSON.parse(text).data.split(',');
					if(arr[8] != '无'){
						sendEmail('22号K4070加格达奇到哈尔滨硬卧: ' + arr[8] + '张票');
					} else if (arr[9] != '无'){
						sendEmail('22号K4070加格达奇到哈尔滨软卧: ' + arr[9] + '张票');
					}
				}
			}
		});

	superagent.get('http://yupiao.info/api/yp/%E6%BC%A0%E6%B2%B3-%E5%93%88%E5%B0%94%E6%BB%A8-k7042/2016-06-22')
		.end(function (err, sres) {
			if(err){
				console.log(err);
			} else {			
				var text = sres.text.trim();
				if(text.slice(0, 1) == '{' || text.charAt(0) == '['){
					var arr = JSON.parse(text).data.split(',');
					if(arr[8] != '无'){
						sendEmail('22号K4072漠河到哈尔滨硬卧: ' + arr[8] + '张票');
					} else if (arr[9] != '无'){
						sendEmail('22号K4072漠河到哈尔滨软卧: ' + arr[9] + '张票');
					}
				}
			}
		});

	superagent.get('http://yupiao.info/api/yp/%E5%8A%A0%E6%A0%BC%E8%BE%BE%E5%A5%87-%E5%93%88%E5%B0%94%E6%BB%A8-k7042/2016-06-23')
		.end(function (err, sres) {
			if(err){
				console.log(err);
			} else {	
				var text = sres.text.trim();
				if(text.slice(0, 1) == '{' || text.charAt(0) == '['){
					var arr = JSON.parse(text).data.split(',');
					if(arr[8] != '无'){
						sendEmail('23号K4072加格达奇到哈尔滨硬卧: ' + arr[8] + '张票');
					} else if (arr[9] != '无'){
						sendEmail('23号K4072加格达奇到哈尔滨软卧: ' + arr[9] + '张票');
					}
				}
			}
		});
}, 30000);
