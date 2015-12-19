# 	高性能javascript High Performance Javascript

-------

## 	1. 脚本载入优化

###	问题


-	正常 `<script>` 并行下载. 很好!  

-	顶部的 `<script>` 先下载, 下载完后执行. 此过程中浏览器一直等待. 
	
	浏览器等待javascript（可能是若干个一起下载，然后顺序执行）全部下载运行完成之后再解析下面的`<body>`;
	
	这样做的目的是为了保证稳定的DOM树;

###	解决办法

-	采用 `<script>` 标签的defer属性。 带有defer属性的javascript可以跟其它资源同时多线程下载，遇到就下载但不运行，在 document.ready / window.load 之前会全部运行完成。    
	
		<script type="text/javascript" src="file1" defer></script>

-	ajax call 获得 javascript 脚本，缺点是不能跨域  

-	requirejs, labjs等  

	基本原理是向 `<head>` 中添加 `<script>` 标签。 

	这种办法添加进去的js引用不会阻塞进程运行， 下载好之后会有 `<script>` 的loaded || completed事件触发。

##	2.数据存取
	
-	类的函数作为回调，上下文会变成window. 可以用bind或者$.proxy绑定上下文再传递
		
		var AjaxManager = function(){};
		//访问需要带token
		AjaxManager.prototype.getLatestSemester = function(token){
			this.xxx = 123; //hazard!
			... ...
		}
		
		var am = new AjaxManager();
		am.getLatestSemester(); //上下文是am
		
		//以下两种情况上下文是window
		$.get('api/sessiontoken').done(am.getLatestSemester);
		$.get('api/sessiontoken').done(AjaxManager.prototype.getLatestSemester);

		

## 	3.DOM编程

1.	为什么DOM开销大? 

	-	Google 使用 webkit的webcore渲染dom，V8运行js。 有一套接口供两者通信，用js操作Dom都是通过接口通信。接口增加了开销。   

	-	访问DOM元素是有代价的， 修改元素则更为昂贵， 因为它会导致页面重新计算页面的几何变化 - DOM树和渲染树。 

	因此通用的经验法则就是减少访问DOM的次数， 把运算尽量留在ECMAscript这一端处理。

2.	dom元素集合里面存放的是DOM对象的引用， 所以同步更新。 

3.	dom树表示页面结构，渲染树表示DOM节点如何显示。 

	尽量避免dom树重排和渲染树重绘， 有如下方法。 
	
	书中写道用 `document.createDocumentFragment()`, 窃以为拼接字符串即可， 大不了用模板拼接字符串。
		
		//书上代码
		var fragment = document.createDocuemntFragment();
		appendDateToElement(fragment, data);
		document.getElementById('mylist').appendChild(fragment);
	
	-	css更新只提交一次
	
			$('#abc').css({
				background-color: red,
				margin-top: 100px,	
				...
			});
			//然而大部分浏览器对css的多次操作进行了优化
			
	-	使元素脱离文档流，修改完毕后再恢复
		
			//最佳实践1 先隐藏元素，把拼接好的字符串set进去， 再恢复
			<ul id='mylist'>
				<li>123</li>
				<li>456</li>
			</ul>
			
			$('#mylist').hide().append('<li>789</li>').show();

			//最佳实践2 克隆DOM元素，操作，然后整体替换
			$('#mylist').clone();
			

##	4.算法和流程控制

1.	javascript没有块作用域(execution-context), 只有函数级作用域。

2.	for in 遍历属性。 for of == foreach，遍历数组或者集合。老浏览器不支持for of。

3.	倒序循环能略微提高性能。
	
		for(var i=items.length;i--;){
			process(item[i]);
		}	

4.	基于循环的迭代比基于函数的迭代块8倍。
	
		for(var i=0,len=items.length;i<len;i++) //快  
		
		$.each(array, function(){});    
	
5.	选择分支来讲， 查找表 > switch > if else

		查找表就是对象， 数组可以看作是index是等差数列的对象

6.	提到的理论， 任何递归能实现的算法同样可以用迭代来实现。 

		流弊人用递归 -- 瞎扯


##	6.快速响应的用户界面

1.	**如果javascript整整运行了几秒钟， 那么很可能是你做错了什么！**

2.	是否可以用定时器取代循环
	
	-	处理过程是否必须同步？
	-	数据是否必须按顺序处理？

	如果都是否， 则可以用定时器分解逐个进行的数组元素处理任务。

		var todo = items.concat(); //items.slice();
		setTimeout(function(){
			
			//取得数组的下个元素并进行处理
			process(todo.shift());

			//如果还有需要处理的元素， 创建另一个定时器
			if(todo.length >　０)｛
				setTimeout(arguments.callee, 25);
			｝else {
				callback(items);
			}
		});

	- *这就是数组处理的异步实现，留出时间给浏览器进行渲染*  
	- *适用于有UI更新同时又需要跟后台交互的场景， 为啥感觉这是个鸡肋， 只是为了让代码看起来看顺序的一种策略。*  
	- *代码结构类似递归， 也还是按顺序逐个处理*
	

3.	2的封装版本

		function processArray(items, process, callback){
			var todo = items.concat(); //克隆数组 克隆jq $('#ss').clone();
			
			setTimeout(function(){
				process(todo.shift()); //弹出第一个

				if(todo.length > 0){
					setTimeout(arguments.callee, 25);
				} else {
					callback(items); //callback是全局回调函数
				}
			}， 25)；
		}

