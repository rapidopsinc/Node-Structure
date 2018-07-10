/**
 * Created by Samir on 9/10/17.
 */
const moment = require('moment'),
  request = require('request'),
  q= require('q'),
  config = global.config;
  _ = require('lodash');

/**
 * @class Utils
 * @description class to manage the common methods accross the application
 */
class Utils{

	/**
   * @method getTime
   * @description function to get time to add in db
   * @returns {number}
   */
  static getTime(){
      return Math.round(moment.utc().valueOf() / 1000, 0)
  }



	/**
   * @method parseBoolean
   * @description function to parse the boolean value
   * @param value
   * @returns {*}
   */
  static parseBoolean(value){
    if(value===true){
      return true;
    }
    if(value===false){
      return false;
    }
    if (value === "true") {
      return true;
    }
    if(value==="false"){
      return false;
    }
    return null;
  }

	/**
   * @method parseJSON
   * @param stringValue
   * @param defaultValue
   * @description function to parse the JSON and handle the error while parsing the JSON
   */
  static parseJSON(stringValue,defaultValue){
    let returnValue = defaultValue || {};
    try{
      returnValue = JSON.parse(stringValue);
    } catch(e){}
    return returnValue;
  }

  /**
   * @method stringifyJSON
   * @param stringValue
   * @param defaultValue
   * @description function to stringify the JSON and handle the error while parsing the JSON
   */
  static stringifyJSON(stringValue,defaultValue){
    let returnValue = defaultValue || '';
    try{
      returnValue = JSON.stringify(stringValue);
    } catch(e){}
    return returnValue;
  }


	/**
   * @method getHostName
   * @description function to get the host name from the request object
   */
  static getHostName(req){
    let hostname = req.hostname.replace('.'+CONFIG.server.mainDomain, '');
    if(req.headers['physio-host']){
      hostname = req.headers['physio-host'];
    }
    return hostname;
  }

	/**
   * @method getDBNameFromHostName
   * @description function to get the database name from the host name
   */
  static getDBNameFromHostName(hostname){
      return hostname.replace('-','_').replace(/\./g, '_');
  }

	/**
   * @method getException
   * @description get the exception from the error
   * @param error
   * @param message
   */
  static getException({error,message}){
    if (error instanceof Exception) {
      return error;
    } else if (error && error.name === 'SequelizeDatabaseError'){
      return new Exception('DBError',message);
    } else {
      return new Exception('UnKnownError');
    }
  }

	/**
   * @method getRandomString
   * @description function to get the random string
   * @param length
   * @returns {string}
   */
  static getRandomString(length=10){
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

	/**
   * @method checkPermission
   * @description function to check the permission
   * @param req
   * @param permissionToken
   */
  static isUserPermitted(req, permissionToken){
    //If API call from the local then do not check for the permissions
    let hostname = req.hostname;
    if (hostname === '127.0.0.1' || hostname=='localhost') {
      return true;
    }
    return req.User.hasModulePermissions(permissionToken)
  }
}

module.exports = Utils;
