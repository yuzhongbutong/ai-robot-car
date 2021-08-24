const { src, dest } = require("gulp");

const config = {
	src: "../static/index.html",
	dest: "../templates/"
};

const defaultTask = (cb) => {
    src(config.src).pipe(dest(config.dest));
    cb();
}

exports.default = defaultTask