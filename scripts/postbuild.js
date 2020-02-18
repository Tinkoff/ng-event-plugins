const fs = require('fs');

const DIST_LIB_PATH = 'dist/ng-event-plugins/';
const README_PATH = 'README.md';
const PATH_TO_README = DIST_LIB_PATH + README_PATH;

copyReadme();

function copyReadme() {
    fs.copyFileSync(README_PATH, PATH_TO_README);
}
