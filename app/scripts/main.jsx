/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * This file is the entry point to generate the client-side javascript bundle
 * using Browserify.
 */

require('./preparation');

var React = require('react/addons'),
    CAApp = require('../components/CAApp'),
    mountNode = document.getElementById('cornell-app-mount');

React.render(<CAApp />, mountNode);
