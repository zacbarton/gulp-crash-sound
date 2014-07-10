gulp-crash-sound
========

Play a WAV or MP3 when gulp crashes.

Errors in gulp tasks tend to crash it. You then spend a few minutes trying to figure out what's gone wrong only to find that gulp crashed and you didn't notice.

Use this plugin to play a sound when gulp crashes so you know you need to fix something.

This plugin can also be used with [gulp-plumber][1].


Installation
--------

    $ npm install -g gulp-crash-sound


Examples
--------

The following examples show you 3 ways to use gulp-crash-sound.

1\. Just include and use defaults.
```javascript
var gCrashSound = require('gulp-crash-sound');

gulp.task('build', function() {
	gulp.src('/some/path');
});
// if gulp crashes (for any task) a sound will be played
```

2\. Play a sound in your error handler.
```javascript
var gCrashSound = require('gulp-crash-sound');

function yourOnErrorFunction(err) {
	gCrashSound.play();
	// handle error
}

// somewhere in gupfile.js
.on('error', yourOnErrorFunction)
```

3\. Wrap gulp-plumber.
```javascript
var gCrashSound = require('gulp-crash-sound');

// somewhere in gupfile.js
.pipe(plumber({
  errorHandler: gCrashSound.plumb(yourOnErrorFunction)
  // if gulp crashes a sound is played before calling your error function
}))
```


Configuration
--------

The default sound is a '[gulp][2]' but you can use any WAV or MP3 (drm free).

```javascript
var gCrashSound = require('gulp-crash-sound');

gCrashSound.config({
	file: '/path/to/your/wav/or/mp3'
	, duration: 3 // 3 seconds. can be null (or not set) to play full length which is the default
});
```

Requirements
--------

* Linux: aplay
* OSX:   afplay



Known Issues
--------

* No Windows support


  [1]: https://www.npmjs.org/package/gulp-plumber
  [2]: https://raw.githubusercontent.com/zacbarton/gulp-crash-sound/master/sounds/gulp.wav