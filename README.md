#Nero
###The bestest (only) Jira task burndown chart

###Installation
1. Navigate to the root directory of the project
2. Install all node dependencies
```
npm install
```
3. Install Bower for client dependencies
```
npm install -g bower
```
4. Install client dependencies
```
bower install
```

*Note, if you are inside the firewall, you may have issues connecting to Bower packages using git. If you encounter an issue, run this command:* 
```
git config --global url."https://".insteadOf git://
```

###Running Site
1. Once all dependencies have been installed above
```
node server.js
```