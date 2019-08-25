Object.defineProperty(exports, "__esModule", { value: true });
var stdin = process.openStdin();
require('tty').setRawMode(true);
function setListeners(at) {
    // next POST https://api.spotify.com/v1/me/player/next
    stdin.on('keypress', function (chunk, key) {
        process.stdout.write('Get Chunk: ' + chunk + '\n');
        if (key && key.ctrl && key.name == 'c')
            process.exit();
    });
}
exports.default = setListeners;
//# sourceMappingURL=control.js.map