/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * This file prepares all the scripts that are run in the browser and is the
 * first file included in the bundle.
 *
 * @jsx React.DOM
 */

global.$ = require('jquery');
require('devbridge-autocomplete');

require('./global');
