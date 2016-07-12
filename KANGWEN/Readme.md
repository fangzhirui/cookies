##	获得海拔


####	需求

已知经度纬度, 通过调用Google Elevation API获得海拔.

####	分析

文档如下: [Google Elevation API][]

*	只能通过Get调用
*	Url长度不能超过2000
*	每条请求不能超过512个locations
*	免费额度为每天2500个请求

####	nodejs方案

1.	Google Console 开通服务, 拿到api key, 添加当前ip到白名单 
2.	读txt文件, 一行一组location, 共计20000行
3.	拼url, 单个url包含90个location, 共计223个请求
4.	获取json响应, 输出到文件为0.cc ~ 222.cc
5.	读*.cc, 格式转换, 再输出到单个文件中

[Google Elevation API]: https://developers.google.com/maps/documentation/elevation/intro?hl=zh-cn

####    SRC

*   **resources/al.txt** 输入的locations
*   **resources/end.xls.csv** 输出的结果
*   **app/main.js** nodejs方案步骤1-4
*   **app/end.js** nodejs方案步骤5
  