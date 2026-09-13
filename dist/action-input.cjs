var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/action-input.ts
var action_input_exports = {};
__export(action_input_exports, {
  actionArguments: () => actionArguments,
  actionCommands: () => actionCommands
});
module.exports = __toCommonJS(action_input_exports);
var import_node_path = require("node:path");
var actionCommands = [
  "sync",
  "pull",
  "generate",
  "check",
  "push",
  "diff",
  "publish"
];
function actionArguments(input) {
  if (!actionCommands.includes(input.command)) {
    throw new Error(`Unsupported LinguaFlow command: ${input.command}`);
  }
  const cwd = safeWorkingDirectory(input.workspace, input.workingDirectory);
  const config = requiredPath(input.config, "config");
  const extra = input.arguments.map((value) => {
    if (value.includes("\0") || /[\r\n]/.test(value))
      throw new Error("Each additional argument must occupy one line.");
    return value;
  });
  return { cwd, argv: [input.command, "--config", config, ...extra] };
}
function safeWorkingDirectory(workspace, value) {
  const requested = requiredPath(value, "working-directory");
  const root = (0, import_node_path.resolve)(workspace);
  const cwd = (0, import_node_path.resolve)(root, requested);
  const relation = (0, import_node_path.relative)(root, cwd);
  if ((0, import_node_path.isAbsolute)(requested) || relation === ".." || relation.startsWith("../") || relation.startsWith("..\\")) {
    throw new Error("working-directory must stay inside GITHUB_WORKSPACE.");
  }
  return cwd;
}
function requiredPath(value, name) {
  const path = value.trim();
  if (!path || path.includes("\0")) throw new Error(`${name} must be a non-empty path.`);
  return path;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  actionArguments,
  actionCommands
});
