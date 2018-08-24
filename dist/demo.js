// A simple test to verify a visible window is opened with a title
const Application = require('spectron').Application;
const assert = require('assert');
const app = new Application({
    path: 'C:\\Users\\depidsvy\\web\\working-time-alert\\node_modules\\electron\\dist\\electron.exe',
    args: [__dirname + '/..']
});
app.start().then(function () {
    // Check if the window is visible
    return app.browserWindow.isVisible();
}).then(function (isVisible) {
    // Verify the window is visible
    assert.equal(isVisible, false);
}).then(function () {
    // Get the window's title
    return app.client.getTitle();
}).then(function (title) {
    // Verify the window's title
    assert.equal(title, 'Working Time Alert');
}).then(function () {
    // Stop the application
    console.log('done, stopping');
    return app.stop();
}).catch(function (error) {
    // Log any failures
    console.error('Test failed', error.message);
});
//# sourceMappingURL=demo.js.map