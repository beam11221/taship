'use strict';

const Joi = require('joi');
const Path = require('path');

const internals = {}


//exports======================================================


exports.landingGet = {
    auth: false,
	tags: ['api'],
    description: 'path:/ first page of website',
    notes: 'send landing.html',
    handler: {
		file: './web/html/landing.html'
	}
};

exports.homeGet = {
    auth: false,
	tags: ['api'],
    description: 'call home page',
    notes: 'send home.html',
    handler: {
		//file: Path.join('././', 'sign_in.html')
		file: './web/html/home.html'
	}
};

exports.signInGet = {
    auth: false,
	tags: ['api'],
    description: 'call sign-in page',
    notes: 'send signIn.html',
    handler: {
        file: './web/html/sign_in.html'
	}
};

exports.signUpGet = {
    auth: false,
    tags: ['api'],
    description: 'call sign-up page',
    notes: 'send signUp.html',
    handler: {
        file: './web/html/sign_up.html'
	}
};

exports.htmlGet = {
    auth: false,
	tags: ['api'],
    description: 'call sign-in page',
    notes: 'send signIn.html',
    handler: {
		//file: Path.join('././', 'sign_in.html')
		directory: {
			path: './web/html',
			index: true
		}
	}
};
