this["JST"] = this["JST"] || {};

this["JST"]["class-info"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="class-info">\n\t<div class="cq-toggle">\n\t\t<i class="icon-check-box on-icon"></i>\n\t\t<i class="icon-check-box-outline-blank off-icon"></i>\n\t</div>\n\t<div class="close">\n\t\t<i class="icon-close"></i>\n\t</div>\n\t<div class="top-section">\n\t\t<a class="cq-display" href="javascript:void(0);">\n\t\t\t' +
((__t = ( cq.strunit.stringCap(course.subject + ' ' + course.catalogNbr + ': ' + course.titleLong, 32, true) )) == null ? '' : __t) +
'\n\t\t</a>\n\t</div>\n\t<div class="bottom-section">\n\t\t<div class="class-section-group first">\n\t\t\t<i class="icon-arrow-drop-down expand-icon"></i>\n\t\t\t<div class="class-section-option">\n\t\t\t\tLEC 001\n\t\t\t</div>\n<!-- \t\t\t\t\t\t\t\t<div class="class-section-option">\n\t\t\t\tLEC 002\n\t\t\t</div> -->\n\t\t</div>\n\t\t<div class="class-section-group">\n\t\t\t<div class="class-section-option">\n\t\t\t\tDIS 001\n\t\t\t</div>\n<!-- \t\t\t\t\t\t\t\t<div class="class-section-option">\n\t\t\t\tDIS 002\n\t\t\t</div> -->\n\t\t</div>\n\t\t<div class="class-section-group">\n\t\t\t<div class="class-section-option">\n\t\t\t\tSEM 001\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</li>';

}
return __p
};