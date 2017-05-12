## Bowler

[![Greenkeeper badge](https://badges.greenkeeper.io/jcblw/bowler.svg)](https://greenkeeper.io/)

Bowler is a simple MV framework that uses jQuery & Handlebars

#### `warning` bowler is going through some large changes

please voice any concerns or ideas in the issues

### Use

include Bowler, Handlebars && jQuery

``` javascript
// intializing
var bowler = Bowler();

// creating a model
var hello = bowler.Model('hello', {hello : 'world'});

//creating a view
var helloView = bowler.View('hello', '<p>{{hello}}</p>');
```
The model and view are bound by thier names (the first argument);

```javascript
//binding the veiw to an element using jquery selectors
var ele = helloView.bind('<div/>');

//element is updated
console.log(ele.html()); // <p>world</p>

//Modify model
hello.extend({hello : 'universe'});

//element is updated
console.log(ele.html()); // <p>universe</p>
```
Change the template

```javascript
helloView.render('<i>{{hello}}</i>');
```	

### Development

Install repo & nodemodules

```shell
git clone https://github.com/jacoblwe20/bowler.git
cd bowler
npm install
```
_you might need to install mocha globally_

```shell
npm install -g mocha
```
running test

```shell
mocha
```

all the test are located in `test/test.js`

### Examples

```shell
node app.js
```


