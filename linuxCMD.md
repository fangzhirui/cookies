###	tar

	tar -xczf test.tar.gz /test1 /test2 
	tar -xvzf test.tar.gz

### head tail

	head -n 10 x.txt
	tail -n 10 x.txt
	tail -f x.txt

### netstat

	netstat	-lns | grep 8080 //l-listening, n-ignore alias, s-group by protocal

###	find grep

	find . -name ".xml" //递归查找所有的xml文件
	find / -name 'filename.txt' //根据名称查找/目录下的filename.txt

	grep 'energywise' *
	grep -r 'energywise' * //当前目录和子目录搜索
	grep -l -r 'enerfywise' * //同上，只显示文件名

### lsof = list open files
	
	[root@52listen ~]# lsof -i:88
	COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
	httpd 23023 root 4u IPv6 1657391 0t0 TCP *:kerberos (LISTEN)
