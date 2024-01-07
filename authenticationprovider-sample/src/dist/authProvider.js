"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
exports.AzureDevOpsAuthenticationProvider = void 0;
var vscode_1 = require("vscode");
var AzureDevOpsPatSession = /** @class */ (function () {
    /**
     *
     * @param accessToken The personal access token to use for authentication
     */
    function AzureDevOpsPatSession(accessToken) {
        this.accessToken = accessToken;
        // We don't know the user's account name, so we'll just use a constant
        this.account = { id: AzureDevOpsAuthenticationProvider.id, label: 'Personal Access Token' };
        // This id isn't used for anything in this example, so we set it to a constant
        this.id = AzureDevOpsAuthenticationProvider.id;
        // We don't know what scopes the PAT has, so we have an empty array here.
        this.scopes = [];
    }
    return AzureDevOpsPatSession;
}());
var AzureDevOpsAuthenticationProvider = /** @class */ (function () {
    function AzureDevOpsAuthenticationProvider(secretStorage) {
        this.secretStorage = secretStorage;
        this._onDidChangeSessions = new vscode_1.EventEmitter();
    }
    Object.defineProperty(AzureDevOpsAuthenticationProvider.prototype, "onDidChangeSessions", {
        get: function () {
            return this._onDidChangeSessions.event;
        },
        enumerable: false,
        configurable: true
    });
    AzureDevOpsAuthenticationProvider.prototype.dispose = function () {
        var _a;
        (_a = this.initializedDisposable) === null || _a === void 0 ? void 0 : _a.dispose();
    };
    AzureDevOpsAuthenticationProvider.prototype.ensureInitialized = function () {
        var _this = this;
        if (this.initializedDisposable === undefined) {
            void this.cacheTokenFromStorage();
            this.initializedDisposable = vscode_1.Disposable.from(
            // This onDidChange event happens when the secret storage changes in _any window_ since
            // secrets are shared across all open windows.
            this.secretStorage.onDidChange(function (e) {
                if (e.key === AzureDevOpsAuthenticationProvider.secretKey) {
                    void _this.checkForUpdates();
                }
            }), 
            // This fires when the user initiates a "silent" auth flow via the Accounts menu.
            vscode_1.authentication.onDidChangeSessions(function (e) {
                if (e.provider.id === AzureDevOpsAuthenticationProvider.id) {
                    void _this.checkForUpdates();
                }
            }));
        }
    };
    // This is a crucial function that handles whether or not the token has changed in
    // a different window of VS Code and sends the necessary event if it has.
    AzureDevOpsAuthenticationProvider.prototype.checkForUpdates = function () {
        return __awaiter(this, void 0, Promise, function () {
            var added, removed, changed, previousToken, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        added = [];
                        removed = [];
                        changed = [];
                        return [4 /*yield*/, this.currentToken];
                    case 1:
                        previousToken = _a.sent();
                        return [4 /*yield*/, this.getSessions()];
                    case 2:
                        session = (_a.sent())[0];
                        if ((session === null || session === void 0 ? void 0 : session.accessToken) && !previousToken) {
                            added.push(session);
                        }
                        else if (!(session === null || session === void 0 ? void 0 : session.accessToken) && previousToken) {
                            removed.push(session);
                        }
                        else if ((session === null || session === void 0 ? void 0 : session.accessToken) !== previousToken) {
                            changed.push(session);
                        }
                        else {
                            return [2 /*return*/];
                        }
                        void this.cacheTokenFromStorage();
                        this._onDidChangeSessions.fire({ added: added, removed: removed, changed: changed });
                        return [2 /*return*/];
                }
            });
        });
    };
    AzureDevOpsAuthenticationProvider.prototype.cacheTokenFromStorage = function () {
        this.currentToken = this.secretStorage.get(AzureDevOpsAuthenticationProvider.secretKey);
        return this.currentToken;
    };
    // This function is called first when `vscode.authentication.getSessions` is called.
    AzureDevOpsAuthenticationProvider.prototype.getSessions = function (_scopes) {
        return __awaiter(this, void 0, Promise, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureInitialized();
                        return [4 /*yield*/, this.cacheTokenFromStorage()];
                    case 1:
                        token = _a.sent();
                        return [2 /*return*/, token ? [new AzureDevOpsPatSession(token)] : []];
                }
            });
        });
    };
    // This function is called after `this.getSessions` is called and only when:
    // - `this.getSessions` returns nothing but `createIfNone` was set to `true` in `vscode.authentication.getSessions`
    // - `vscode.authentication.getSessions` was called with `forceNewSession: true`
    // - The end user initiates the "silent" auth flow via the Accounts menu
    AzureDevOpsAuthenticationProvider.prototype.createSession = function (_scopes) {
        return __awaiter(this, void 0, Promise, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureInitialized();
                        return [4 /*yield*/, vscode_1.window.showInputBox({
                                ignoreFocusOut: true,
                                placeHolder: 'Personal access token',
                                prompt: 'Enter an Azure DevOps Personal Access Token (PAT).',
                                password: true
                            })];
                    case 1:
                        token = _a.sent();
                        // Note: this example doesn't do any validation of the token beyond making sure it's not empty.
                        if (!token) {
                            throw new Error('PAT is required');
                        }
                        // Don't set `currentToken` here, since we want to fire the proper events in the `checkForUpdates` call
                        return [4 /*yield*/, this.secretStorage.store(AzureDevOpsAuthenticationProvider.secretKey, token)];
                    case 2:
                        // Don't set `currentToken` here, since we want to fire the proper events in the `checkForUpdates` call
                        _a.sent();
                        console.log('Successfully logged in to Azure DevOps');
                        return [2 /*return*/, new AzureDevOpsPatSession(token)];
                }
            });
        });
    };
    // This function is called when the end user signs out of the account.
    AzureDevOpsAuthenticationProvider.prototype.removeSession = function (_sessionId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.secretStorage["delete"](AzureDevOpsAuthenticationProvider.secretKey)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AzureDevOpsAuthenticationProvider.id = 'AzureDevOpsPAT';
    AzureDevOpsAuthenticationProvider.secretKey = 'AzureDevOpsPAT';
    return AzureDevOpsAuthenticationProvider;
}());
exports.AzureDevOpsAuthenticationProvider = AzureDevOpsAuthenticationProvider;
