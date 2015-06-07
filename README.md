# API Contest for REV2

Built with React.js, Publicity uses a flexible Poster Card as the fundamental building block to allow creation various widgets, and even grids.
Using a Virtual DOM, we can utilize a model architecture for better performance.

To see the latest running build, please visit http://publicity-556fbd6dbeac3.bluestallion.net


## Technology Stack

* NPM (http://npmjs.org)
* RevContent API (http://www.revcontent.com)
* Bower (http://bower.io)
* React.js (https://facebook.github.io/react/)
* jQuery (http://jquery.com)

### Future Toolkits to be Integrated

* Node.JS + Express.js
* Derby.js MVC for Express.js
* Jade Template lang
* Stylus CSS Preprocessor
* Redis (http://redis.io)
* MongoDB (http://)

## Package Contents

```
➜  publicity.js git:(development) ✗ ls -la
total 96
drwxr-xr-x   15 shogun  staff    510 Jun  5 23:43 .
drwxr-xr-x  152 shogun  staff   5168 Jun  2 09:11 ..
drwxr-xr-x   14 shogun  staff    476 Jun  5 23:44 .git
-rw-r--r--    1 shogun  staff     41 Jun  2 20:15 .gitignore
drwxr-xr-x   13 shogun  staff    442 Jun  4 20:14 .idea
-rw-r--r--    1 shogun  staff   2670 Jun  5 20:04 Gruntfile.js
-rw-r--r--    1 shogun  staff   8592 Jun  5 23:43 README.md
drwxr-xr-x    7 shogun  staff    238 Jun  2 09:43 bower_components
drwxr-xr-x    6 shogun  staff    204 Jun  2 20:15 build
drwxr-xr-x    4 shogun  staff    136 Jun  2 20:15 fonts
-rw-r--r--    1 shogun  staff  19718 Jun  5 23:34 index.html
-rw-r--r--    1 shogun  staff   1382 Jun  2 09:43 intro.html
drwxr-xr-x    8 shogun  staff    272 Jun  2 20:16 node_modules
-rw-r--r--    1 shogun  staff    718 Jun  5 20:04 package.json
drwxr-xr-x    6 shogun  staff    204 Jun  2 20:15 src

```


### Pre-requisites

**A functioning LAMP Stack is required to run this application**. Please ensure you have a healthy development environment before proceeding with installing this application.

### Apache HTTPd Server
Apache must be installed and compiled with PHP5 + MySQL Support.


#### PHP5 Special Configuration
Please ensure that the **Short_Open** directive is set to **ON** in your system's **php.ini** configuration to ensure proper rendering. This is usually set to off for production environments and default installations of PHP!


#### Mac OS
To install dependencies using Homebrew, run the following operations. As of this build, mongodb and redis are optional.
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
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-cssmin --save-dev
npm install grunt-contrib-imagemin --save-dev
npm install grunt-contrib-sass --save-dev

```

### Setup HTTP Host

Please see below for sample Virtual Host Configuration for use with Apache HTTPd. You will need to adjust the
DocumentRoot and Directory properties to match your local environment.

```
<VirtualHost *:80>
    ServerAdmin j.c@shogun.io
    DocumentRoot "/www/publicity.js"
    ServerName publicity.js
    ServerAlias www.publicity.js
    ErrorLog "/private/var/log/apache2/publicity-error_log"
    CustomLog "/private/var/log/apache2/publicity-access_log" common
        <Directory "/www/publicity.js">
        AllowOverride All
        Options Indexes MultiViews FollowSymlinks
        Order allow,deny
        Allow from all
        #Header Set Cache-Control no-cache
        </Directory>
</VirtualHost>
```


# MVC Design Overview


# Poster Card

The Poster card is the fundamental component of Publicity, it is a structured React Component broken down into several sub-components for better html modeling of an advertisement.

```
            // PosterCard Main Component (Ad Unit)
            Publicity.PosterCard = React.createClass({
                render: function () {
                    return (
                        <div className="card left" data-count={this.state.internal_count} data-offset={this.state.internal_offset} data-sp-count={this.state.sponsored_count} data-sp-offset={this.state.sponsored_offset} >
                            <span className="card-icon restore-card">
                                <i className="oi" data-glyph="arrow-circle-top"></i>
                            </span>

                            <span className="card-icon snooze-card">
                                <i className="oi" data-glyph="timer"></i>
                            </span>

                            <Publicity.PosterCard.Close />

                            <Publicity.PosterCard.Loader />

                            <Publicity.PosterCard.Dismissal />

                            <Publicity.PosterCard.Action data={this.state.data} />

                        </div>
                        );
                });
```


## Close Component
The close component is the "x" icon that is responsible for starting the ad dismissal process.

```
            // Close Trigger Sub-component (Calls Dismissal)
            Publicity.PosterCard.Close = React.createClass({
                render: function () {
                    return (
                        <span className="card-icon close-card">&times;</span>
                        );
                }
            });
```
## Loader Component

## Dismissal Component

## Action Component

### Link

### Headline

### Image (Creative)


# Testing

## UNIT Tests

## Functional Tests

## Issue Tickets


# Documentation

### React References


#### More About Refs
https://facebook.github.io/react/docs/more-about-refs.html

### Future Development Configurations

### Derby
For Derby you need:

* Node.js (>=0.10)
* MongoDB
* Redis (>=2.6) is optional (used to scale past one server process)


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


# Credits


## React

From React's documentation, here are a couple key points about the React Framework. When you're ready to dabble with the code,
checkout the *Getting Started* section to get up and running quickly http://facebook.github.io/react/docs/getting-started.html.

#### Simple
Simply express how your app should look at any given point in time, and React will automatically manage all UI updates when your underlying data changes.

#### Declarative
When the data changes, React conceptually hits the "refresh" button, and knows to only update the changed parts.

#### Build Composable Components

React is all about building reusable components. In fact, with React the only thing you do is build components. Since they're so encapsulated, components make code reuse, testing, and separation of concerns easy.


# License

Private license, Copyright &copy; 2015 SHOGUN.IO™.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software with restriction, limited to the rights to use, copy, modify this software for educational and learning purposes. Permission is not granted to publish, distribute, sublicense, and/or sell copies of this Software. Use of this software is subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.