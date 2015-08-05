/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * This file is the entry point to generate the client-side javascript bundle
 * using Browserify.
 *
 * @jsx React.DOM
 */

var React = require('react/addons'),
    DHApp = require('./components/DHApp'),
    mountNode = document.body;

global.$ = require('jquery');
require('devbridge-autocomplete');

// React.render(<DHApp />), mountNode);
React.render(React.createElement(DHApp)), mountNode);
