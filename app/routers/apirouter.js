/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Router submodule for handling all api routes.
 */

var strutil = require('../utils/strutil'),
	cornellutil = require('../utils/cornellutil'),
	ScheduleStore = require('../stores/ScheduleStore'),
	config = require('../../config'),
	async = require('async'),
	_ = require('underscore');

var apirouter = function(app, blockValidationErrors) {
	var knex = app.get('knex'),
		models = app.get('models'),
		authorize = app.get('authorize'),
		apiutil = require('../utils/apiutil')(models);

	// Route for searching for courses to add.
	app.get('/api/search/courses', function(req, res) {
		req.sanitizeQuery('query').trim();
		req.checkQuery('strm', 'Provide a strm.').notEmpty().isInt();
		req.checkQuery('query', 'Provide a query.').notEmpty();

		blockValidationErrors(req, res, function() {
			apiutil.searchCourses(req.query, 10, function(err, courses) {
				if (err) {
					res.status(400);
					res.send('An error occurred performing the course search.');
					return;
				}

				res.send(courses);
			});
		});
	});

	// Route for getting a full name for a netid
	app.get('/api/fetch-name', function(req, res) {
		req.checkQuery('netid', 'Provide a netid.').notEmpty();

		blockValidationErrors(req, res, function() {
			cornellutil.fetchName(req.query.netid, function(name) {
				if (name === null)
					name = '';

				res.send(name);
			});
		});
	});

	// Route for saving account info.
	app.post('/api/user', authorize, function(req, res) {
		var d = {};

		if (req.body.name !== req.user.get('name'))
			d.name = req.body.name;

		// Old password is correct.
		if (req.body.old_password && req.body.new_password &&
			req.user.correctPassword(req.body.old_password)) {
			d.password = models.user.hashPassword(req.body.new_password);
		}

		if (!_.isEmpty(d)) {
			req.user.save(d).then(function() {
				res.send('ok');
			});

		// No change was detected.
		} else {
			res.send('ok');
		}
	});

	// Route for liking a course.
	app.post('/api/like/:crseId/:subject', authorize, function(req, res) {
		var crseId = req.params.crseId,
			subject = req.params.subject,
			shouldLike = !!req.body.shouldLike;

		if (!crseId || !subject)
			return res.send('error');

		if (req.body.shouldLike !== 'false') {
			knex.table('likes').insert({ crseId_subject: crseId + '_' + subject,
				userId: req.user.id }).then(function() {
					res.send('ok');
				});
		} else {
			knex.table('likes')
				.where('userId', req.user.id)
				.where('crseId_subject', crseId + '_' + subject)
				.del().then(function() {
					res.send('ok');
				});
		}
	});

	// Route for commenting on a course.
	app.post('/api/comment/:crseId', authorize, function(req, res) {
		var crseId = req.params.crseId,
			message = req.body.message,
			id = req.body.id;

		if (!crseId || !message.trim().length)
			return res.send('error');

		async.parallel([
			// Make sure the course exists.
			function(callback) {
				new models.course({
					crseId: crseId
				}).fetch().then(function(course) {
					if (!course)
						callback(true);
					else
						callback();
				});
			},
			// Make sure the id isn't already taken.
			function(callback) {
				new models.comment({
					id: id
				}).fetch().then(function(comment) {
					if (comment)
						callback(true);
					else
						callback();
				});
			}
		], function(err) {
			if (err)
				return res.send('error');

			new models.comment({
				id: id,
				crseId: crseId,
				created: new Date(),
				userId: req.user.id,
				message: message.trim()
			}).save({}, { method: 'insert'}).then(function() {
				res.send('ok');
			});
		});
	});

	// Route for deleting comments.
	app.delete('/api/comment/:id', authorize, function(req, res) {
		var id = req.params.id;

		new models.comment({
			id: id
		}).fetch().then(function(comment) {
			// Make sure the comment belongs to the user.
			if (!comment || comment.get('userId') != req.user.id)
				return res.send('error');

			comment.destroy();
			res.send('ok');
		});
	});

	// Route for upvoting a comment.
	app.post('/api/upvote/:commentid', authorize, function(req, res) {
		var commentid = req.params.commentid;

		// Make sure upvote doesn't already exist.
		new models.upvote({
			userId: req.user.id,
			comment_id: commentid
		}).fetch().then(function(upvote) {
			if (upvote)
				return res.send('ok');

			new models.upvote({
				userId: req.user.id,
				comment_id: commentid
			}).save().then(function() {
				res.send('ok');
			});
		});
	});

	// Route for unvoting a comment.
	app.delete('/api/upvote/:commentid', authorize, function(req, res) {
		var commentid = req.params.commentid;

		knex('upvotes').where('userId', req.user.id)
			.where('comment_id', commentid).del().then(function() {
				res.send('ok');
			});
	});

	// Route for rating a course's difficulty.
	app.post('/api/rating/:crseid/:value', authorize, function(req, res) {
		var crseId = req.params.crseid;
			value = parseInt(req.params.value);

		// Check if user already has rated the course.
		knex('ratings')
			.where('crseId', crseId)
			.where('userId', req.user.id)
			.limit(1)
			.select()
			.then(function(rating) {
				// Rating exists and only need to update the rating.
				if (rating.length) {
					if (rating[0].value != value) {
						knex('ratings')
							.where('crseId', crseId)
							.where('userId', req.user.id)
							.update({
								value: value
							})
							.then(function() {
								res.send('ok');
							});
					} else {
						res.send('ok');
					}

				// Or create a new rating object.
				} else {
					knex('ratings')
						.insert({
							crseId: crseId,
							userId: req.user.id,
							value: value
						})
						.then(function() {
							res.send('ok');
						});
				}
			});
	});

	// Route to generate a schedule for a semester.
	app.post('/api/schedule/:semester', authorize, function(req, res) {
		var semester = req.params.semester;

		// Check if one exists already.
		knex('schedules')
			.where('semester', semester)
			.where('userId', req.user.id)
			.limit(1)
			.select()
			.then(function(schedules) {
				if (schedules.length) {
					// Return it if it exists already.
					res.send(schedules[0]);
				} else {
					var insertObject = {
						id: models.schedule.generateId(),
						semester: semester,
						userId: req.user.id
					};

					// Create a new schedule if doesn't exist already.
					knex('schedules')
						.insert(insertObject)
						.returning(['id', 'semester'])
						.then(function(schedule) {
							res.send(insertObject);
						});
				}
			});
	});

	// Route to send a text picture screenshot of the schedule.
	app.post('/api/text-screenshot/:scheduleId', authorize, function(req, res) {
		var scheduleId = req.params.scheduleId,
			number = req.body.number;

		// Require a scheduleId parameter.
		if (!scheduleId)
			return res.send({
				error: 'The specified schedule could not be found.'
			});

		// Require a number parameter.
		if (!number)
			return res.send({
				error: 'The phone number provided is invalid.'
			});

		// Verify that schedule exists.
		knex('schedules')
			.where('id', scheduleId)
			.limit(1)
			.select()
			.then(function(schedules) {
				// Verify that the schedule belongs to the user.
				if (!schedules.length ||
					schedules[0].userId != req.user.get('id')) {

					res.send({
						error: 'The specified schedule could not be found.'
					});

				} else {
					var schedule = schedules[0];

					apiutil.textScreenshot(scheduleId, number, req.user,
						function(err) {
						if (err)
							return res.send({
								error: err
							});
						res.send({});
					});
				}
			});
	});

	// Route for rendering a schedule and a screenshot.
	app.get('/schedule/:id', function(req, res) {
		var id = req.params.id,
			screenshotMode = !!req.query.screenshot,
			React = require('react/addons'),
			CASchedule =
				React.createFactory(require('../components/CASchedule'));

		// Retrieve the schedule
		knex('schedules')
			.where('id', id)
			.limit(1)
			.select()
			.then(function(schedules) {
				if (!schedules.length) {
					res.send('An error occured');

				} else {
					var schedule = schedules[0];

					new models.user({ id: schedule.userId }).fetch({
						withRelated: [
						'selections.course.groups.sections.meetings.professors',
						'events']
					}).then(function(user) {
						if (!user)
							return res.send('An error occured');

						ScheduleStore.reset(user, [], schedule.semester);

						var output = React.renderToString(CASchedule({
							entries: ScheduleStore.getEntries(),
							large: screenshotMode
						}));

						// Render the screenshot.
						if (screenshotMode) {
							res.render('screenshot', {
								reactOutput: output
							});

						// Render the schedule.
						} else {
							knex('semesters')
								.where('slug', schedule.semester)
								.limit(1)
								.select()
								.then(function(semester) {
									var semesterDescr = semester[0].descr;

									res.render('schedule', {
										reactOutput: output,
										name: user.get('name'),
										semester: semesterDescr
									});
								});
						}
					});
				}
			});
	});

	// Route for updating the course catalog.
	app.get('/admin/trawl/:semester', authorize, function(req, res) {
		if (config.admins.indexOf(req.user.get('netid')) === -1)
			return res.send('NOT AUTHORIZED');

		res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });

		require('../utils/trawlutil')
			.trawl(req.params.semester, log, printSuccess, exit);

		function log(message) {
			res.write(message + '\n');
		}

		function exit() {
			res.write('Process Complete.');
			res.end();
		}

		function printSuccess(message) {
			res.write(message +
				' Success\n');
		}
	});

    require('./authenticationrouter')(app, blockValidationErrors);
    require('./selectionrouter')(app, blockValidationErrors);
};

module.exports = apirouter;
