const auth = require('./handlers/auth.js');
const Config = require('../../config.json');

exports.register = function(server, options, next){
    
    server.auth.strategy('default', 'cookie', true, {
        password: 'huK2e3h0de2lJKGHe94lhmr5iHkier48hIyadlkfOI8ewkrjhh7pIblkrehYgskw',
        cookie: 'sid',
        keepAlive: true,
        ttl: 604800000,   // 7 days
        //redirectTo: '/sign-in',
        isSecure: false,
        isHttpOnly: true,
        validateFunc: function (request, session, callback) {

            console.log(session);
			if (!session.sid) { 
				return callback(null, false); //no cookie sid
			}
            
            request.server.getDb(function (err, connection) {
        
                let sql = 'call validateUser(?)';
                let params = [session.sid];
                connection.query(sql, params, function (error, results, fields) {
                   
                    connection.release();
                    
                    console.log(results[0][0].vResult);
                    if (error) throw error;
                    
                    if (results[0][0].vResult === 0){
                        console.log('Fail cookie');
                        return callback(null, false);
                    }
                    else{ //valid cookie return true
                        console.log('successful');
                        return callback(null, true, session);
                    }
                });
            });
        }
    });
    
    server.route([
        {method: 'POST', path: '/sign-in', config: auth.signInPost },
        //{method: 'POST', path: '/change-password', config: auth.changePassword}
        {method: 'POST', path: '/sign-up', config: auth.signUpPost}
        //{method: 'POST', path: '/sign-out', config: auth.signOut }
    ]); 
        
   next(); 
};

exports.register.attributes = {
    name: 'authentication' 
};


