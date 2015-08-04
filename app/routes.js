/**
 * @fileoverview This file is the main route declaration file for the Chequerd
 * application. This file uses submodule routers to handle subroutes.
 */

var React = require('react/addons'),
ChequerdApp = React.createFactory(require('./components/ChequerdApp'));

module.exports = function(app) {

    app.get('/', function(req, res){
        // React.renderToString takes your component
        // and generates the markup

        var number = 5;

        var reactHtml = React.renderToString(ChequerdApp({ prop: number }));
        var context = JSON.stringify({
            test: 'test'
        });

        res.render('index.ejs', {
            reactOutput: reactHtml,
            context: context
        });
    });

    // app.get('/', function(req, res) {
    //     var config = app.get('config'),
    //         configutil = require('./utils/configutil')(config);

    //     res.render('index', {
    //         "config": config,
    //         "configutil": configutil
    //     });
    // });

    // "/api"
    require('./routers/apirouter')(app);

};
