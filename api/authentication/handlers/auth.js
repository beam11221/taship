'use strict';

const Joi = require('joi');
var Aguid = require('aguid');
var Bcrypt = require('bcrypt');

const internals = {};


internals.doSignout = function(request, reply) {
    let react = '';
    request.cookieAuth.clear();
    
    request.server.getDb(function (err, connection) {
        
        let sql = 'call signout(?)';
        let params = [request.auth.credentials.sid];
        connection.query(sql, params, function (error, results, fields) {
            
            connection.release();
                if (error) throw error;
                if (results[0][0].vResult == 1){
                    react = {
                        messageCode: 1,
                        message: 'Cleared cookie!',
                    };
    
                    reply(react);
                }
                else {
                    react = {
                        messageCode: 1,
                        message: 'Cant clear cookie!',
                        errCode: 99
                    };
                    
                    reply(react);
                }
        });
    });
};


internals.doSignUp = function(request, reply){
    const saltRounds = 10;
    let react = '';
    
    if (requset.payload.character == 'TA'){
        if (request.payload.password == request.payload.passwordRepeat){
            //gen hash
            Bcrypt.hash(request.payload.password, saltRounds, function(err, hash) {
            
                request.server.getDb(function (err, connection) {
                    let sql = 'call signupTA(?,  ?, ?)';
                    let params = [request.payload.userNm, hash, request.payload.charactor];
                    connection.query(sql, params, function (error, results, fields) {
            
                        connection.release();
                        if (error) throw error;

                        if (results[0][0].vResult === 0){
                            react = {
                                messageCode: 0,
                                message: 'This username already in database',
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
                    });
                });
            });
        }
        else{
            react = {
                messageCode: 1,
                message: 'Password != passwordRepeat',
                errCode: 13
            };
            reply(react);
        }
    }
};


internals.doSignInPost = function(request, reply){

    //get hash password from DB
    request.server.getDb(function (err, connection) {
        let sql = 'call getPassword(?)';
        let params = [request.payload.userNm];
        connection.query(sql, params, function (error, results, fields) {

            connection.release();
            if (error) throw error;
            Bcrypt.compare(request.payload.password, results[0][0].vResult, function(err, res) {
                
                let react = '';
                if (res == true) { //input correctly password
                    //call DB 
                    request.server.getDb(function (err, connection) {
			
                        let sid = Aguid(); //create uniqueID
                        let sql = 'call signin(?, ?)';
                        let params = [request.payload.userNm, sid];
                        connection.query(sql, params, function (error, results, fields) {
                            
                            connection.release();
                            if (error) throw error;
                            
                            if (results[0][0].vResult == null) {
                                console.log('Error!!!!');
                            }
                            else{
                                request.cookieAuth.set({ sid: sid });
                                react = {
                                    messageCode: 1,
                                    message: 'Successfully signin!',
                                    data: {
                                        charactor: results[0][0].vResult
                                    }
                                }
                                reply(react);
                            }
                        });
                    });
                }
                else{   // input wrong password
                    react = {
                                    messageCode: 0,
                                    message: 'Invalid username or password',
                                    errCode: 11,
                                };

                    reply(react);
                }
            });
        });
    });
};


internals.doChangePassword = function(request, reply){
    
    request.server.getDb(function (err, connection) {
        const saltRounds = 10;
        let react = '';
        let sql = 'call getPasswordCre(?)';
        let params = [request.auth.credentials.sid];
        connection.query(sql, params, function (error, results, fields) {
            
            connection.release();
            if (error) throw error;
            Bcrypt.compare(request.payload.currentPassword, results[0][0].vResult, function(err, res) {
                console.log(request.payload.currentPassword);
                console.log(results[0][0].vResult);
                if (res == false) {  //invalid current password
                    react = {
                    messageCode: 0,
                    message: 'Invalid your current password',
                    errCode: 14,
                };

                reply(react);
                }
                else {   //correct current password
                    Bcrypt.hash(request.payload.newPassword, saltRounds, function(err, hash) {
                        
                        request.server.getDb(function (err, connection) {
                        
                        let sql = 'call chagePassword(?, ?)';
                        let params = [request.auth.credentials.sid, hash];
                            connection.query(sql, params, function (error, results, fields) { //update newPassword
                                
                                connection.release();
                                if (results[0][0].vResult == 1) {
                                    react = {
                                        messageCode: 1,
                                        message: 'Successfully change password!',
                                        data: {
                                            charactor: results[0][0].vResult
                                        }
                                    };
                                    
                                    reply(react);
                                }
                            });
                        });
                    });
                }
            });
        });
    });
};


internals.doFord = function(request, reply){
    
    request.server.getDb(function (err, connection) {
        
        let sql = 'call cursorEx(?)';
        let params = ["TA"];
        connection.query(sql, params, function (error, results, fields) {
            
            connection.release();
            if (error) throw error;
            console.log(results);
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

exports.signout = {
	tags: ['api'],
    handler: internals.doSignout
};

exports.changePassword = {
	tags: ['api'],
    validate: {
        payload: {
            currentPassword: Joi.string().max(40).required(),
            newPassword: Joi.string().max(40).required()
        }
    },
    handler: internals.doChangePassword
};

exports.signUpPost = {
    auth: false,
    tags: ['api'],
    validate: {
        payload: {
            userNm: Joi.string().max(40).required(),
            password: Joi.string().max(40).required(),
            passwordRepeat: Joi.string().max(40).required(),
            charactor: Joi.string().max(2).required()
        }
    },
    handler: internals.doSignUp
};


exports.ford = {
    auth: false,
    tags: ['api'],
    handler: internals.doFord
};
