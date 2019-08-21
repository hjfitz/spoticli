var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var request_promise_1 = __importDefault(require("request-promise"));
var events_1 = __importDefault(require("./events"));
var app_1 = __importDefault(require("./app"));
var flow_1 = __importDefault(require("./flow"));
var port = parseInt(process.env.PORT || '5000', 10);
var server = app_1.default.listen(port, flow_1.default);
var clear = function () { return console.log('\033[2J'); };
function paintPlaying(token) {
    return __awaiter(this, void 0, void 0, function () {
        var playing, elapsed, interval;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPlaying(token.access_token)];
                case 1:
                    playing = _a.sent();
                    elapsed = 0;
                    interval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var percPlayed, playedBar, unplayedBar, played, length, newPlaying;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    clear();
                                    console.log(chalk_1.default.bold('[artist]') + "\t" + playing.artist
                                        + ("\n" + chalk_1.default.bold('[album]') + " \t" + playing.album)
                                        + ("\n" + chalk_1.default.bold('[track]') + " \t" + playing.track));
                                    percPlayed = ~~((playing.place / playing.length) * 10);
                                    playedBar = Array.from({ length: percPlayed }).map(function (_) { return '=='; }).join('');
                                    unplayedBar = Array.from({ length: (10 - percPlayed) }).map(function (_) { return '--'; }).join('');
                                    played = parseMS(playing.place);
                                    length = parseMS(playing.length);
                                    console.log(played + "/" + length + " " + playedBar + "*" + unplayedBar);
                                    playing.place += 1000;
                                    elapsed += 1;
                                    if (!(++elapsed % 20 === 0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, getPlaying(token.access_token)];
                                case 1:
                                    newPlaying = _a.sent();
                                    if (newPlaying.track !== playing.artist) {
                                        clearInterval(interval);
                                        paintPlaying(token);
                                    }
                                    _a.label = 2;
                                case 2:
                                    // song finished? get new song
                                    if (playing.place >= playing.length) {
                                        clearInterval(interval);
                                        paintPlaying(token);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 1000);
                    return [2 /*return*/];
            }
        });
    });
}
function parseMS(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
function getPlaying(at) {
    return __awaiter(this, void 0, void 0, function () {
        var resp, _a, progress_ms, item, album, artist, track, duration_ms;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, request_promise_1.default({
                        method: 'GET',
                        uri: 'https://api.spotify.com/v1/me/player/currently-playing',
                        headers: {
                            Authorization: "Bearer " + at
                        }
                    })];
                case 1:
                    resp = _b.sent();
                    _a = JSON.parse(resp), progress_ms = _a.progress_ms, item = _a.item;
                    album = item.album.name;
                    artist = item.artists[0].name;
                    track = item.name, duration_ms = item.duration_ms;
                    return [2 /*return*/, {
                            track: track,
                            artist: artist,
                            album: album,
                            length: duration_ms,
                            place: progress_ms,
                        }];
            }
        });
    });
}
events_1.default.on('token-get', function (token) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        paintPlaying(token);
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=index.js.map