# API Contest for REV2

Ground rules:
* The primary thing we would be looking for is UI innovation, ways publishers can display our content that adds value to their users and site design. Remember most of our pubs like to place us below article.
* Client side code is preferred method for calling the API
* If you request ads, you must show them, per API terms - you cant make a request for 40 ads then only show 2 of them in your plugin/ui (this can be tricky).
* Must be worked on outside of core hours
* Use current github examples as a template for showcasing your widget


## Technology Stack


* NPM
* Node.JS + Express.js
* Derby.js MVC for Express.js
* RevContent API (http://www.revcontent.com)
* Bower (http://bower.io)
* Redis (http://redis.io)
* MongoDB (http://)
* Jade Template lang
* Stylus CSS Preprocessor


### Derby
For Derby you need:

* Node.js (>=0.10)
* MongoDB
* Redis (>=2.6) is optional (used to scale past one server process)


#### Mac OS
To install dependencies using Homebrew, run the following operations.
```
brew update
brew install mongodb
brew install redis
```




### Install NPM Dependencies
After extracting the package contents, change to the project directory and install the needed dependencies.

```
npm install
```

### Install Bower Components

```
bower install
```

### Grunt Packages

```
npm install grunt-contrib-uglify
npm install grunt-contrib-cssmin
npm install grunt-contrib-imagemin
npm install grunt-contrib-sass

```

### Install Redis (OSX)
Please install redis-server for OSX by using homebrew.

```
brew install redis
```


### Start Mongo DB Server

Mongo db is setup to run from [APP]/data.

```
# Start Mongo DB Server
 mongod --dbpath=./data &
```


### Running the Application
Before attempting to run the app, ensure the Npm dependencies are met, Redis and Mongo DB are running.
After successfully starting the index gateway with Node, the app will be available at http://localhost:3000.

```
node server.js
```
