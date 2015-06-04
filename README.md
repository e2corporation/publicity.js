# API Contest for REV2


From React's documentation, here are a couple key points about the React Framework. When you're ready to dabble with the code,
checkout the *Getting Started* section to get up and running quickly http://facebook.github.io/react/docs/getting-started.html.

To see the latest running build, please visit http://publicity-556fbd6dbeac3.bluestallion.net

#### Simple
Simply express how your app should look at any given point in time, and React will automatically manage all UI updates when your underlying data changes.

#### Declarative
When the data changes, React conceptually hits the "refresh" button, and knows to only update the changed parts.

#### Build Composable Components

React is all about building reusable components. In fact, with React the only thing you do is build components. Since they're so encapsulated, components make code reuse, testing, and separation of concerns easy.

## Contest Ground rules:
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
* React.js (https://facebook.github.io/react/)


## Package Contents

```
shogun:Publicity Julien$ ls -la
total 48
drwxr-xr-x  12 Julien  staff    408 Jun  2 12:09 .
drwxr-xr-x  67 Julien  staff   2278 Jun  2 12:09 ..
drwxr-xr-x  13 Julien  staff    442 Jun  2 13:00 .git
-rw-r--r--   1 Julien  staff     27 Jun  2 12:09 .gitignore
drwxr-xr-x   8 Julien  staff    272 Jun  2 12:09 .idea
-rw-r--r--   1 Julien  staff   3929 Jun  2 12:59 README.md
drwxr-xr-x   7 Julien  staff    238 Jun  2 12:09 bower_components
drwxr-xr-x   5 Julien  staff    170 Jun  2 12:09 build
drwxr-xr-x   4 Julien  staff    136 Jun  2 12:09 fonts
-rw-r--r--   1 Julien  staff  10734 Jun  2 12:54 index.html
-rw-r--r--   1 Julien  staff   1382 Jun  2 12:09 intro.html
drwxr-xr-x   5 Julien  staff    170 Jun  2 12:09 src

```


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
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-cssmin --save-dev
npm install grunt-contrib-imagemin --save-dev
npm install grunt-contrib-sass --save-dev

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


# Credits

# License

Released under the a Private non-commercial license.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software with restriction, limited to the rights to use, copy, modify this software for educational and learning purposes, and to permit persons to whom the Software is furnished to do so. Permission is not granted to publish, distribute, sublicense, and/or sell copies of this Software. Use of this software is subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.