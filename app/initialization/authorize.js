/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * App middleware to restrict authorized users only.
 */

function authorize(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('NOT ALLOWED');
    }
}

module.exports = authorize;
