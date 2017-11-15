'use strict';

const Glue = require('glue');
const Hapi = require('hapi');
const Path = require('path');
const internals = {};

internals.manifest = {
    connections: [
        {
            port: 8000,
            labels: ['web'],
			routes: {
				files: {
					relativeTo: Path.join(__dirname, '../')
				}
			}
        },
        {
            port: 8088,
            labels:['api'],
			routes: {
				files: {
					relativeTo: Path.join(__dirname, '../')
				}
			}
        }
    ],
    registrations: [  
        {
            plugin: 'inert',
            options: {
                select: ['web', 'api']
            }
        },
        {
            plugin: 'vision',
            options: {
                select: ['web', 'api']
            }
        },
        {
            plugin: 'blipp',
            options: {}
        },
        {
            plugin: 'hapi-auth-cookie',
            options: {
                select: ['web', 'api']
            }
        },
		{
			plugin: {
				register: 'hapi-plugin-mysql',
				options: {
					host: 'localhost',
					user: 'root',
					password: 'beam',
					database: 'users'
				}
			},
			options: {
				select: ['web', 'api']
			}
			
		},
        {
            plugin: './authentication',
            options: {
                select: ['web', 'api']
            }
        },
        {
            plugin: './web',
            options: {
                select: ['web']
            }
        },
        { 
            plugin: {  // must register after inert and vision 
                register: 'hapi-swagger', 
                options: { 
                    'info': { 
                        'title': 'taship API Documentation', 
                        'description': 'taship', 
                        'version': '1.0.0', 
                    }, 
                    'expanded': 'none', 
                    'payloadType': 'form',  // either json or form 
                    'sortTags': 'name'  // sort API by path name 
                } 
            }, 
            options: { 
               select: ['web', 'api']
            } 
        },
        
    ]
};

Glue.compose(internals.manifest, { relativeTo: __dirname }, function (err, server) {
	
    if (err) {
        console.log('server.register err:', err);
    }
    
    server.start(function() {
        
        server.connections.forEach(function(connection) {
            console.log('Server started at: ' + connection.info.uri);
        });
        /*
        server. auth. strategy('session' , 'cookie' , 
        {
            password: 'secret' ,
            cookie: 'sid-example' ,
            redirectTo: '/sign-in' ,
            isSecure: false
        }); */
    });
});