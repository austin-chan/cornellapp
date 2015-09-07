/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * This file prepares all the scripts that are run in the browser and is the
 * first file included in the bundle.
 */

global.$ = global.jQuery = require('jquery');
require('devbridge-autocomplete');
require('velocity-animate');
require('form-serializer');
require('jquery.cookie');
require('timeago');

// Initialize global render context.
global.context = JSON.parse(document.getElementById('context').textContent);

// Initialize timeago plugin.
$(document).ready(function() {
    $(".timeago").timeago();
});
