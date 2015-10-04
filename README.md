# [Cornellapp](http://cornellapp.com)
Cornellapp is the best and the most popular way to schedule your courses at Cornell.

## Installation
To run Cornellapp on your machine, you must have [Node.js](https://nodejs.org/) and MySQL installed (Mac users should use [Homebrew](http://brew.sh/)), and [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) installed with the global flag.

Create a MySQL database (a database client like [Sequel Pro](http://www.sequelpro.com/) is recommended) and then download the Cornellapp repository somewhere on your local machine. Navigate to the root directory of the project and create a new file called `.env` and write the following configuration lines in the file (without brackets):

```
DB_HOST=[DB host to connect to, usually localhost]
DB_USER=[MySQL user, usually root]
DB_PASSWORD=[MySQL password, usually empty]
DB_DATABASE=[Name of database to use]
AWS_ACCESSKEYID=[Optional, AWS access key for sending email]
AWS_SECRETACCESSKEY=[Optional, AWS secret key for sending email]
AWS_S3BUCKET=[Optional, AWS S3 bucket name to temporarily store screenshots]
TWILIO_ACCOUNTSID=[Optional, Twilio AccountSID for sending schedule texts]
TWILIO_AUTHTOKEN=[Optional, Twilio AuthToken for sending schedule texts]
TWILIO_PHONENUMBER=[Optional, Twilio phone number to send texts from]
MAIL_FROMADDRESS=[Optional, email address to send email from, must be verified in Amazon SES]
SITE_DOMAIN=[Domain of installation, localhost:3000 for local instances]
```

After creating and specifying the .env file, run two commands to prepare Cornellapp.

```
$ npm install
# install all dependencies

$ gulp
# command to start the server
```

But before launching the web application in your browser, you need to populate courses for the semester:

```
$ node trawl FA15
```

Open `localhost:3000` and see Cornellapp in your browser!

## React + Flux
Cornellapp uses React and a unidirectional data flow paradigm called [Flux](https://facebook.github.io/flux/), which like React was created Facebook – God bless them. Cornellapp's Flux architecture describes a pattern with four major components: Dispatcher, Stores, Actions, and Views, all of which are singletons except Views.

```
                       ----------
       ----------------| Action |------------
       |               ----------           |
       V                                    |
--------------         ---------         --------
| Dispatcher |  ---->  | Store |  ---->  | View |
--------------         ---------         --------
```
The Cornellapp Dispatcher communicates all changes to the Stores in the pub/sub pattern using event triggers and listeners. Then the stores transmit the data to all the components by calling `setState` on the root component (CAApp).

## Isomorphic Javascript Structure
Cornellapp is entirely written in Javascript (Node), allowing logic to be shared when executing code in the frontend and backend. Using the same language in the Cornellapp frontend and backend cuts down development time, obviates possible confusion between multiple languages, and most importantly allows client-side rendering to be run in the server-side environment, making the application a single isomorphic entity. The isomorphic attribute enables the application to deliver pre-rendered pages that only need to be initialized in the client-side instead of delivering empty pages that need to be completely built client-side. This also prevents the modern phenomenon known by some as the [Flash of Client-Side Rendering](https://twitter.com/codepo8/status/576677287124426752), which degrades the user experience and occurs commonly in client-side frameworks like Angular and Ember. Additionally, pre-rendered markup reduces user loading time and dramatically improves SEO strength. Thus, [React](http://facebook.github.io/react/) was chosen as the frontend Javascript framework, as it's the only real way to create isomorphic javascript applications.

## Database Management
Both [Knex.js](http://knexjs.org/) and [Bookshelf.js](http://bookshelfjs.org/) and used extensively for managing and manipulating database data. Bookshelf abstracts business logic for interacting with the database by serving as an ORM to manage the data and database migrations are managed by Knex:

```
$ knex migrate:make migration_name
# create a new migration schema file named "migration_name"

$ knex migrate:latest
# run all uncommitted migrations

$ knex migrate:rollback
# undo the last batch of migrations
```

## Gulp
[Gulp](http://gulpjs.com/) is used extensively to automate and organize development tasks. Configuration for the Gulp processes are in `Gulpfile.js`, and running `gulp` in the root directory of the project will start 3 automatic file-watching processes:

### Client Side Script Bundling
Cornellapp bundles the client side script with [Browserify](http://browserify.org/). The entrypoint file for the client side bundle is `main.jsx` located in `app/scripts`. Browserify includes all required modules and outputs a  bundled script for the client side.

### Style Development
Styling is done in SCSS ([Sass](http://sass-lang.com/)) and compiles from the `app/styles` directory to the `public/assets/css` directory.

### Server Launching
The entrypoint for launching the webserver is `server.js` and Gulp is customized to run the file to launch the server to start Cornellapp.

## Deployment
Cornellapp is completely powered by [AWS](https://aws.amazon.com/). [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) is leveraged to host the application, [RDS](https://aws.amazon.com/rds/) to run the MySQL instances and [Route 53](https://aws.amazon.com/route53/) to host and route the cornellapp.com domain.

All deployment credentials are kept out of this repo, but to run Cornellapp in your own production environment, create a new file named `.productionenv` and populate it with the same lines as `.env` ([specified above](#installation)) but with your own production values.

Deployment procedure will exclude the `.env` file and include the `.productionenv` which will be used by the production servers. All uncommitted migrations will also be run by the production server on deploy as described by the `.ebextensions` file [deploy.config](./.ebextensions/deploy.config).


## Course Data Retrieval

All course data is generated by [The Office of the University Registrar](https://registrar.cornell.edu/) and accessed with the API provided by [classes.cornell.edu](https://classes.cornell.edu/). When data is retrieved from the University system, it is inserted into the Cornellapp database using an algorithm designed to make the Cornellapp database an exact replica of the University's. When a data sync is taking place, course info is downloaded from the registrar and analyzed against the existing data in the Cornellapp database. Course data is then either inserted into, updated in or deleted from the Cornellapp database. This operation happens at an individual course level - only courses that detect changes are updated in the Cornellapp database.

The command to retrieve and populate course data is:

```
$ node trawl FA15
# The last string is the semester parameter: [SP, SU, FA or WI + 2 digit year]
```

## Engineering Thoughts

Through building Cornellapp, I've been completely evangelized into a supporter of React. Comparing it to many other frameworks I've used, including Angular and Backbone, React is by far the most maintainable, easily adoptable, and elegant framework. I could easily explain the Cornellapp React frontend to a 10 year-old, I could hardly say that about any Angular project. The fact that React does not re-render on page load if data is already rendered server-side during page delivery and merely mounts is completely revolutionary because it introduces [Isomorphic Javascript](#isomorphic-javascript).

Furthermore, by using Node exclusively in the backend, we can take the isomorphic application flow like this:

```
+-------------+       +------------------+                                              +----------------------+
|             |       |                  |  ---- HTTP request (module, props JSON) ---> |                      |
| The browser | <---> | Existing PHP App |                                              | Node.js react server |
|             |       |                  |  <--- HTTP response (static HTML string) --- |                      |
+------+------+       +------------------+                                              +----------------------+
       ^                                                                                            ^
       |                                                                                            |
       |              +------------------+                                              +-----------+----------+
       |              |                  |                                              |                      |
       +--------------+    Browserify    | <--------------------------------------------+  App code (CommonJS) |
                      |                  |                                              |                      |
                      +------------------+                                              +----------------------+

From: https://github.com/facebook/react/tree/master/examples/server-rendering
```

and simplify it to this:

```
+-------------+                                             +----------------------+
|             | ---- HTTP request (module, props JSON) ---> |                      |
| The browser |                                             | Node.js react server |
|             | <--- HTTP response (static HTML string) --- |                      |
+------+------+                                             +----------------------+
       ^                                                                ^
       |                                                                |
       |              +------------------+                  +-----------+----------+
       |              |                  |                  |                      |
       +--------------+    Browserify    | <----------------+  App code (CommonJS) |
                      |                  |                  |                      |
                      +------------------+                  +----------------------+
```
Simply beautiful. One rendering logic, so much time saved.

The downside with using React is that it makes building frontend functionality slightly slower than using other frameworks, because it introduces extra separation between components, meaning that you'll end up making more components to achieve the same function than you would in another framework. But the end result is a much more organized and understandable codebase. All throughout, building Cornellapp with React has been incredible. Truly, what an experience.

## Code Style Guide
- 80 character line length
- Use semicolons ;
- Commas last ,
- 4 spaces for indentation (no tabs)
- Prefer ' over "
- Write "attractive" code

## Design Guide
![Design Guide](./designguide.png?raw=true)

## Contribute
Cornellapp from its inception has ideologically been a collaborative application. All CL's are encouraged, no matter the size. Even if a single word is changed, the change will be appreciated.

To submit a code change, fork the repo and create your branch from `master`. Make changes and submit a pull request in Github.

**Contributors List:**  
Austin Chan '17  
Nicole Calace '16  

## License

Cornellapp is [GNU licensed](./LICENSE?raw=true) and is available for public use under proper attribution according to the license.

## Version Screenshots

**Version 1.0** (Aug 2015) *Current*
![Screenshot 1.0](./screenshot2.png?raw=true)

**Version 0.1** (April 2015)
![Screenshot 0.1](./screenshot.png?raw=true)
