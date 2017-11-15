const Static = require('./handlers/static.js');

exports.register = function(plugin, options, next){
    
    plugin.route([
        {method: 'GET', path: '/', config: Static.landingGet },
        {method: 'GET', path: '/home', config: Static.homeGet },
        {method: 'GET', path: '/sign-up', config: Static.signUpGet },
        {method: 'GET', path: '/sign-in', config: Static.signInGet },
        {method: 'GET', path: '/html/{path*}', config: Static.htmlGet },
		
   ]); 
        
   next(); 
};

exports.register.attributes = {
    name: 'web' 
};


