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
exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
require("isomorphic-fetch");
var vscode = require("vscode");
var authProvider_1 = require("./authProvider");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var _this = this;
    console.log('Congratulations, your extension "vscode-authenticationprovider-sample" is now active!');
    // Register our authentication provider. NOTE: this will register the provider globally which means that
    // any other extension can use this provider via the `getSession` API.
    // NOTE: when implementing an auth provider, don't forget to register an activation event for that provider
    // in your package.json file: "onAuthenticationRequest:AzureDevOpsPAT"
    context.subscriptions.push(vscode.authentication.registerAuthenticationProvider(authProvider_1.AzureDevOpsAuthenticationProvider.id, 'Azure Repos', new authProvider_1.AzureDevOpsAuthenticationProvider(context.secrets)));
    var disposable = vscode.commands.registerCommand('vscode-authenticationprovider-sample.login', function () { return __awaiter(_this, void 0, void 0, function () {
        var session, req, res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.authentication.getSession(authProvider_1.AzureDevOpsAuthenticationProvider.id, [], { createIfNone: true })];
                case 1:
                    session = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetch('https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=6.0', {
                            headers: {
                                authorization: "Basic " + Buffer.from(":" + session.accessToken).toString('base64'),
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'content-type': 'application/json'
                            }
                        })];
                case 3:
                    req = _a.sent();
                    if (!req.ok) {
                        throw new Error(req.statusText);
                    }
                    return [4 /*yield*/, req.json()];
                case 4:
                    res = _a.sent();
                    vscode.window.showInformationMessage("Hello " + res.displayName);
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    if (e_1.message === 'Unauthorized') {
                        vscode.window.showErrorMessage('Failed to get profile. You need to use a PAT that has access to all organizations. Please sign out and try again.');
                    }
                    throw e_1;
                case 6: return [2 /*return*/];
            }
        });
    }); });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
