##	有火车票时发送邮件通知


####	需求

监控火车票情况，有票时发送邮件通知。 
Q&A：
*	**为什么不是微信？** 并没有内地银行卡 
	
	
####	分析

[yupiao.info][]

*	直接call余票网(http://yupiao.info/)的Restful API，其采用jsonp跨域，返回json
*	拿回json判断，没东西就继续循环，有东西就发邮件
*	setInterval

####	nodejs方案

如分析所说，126邮箱试不通，采用GMail成功。

[yupiao.info]: yupiao.info

####    SRC

*	**index.js**	主程序
  