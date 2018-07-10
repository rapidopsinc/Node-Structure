'use strict';
const LEVEL_TRACE='trace';
const LEVEL_DEBUG='debug';
const LEVEL_INFO='info';
const LEVEL_WARN='warn';
const LEVEL_ERROR='error';

module.exports= class Logger {
	log(message){
		doLog(LEVEL_INFO,message);
	}
	trace(message){
		doLog(LEVEL_TRACE,message);
	}
	debug(message){
		doLog(LEVEL_DEBUG,message);
	}
	info(message){
		doLog(LEVEL_INFO,message);
	}
	warn(message){
		doLog(LEVEL_WARN,message);
	}
	error(message){
		doLog(LEVEL_ERROR,message);
	}
}

function doLog(level,message){
	switch (level){
		case 'trace':
			console.trace(message);
			break;
		case 'debug':
			console.debug(message);
			break;
		case 'info':
			console.info(message);
			break;
		case 'warn':
			console.warn(message);
			break;
		case 'error':
			console.error(message);
			break;
	}
}