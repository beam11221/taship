'use strict';

const Joi = require('joi');
var Aguid = require('aguid');
const Config = require('../../../config.json');

var uuid = 1;

const internals = {};

internals.doSignInPost = function(request, reply) {
    
    request.server.getDb(function (err, connection) {
			
        let sid = Aguid();
        let react = '';
        let sql = 'call signin(?,  ?, ?)';
        let params = [request.payload.userNm, request.payload.password, sid];
        connection.query(sql, params, function (error, results, fields) {
        
            connection.release();
            if (error) throw error;
            
            if (results[0][0].vResult === 0){
                react = {
                    messageCode: 0,
                    message: 'Invalid username or password',
                    errCode: 11,
                };

                reply(react);
            }
            else{
                request.cookieAuth.set({ sid: sid });
                
                react = {
                    messageCode: 1,
                    message: 'Successfully signin!'
                };

                reply(react);
            }
		});
    });
};

internals.doSignOut = function(request, reply) {
    
    reply('Hello ' + request.payload.name);
};

internals.doChangePassword = function(request, reply) {
    
    reply('Hello ' + request.payload.name);
};

internals.doSign = function(request, reply) {
    reply('hello');
};

internals.doSignUp = function(request, reply) {
    
    request.server.getDb(function (err, connection) {
			
        let react = '';
        let sql = 'call signup(?,  ?)';
        let params = [request.payload.userNm, request.payload.password];
        connection.query(sql, params, function (error, results, fields) {
        
            connection.release();
            if (error) throw error;
            
            if (request.payload.password != request.payload.passwordRepeat){

                if (results[0][0].vResult === 0){
                react = {
                    messageCode: 0,
                    message: 'This username already has in database',
                    errCode: 12
                };
                
                reply(react);
                }
                else{
                react = {
                    messageCode: 1,
                    message: 'Successfully signup'
                };
        
                reply(react);
                }
            }
            else{
                react = {
                    messageCode: 1,
                    message: 'Password != passwordRepeat',
                    errCode: 13
                };
            
                reply(react);
            }
		});
    });
};


//exports======================================================


exports.signInPost = {
	auth: false,
	tags: ['api'],
    validate: {
        payload: {
            userNm: Joi.string().max(40).required(),
			password: Joi.string().max(40).required()
        }
    },
    handler: internals.doSignInPost  
};

exports.signOut = {
	tags: ['api'],
    validate: {
        payload: {
            name: Joi.string().max(100).required()
        }
    },
    handler: internals.doSignOut 
};

exports.changePassword = {
	tags: ['api'],
    validate: {
        payload: {
            name: Joi.string().max(40).required()
        }
    },
    handler: internals.doChangePassword
};

exports.signUpPost = {
    tags: ['api'],
    validate: {
        payload: {
            userNm: Joi.string().max(40).required(),
            password: Joi.string().max(40).required()
        }
    },
    handler: internals.doSignUp
};