4.	利用3的原理， 处理运行时间过长的函数。
	
		function saveDocument(id){
			
			var tasks = [openDocument, writeText, closeDocument, updateUI];
			setTimeout(function(){
				
				var task = tasks.shift();
				task(id);

				if(tasks.length > 0){
					setTimeout(arguments.callee, 25); //call自己
				}
			}, 25);
		}；


	封装起来待备用，使用前提是
	**任务可以异步处理而不影响用户体验或造成相关代码错误**。

		//定义
		function multistep(steps, args, callback){
		
			var tasks = steps.slice();
			
			setTimeout(function(){
			
				var task = tasks.shift();
				task.apply(undefined, args || []);
	
				if(tasks.length > 0){
					setTimeout(arguments.callee, 25);
				} else {
					callback();
				}
			}, 25)  
		}

		//使用
		function saveDocument(id){
			var tasks = [openDocument, writeText, closeDocument, updateUI];
			multistep(tasks, [id], function(){
				alert('Save Completed!');
			});
		}

	*虽然现在是这么写上了， 然而并布吉岛有啥场景能用*

5.	Web Workers （陌生嘢）

	**Web应用中通常有一些数据处理功能将受益于web workers 而不是定时器**
	
	-	解析一个大字符串
	-	编码/解码大字符串
	-	复杂数学运算（图像或视频处理， 如xml转json， 图片进行base64编码）
	-	大数组排序
			
6.	一个理论，即使javascript代码再重要，也不能影响用户体验。

## 7. AJAX

1.	XHR载入脚本
	
	-	注意使用缓存
	-	同源限制
	
2.	动态脚本注入
	
		var scriptElement = document.createElement('script');
		scriptElement.src = 'http://../../lib.js';
		document.getElementsByTagName('head')[0].appendChild(scriptElement);

	-	*只能是Get方式*
	-	*本质上讲这就是jsonp*
	-	安全问题： 因为使用的动态脚本可以控制整个页面，包括修改内容，重定向到其他网站，甚至跟踪用户操作并发送数据到第三方服务器（就用jsonp）都是可以实现的。

3.	MultipartXHR (新嘢)

	-	"这段php代码读取了三张图片，并把他们转换为base64编码的长字符串， 他们之间用一个简单的Unicode编码的字符1连接，然后返回给客户端。"  

		
			function splitImages(imagesString){
				var imageData = imagesString.split('\u0001');
				var imageElement;
	
				for(var i=imageData.length; i--; ){
					imageElement = document.createElement('img');
					imageElement.src = 'data:image/jpeg;base64,' + imageData[i];
					document.getElementById('container').appendChild('imageElement');
				}
			}

	-	这种方法拿来的data不能缓存
	-	MXHR不能等接收完毕再处理。 可以设置定时器，间隔15s，遇到分隔符就拿出来然后处理。
	-	适用范围
		
		-	页面包含了大量其他地方用不到的资源，尤其是图片（schoolchannel的json response, 提取所有图片itemid，一次发给backend，返回所有图片的base64）
		-	“网站已经在每个页面中使用一个独立打包的jabascript或css文件以减少http请求，因为对每个页面来说，这些文件都是唯一的，所以并不需要从缓存中读取数据，除非重载页面。”


4.	服务器传递数据

-	XHR 最传统的方式
-	图片信标

		var url = '/status_tracker.php';
		var params = [
			'step=2',
			'time=12345678'
		];
		(new Image()).src = url + '?' + params.join('&');
	
	监听image对象的load事件获得服务器状态反馈。  
	检查返回图片的长宽（存疑）获得服务器状态反馈。
	
		var url = '/status_tracker.php';
		var params = [
			'step=2',
			'time=1234567'
		];
		var beacon = new Image();
		beacon.src=  url + '?' + params.join('&');

		beacon.onload = function(){
		
			if(this.width == 1){
				//success
			} else if (this.width == 2){
				//fail
			}
		}

	场景：比如无需返回用户数据的用户authentication就可以用这种。  记录用户在线时长的，传送id及时长即可，可以用这个。  

	如果没用东西返回的话，服务器应该返回http 204　no content 用来阻止客户端继续等待。

5.	AJAX缓存 (存疑)

	缓存需要前后配合。
	1.	前端发送请求，携带etag
	2.	后端收到请求，拿数据。
	3.	拿出来的数据进行哈希，然后跟etag比对。一样返回304。


##	8. 编程实践

1.	不使用eval。 使用setTimeout的时候第一个参数不是字符串。
2.	“条件预加载”
		
		var addHandler = document.body.addEventListener?
			function(target, eventType, handler){
				target.addEventListener(eventType, handler, false);
			}:
			function(target, eventType, handler){
				target.attachEvent('on' + eventType, handler);
			}

3.	“当需要复杂数学运算时，应先查看Math对象”

4.	“当web浏览器请求一个资源是，它通常会发送一个Accept-Encoding HTTP头，来告诉web服务器它支持哪种编码类型”。 可选值包括gzip, compress, deflate, identity.

		//Deflate只是一种过时的网页压缩，应该禁用
		//浏览器内置了解压缩的过程，accept-encoding设为gzip之后回来的数据自己不用管。 
		//使用py攞数据就不一样了，如果设了gzip，需要手动解压。



