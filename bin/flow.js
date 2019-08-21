var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var envLoc = path_1.default.join(process.cwd(), '.env');
var contents = fs_1.default.readFileSync(envLoc).toString();
console.log(chalk_1.default.green('Loading env...'));
console.log(chalk_1.default.green('File:'), envLoc);
contents.split('\n').map(function (line) {
    var _a = line.split('='), key = _a[0], vals = _a.slice(1);
    var val = vals.join('=');
    process.env[key] = val;
    console.log("Setting \"" + chalk_1.default.bold(key) + "\" as " + chalk_1.default.bold(val));
});
var scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
];
var callback = 'https://accounts.spotify.com/authorize'
    + '?response_type=code'
    + ("&client_id=" + encodeURIComponent(process.env.SPOTIFY_CLIENT_ID || ''))
    + ("&scope=" + encodeURIComponent(scopes.join(' ')))
    + ("&redirect_uri=" + encodeURIComponent(process.env.SPOTIFY_CALLBACK_URL || ''));
// create an express app
var doFlow = function () {
    console.log(chalk_1.default.green('Server started'));
    console.log(chalk_1.default.yellow('Begin flow:') + " " + callback);
};
exports.default = doFlow;
//# sourceMappingURL=flow.js.map