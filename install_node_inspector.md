##  node-inspector

1.  install node-inspector

      ```
      npm install -g node-inspector
      ```

2.  open a cmd console 

      ```
      cd d://nodejs/npm.prefix; // this is node repository path
      node-inspector // start node-inspector
      ```
      
3.  open another cmd console 
      
      ```
      cd d://js/async // switch to your working route
      node --debug-brk detect // execute your working script 
      ```
      
4.  open chrome 

      ```
      http://localhost:8080/?ws=127.0.0.1:8080&port=5858 //node server is running on 8080
      ```
