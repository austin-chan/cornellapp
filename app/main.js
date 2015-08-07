/**
 * Copyright (c) 2015, Davyapp.
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
    DAApp = require('./components/DAApp'),
    mountNode = document.getElementById('davy-app-mount');

require('./scripts/preparation');

React.render(<DAApp />, mountNode);
