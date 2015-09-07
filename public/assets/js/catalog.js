/**
 * Override link click behavior and pass link source to the parent.
 */
$(document).on('click', 'a', function(e) {
    e.preventDefault();

    var href = $(this).attr('href');
    parent.receiveLink(href);
});

/**
 * Click on like button.
 */
$(document).on('click', '.like', function(e) {
    var liked = $(this).hasClass('liked'),
        count = parseInt($(this).find('.label').text()),
        likeDif = liked ? -1 : 1;

    // Skip for non-logged in users.
    if (!parent.isLoggedIn())
        return;

    count = count + likeDif;

    $(this).find('.label').text(count);
    $(this).toggleClass('liked', !liked);
    $(this).toggleClass('has-likes', !!count);

    $.ajax({
        type: 'post',
        url: '/api/like/' + $(this).data('crseid') + '/' +
            $(this).data('subject'),
        data: {
            shouldLike: !liked
        }
    })
});


/**
 * Click on add to courses button.
 */
$(document).on('click', '.add', function(e) {
    var number = $(this).data('number'),
        subject = $(this).data('subject');

    var found = _.find(context, function(c) {
        return c.catalogNbr == number && c.subject == subject;
    });

    parent.addCourse(found);
});

/**
 * Submit a new comment.
 */
$(document).on('click', '.add-comment', function() {
    var $addButton = $(this),
        $textarea = $addButton.siblings('textarea'),
        value = $textarea.val();

    // Skip if the comment is empty.
    if (!value.trim().length)
        return;

    // Empty the textarea
    $textarea.val('');

    // Render the new comment.
    var $comments = $addButton.siblings('.comments'),
        $schema = $comments.find('.creation-schema');

    // Remove empty label.
    $comments.removeClass('empty');

    // Insert text values.
    $schema.find('.message').html(value);
    $schema.find('.created').html('just now');

    // New id for the comment.
    var id = (Math.floor(Math.random() * 100000000000)).toString(36),
        crseId = $addButton.data('crseid'),
        $newComment = $($schema[0].outerHTML).removeClass('creation-schema')
            .attr('data-id', id);

    $comments.prepend($newComment);

    $.ajax({
        type: 'post',
        url: '/api/comment/' + crseId,
        data: {
            id: id,
            message: value
        }
    });
});

/**
 * Delete a comment.
 */
$(document).on('click', '.comment-item .delete', function() {
    var $commentItem = $(this).closest('.comment-item'),
        $comments = $commentItem.closest('.comments');

    // Remove the element.
    $commentItem.remove();

    var willBeEmpty = !$comments
            .find('.comment-item:not(.creation-schema)').length;

    if (willBeEmpty)
        $comments.addClass('empty');

    var id = $commentItem.data('id');

    $.ajax({
        type: 'delete',
        url: '/api/comment/' + id
    });
});

/**
 * Upvote a comment.
 */
$(document).on('click', '.comment-item .upvote', function() {
    var vote = !!$(this).hasClass('selected'),
        value = parseInt($(this).find('.label').html()),
        $commentItem = $(this).closest('.comment-item');

    // Skip for non-logged in users.
    if (!parent.isLoggedIn())
        return;

    // Voted for the comment.
    if (!vote) {
        value++;

    // Unvoted for the comment.
    } else {
        value--;
    }

    $(this).toggleClass('selected');
    $(this).find('.label').html(value);

    $.ajax({
        type: vote ? 'delete' : 'post',
        url: '/api/upvote/' + $commentItem.data('id')
    });
});
