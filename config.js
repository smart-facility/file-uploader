config = {};

// TCP port to run on
config.port = 8081;

// Logging configuration
config.logger = {};
config.logger.level = "info"; // What level to log at; info, verbose or debug are most useful. Levels are (npm defaults): silly, debug, verbose, info, warn, error.
config.logger.maxFileSize = 1024 * 1024 * 100; // Max file size in bytes of each log file; default 100MB
config.logger.maxFiles = 10; // Max number of log files kept
config.logger.logDirectory = ''; // Set this to a full path to a directory - if not set logs will be written to the application directory.
config.logger.logFileName = 'odm-image-uploader.log'

module.exports = config;
