// https://github.com/gulpjs/gulp/issues/293
var os = require('os');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var wav = require('wav');
var lame = require('lame');
var gutil = require('gulp-util');

var sound = {
	file: __dirname + '/sounds/gulp.wav'
	, duration: null
};

exports.config = config;
exports.play = play;
exports.plumb = plumb;

process.on('uncaughtException', function(err) {
	play();
	throw err;
});

function config(options) {
	if (options.duration) {
		sound.duration = parseInt(options.duration);
	}
		
	if (options.file) {
		fs.exists(options.file, function(exists) {
			var ext = path.extname(options.file);
			
			// return early if;
			// file doesn't exist
			if (!exists) {
				return gutil.log('[' + gutil.colors.red('gulp-crash-sound') + ']', 'File doesn\'t exist');
			}
			
			// or is a wav (nothing to do)
			if (ext === '.wav') {
				return;
			}
			
			// or isnt a mp3 (not supported file)
			if (ext !== '.mp3') {
				return gutil.log('[' + gutil.colors.red('gulp-crash-sound') + ']', 'Only WAV and MP3 files are supported');
			}
			
			convertMP3(options.file);
		});
	}
}

function play() {
	switch (os.platform()) {
		case 'linux':
			exec('aplay ' + (sound.duration ? ('-d' + sound.duration) : '') + ' ' + sound.file);
			break;
		
		case 'darwin':
			exec('afplay ' + (sound.duration ? ('-t' + sound.duration) : '') + ' ' + sound.file);
			break;
		
		case 'win32':
		case 'win64':
			gutil.log('[' + gutil.colors.red('gulp-crash-sound') + ']', 'Windows is currently not supported');
			break;
	}
}

function plumb(fn) {
	return function(err) {
		play();
		fn(err);
	};
}

// helpers
function convertMP3(file) {
	var tempdir =  os.tmpdir();
	var mp3File = path.basename(file);
	var wavFile = tempdir + path.sep + mp3File.replace(/mp3$/, 'wav');
	
	// check if we have the converted wav cached
	fs.exists(wavFile, function(exists) {
		if (exists) {
			return sound.file = wavFile;
		}
		
		var input = fs.createReadStream(file);
		var decoder = new lame.Decoder();
		
		decoder.on('format', function(format) {
			var writer = new wav.Writer(format);
			var output = fs.createWriteStream(wavFile);
		  	
		  	decoder.pipe(writer).pipe(output);
		});
		
		decoder.on('finish', function() {
			// check conversion
			fs.stat(wavFile, function(err, stats) {
				if (stats && stats.size > 0) {
					sound.file = wavFile;
				} else {
					gutil.log('[' + gutil.colors.red('gulp-crash-sound') + ']', 'Unable to convert file to a WAV');
				}
			});
		});
		
		input.pipe(decoder);
	});
}