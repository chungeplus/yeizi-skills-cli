#!/usr/bin/env node
import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/commander/lib/error.js
var require_error = __commonJS((exports) => {
  class CommanderError extends Error {
    constructor(exitCode, code, message) {
      super(message);
      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
      this.code = code;
      this.exitCode = exitCode;
      this.nestedError = undefined;
    }
  }

  class InvalidArgumentError extends CommanderError {
    constructor(message) {
      super(1, "commander.invalidArgument", message);
      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
    }
  }
  exports.CommanderError = CommanderError;
  exports.InvalidArgumentError = InvalidArgumentError;
});

// node_modules/commander/lib/argument.js
var require_argument = __commonJS((exports) => {
  var { InvalidArgumentError } = require_error();

  class Argument {
    constructor(name, description) {
      this.description = description || "";
      this.variadic = false;
      this.parseArg = undefined;
      this.defaultValue = undefined;
      this.defaultValueDescription = undefined;
      this.argChoices = undefined;
      switch (name[0]) {
        case "<":
          this.required = true;
          this._name = name.slice(1, -1);
          break;
        case "[":
          this.required = false;
          this._name = name.slice(1, -1);
          break;
        default:
          this.required = true;
          this._name = name;
          break;
      }
      if (this._name.endsWith("...")) {
        this.variadic = true;
        this._name = this._name.slice(0, -3);
      }
    }
    name() {
      return this._name;
    }
    _collectValue(value, previous) {
      if (previous === this.defaultValue || !Array.isArray(previous)) {
        return [value];
      }
      previous.push(value);
      return previous;
    }
    default(value, description) {
      this.defaultValue = value;
      this.defaultValueDescription = description;
      return this;
    }
    argParser(fn) {
      this.parseArg = fn;
      return this;
    }
    choices(values) {
      this.argChoices = values.slice();
      this.parseArg = (arg, previous) => {
        if (!this.argChoices.includes(arg)) {
          throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
        }
        if (this.variadic) {
          return this._collectValue(arg, previous);
        }
        return arg;
      };
      return this;
    }
    argRequired() {
      this.required = true;
      return this;
    }
    argOptional() {
      this.required = false;
      return this;
    }
  }
  function humanReadableArgName(arg) {
    const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
    return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
  }
  exports.Argument = Argument;
  exports.humanReadableArgName = humanReadableArgName;
});

// node_modules/commander/lib/help.js
var require_help = __commonJS((exports) => {
  var { humanReadableArgName } = require_argument();

  class Help {
    constructor() {
      this.helpWidth = undefined;
      this.minWidthToWrap = 40;
      this.sortSubcommands = false;
      this.sortOptions = false;
      this.showGlobalOptions = false;
    }
    prepareContext(contextOptions) {
      this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
    }
    visibleCommands(cmd) {
      const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
      const helpCommand = cmd._getHelpCommand();
      if (helpCommand && !helpCommand._hidden) {
        visibleCommands.push(helpCommand);
      }
      if (this.sortSubcommands) {
        visibleCommands.sort((a, b) => {
          return a.name().localeCompare(b.name());
        });
      }
      return visibleCommands;
    }
    compareOptions(a, b) {
      const getSortKey = (option) => {
        return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
      };
      return getSortKey(a).localeCompare(getSortKey(b));
    }
    visibleOptions(cmd) {
      const visibleOptions = cmd.options.filter((option) => !option.hidden);
      const helpOption = cmd._getHelpOption();
      if (helpOption && !helpOption.hidden) {
        const removeShort = helpOption.short && cmd._findOption(helpOption.short);
        const removeLong = helpOption.long && cmd._findOption(helpOption.long);
        if (!removeShort && !removeLong) {
          visibleOptions.push(helpOption);
        } else if (helpOption.long && !removeLong) {
          visibleOptions.push(cmd.createOption(helpOption.long, helpOption.description));
        } else if (helpOption.short && !removeShort) {
          visibleOptions.push(cmd.createOption(helpOption.short, helpOption.description));
        }
      }
      if (this.sortOptions) {
        visibleOptions.sort(this.compareOptions);
      }
      return visibleOptions;
    }
    visibleGlobalOptions(cmd) {
      if (!this.showGlobalOptions)
        return [];
      const globalOptions = [];
      for (let ancestorCmd = cmd.parent;ancestorCmd; ancestorCmd = ancestorCmd.parent) {
        const visibleOptions = ancestorCmd.options.filter((option) => !option.hidden);
        globalOptions.push(...visibleOptions);
      }
      if (this.sortOptions) {
        globalOptions.sort(this.compareOptions);
      }
      return globalOptions;
    }
    visibleArguments(cmd) {
      if (cmd._argsDescription) {
        cmd.registeredArguments.forEach((argument) => {
          argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
        });
      }
      if (cmd.registeredArguments.find((argument) => argument.description)) {
        return cmd.registeredArguments;
      }
      return [];
    }
    subcommandTerm(cmd) {
      const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
      return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + (args ? " " + args : "");
    }
    optionTerm(option) {
      return option.flags;
    }
    argumentTerm(argument) {
      return argument.name();
    }
    longestSubcommandTermLength(cmd, helper) {
      return helper.visibleCommands(cmd).reduce((max, command) => {
        return Math.max(max, this.displayWidth(helper.styleSubcommandTerm(helper.subcommandTerm(command))));
      }, 0);
    }
    longestOptionTermLength(cmd, helper) {
      return helper.visibleOptions(cmd).reduce((max, option) => {
        return Math.max(max, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))));
      }, 0);
    }
    longestGlobalOptionTermLength(cmd, helper) {
      return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
        return Math.max(max, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))));
      }, 0);
    }
    longestArgumentTermLength(cmd, helper) {
      return helper.visibleArguments(cmd).reduce((max, argument) => {
        return Math.max(max, this.displayWidth(helper.styleArgumentTerm(helper.argumentTerm(argument))));
      }, 0);
    }
    commandUsage(cmd) {
      let cmdName = cmd._name;
      if (cmd._aliases[0]) {
        cmdName = cmdName + "|" + cmd._aliases[0];
      }
      let ancestorCmdNames = "";
      for (let ancestorCmd = cmd.parent;ancestorCmd; ancestorCmd = ancestorCmd.parent) {
        ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
      }
      return ancestorCmdNames + cmdName + " " + cmd.usage();
    }
    commandDescription(cmd) {
      return cmd.description();
    }
    subcommandDescription(cmd) {
      return cmd.summary() || cmd.description();
    }
    optionDescription(option) {
      const extraInfo = [];
      if (option.argChoices) {
        extraInfo.push(`choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`);
      }
      if (option.defaultValue !== undefined) {
        const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
        if (showDefault) {
          extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
        }
      }
      if (option.presetArg !== undefined && option.optional) {
        extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
      }
      if (option.envVar !== undefined) {
        extraInfo.push(`env: ${option.envVar}`);
      }
      if (extraInfo.length > 0) {
        const extraDescription = `(${extraInfo.join(", ")})`;
        if (option.description) {
          return `${option.description} ${extraDescription}`;
        }
        return extraDescription;
      }
      return option.description;
    }
    argumentDescription(argument) {
      const extraInfo = [];
      if (argument.argChoices) {
        extraInfo.push(`choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`);
      }
      if (argument.defaultValue !== undefined) {
        extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
      }
      if (extraInfo.length > 0) {
        const extraDescription = `(${extraInfo.join(", ")})`;
        if (argument.description) {
          return `${argument.description} ${extraDescription}`;
        }
        return extraDescription;
      }
      return argument.description;
    }
    formatItemList(heading, items, helper) {
      if (items.length === 0)
        return [];
      return [helper.styleTitle(heading), ...items, ""];
    }
    groupItems(unsortedItems, visibleItems, getGroup) {
      const result = new Map;
      unsortedItems.forEach((item) => {
        const group = getGroup(item);
        if (!result.has(group))
          result.set(group, []);
      });
      visibleItems.forEach((item) => {
        const group = getGroup(item);
        if (!result.has(group)) {
          result.set(group, []);
        }
        result.get(group).push(item);
      });
      return result;
    }
    formatHelp(cmd, helper) {
      const termWidth = helper.padWidth(cmd, helper);
      const helpWidth = helper.helpWidth ?? 80;
      function callFormatItem(term, description) {
        return helper.formatItem(term, termWidth, description, helper);
      }
      let output = [
        `${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`,
        ""
      ];
      const commandDescription = helper.commandDescription(cmd);
      if (commandDescription.length > 0) {
        output = output.concat([
          helper.boxWrap(helper.styleCommandDescription(commandDescription), helpWidth),
          ""
        ]);
      }
      const argumentList = helper.visibleArguments(cmd).map((argument) => {
        return callFormatItem(helper.styleArgumentTerm(helper.argumentTerm(argument)), helper.styleArgumentDescription(helper.argumentDescription(argument)));
      });
      output = output.concat(this.formatItemList("Arguments:", argumentList, helper));
      const optionGroups = this.groupItems(cmd.options, helper.visibleOptions(cmd), (option) => option.helpGroupHeading ?? "Options:");
      optionGroups.forEach((options2, group) => {
        const optionList = options2.map((option) => {
          return callFormatItem(helper.styleOptionTerm(helper.optionTerm(option)), helper.styleOptionDescription(helper.optionDescription(option)));
        });
        output = output.concat(this.formatItemList(group, optionList, helper));
      });
      if (helper.showGlobalOptions) {
        const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
          return callFormatItem(helper.styleOptionTerm(helper.optionTerm(option)), helper.styleOptionDescription(helper.optionDescription(option)));
        });
        output = output.concat(this.formatItemList("Global Options:", globalOptionList, helper));
      }
      const commandGroups = this.groupItems(cmd.commands, helper.visibleCommands(cmd), (sub) => sub.helpGroup() || "Commands:");
      commandGroups.forEach((commands, group) => {
        const commandList = commands.map((sub) => {
          return callFormatItem(helper.styleSubcommandTerm(helper.subcommandTerm(sub)), helper.styleSubcommandDescription(helper.subcommandDescription(sub)));
        });
        output = output.concat(this.formatItemList(group, commandList, helper));
      });
      return output.join(`
`);
    }
    displayWidth(str2) {
      return stripColor(str2).length;
    }
    styleTitle(str2) {
      return str2;
    }
    styleUsage(str2) {
      return str2.split(" ").map((word) => {
        if (word === "[options]")
          return this.styleOptionText(word);
        if (word === "[command]")
          return this.styleSubcommandText(word);
        if (word[0] === "[" || word[0] === "<")
          return this.styleArgumentText(word);
        return this.styleCommandText(word);
      }).join(" ");
    }
    styleCommandDescription(str2) {
      return this.styleDescriptionText(str2);
    }
    styleOptionDescription(str2) {
      return this.styleDescriptionText(str2);
    }
    styleSubcommandDescription(str2) {
      return this.styleDescriptionText(str2);
    }
    styleArgumentDescription(str2) {
      return this.styleDescriptionText(str2);
    }
    styleDescriptionText(str2) {
      return str2;
    }
    styleOptionTerm(str2) {
      return this.styleOptionText(str2);
    }
    styleSubcommandTerm(str2) {
      return str2.split(" ").map((word) => {
        if (word === "[options]")
          return this.styleOptionText(word);
        if (word[0] === "[" || word[0] === "<")
          return this.styleArgumentText(word);
        return this.styleSubcommandText(word);
      }).join(" ");
    }
    styleArgumentTerm(str2) {
      return this.styleArgumentText(str2);
    }
    styleOptionText(str2) {
      return str2;
    }
    styleArgumentText(str2) {
      return str2;
    }
    styleSubcommandText(str2) {
      return str2;
    }
    styleCommandText(str2) {
      return str2;
    }
    padWidth(cmd, helper) {
      return Math.max(helper.longestOptionTermLength(cmd, helper), helper.longestGlobalOptionTermLength(cmd, helper), helper.longestSubcommandTermLength(cmd, helper), helper.longestArgumentTermLength(cmd, helper));
    }
    preformatted(str2) {
      return /\n[^\S\r\n]/.test(str2);
    }
    formatItem(term, termWidth, description, helper) {
      const itemIndent = 2;
      const itemIndentStr = " ".repeat(itemIndent);
      if (!description)
        return itemIndentStr + term;
      const paddedTerm = term.padEnd(termWidth + term.length - helper.displayWidth(term));
      const spacerWidth = 2;
      const helpWidth = this.helpWidth ?? 80;
      const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent;
      let formattedDescription;
      if (remainingWidth < this.minWidthToWrap || helper.preformatted(description)) {
        formattedDescription = description;
      } else {
        const wrappedDescription = helper.boxWrap(description, remainingWidth);
        formattedDescription = wrappedDescription.replace(/\n/g, `
` + " ".repeat(termWidth + spacerWidth));
      }
      return itemIndentStr + paddedTerm + " ".repeat(spacerWidth) + formattedDescription.replace(/\n/g, `
${itemIndentStr}`);
    }
    boxWrap(str2, width) {
      if (width < this.minWidthToWrap)
        return str2;
      const rawLines = str2.split(/\r\n|\n/);
      const chunkPattern = /[\s]*[^\s]+/g;
      const wrappedLines = [];
      rawLines.forEach((line) => {
        const chunks = line.match(chunkPattern);
        if (chunks === null) {
          wrappedLines.push("");
          return;
        }
        let sumChunks = [chunks.shift()];
        let sumWidth = this.displayWidth(sumChunks[0]);
        chunks.forEach((chunk) => {
          const visibleWidth = this.displayWidth(chunk);
          if (sumWidth + visibleWidth <= width) {
            sumChunks.push(chunk);
            sumWidth += visibleWidth;
            return;
          }
          wrappedLines.push(sumChunks.join(""));
          const nextChunk = chunk.trimStart();
          sumChunks = [nextChunk];
          sumWidth = this.displayWidth(nextChunk);
        });
        wrappedLines.push(sumChunks.join(""));
      });
      return wrappedLines.join(`
`);
    }
  }
  function stripColor(str2) {
    const sgrPattern = /\x1b\[\d*(;\d*)*m/g;
    return str2.replace(sgrPattern, "");
  }
  exports.Help = Help;
  exports.stripColor = stripColor;
});

// node_modules/commander/lib/option.js
var require_option = __commonJS((exports) => {
  var { InvalidArgumentError } = require_error();

  class Option {
    constructor(flags, description) {
      this.flags = flags;
      this.description = description || "";
      this.required = flags.includes("<");
      this.optional = flags.includes("[");
      this.variadic = /\w\.\.\.[>\]]$/.test(flags);
      this.mandatory = false;
      const optionFlags = splitOptionFlags(flags);
      this.short = optionFlags.shortFlag;
      this.long = optionFlags.longFlag;
      this.negate = false;
      if (this.long) {
        this.negate = this.long.startsWith("--no-");
      }
      this.defaultValue = undefined;
      this.defaultValueDescription = undefined;
      this.presetArg = undefined;
      this.envVar = undefined;
      this.parseArg = undefined;
      this.hidden = false;
      this.argChoices = undefined;
      this.conflictsWith = [];
      this.implied = undefined;
      this.helpGroupHeading = undefined;
    }
    default(value, description) {
      this.defaultValue = value;
      this.defaultValueDescription = description;
      return this;
    }
    preset(arg) {
      this.presetArg = arg;
      return this;
    }
    conflicts(names) {
      this.conflictsWith = this.conflictsWith.concat(names);
      return this;
    }
    implies(impliedOptionValues) {
      let newImplied = impliedOptionValues;
      if (typeof impliedOptionValues === "string") {
        newImplied = { [impliedOptionValues]: true };
      }
      this.implied = Object.assign(this.implied || {}, newImplied);
      return this;
    }
    env(name) {
      this.envVar = name;
      return this;
    }
    argParser(fn) {
      this.parseArg = fn;
      return this;
    }
    makeOptionMandatory(mandatory = true) {
      this.mandatory = !!mandatory;
      return this;
    }
    hideHelp(hide = true) {
      this.hidden = !!hide;
      return this;
    }
    _collectValue(value, previous) {
      if (previous === this.defaultValue || !Array.isArray(previous)) {
        return [value];
      }
      previous.push(value);
      return previous;
    }
    choices(values) {
      this.argChoices = values.slice();
      this.parseArg = (arg, previous) => {
        if (!this.argChoices.includes(arg)) {
          throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
        }
        if (this.variadic) {
          return this._collectValue(arg, previous);
        }
        return arg;
      };
      return this;
    }
    name() {
      if (this.long) {
        return this.long.replace(/^--/, "");
      }
      return this.short.replace(/^-/, "");
    }
    attributeName() {
      if (this.negate) {
        return camelcase(this.name().replace(/^no-/, ""));
      }
      return camelcase(this.name());
    }
    helpGroup(heading) {
      this.helpGroupHeading = heading;
      return this;
    }
    is(arg) {
      return this.short === arg || this.long === arg;
    }
    isBoolean() {
      return !this.required && !this.optional && !this.negate;
    }
  }

  class DualOptions {
    constructor(options2) {
      this.positiveOptions = new Map;
      this.negativeOptions = new Map;
      this.dualOptions = new Set;
      options2.forEach((option) => {
        if (option.negate) {
          this.negativeOptions.set(option.attributeName(), option);
        } else {
          this.positiveOptions.set(option.attributeName(), option);
        }
      });
      this.negativeOptions.forEach((value, key) => {
        if (this.positiveOptions.has(key)) {
          this.dualOptions.add(key);
        }
      });
    }
    valueFromOption(value, option) {
      const optionKey = option.attributeName();
      if (!this.dualOptions.has(optionKey))
        return true;
      const preset = this.negativeOptions.get(optionKey).presetArg;
      const negativeValue = preset !== undefined ? preset : false;
      return option.negate === (negativeValue === value);
    }
  }
  function camelcase(str2) {
    return str2.split("-").reduce((str3, word) => {
      return str3 + word[0].toUpperCase() + word.slice(1);
    });
  }
  function splitOptionFlags(flags) {
    let shortFlag;
    let longFlag;
    const shortFlagExp = /^-[^-]$/;
    const longFlagExp = /^--[^-]/;
    const flagParts = flags.split(/[ |,]+/).concat("guard");
    if (shortFlagExp.test(flagParts[0]))
      shortFlag = flagParts.shift();
    if (longFlagExp.test(flagParts[0]))
      longFlag = flagParts.shift();
    if (!shortFlag && shortFlagExp.test(flagParts[0]))
      shortFlag = flagParts.shift();
    if (!shortFlag && longFlagExp.test(flagParts[0])) {
      shortFlag = longFlag;
      longFlag = flagParts.shift();
    }
    if (flagParts[0].startsWith("-")) {
      const unsupportedFlag = flagParts[0];
      const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
      if (/^-[^-][^-]/.test(unsupportedFlag))
        throw new Error(`${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`);
      if (shortFlagExp.test(unsupportedFlag))
        throw new Error(`${baseError}
- too many short flags`);
      if (longFlagExp.test(unsupportedFlag))
        throw new Error(`${baseError}
- too many long flags`);
      throw new Error(`${baseError}
- unrecognised flag format`);
    }
    if (shortFlag === undefined && longFlag === undefined)
      throw new Error(`option creation failed due to no flags found in '${flags}'.`);
    return { shortFlag, longFlag };
  }
  exports.Option = Option;
  exports.DualOptions = DualOptions;
});

// node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS((exports) => {
  var maxDistance = 3;
  function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > maxDistance)
      return Math.max(a.length, b.length);
    const d = [];
    for (let i = 0;i <= a.length; i++) {
      d[i] = [i];
    }
    for (let j = 0;j <= b.length; j++) {
      d[0][j] = j;
    }
    for (let j = 1;j <= b.length; j++) {
      for (let i = 1;i <= a.length; i++) {
        let cost = 1;
        if (a[i - 1] === b[j - 1]) {
          cost = 0;
        } else {
          cost = 1;
        }
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        }
      }
    }
    return d[a.length][b.length];
  }
  function suggestSimilar(word, candidates) {
    if (!candidates || candidates.length === 0)
      return "";
    candidates = Array.from(new Set(candidates));
    const searchingOptions = word.startsWith("--");
    if (searchingOptions) {
      word = word.slice(2);
      candidates = candidates.map((candidate) => candidate.slice(2));
    }
    let similar = [];
    let bestDistance = maxDistance;
    const minSimilarity = 0.4;
    candidates.forEach((candidate) => {
      if (candidate.length <= 1)
        return;
      const distance = editDistance(word, candidate);
      const length = Math.max(word.length, candidate.length);
      const similarity = (length - distance) / length;
      if (similarity > minSimilarity) {
        if (distance < bestDistance) {
          bestDistance = distance;
          similar = [candidate];
        } else if (distance === bestDistance) {
          similar.push(candidate);
        }
      }
    });
    similar.sort((a, b) => a.localeCompare(b));
    if (searchingOptions) {
      similar = similar.map((candidate) => `--${candidate}`);
    }
    if (similar.length > 1) {
      return `
(Did you mean one of ${similar.join(", ")}?)`;
    }
    if (similar.length === 1) {
      return `
(Did you mean ${similar[0]}?)`;
    }
    return "";
  }
  exports.suggestSimilar = suggestSimilar;
});

// node_modules/commander/lib/command.js
var require_command = __commonJS((exports) => {
  var EventEmitter = __require("node:events").EventEmitter;
  var childProcess = __require("node:child_process");
  var path = __require("node:path");
  var fs = __require("node:fs");
  var process2 = __require("node:process");
  var { Argument, humanReadableArgName } = require_argument();
  var { CommanderError } = require_error();
  var { Help, stripColor } = require_help();
  var { Option, DualOptions } = require_option();
  var { suggestSimilar } = require_suggestSimilar();

  class Command extends EventEmitter {
    constructor(name) {
      super();
      this.commands = [];
      this.options = [];
      this.parent = null;
      this._allowUnknownOption = false;
      this._allowExcessArguments = false;
      this.registeredArguments = [];
      this._args = this.registeredArguments;
      this.args = [];
      this.rawArgs = [];
      this.processedArgs = [];
      this._scriptPath = null;
      this._name = name || "";
      this._optionValues = {};
      this._optionValueSources = {};
      this._storeOptionsAsProperties = false;
      this._actionHandler = null;
      this._executableHandler = false;
      this._executableFile = null;
      this._executableDir = null;
      this._defaultCommandName = null;
      this._exitCallback = null;
      this._aliases = [];
      this._combineFlagAndOptionalValue = true;
      this._description = "";
      this._summary = "";
      this._argsDescription = undefined;
      this._enablePositionalOptions = false;
      this._passThroughOptions = false;
      this._lifeCycleHooks = {};
      this._showHelpAfterError = false;
      this._showSuggestionAfterError = true;
      this._savedState = null;
      this._outputConfiguration = {
        writeOut: (str2) => process2.stdout.write(str2),
        writeErr: (str2) => process2.stderr.write(str2),
        outputError: (str2, write) => write(str2),
        getOutHelpWidth: () => process2.stdout.isTTY ? process2.stdout.columns : undefined,
        getErrHelpWidth: () => process2.stderr.isTTY ? process2.stderr.columns : undefined,
        getOutHasColors: () => useColor() ?? (process2.stdout.isTTY && process2.stdout.hasColors?.()),
        getErrHasColors: () => useColor() ?? (process2.stderr.isTTY && process2.stderr.hasColors?.()),
        stripColor: (str2) => stripColor(str2)
      };
      this._hidden = false;
      this._helpOption = undefined;
      this._addImplicitHelpCommand = undefined;
      this._helpCommand = undefined;
      this._helpConfiguration = {};
      this._helpGroupHeading = undefined;
      this._defaultCommandGroup = undefined;
      this._defaultOptionGroup = undefined;
    }
    copyInheritedSettings(sourceCommand) {
      this._outputConfiguration = sourceCommand._outputConfiguration;
      this._helpOption = sourceCommand._helpOption;
      this._helpCommand = sourceCommand._helpCommand;
      this._helpConfiguration = sourceCommand._helpConfiguration;
      this._exitCallback = sourceCommand._exitCallback;
      this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
      this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
      this._allowExcessArguments = sourceCommand._allowExcessArguments;
      this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
      this._showHelpAfterError = sourceCommand._showHelpAfterError;
      this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
      return this;
    }
    _getCommandAndAncestors() {
      const result = [];
      for (let command = this;command; command = command.parent) {
        result.push(command);
      }
      return result;
    }
    command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
      let desc = actionOptsOrExecDesc;
      let opts = execOpts;
      if (typeof desc === "object" && desc !== null) {
        opts = desc;
        desc = null;
      }
      opts = opts || {};
      const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
      const cmd = this.createCommand(name);
      if (desc) {
        cmd.description(desc);
        cmd._executableHandler = true;
      }
      if (opts.isDefault)
        this._defaultCommandName = cmd._name;
      cmd._hidden = !!(opts.noHelp || opts.hidden);
      cmd._executableFile = opts.executableFile || null;
      if (args)
        cmd.arguments(args);
      this._registerCommand(cmd);
      cmd.parent = this;
      cmd.copyInheritedSettings(this);
      if (desc)
        return this;
      return cmd;
    }
    createCommand(name) {
      return new Command(name);
    }
    createHelp() {
      return Object.assign(new Help, this.configureHelp());
    }
    configureHelp(configuration) {
      if (configuration === undefined)
        return this._helpConfiguration;
      this._helpConfiguration = configuration;
      return this;
    }
    configureOutput(configuration) {
      if (configuration === undefined)
        return this._outputConfiguration;
      this._outputConfiguration = {
        ...this._outputConfiguration,
        ...configuration
      };
      return this;
    }
    showHelpAfterError(displayHelp = true) {
      if (typeof displayHelp !== "string")
        displayHelp = !!displayHelp;
      this._showHelpAfterError = displayHelp;
      return this;
    }
    showSuggestionAfterError(displaySuggestion = true) {
      this._showSuggestionAfterError = !!displaySuggestion;
      return this;
    }
    addCommand(cmd, opts) {
      if (!cmd._name) {
        throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
      }
      opts = opts || {};
      if (opts.isDefault)
        this._defaultCommandName = cmd._name;
      if (opts.noHelp || opts.hidden)
        cmd._hidden = true;
      this._registerCommand(cmd);
      cmd.parent = this;
      cmd._checkForBrokenPassThrough();
      return this;
    }
    createArgument(name, description) {
      return new Argument(name, description);
    }
    argument(name, description, parseArg, defaultValue) {
      const argument = this.createArgument(name, description);
      if (typeof parseArg === "function") {
        argument.default(defaultValue).argParser(parseArg);
      } else {
        argument.default(parseArg);
      }
      this.addArgument(argument);
      return this;
    }
    arguments(names) {
      names.trim().split(/ +/).forEach((detail) => {
        this.argument(detail);
      });
      return this;
    }
    addArgument(argument) {
      const previousArgument = this.registeredArguments.slice(-1)[0];
      if (previousArgument?.variadic) {
        throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
      }
      if (argument.required && argument.defaultValue !== undefined && argument.parseArg === undefined) {
        throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
      }
      this.registeredArguments.push(argument);
      return this;
    }
    helpCommand(enableOrNameAndArgs, description) {
      if (typeof enableOrNameAndArgs === "boolean") {
        this._addImplicitHelpCommand = enableOrNameAndArgs;
        if (enableOrNameAndArgs && this._defaultCommandGroup) {
          this._initCommandGroup(this._getHelpCommand());
        }
        return this;
      }
      const nameAndArgs = enableOrNameAndArgs ?? "help [command]";
      const [, helpName, helpArgs] = nameAndArgs.match(/([^ ]+) *(.*)/);
      const helpDescription = description ?? "display help for command";
      const helpCommand = this.createCommand(helpName);
      helpCommand.helpOption(false);
      if (helpArgs)
        helpCommand.arguments(helpArgs);
      if (helpDescription)
        helpCommand.description(helpDescription);
      this._addImplicitHelpCommand = true;
      this._helpCommand = helpCommand;
      if (enableOrNameAndArgs || description)
        this._initCommandGroup(helpCommand);
      return this;
    }
    addHelpCommand(helpCommand, deprecatedDescription) {
      if (typeof helpCommand !== "object") {
        this.helpCommand(helpCommand, deprecatedDescription);
        return this;
      }
      this._addImplicitHelpCommand = true;
      this._helpCommand = helpCommand;
      this._initCommandGroup(helpCommand);
      return this;
    }
    _getHelpCommand() {
      const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"));
      if (hasImplicitHelpCommand) {
        if (this._helpCommand === undefined) {
          this.helpCommand(undefined, undefined);
        }
        return this._helpCommand;
      }
      return null;
    }
    hook(event, listener) {
      const allowedValues = ["preSubcommand", "preAction", "postAction"];
      if (!allowedValues.includes(event)) {
        throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
      }
      if (this._lifeCycleHooks[event]) {
        this._lifeCycleHooks[event].push(listener);
      } else {
        this._lifeCycleHooks[event] = [listener];
      }
      return this;
    }
    exitOverride(fn) {
      if (fn) {
        this._exitCallback = fn;
      } else {
        this._exitCallback = (err) => {
          if (err.code !== "commander.executeSubCommandAsync") {
            throw err;
          }
        };
      }
      return this;
    }
    _exit(exitCode, code, message) {
      if (this._exitCallback) {
        this._exitCallback(new CommanderError(exitCode, code, message));
      }
      process2.exit(exitCode);
    }
    action(fn) {
      const listener = (args) => {
        const expectedArgsCount = this.registeredArguments.length;
        const actionArgs = args.slice(0, expectedArgsCount);
        if (this._storeOptionsAsProperties) {
          actionArgs[expectedArgsCount] = this;
        } else {
          actionArgs[expectedArgsCount] = this.opts();
        }
        actionArgs.push(this);
        return fn.apply(this, actionArgs);
      };
      this._actionHandler = listener;
      return this;
    }
    createOption(flags, description) {
      return new Option(flags, description);
    }
    _callParseArg(target, value, previous, invalidArgumentMessage) {
      try {
        return target.parseArg(value, previous);
      } catch (err) {
        if (err.code === "commander.invalidArgument") {
          const message = `${invalidArgumentMessage} ${err.message}`;
          this.error(message, { exitCode: err.exitCode, code: err.code });
        }
        throw err;
      }
    }
    _registerOption(option) {
      const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
      if (matchingOption) {
        const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
        throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
      }
      this._initOptionGroup(option);
      this.options.push(option);
    }
    _registerCommand(command) {
      const knownBy = (cmd) => {
        return [cmd.name()].concat(cmd.aliases());
      };
      const alreadyUsed = knownBy(command).find((name) => this._findCommand(name));
      if (alreadyUsed) {
        const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
        const newCmd = knownBy(command).join("|");
        throw new Error(`cannot add command '${newCmd}' as already have command '${existingCmd}'`);
      }
      this._initCommandGroup(command);
      this.commands.push(command);
    }
    addOption(option) {
      this._registerOption(option);
      const oname = option.name();
      const name = option.attributeName();
      if (option.negate) {
        const positiveLongFlag = option.long.replace(/^--no-/, "--");
        if (!this._findOption(positiveLongFlag)) {
          this.setOptionValueWithSource(name, option.defaultValue === undefined ? true : option.defaultValue, "default");
        }
      } else if (option.defaultValue !== undefined) {
        this.setOptionValueWithSource(name, option.defaultValue, "default");
      }
      const handleOptionValue = (val, invalidValueMessage, valueSource) => {
        if (val == null && option.presetArg !== undefined) {
          val = option.presetArg;
        }
        const oldValue = this.getOptionValue(name);
        if (val !== null && option.parseArg) {
          val = this._callParseArg(option, val, oldValue, invalidValueMessage);
        } else if (val !== null && option.variadic) {
          val = option._collectValue(val, oldValue);
        }
        if (val == null) {
          if (option.negate) {
            val = false;
          } else if (option.isBoolean() || option.optional) {
            val = true;
          } else {
            val = "";
          }
        }
        this.setOptionValueWithSource(name, val, valueSource);
      };
      this.on("option:" + oname, (val) => {
        const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
        handleOptionValue(val, invalidValueMessage, "cli");
      });
      if (option.envVar) {
        this.on("optionEnv:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "env");
        });
      }
      return this;
    }
    _optionEx(config, flags, description, fn, defaultValue) {
      if (typeof flags === "object" && flags instanceof Option) {
        throw new Error("To add an Option object use addOption() instead of option() or requiredOption()");
      }
      const option = this.createOption(flags, description);
      option.makeOptionMandatory(!!config.mandatory);
      if (typeof fn === "function") {
        option.default(defaultValue).argParser(fn);
      } else if (fn instanceof RegExp) {
        const regex = fn;
        fn = (val, def) => {
          const m = regex.exec(val);
          return m ? m[0] : def;
        };
        option.default(defaultValue).argParser(fn);
      } else {
        option.default(fn);
      }
      return this.addOption(option);
    }
    option(flags, description, parseArg, defaultValue) {
      return this._optionEx({}, flags, description, parseArg, defaultValue);
    }
    requiredOption(flags, description, parseArg, defaultValue) {
      return this._optionEx({ mandatory: true }, flags, description, parseArg, defaultValue);
    }
    combineFlagAndOptionalValue(combine = true) {
      this._combineFlagAndOptionalValue = !!combine;
      return this;
    }
    allowUnknownOption(allowUnknown = true) {
      this._allowUnknownOption = !!allowUnknown;
      return this;
    }
    allowExcessArguments(allowExcess = true) {
      this._allowExcessArguments = !!allowExcess;
      return this;
    }
    enablePositionalOptions(positional = true) {
      this._enablePositionalOptions = !!positional;
      return this;
    }
    passThroughOptions(passThrough = true) {
      this._passThroughOptions = !!passThrough;
      this._checkForBrokenPassThrough();
      return this;
    }
    _checkForBrokenPassThrough() {
      if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
        throw new Error(`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`);
      }
    }
    storeOptionsAsProperties(storeAsProperties = true) {
      if (this.options.length) {
        throw new Error("call .storeOptionsAsProperties() before adding options");
      }
      if (Object.keys(this._optionValues).length) {
        throw new Error("call .storeOptionsAsProperties() before setting option values");
      }
      this._storeOptionsAsProperties = !!storeAsProperties;
      return this;
    }
    getOptionValue(key) {
      if (this._storeOptionsAsProperties) {
        return this[key];
      }
      return this._optionValues[key];
    }
    setOptionValue(key, value) {
      return this.setOptionValueWithSource(key, value, undefined);
    }
    setOptionValueWithSource(key, value, source) {
      if (this._storeOptionsAsProperties) {
        this[key] = value;
      } else {
        this._optionValues[key] = value;
      }
      this._optionValueSources[key] = source;
      return this;
    }
    getOptionValueSource(key) {
      return this._optionValueSources[key];
    }
    getOptionValueSourceWithGlobals(key) {
      let source;
      this._getCommandAndAncestors().forEach((cmd) => {
        if (cmd.getOptionValueSource(key) !== undefined) {
          source = cmd.getOptionValueSource(key);
        }
      });
      return source;
    }
    _prepareUserArgs(argv, parseOptions) {
      if (argv !== undefined && !Array.isArray(argv)) {
        throw new Error("first parameter to parse must be array or undefined");
      }
      parseOptions = parseOptions || {};
      if (argv === undefined && parseOptions.from === undefined) {
        if (process2.versions?.electron) {
          parseOptions.from = "electron";
        }
        const execArgv = process2.execArgv ?? [];
        if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) {
          parseOptions.from = "eval";
        }
      }
      if (argv === undefined) {
        argv = process2.argv;
      }
      this.rawArgs = argv.slice();
      let userArgs;
      switch (parseOptions.from) {
        case undefined:
        case "node":
          this._scriptPath = argv[1];
          userArgs = argv.slice(2);
          break;
        case "electron":
          if (process2.defaultApp) {
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
          } else {
            userArgs = argv.slice(1);
          }
          break;
        case "user":
          userArgs = argv.slice(0);
          break;
        case "eval":
          userArgs = argv.slice(1);
          break;
        default:
          throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
      }
      if (!this._name && this._scriptPath)
        this.nameFromFilename(this._scriptPath);
      this._name = this._name || "program";
      return userArgs;
    }
    parse(argv, parseOptions) {
      this._prepareForParse();
      const userArgs = this._prepareUserArgs(argv, parseOptions);
      this._parseCommand([], userArgs);
      return this;
    }
    async parseAsync(argv, parseOptions) {
      this._prepareForParse();
      const userArgs = this._prepareUserArgs(argv, parseOptions);
      await this._parseCommand([], userArgs);
      return this;
    }
    _prepareForParse() {
      if (this._savedState === null) {
        this.saveStateBeforeParse();
      } else {
        this.restoreStateBeforeParse();
      }
    }
    saveStateBeforeParse() {
      this._savedState = {
        _name: this._name,
        _optionValues: { ...this._optionValues },
        _optionValueSources: { ...this._optionValueSources }
      };
    }
    restoreStateBeforeParse() {
      if (this._storeOptionsAsProperties)
        throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
      this._name = this._savedState._name;
      this._scriptPath = null;
      this.rawArgs = [];
      this._optionValues = { ...this._savedState._optionValues };
      this._optionValueSources = { ...this._savedState._optionValueSources };
      this.args = [];
      this.processedArgs = [];
    }
    _checkForMissingExecutable(executableFile, executableDir, subcommandName) {
      if (fs.existsSync(executableFile))
        return;
      const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
      const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
      throw new Error(executableMissing);
    }
    _executeSubCommand(subcommand, args) {
      args = args.slice();
      let launchWithNode = false;
      const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
      function findFile(baseDir, baseName) {
        const localBin = path.resolve(baseDir, baseName);
        if (fs.existsSync(localBin))
          return localBin;
        if (sourceExt.includes(path.extname(baseName)))
          return;
        const foundExt = sourceExt.find((ext) => fs.existsSync(`${localBin}${ext}`));
        if (foundExt)
          return `${localBin}${foundExt}`;
        return;
      }
      this._checkForMissingMandatoryOptions();
      this._checkForConflictingOptions();
      let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
      let executableDir = this._executableDir || "";
      if (this._scriptPath) {
        let resolvedScriptPath;
        try {
          resolvedScriptPath = fs.realpathSync(this._scriptPath);
        } catch {
          resolvedScriptPath = this._scriptPath;
        }
        executableDir = path.resolve(path.dirname(resolvedScriptPath), executableDir);
      }
      if (executableDir) {
        let localFile = findFile(executableDir, executableFile);
        if (!localFile && !subcommand._executableFile && this._scriptPath) {
          const legacyName = path.basename(this._scriptPath, path.extname(this._scriptPath));
          if (legacyName !== this._name) {
            localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
          }
        }
        executableFile = localFile || executableFile;
      }
      launchWithNode = sourceExt.includes(path.extname(executableFile));
      let proc;
      if (process2.platform !== "win32") {
        if (launchWithNode) {
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process2.execArgv).concat(args);
          proc = childProcess.spawn(process2.argv[0], args, { stdio: "inherit" });
        } else {
          proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
        }
      } else {
        this._checkForMissingExecutable(executableFile, executableDir, subcommand._name);
        args.unshift(executableFile);
        args = incrementNodeInspectorPort(process2.execArgv).concat(args);
        proc = childProcess.spawn(process2.execPath, args, { stdio: "inherit" });
      }
      if (!proc.killed) {
        const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
        signals.forEach((signal) => {
          process2.on(signal, () => {
            if (proc.killed === false && proc.exitCode === null) {
              proc.kill(signal);
            }
          });
        });
      }
      const exitCallback = this._exitCallback;
      proc.on("close", (code) => {
        code = code ?? 1;
        if (!exitCallback) {
          process2.exit(code);
        } else {
          exitCallback(new CommanderError(code, "commander.executeSubCommandAsync", "(close)"));
        }
      });
      proc.on("error", (err) => {
        if (err.code === "ENOENT") {
          this._checkForMissingExecutable(executableFile, executableDir, subcommand._name);
        } else if (err.code === "EACCES") {
          throw new Error(`'${executableFile}' not executable`);
        }
        if (!exitCallback) {
          process2.exit(1);
        } else {
          const wrappedError = new CommanderError(1, "commander.executeSubCommandAsync", "(error)");
          wrappedError.nestedError = err;
          exitCallback(wrappedError);
        }
      });
      this.runningCommand = proc;
    }
    _dispatchSubcommand(commandName, operands, unknown) {
      const subCommand = this._findCommand(commandName);
      if (!subCommand)
        this.help({ error: true });
      subCommand._prepareForParse();
      let promiseChain;
      promiseChain = this._chainOrCallSubCommandHook(promiseChain, subCommand, "preSubcommand");
      promiseChain = this._chainOrCall(promiseChain, () => {
        if (subCommand._executableHandler) {
          this._executeSubCommand(subCommand, operands.concat(unknown));
        } else {
          return subCommand._parseCommand(operands, unknown);
        }
      });
      return promiseChain;
    }
    _dispatchHelpCommand(subcommandName) {
      if (!subcommandName) {
        this.help();
      }
      const subCommand = this._findCommand(subcommandName);
      if (subCommand && !subCommand._executableHandler) {
        subCommand.help();
      }
      return this._dispatchSubcommand(subcommandName, [], [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]);
    }
    _checkNumberOfArguments() {
      this.registeredArguments.forEach((arg, i) => {
        if (arg.required && this.args[i] == null) {
          this.missingArgument(arg.name());
        }
      });
      if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) {
        return;
      }
      if (this.args.length > this.registeredArguments.length) {
        this._excessArguments(this.args);
      }
    }
    _processArguments() {
      const myParseArg = (argument, value, previous) => {
        let parsedValue = value;
        if (value !== null && argument.parseArg) {
          const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
          parsedValue = this._callParseArg(argument, value, previous, invalidValueMessage);
        }
        return parsedValue;
      };
      this._checkNumberOfArguments();
      const processedArgs = [];
      this.registeredArguments.forEach((declaredArg, index) => {
        let value = declaredArg.defaultValue;
        if (declaredArg.variadic) {
          if (index < this.args.length) {
            value = this.args.slice(index);
            if (declaredArg.parseArg) {
              value = value.reduce((processed, v) => {
                return myParseArg(declaredArg, v, processed);
              }, declaredArg.defaultValue);
            }
          } else if (value === undefined) {
            value = [];
          }
        } else if (index < this.args.length) {
          value = this.args[index];
          if (declaredArg.parseArg) {
            value = myParseArg(declaredArg, value, declaredArg.defaultValue);
          }
        }
        processedArgs[index] = value;
      });
      this.processedArgs = processedArgs;
    }
    _chainOrCall(promise, fn) {
      if (promise?.then && typeof promise.then === "function") {
        return promise.then(() => fn());
      }
      return fn();
    }
    _chainOrCallHooks(promise, event) {
      let result = promise;
      const hooks = [];
      this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== undefined).forEach((hookedCommand) => {
        hookedCommand._lifeCycleHooks[event].forEach((callback) => {
          hooks.push({ hookedCommand, callback });
        });
      });
      if (event === "postAction") {
        hooks.reverse();
      }
      hooks.forEach((hookDetail) => {
        result = this._chainOrCall(result, () => {
          return hookDetail.callback(hookDetail.hookedCommand, this);
        });
      });
      return result;
    }
    _chainOrCallSubCommandHook(promise, subCommand, event) {
      let result = promise;
      if (this._lifeCycleHooks[event] !== undefined) {
        this._lifeCycleHooks[event].forEach((hook) => {
          result = this._chainOrCall(result, () => {
            return hook(this, subCommand);
          });
        });
      }
      return result;
    }
    _parseCommand(operands, unknown) {
      const parsed = this.parseOptions(unknown);
      this._parseOptionsEnv();
      this._parseOptionsImplied();
      operands = operands.concat(parsed.operands);
      unknown = parsed.unknown;
      this.args = operands.concat(unknown);
      if (operands && this._findCommand(operands[0])) {
        return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
      }
      if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
        return this._dispatchHelpCommand(operands[1]);
      }
      if (this._defaultCommandName) {
        this._outputHelpIfRequested(unknown);
        return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
      }
      if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
        this.help({ error: true });
      }
      this._outputHelpIfRequested(parsed.unknown);
      this._checkForMissingMandatoryOptions();
      this._checkForConflictingOptions();
      const checkForUnknownOptions = () => {
        if (parsed.unknown.length > 0) {
          this.unknownOption(parsed.unknown[0]);
        }
      };
      const commandEvent = `command:${this.name()}`;
      if (this._actionHandler) {
        checkForUnknownOptions();
        this._processArguments();
        let promiseChain;
        promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
        promiseChain = this._chainOrCall(promiseChain, () => this._actionHandler(this.processedArgs));
        if (this.parent) {
          promiseChain = this._chainOrCall(promiseChain, () => {
            this.parent.emit(commandEvent, operands, unknown);
          });
        }
        promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
        return promiseChain;
      }
      if (this.parent?.listenerCount(commandEvent)) {
        checkForUnknownOptions();
        this._processArguments();
        this.parent.emit(commandEvent, operands, unknown);
      } else if (operands.length) {
        if (this._findCommand("*")) {
          return this._dispatchSubcommand("*", operands, unknown);
        }
        if (this.listenerCount("command:*")) {
          this.emit("command:*", operands, unknown);
        } else if (this.commands.length) {
          this.unknownCommand();
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      } else if (this.commands.length) {
        checkForUnknownOptions();
        this.help({ error: true });
      } else {
        checkForUnknownOptions();
        this._processArguments();
      }
    }
    _findCommand(name) {
      if (!name)
        return;
      return this.commands.find((cmd) => cmd._name === name || cmd._aliases.includes(name));
    }
    _findOption(arg) {
      return this.options.find((option) => option.is(arg));
    }
    _checkForMissingMandatoryOptions() {
      this._getCommandAndAncestors().forEach((cmd) => {
        cmd.options.forEach((anOption) => {
          if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === undefined) {
            cmd.missingMandatoryOptionValue(anOption);
          }
        });
      });
    }
    _checkForConflictingLocalOptions() {
      const definedNonDefaultOptions = this.options.filter((option) => {
        const optionKey = option.attributeName();
        if (this.getOptionValue(optionKey) === undefined) {
          return false;
        }
        return this.getOptionValueSource(optionKey) !== "default";
      });
      const optionsWithConflicting = definedNonDefaultOptions.filter((option) => option.conflictsWith.length > 0);
      optionsWithConflicting.forEach((option) => {
        const conflictingAndDefined = definedNonDefaultOptions.find((defined) => option.conflictsWith.includes(defined.attributeName()));
        if (conflictingAndDefined) {
          this._conflictingOption(option, conflictingAndDefined);
        }
      });
    }
    _checkForConflictingOptions() {
      this._getCommandAndAncestors().forEach((cmd) => {
        cmd._checkForConflictingLocalOptions();
      });
    }
    parseOptions(args) {
      const operands = [];
      const unknown = [];
      let dest = operands;
      function maybeOption(arg) {
        return arg.length > 1 && arg[0] === "-";
      }
      const negativeNumberArg = (arg) => {
        if (!/^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/.test(arg))
          return false;
        return !this._getCommandAndAncestors().some((cmd) => cmd.options.map((opt) => opt.short).some((short) => /^-\d$/.test(short)));
      };
      let activeVariadicOption = null;
      let activeGroup = null;
      let i = 0;
      while (i < args.length || activeGroup) {
        const arg = activeGroup ?? args[i++];
        activeGroup = null;
        if (arg === "--") {
          if (dest === unknown)
            dest.push(arg);
          dest.push(...args.slice(i));
          break;
        }
        if (activeVariadicOption && (!maybeOption(arg) || negativeNumberArg(arg))) {
          this.emit(`option:${activeVariadicOption.name()}`, arg);
          continue;
        }
        activeVariadicOption = null;
        if (maybeOption(arg)) {
          const option = this._findOption(arg);
          if (option) {
            if (option.required) {
              const value = args[i++];
              if (value === undefined)
                this.optionMissingArgument(option);
              this.emit(`option:${option.name()}`, value);
            } else if (option.optional) {
              let value = null;
              if (i < args.length && (!maybeOption(args[i]) || negativeNumberArg(args[i]))) {
                value = args[i++];
              }
              this.emit(`option:${option.name()}`, value);
            } else {
              this.emit(`option:${option.name()}`);
            }
            activeVariadicOption = option.variadic ? option : null;
            continue;
          }
        }
        if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
          const option = this._findOption(`-${arg[1]}`);
          if (option) {
            if (option.required || option.optional && this._combineFlagAndOptionalValue) {
              this.emit(`option:${option.name()}`, arg.slice(2));
            } else {
              this.emit(`option:${option.name()}`);
              activeGroup = `-${arg.slice(2)}`;
            }
            continue;
          }
        }
        if (/^--[^=]+=/.test(arg)) {
          const index = arg.indexOf("=");
          const option = this._findOption(arg.slice(0, index));
          if (option && (option.required || option.optional)) {
            this.emit(`option:${option.name()}`, arg.slice(index + 1));
            continue;
          }
        }
        if (dest === operands && maybeOption(arg) && !(this.commands.length === 0 && negativeNumberArg(arg))) {
          dest = unknown;
        }
        if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
          if (this._findCommand(arg)) {
            operands.push(arg);
            unknown.push(...args.slice(i));
            break;
          } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
            operands.push(arg, ...args.slice(i));
            break;
          } else if (this._defaultCommandName) {
            unknown.push(arg, ...args.slice(i));
            break;
          }
        }
        if (this._passThroughOptions) {
          dest.push(arg, ...args.slice(i));
          break;
        }
        dest.push(arg);
      }
      return { operands, unknown };
    }
    opts() {
      if (this._storeOptionsAsProperties) {
        const result = {};
        const len = this.options.length;
        for (let i = 0;i < len; i++) {
          const key = this.options[i].attributeName();
          result[key] = key === this._versionOptionName ? this._version : this[key];
        }
        return result;
      }
      return this._optionValues;
    }
    optsWithGlobals() {
      return this._getCommandAndAncestors().reduce((combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()), {});
    }
    error(message, errorOptions) {
      this._outputConfiguration.outputError(`${message}
`, this._outputConfiguration.writeErr);
      if (typeof this._showHelpAfterError === "string") {
        this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
      } else if (this._showHelpAfterError) {
        this._outputConfiguration.writeErr(`
`);
        this.outputHelp({ error: true });
      }
      const config = errorOptions || {};
      const exitCode = config.exitCode || 1;
      const code = config.code || "commander.error";
      this._exit(exitCode, code, message);
    }
    _parseOptionsEnv() {
      this.options.forEach((option) => {
        if (option.envVar && option.envVar in process2.env) {
          const optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === undefined || ["default", "config", "env"].includes(this.getOptionValueSource(optionKey))) {
            if (option.required || option.optional) {
              this.emit(`optionEnv:${option.name()}`, process2.env[option.envVar]);
            } else {
              this.emit(`optionEnv:${option.name()}`);
            }
          }
        }
      });
    }
    _parseOptionsImplied() {
      const dualHelper = new DualOptions(this.options);
      const hasCustomOptionValue = (optionKey) => {
        return this.getOptionValue(optionKey) !== undefined && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
      };
      this.options.filter((option) => option.implied !== undefined && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option)).forEach((option) => {
        Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
          this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], "implied");
        });
      });
    }
    missingArgument(name) {
      const message = `error: missing required argument '${name}'`;
      this.error(message, { code: "commander.missingArgument" });
    }
    optionMissingArgument(option) {
      const message = `error: option '${option.flags}' argument missing`;
      this.error(message, { code: "commander.optionMissingArgument" });
    }
    missingMandatoryOptionValue(option) {
      const message = `error: required option '${option.flags}' not specified`;
      this.error(message, { code: "commander.missingMandatoryOptionValue" });
    }
    _conflictingOption(option, conflictingOption) {
      const findBestOptionFromValue = (option2) => {
        const optionKey = option2.attributeName();
        const optionValue = this.getOptionValue(optionKey);
        const negativeOption = this.options.find((target) => target.negate && optionKey === target.attributeName());
        const positiveOption = this.options.find((target) => !target.negate && optionKey === target.attributeName());
        if (negativeOption && (negativeOption.presetArg === undefined && optionValue === false || negativeOption.presetArg !== undefined && optionValue === negativeOption.presetArg)) {
          return negativeOption;
        }
        return positiveOption || option2;
      };
      const getErrorMessage = (option2) => {
        const bestOption = findBestOptionFromValue(option2);
        const optionKey = bestOption.attributeName();
        const source = this.getOptionValueSource(optionKey);
        if (source === "env") {
          return `environment variable '${bestOption.envVar}'`;
        }
        return `option '${bestOption.flags}'`;
      };
      const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
      this.error(message, { code: "commander.conflictingOption" });
    }
    unknownOption(flag) {
      if (this._allowUnknownOption)
        return;
      let suggestion = "";
      if (flag.startsWith("--") && this._showSuggestionAfterError) {
        let candidateFlags = [];
        let command = this;
        do {
          const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
          candidateFlags = candidateFlags.concat(moreFlags);
          command = command.parent;
        } while (command && !command._enablePositionalOptions);
        suggestion = suggestSimilar(flag, candidateFlags);
      }
      const message = `error: unknown option '${flag}'${suggestion}`;
      this.error(message, { code: "commander.unknownOption" });
    }
    _excessArguments(receivedArgs) {
      if (this._allowExcessArguments)
        return;
      const expected = this.registeredArguments.length;
      const s = expected === 1 ? "" : "s";
      const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
      const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
      this.error(message, { code: "commander.excessArguments" });
    }
    unknownCommand() {
      const unknownName = this.args[0];
      let suggestion = "";
      if (this._showSuggestionAfterError) {
        const candidateNames = [];
        this.createHelp().visibleCommands(this).forEach((command) => {
          candidateNames.push(command.name());
          if (command.alias())
            candidateNames.push(command.alias());
        });
        suggestion = suggestSimilar(unknownName, candidateNames);
      }
      const message = `error: unknown command '${unknownName}'${suggestion}`;
      this.error(message, { code: "commander.unknownCommand" });
    }
    version(str2, flags, description) {
      if (str2 === undefined)
        return this._version;
      this._version = str2;
      flags = flags || "-V, --version";
      description = description || "output the version number";
      const versionOption = this.createOption(flags, description);
      this._versionOptionName = versionOption.attributeName();
      this._registerOption(versionOption);
      this.on("option:" + versionOption.name(), () => {
        this._outputConfiguration.writeOut(`${str2}
`);
        this._exit(0, "commander.version", str2);
      });
      return this;
    }
    description(str2, argsDescription) {
      if (str2 === undefined && argsDescription === undefined)
        return this._description;
      this._description = str2;
      if (argsDescription) {
        this._argsDescription = argsDescription;
      }
      return this;
    }
    summary(str2) {
      if (str2 === undefined)
        return this._summary;
      this._summary = str2;
      return this;
    }
    alias(alias) {
      if (alias === undefined)
        return this._aliases[0];
      let command = this;
      if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
        command = this.commands[this.commands.length - 1];
      }
      if (alias === command._name)
        throw new Error("Command alias can't be the same as its name");
      const matchingCommand = this.parent?._findCommand(alias);
      if (matchingCommand) {
        const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
        throw new Error(`cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`);
      }
      command._aliases.push(alias);
      return this;
    }
    aliases(aliases) {
      if (aliases === undefined)
        return this._aliases;
      aliases.forEach((alias) => this.alias(alias));
      return this;
    }
    usage(str2) {
      if (str2 === undefined) {
        if (this._usage)
          return this._usage;
        const args = this.registeredArguments.map((arg) => {
          return humanReadableArgName(arg);
        });
        return [].concat(this.options.length || this._helpOption !== null ? "[options]" : [], this.commands.length ? "[command]" : [], this.registeredArguments.length ? args : []).join(" ");
      }
      this._usage = str2;
      return this;
    }
    name(str2) {
      if (str2 === undefined)
        return this._name;
      this._name = str2;
      return this;
    }
    helpGroup(heading) {
      if (heading === undefined)
        return this._helpGroupHeading ?? "";
      this._helpGroupHeading = heading;
      return this;
    }
    commandsGroup(heading) {
      if (heading === undefined)
        return this._defaultCommandGroup ?? "";
      this._defaultCommandGroup = heading;
      return this;
    }
    optionsGroup(heading) {
      if (heading === undefined)
        return this._defaultOptionGroup ?? "";
      this._defaultOptionGroup = heading;
      return this;
    }
    _initOptionGroup(option) {
      if (this._defaultOptionGroup && !option.helpGroupHeading)
        option.helpGroup(this._defaultOptionGroup);
    }
    _initCommandGroup(cmd) {
      if (this._defaultCommandGroup && !cmd.helpGroup())
        cmd.helpGroup(this._defaultCommandGroup);
    }
    nameFromFilename(filename) {
      this._name = path.basename(filename, path.extname(filename));
      return this;
    }
    executableDir(path2) {
      if (path2 === undefined)
        return this._executableDir;
      this._executableDir = path2;
      return this;
    }
    helpInformation(contextOptions) {
      const helper = this.createHelp();
      const context = this._getOutputContext(contextOptions);
      helper.prepareContext({
        error: context.error,
        helpWidth: context.helpWidth,
        outputHasColors: context.hasColors
      });
      const text = helper.formatHelp(this, helper);
      if (context.hasColors)
        return text;
      return this._outputConfiguration.stripColor(text);
    }
    _getOutputContext(contextOptions) {
      contextOptions = contextOptions || {};
      const error = !!contextOptions.error;
      let baseWrite;
      let hasColors;
      let helpWidth;
      if (error) {
        baseWrite = (str2) => this._outputConfiguration.writeErr(str2);
        hasColors = this._outputConfiguration.getErrHasColors();
        helpWidth = this._outputConfiguration.getErrHelpWidth();
      } else {
        baseWrite = (str2) => this._outputConfiguration.writeOut(str2);
        hasColors = this._outputConfiguration.getOutHasColors();
        helpWidth = this._outputConfiguration.getOutHelpWidth();
      }
      const write = (str2) => {
        if (!hasColors)
          str2 = this._outputConfiguration.stripColor(str2);
        return baseWrite(str2);
      };
      return { error, write, hasColors, helpWidth };
    }
    outputHelp(contextOptions) {
      let deprecatedCallback;
      if (typeof contextOptions === "function") {
        deprecatedCallback = contextOptions;
        contextOptions = undefined;
      }
      const outputContext = this._getOutputContext(contextOptions);
      const eventContext = {
        error: outputContext.error,
        write: outputContext.write,
        command: this
      };
      this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", eventContext));
      this.emit("beforeHelp", eventContext);
      let helpInformation = this.helpInformation({ error: outputContext.error });
      if (deprecatedCallback) {
        helpInformation = deprecatedCallback(helpInformation);
        if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
          throw new Error("outputHelp callback must return a string or a Buffer");
        }
      }
      outputContext.write(helpInformation);
      if (this._getHelpOption()?.long) {
        this.emit(this._getHelpOption().long);
      }
      this.emit("afterHelp", eventContext);
      this._getCommandAndAncestors().forEach((command) => command.emit("afterAllHelp", eventContext));
    }
    helpOption(flags, description) {
      if (typeof flags === "boolean") {
        if (flags) {
          if (this._helpOption === null)
            this._helpOption = undefined;
          if (this._defaultOptionGroup) {
            this._initOptionGroup(this._getHelpOption());
          }
        } else {
          this._helpOption = null;
        }
        return this;
      }
      this._helpOption = this.createOption(flags ?? "-h, --help", description ?? "display help for command");
      if (flags || description)
        this._initOptionGroup(this._helpOption);
      return this;
    }
    _getHelpOption() {
      if (this._helpOption === undefined) {
        this.helpOption(undefined, undefined);
      }
      return this._helpOption;
    }
    addHelpOption(option) {
      this._helpOption = option;
      this._initOptionGroup(option);
      return this;
    }
    help(contextOptions) {
      this.outputHelp(contextOptions);
      let exitCode = Number(process2.exitCode ?? 0);
      if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
        exitCode = 1;
      }
      this._exit(exitCode, "commander.help", "(outputHelp)");
    }
    addHelpText(position, text) {
      const allowedValues = ["beforeAll", "before", "after", "afterAll"];
      if (!allowedValues.includes(position)) {
        throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
      }
      const helpEvent = `${position}Help`;
      this.on(helpEvent, (context) => {
        let helpStr;
        if (typeof text === "function") {
          helpStr = text({ error: context.error, command: context.command });
        } else {
          helpStr = text;
        }
        if (helpStr) {
          context.write(`${helpStr}
`);
        }
      });
      return this;
    }
    _outputHelpIfRequested(args) {
      const helpOption = this._getHelpOption();
      const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
      if (helpRequested) {
        this.outputHelp();
        this._exit(0, "commander.helpDisplayed", "(outputHelp)");
      }
    }
  }
  function incrementNodeInspectorPort(args) {
    return args.map((arg) => {
      if (!arg.startsWith("--inspect")) {
        return arg;
      }
      let debugOption;
      let debugHost = "127.0.0.1";
      let debugPort = "9229";
      let match;
      if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
        debugOption = match[1];
      } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
        debugOption = match[1];
        if (/^\d+$/.test(match[3])) {
          debugPort = match[3];
        } else {
          debugHost = match[3];
        }
      } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
        debugOption = match[1];
        debugHost = match[3];
        debugPort = match[4];
      }
      if (debugOption && debugPort !== "0") {
        return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
      }
      return arg;
    });
  }
  function useColor() {
    if (process2.env.NO_COLOR || process2.env.FORCE_COLOR === "0" || process2.env.FORCE_COLOR === "false")
      return false;
    if (process2.env.FORCE_COLOR || process2.env.CLICOLOR_FORCE !== undefined)
      return true;
    return;
  }
  exports.Command = Command;
  exports.useColor = useColor;
});

// node_modules/commander/index.js
var require_commander = __commonJS((exports) => {
  var { Argument } = require_argument();
  var { Command } = require_command();
  var { CommanderError, InvalidArgumentError } = require_error();
  var { Help } = require_help();
  var { Option } = require_option();
  exports.program = new Command;
  exports.createCommand = (name) => new Command(name);
  exports.createOption = (flags, description) => new Option(flags, description);
  exports.createArgument = (name, description) => new Argument(name, description);
  exports.Command = Command;
  exports.Option = Option;
  exports.Argument = Argument;
  exports.Help = Help;
  exports.CommanderError = CommanderError;
  exports.InvalidArgumentError = InvalidArgumentError;
  exports.InvalidOptionArgumentError = InvalidArgumentError;
});

// node_modules/sisteransi/src/index.js
var require_src = __commonJS((exports, module) => {
  var ESC2 = "\x1B";
  var CSI2 = `${ESC2}[`;
  var beep = "\x07";
  var cursor = {
    to(x, y) {
      if (!y)
        return `${CSI2}${x + 1}G`;
      return `${CSI2}${y + 1};${x + 1}H`;
    },
    move(x, y) {
      let ret = "";
      if (x < 0)
        ret += `${CSI2}${-x}D`;
      else if (x > 0)
        ret += `${CSI2}${x}C`;
      if (y < 0)
        ret += `${CSI2}${-y}A`;
      else if (y > 0)
        ret += `${CSI2}${y}B`;
      return ret;
    },
    up: (count = 1) => `${CSI2}${count}A`,
    down: (count = 1) => `${CSI2}${count}B`,
    forward: (count = 1) => `${CSI2}${count}C`,
    backward: (count = 1) => `${CSI2}${count}D`,
    nextLine: (count = 1) => `${CSI2}E`.repeat(count),
    prevLine: (count = 1) => `${CSI2}F`.repeat(count),
    left: `${CSI2}G`,
    hide: `${CSI2}?25l`,
    show: `${CSI2}?25h`,
    save: `${ESC2}7`,
    restore: `${ESC2}8`
  };
  var scroll = {
    up: (count = 1) => `${CSI2}S`.repeat(count),
    down: (count = 1) => `${CSI2}T`.repeat(count)
  };
  var erase = {
    screen: `${CSI2}2J`,
    up: (count = 1) => `${CSI2}1J`.repeat(count),
    down: (count = 1) => `${CSI2}J`.repeat(count),
    line: `${CSI2}2K`,
    lineEnd: `${CSI2}K`,
    lineStart: `${CSI2}1K`,
    lines(count) {
      let clear = "";
      for (let i = 0;i < count; i++)
        clear += this.line + (i < count - 1 ? cursor.up() : "");
      if (count)
        clear += cursor.left;
      return clear;
    }
  };
  module.exports = { cursor, scroll, erase, beep };
});

// node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS((exports, module) => {
  var p2 = process || {};
  var argv = p2.argv || [];
  var env = p2.env || {};
  var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p2.platform === "win32" || (p2.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
  var formatter = (open, close, replace = open) => (input) => {
    let string = "" + input, index = string.indexOf(close, open.length);
    return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
  };
  var replaceClose = (string, close, replace, index) => {
    let result = "", cursor3 = 0;
    do {
      result += string.substring(cursor3, index) + replace;
      cursor3 = index + close.length;
      index = string.indexOf(close, cursor3);
    } while (~index);
    return result + string.substring(cursor3);
  };
  var createColors = (enabled = isColorSupported) => {
    let f2 = enabled ? formatter : () => String;
    return {
      isColorSupported: enabled,
      reset: f2("\x1B[0m", "\x1B[0m"),
      bold: f2("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
      dim: f2("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
      italic: f2("\x1B[3m", "\x1B[23m"),
      underline: f2("\x1B[4m", "\x1B[24m"),
      inverse: f2("\x1B[7m", "\x1B[27m"),
      hidden: f2("\x1B[8m", "\x1B[28m"),
      strikethrough: f2("\x1B[9m", "\x1B[29m"),
      black: f2("\x1B[30m", "\x1B[39m"),
      red: f2("\x1B[31m", "\x1B[39m"),
      green: f2("\x1B[32m", "\x1B[39m"),
      yellow: f2("\x1B[33m", "\x1B[39m"),
      blue: f2("\x1B[34m", "\x1B[39m"),
      magenta: f2("\x1B[35m", "\x1B[39m"),
      cyan: f2("\x1B[36m", "\x1B[39m"),
      white: f2("\x1B[37m", "\x1B[39m"),
      gray: f2("\x1B[90m", "\x1B[39m"),
      bgBlack: f2("\x1B[40m", "\x1B[49m"),
      bgRed: f2("\x1B[41m", "\x1B[49m"),
      bgGreen: f2("\x1B[42m", "\x1B[49m"),
      bgYellow: f2("\x1B[43m", "\x1B[49m"),
      bgBlue: f2("\x1B[44m", "\x1B[49m"),
      bgMagenta: f2("\x1B[45m", "\x1B[49m"),
      bgCyan: f2("\x1B[46m", "\x1B[49m"),
      bgWhite: f2("\x1B[47m", "\x1B[49m"),
      blackBright: f2("\x1B[90m", "\x1B[39m"),
      redBright: f2("\x1B[91m", "\x1B[39m"),
      greenBright: f2("\x1B[92m", "\x1B[39m"),
      yellowBright: f2("\x1B[93m", "\x1B[39m"),
      blueBright: f2("\x1B[94m", "\x1B[39m"),
      magentaBright: f2("\x1B[95m", "\x1B[39m"),
      cyanBright: f2("\x1B[96m", "\x1B[39m"),
      whiteBright: f2("\x1B[97m", "\x1B[39m"),
      bgBlackBright: f2("\x1B[100m", "\x1B[49m"),
      bgRedBright: f2("\x1B[101m", "\x1B[49m"),
      bgGreenBright: f2("\x1B[102m", "\x1B[49m"),
      bgYellowBright: f2("\x1B[103m", "\x1B[49m"),
      bgBlueBright: f2("\x1B[104m", "\x1B[49m"),
      bgMagentaBright: f2("\x1B[105m", "\x1B[49m"),
      bgCyanBright: f2("\x1B[106m", "\x1B[49m"),
      bgWhiteBright: f2("\x1B[107m", "\x1B[49m")
    };
  };
  module.exports = createColors();
  module.exports.createColors = createColors;
});

// node_modules/giget/dist/_chunks/rolldown-runtime.mjs
var __defProp2, __exportAll = (all, no_symbols) => {
  let target = {};
  for (var name in all)
    __defProp2(target, name, {
      get: all[name],
      enumerable: true
    });
  if (!no_symbols)
    __defProp2(target, Symbol.toStringTag, { value: "Module" });
  return target;
};
var init_rolldown_runtime = __esm(() => {
  __defProp2 = Object.defineProperty;
});

// node_modules/giget/dist/_chunks/libs/nypm.mjs
var exports_nypm = {};
__export(exports_nypm, {
  resolve: () => C3,
  relative: () => re,
  dist_exports: () => X,
  dirname: () => E,
  basename: () => D
});
import { closeSync as t2, existsSync as n2, openSync as r2, readSync as i2, statSync as a2 } from "node:fs";
import { readFile as o2 } from "node:fs/promises";
import { PassThrough as s } from "node:stream";
import { pipeline as c2 } from "node:stream/promises";
import { spawn as ee } from "node:child_process";
import { basename as l2, delimiter as u4, dirname as d, normalize as f2, resolve as p2 } from "node:path";
import { cwd as m3 } from "node:process";
import te from "node:readline";
function g2(e = ``) {
  return e && e.replace(/\\/g, `/`).replace(h2, (e2) => e2.toUpperCase());
}
function S() {
  return typeof process < `u` && typeof process.cwd == `function` ? process.cwd().replace(/\\/g, `/`) : `/`;
}
function w(e, t3) {
  let n3 = ``, r3 = 0, i3 = -1, a3 = 0, o3 = null;
  for (let s2 = 0;s2 <= e.length; ++s2) {
    if (s2 < e.length)
      o3 = e[s2];
    else if (o3 === `/`)
      break;
    else
      o3 = `/`;
    if (o3 === `/`) {
      if (!(i3 === s2 - 1 || a3 === 1))
        if (a3 === 2) {
          if (n3.length < 2 || r3 !== 2 || n3[n3.length - 1] !== `.` || n3[n3.length - 2] !== `.`) {
            if (n3.length > 2) {
              let e2 = n3.lastIndexOf(`/`);
              e2 === -1 ? (n3 = ``, r3 = 0) : (n3 = n3.slice(0, e2), r3 = n3.length - 1 - n3.lastIndexOf(`/`)), i3 = s2, a3 = 0;
              continue;
            } else if (n3.length > 0) {
              n3 = ``, r3 = 0, i3 = s2, a3 = 0;
              continue;
            }
          }
          t3 && (n3 += n3.length > 0 ? `/..` : `..`, r3 = 2);
        } else
          n3.length > 0 ? n3 += `/${e.slice(i3 + 1, s2)}` : n3 = e.slice(i3 + 1, s2), r3 = s2 - i3 - 1;
      i3 = s2, a3 = 0;
    } else
      o3 === `.` && a3 !== -1 ? ++a3 : a3 = -1;
  }
  return n3;
}
function A(e) {
  for (let t3 in e) {
    if (!Object.prototype.hasOwnProperty.call(e, t3) || !O.test(t3))
      continue;
    let n3 = e[t3];
    return n3 ? {
      key: t3,
      value: n3
    } : k;
  }
  return k;
}
function j(e, t3) {
  let n3 = t3.value.split(u4), r3 = [], i3 = e, a3;
  do
    r3.push(p2(i3, `node_modules`, `.bin`)), a3 = i3, i3 = d(i3);
  while (i3 !== a3);
  r3.push(d(process.execPath));
  let o3 = r3.concat(n3).join(u4);
  return {
    key: t3.key,
    value: o3
  };
}
function M2(e, t3, n3 = true) {
  let r3 = {
    ...process.env,
    ...t3
  };
  if (!n3)
    return r3;
  let i3 = j(e, A(r3));
  return r3[i3.key] = i3.value, r3;
}
function B(e, n3 = [], a3 = {}) {
  if (a3.shell === true || !R2)
    return {
      command: e,
      args: n3,
      options: a3
    };
  let o3 = V2(e, a3), s2 = null;
  if (o3 !== null) {
    let e2 = Buffer.alloc(150), n4 = null;
    try {
      n4 = r2(o3, `r`), i2(n4, e2, 0, 150, 0);
    } catch {} finally {
      n4 !== null && t2(n4);
    }
    let a4 = e2.toString().match(F);
    if (a4 !== null) {
      let e3 = a4[1].trim(), t3 = e3.indexOf(` `), n5 = t3 === -1 ? e3 : e3.slice(0, t3), r3 = t3 === -1 ? `` : e3.slice(t3 + 1), i3 = l2(n5);
      s2 = i3 === `env` ? r3 || null : i3;
    }
  }
  if (s2 !== null && o3 !== null && (n3 = [o3, ...n3], e = s2, o3 = V2(e, a3)), o3 === null || !I2.test(o3)) {
    let t3 = o3 !== null && L.test(o3);
    e = f2(e), e = e.replace(P2, `^$1`), n3 = n3.map((e2) => (e2 = e2.replace(/(?=(\\+?)?)\1"/g, `$1$1\\"`), e2 = e2.replace(/(?=(\\+?)?)\1$/, `$1$1`), e2 = `"${e2}"`, e2 = e2.replace(P2, `^$1`), t3 && (e2 = e2.replace(P2, `^$1`)), e2)), n3 = [
      `/d`,
      `/s`,
      `/c`,
      `"${[e, ...n3].join(` `)}"`
    ], e = a3.env?.comspec ?? `cmd.exe`, a3 = {
      ...a3,
      windowsVerbatimArguments: true
    };
  }
  return {
    command: e,
    args: n3,
    options: a3
  };
}
function V2(e, t3) {
  let n3 = (t3.cwd ?? m3()).toString(), r3 = t3.env ?? process.env, i3 = A(r3).value, o3 = e.includes(`/`) || e.includes(`\\`) ? [``] : [n3, ...i3.split(u4)], s2 = r3.PATHEXT ? r3.PATHEXT.split(u4) : z;
  e.includes(`.`) && s2[0] !== `` && s2.unshift(``);
  for (let t4 of o3) {
    let r4 = p2(n3, t4.startsWith(`"`) && t4.endsWith(`"`) && t4.length > 1 ? t4.slice(1, -1) : t4, e);
    for (let e2 of s2) {
      let t5 = r4 + e2;
      try {
        if (a2(t5).isFile())
          return t5;
      } catch {}
    }
  }
  return null;
}
function G(e) {
  let t3 = new AbortController;
  for (let n3 of e) {
    if (n3.aborted)
      return t3.abort(), n3;
    n3.addEventListener(`abort`, () => {
      t3.abort(n3.reason);
    }, { signal: t3.signal });
  }
  return t3.signal;
}
async function K(e) {
  let t3 = ``;
  try {
    for await (let n3 of e)
      t3 += n3.toString();
  } catch {}
  return t3;
}
async function ie(e, t3, n3 = {}) {
  let r3 = b2(e).split(`/`);
  for (;r3.length > 0; ) {
    let e2 = await t3(r3.join(`/`) || `/`);
    if (e2 || !n3.includeParentDirs)
      return e2;
    r3.pop();
  }
}
function ae(e) {
  let t3;
  return () => (t3 === undefined && (t3 = e().then((e2) => (t3 = e2, t3))), t3);
}
async function se(e, t3, n3 = {}) {
  let r3 = e !== `npm` && e !== `bun` && e !== `deno` && n3.corepack !== false && await oe() ? [`corepack`, [e, ...t3]] : [e, t3], { exitCode: i3, stdout: a3, stderr: o3 } = await J(r3[0], r3[1], { nodeOptions: {
    cwd: C3(n3.cwd || process.cwd()),
    env: n3.env,
    stdio: n3.silent ? `pipe` : `inherit`
  } });
  if (i3 !== 0)
    throw Error(`\`${r3.flat().join(` `)}\` failed.${n3.silent ? [
      ``,
      a3,
      o3
    ].join(`
`) : ``}`);
}
async function ce(e = {}) {
  let t3 = e.cwd || process.cwd(), n3 = {
    ...process.env,
    ...e.env
  }, r3 = (typeof e.packageManager == `string` ? Q.find((t4) => t4.name === e.packageManager) : e.packageManager) || await $(e.cwd || process.cwd());
  if (!r3)
    throw Error(`No package manager auto-detected.`);
  return {
    cwd: t3,
    env: n3,
    silent: e.silent ?? false,
    packageManager: r3,
    dev: e.dev ?? false,
    workspace: e.workspace,
    global: e.global ?? false,
    dry: e.dry ?? false,
    corepack: e.corepack ?? true
  };
}
function Z(e) {
  let [t3, n3] = (e || ``).split(`@`), [r3, i3] = n3?.split(`+`) || [];
  if (t3 && t3 !== `-` && /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(t3))
    return {
      name: t3,
      version: r3,
      buildMeta: i3
    };
  let a3 = (t3 || ``).replace(/\W+/g, ``);
  return {
    name: a3,
    version: r3,
    buildMeta: i3,
    warnings: [`Abnormal characters found in \`packageManager\` field, sanitizing from \`${t3}\` to \`${a3}\``]
  };
}
async function $(e, t3 = {}) {
  let r3 = await ie(C3(e || `.`), async (e2) => {
    if (!t3.ignorePackageJSON) {
      let t4 = x(e2, `package.json`);
      if (n2(t4)) {
        let e3 = JSON.parse(await o2(t4, `utf8`));
        if (e3?.packageManager) {
          let { name: t5, version: n3 = `0.0.0`, buildMeta: r4, warnings: i3 } = Z(e3.packageManager);
          if (t5) {
            let e4 = n3.split(`.`)[0], a3 = Q.find((n4) => n4.name === t5 && n4.majorVersion === e4) || Q.find((e5) => e5.name === t5);
            return {
              name: t5,
              command: t5,
              version: n3,
              majorVersion: e4,
              buildMeta: r4,
              warnings: i3,
              files: a3?.files,
              lockFile: a3?.lockFile
            };
          }
        }
      }
      if (n2(x(e2, `deno.json`)))
        return Q.find((e3) => e3.name === `deno`);
    }
    if (!t3.ignoreLockFile) {
      for (let t4 of Q)
        if ([t4.lockFile, t4.files].flat().filter(Boolean).some((t5) => n2(C3(e2, t5))))
          return { ...t4 };
    }
  }, { includeParentDirs: t3.includeParentDirs ?? true });
  if (!r3 && !t3.ignoreArgv) {
    let e2 = process.argv[1];
    if (e2) {
      for (let t4 of Q)
        if (RegExp(`[/\\\\]\\.?${t4.command}`).test(e2))
          return t4;
    }
  }
  return r3;
}
async function le(e = {}) {
  let t3 = await ce(e), n3 = e.frozenLockFile ? {
    npm: [`ci`],
    yarn: [`install`, `--immutable`],
    bun: [`install`, `--frozen-lockfile`],
    pnpm: [`install`, `--frozen-lockfile`],
    deno: [`install`, `--frozen`]
  }[t3.packageManager.name] : [`install`];
  return e.ignoreWorkspace && t3.packageManager.name === `pnpm` && n3.push(`--ignore-workspace`), t3.dry || await se(t3.packageManager.command, n3, {
    cwd: t3.cwd,
    silent: t3.silent,
    corepack: t3.corepack
  }), { exec: {
    command: t3.packageManager.command,
    args: n3
  } };
}
var h2, ne, _2, v, y, b2 = function(e) {
  if (e.length === 0)
    return `.`;
  e = g2(e);
  let t3 = e.match(ne), n3 = T3(e), r3 = e[e.length - 1] === `/`;
  return e = w(e, !n3), e.length === 0 ? n3 ? `/` : r3 ? `./` : `.` : (r3 && (e += `/`), v.test(e) && (e += `/`), t3 ? n3 ? `//${e}` : `//./${e}` : n3 && !T3(e) ? `/${e}` : e);
}, x = function(...e) {
  let t3 = ``;
  for (let n3 of e)
    if (n3)
      if (t3.length > 0) {
        let e2 = t3[t3.length - 1] === `/`, r3 = n3[0] === `/`;
        e2 && r3 ? t3 += n3.slice(1) : t3 += e2 || r3 ? n3 : `/${n3}`;
      } else
        t3 += n3;
  return b2(t3);
}, C3 = function(...e) {
  e = e.map((e2) => g2(e2));
  let t3 = ``, n3 = false;
  for (let r3 = e.length - 1;r3 >= -1 && !n3; r3--) {
    let i3 = r3 >= 0 ? e[r3] : S();
    !i3 || i3.length === 0 || (t3 = `${i3}/${t3}`, n3 = T3(i3));
  }
  return t3 = w(t3, !n3), n3 && !T3(t3) ? `/${t3}` : t3.length > 0 ? t3 : `.`;
}, T3 = function(e) {
  return _2.test(e);
}, re = function(e, t3) {
  let n3 = C3(e).replace(y, `$1`).split(`/`), r3 = C3(t3).replace(y, `$1`).split(`/`);
  if (r3[0][1] === `:` && n3[0][1] === `:` && n3[0] !== r3[0])
    return r3.join(`/`);
  let i3 = [...n3];
  for (let e2 of i3) {
    if (r3[0] !== e2)
      break;
    n3.shift(), r3.shift();
  }
  return [...n3.map(() => `..`), ...r3].join(`/`);
}, E = function(e) {
  let t3 = g2(e).replace(/\/$/, ``).split(`/`).slice(0, -1);
  return t3.length === 1 && v.test(t3[0]) && (t3[0] += `/`), t3.join(`/`) || (T3(e) ? `/` : `.`);
}, D = function(e, t3) {
  let n3 = g2(e).split(`/`), r3 = ``;
  for (let e2 = n3.length - 1;e2 >= 0; e2--) {
    let t4 = n3[e2];
    if (t4) {
      r3 = t4;
      break;
    }
  }
  return t3 && r3.endsWith(t3) ? r3.slice(0, -t3.length) : r3;
}, O, k, N = (e) => {
  let t3 = e.length, n3 = new s, r3 = () => {
    --t3 === 0 && n3.end();
  };
  for (let t4 of e)
    c2(t4, n3, { end: false }).then(r3).catch(r3);
  return n3;
}, P2, F, I2, L, R2, z, H, U2, W2, q, J = (e, t3, n3) => {
  let r3 = new q(e, t3, n3);
  return r3.spawn(), r3;
}, Y, X, oe, Q;
var init_nypm = __esm(() => {
  init_rolldown_runtime();
  h2 = /^[A-Za-z]:\//;
  ne = /^[/\\]{2}/;
  _2 = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
  v = /^[A-Za-z]:$/;
  y = /^\/([A-Za-z]:)?$/;
  O = /^path$/i;
  k = {
    key: `PATH`,
    value: ``
  };
  P2 = /([()\][%!^"`<>&|;, *?])/g;
  F = /^#!\s*(.+)/;
  I2 = /\.(?:com|exe)$/i;
  L = /node_modules[\\/]\.bin[\\/][^\\/]+\.cmd$/i;
  R2 = process.platform === `win32`;
  z = [
    `.EXE`,
    `.CMD`,
    `.BAT`,
    `.COM`
  ];
  H = class extends Error {
    result;
    output;
    get exitCode() {
      if (this.result.exitCode !== null)
        return this.result.exitCode;
    }
    constructor(e, t3) {
      super(`Process exited with non-zero status (${e.exitCode})`), this.result = e, this.output = t3;
    }
  };
  U2 = {
    timeout: undefined,
    persist: false
  };
  W2 = { windowsHide: true };
  q = class {
    _process;
    _aborted = false;
    _options;
    _command;
    _args;
    _resolveClose;
    _processClosed;
    _thrownError;
    get process() {
      return this._process;
    }
    get pid() {
      return this._process?.pid;
    }
    get exitCode() {
      if (this._process && this._process.exitCode !== null)
        return this._process.exitCode;
    }
    constructor(e, t3, n3) {
      this._options = {
        ...U2,
        ...n3
      }, this._command = e, this._args = t3 ?? [], this._processClosed = new Promise((e2) => {
        this._resolveClose = e2;
      });
    }
    kill(e) {
      return this._process?.kill(e) === true;
    }
    get aborted() {
      return this._aborted;
    }
    get killed() {
      return this._process?.killed === true;
    }
    pipe(e, t3, n3) {
      return Y(e, t3, {
        ...n3,
        stdin: this
      });
    }
    async* [Symbol.asyncIterator]() {
      let e = this._process;
      if (!e)
        return;
      let t3 = [];
      this._streamErr && t3.push(this._streamErr), this._streamOut && t3.push(this._streamOut);
      let n3 = N(t3), r3 = te.createInterface({ input: n3 });
      for await (let e2 of r3)
        yield e2.toString();
      if (await this._processClosed, e.removeAllListeners(), this._thrownError)
        throw this._thrownError;
      if (this._options?.throwOnError && this.exitCode !== 0 && this.exitCode !== undefined)
        throw new H(this);
    }
    async _waitForOutput() {
      let e = this._process;
      if (!e)
        throw Error(`No process was started`);
      let [t3, n3] = await Promise.all([this._streamOut ? K(this._streamOut) : ``, this._streamErr ? K(this._streamErr) : ``]);
      await this._processClosed;
      let { stdin: r3 } = this._options;
      if (r3 && typeof r3 != `string` && await r3, e.removeAllListeners(), this._thrownError)
        throw this._thrownError;
      let i3 = {
        stderr: n3,
        stdout: t3,
        exitCode: this.exitCode
      };
      if (this._options.throwOnError && this.exitCode !== 0 && this.exitCode !== undefined)
        throw new H(this, i3);
      return i3;
    }
    then(e, t3) {
      return this._waitForOutput().then(e, t3);
    }
    _streamOut;
    _streamErr;
    spawn() {
      let e = m3(), t3 = this._options, n3 = {
        ...W2,
        ...t3.nodeOptions
      }, r3 = [];
      this._resetState(), t3.timeout !== undefined && r3.push(AbortSignal.timeout(t3.timeout)), t3.signal !== undefined && r3.push(t3.signal), t3.persist === true && (n3.detached = true), r3.length > 0 && (n3.signal = G(r3)), n3.env = M2(e, n3.env, t3.nodePath);
      let i3 = B(this._command, this._args, n3), a3 = ee(i3.command, i3.args, i3.options);
      if (a3.stderr && (this._streamErr = a3.stderr), a3.stdout && (this._streamOut = a3.stdout), this._process = a3, a3.once(`error`, this._onError), a3.once(`close`, this._onClose), a3.stdin) {
        let { stdin: e2 } = t3;
        typeof e2 == `string` ? a3.stdin.end(e2) : e2?.process?.stdout?.pipe(a3.stdin);
      }
    }
    _resetState() {
      this._aborted = false, this._processClosed = new Promise((e) => {
        this._resolveClose = e;
      }), this._thrownError = undefined;
    }
    _onError = (e) => {
      if (e.name === `AbortError` && (!(e.cause instanceof Error) || e.cause.name !== `TimeoutError`)) {
        this._aborted = true;
        return;
      }
      this._thrownError = e;
    };
    _onClose = () => {
      this._resolveClose && this._resolveClose();
    };
  };
  Y = J;
  X = __exportAll({
    detectPackageManager: () => $,
    installDependencies: () => le,
    packageManagers: () => Q
  });
  oe = ae(async () => {
    if (globalThis.process?.versions?.webcontainer)
      return false;
    try {
      let { exitCode: e } = await J(`corepack`, [`--version`]);
      return e === 0;
    } catch {
      return false;
    }
  });
  Q = [
    {
      name: `npm`,
      command: `npm`,
      lockFile: `package-lock.json`
    },
    {
      name: `pnpm`,
      command: `pnpm`,
      lockFile: `pnpm-lock.yaml`,
      files: [`pnpm-workspace.yaml`]
    },
    {
      name: `bun`,
      command: `bun`,
      lockFile: [`bun.lockb`, `bun.lock`]
    },
    {
      name: `yarn`,
      command: `yarn`,
      lockFile: `yarn.lock`,
      files: [`.yarnrc.yml`]
    },
    {
      name: `deno`,
      command: `deno`,
      lockFile: `deno.lock`,
      files: [`deno.json`]
    }
  ];
});

// node_modules/giget/dist/_chunks/libs/tar.mjs
var exports_tar = {};
__export(exports_tar, {
  index_min_exports: () => ce2
});
import t3 from "node:fs";
import n3 from "node:fs/promises";
import r3 from "node:stream";
import i3, { basename as a3, join as o3, posix as s2, win32 as c3 } from "node:path";
import l3, { EventEmitter as u5 } from "events";
import d2 from "fs";
import { EventEmitter as f3 } from "node:events";
import { StringDecoder as ee2 } from "node:string_decoder";
import p3, { dirname as m4, parse as te2 } from "path";
import ne2 from "assert";
import { Buffer as re2 } from "buffer";
import * as ie2 from "zlib";
import ae2 from "zlib";
import oe2 from "node:assert";
import { randomBytes as se2 } from "node:crypto";
function Nr(e3, t4, n4) {
  let r4 = new Ir(n4, t4, t4 ? t4.next : e3.head, e3);
  return r4.next === undefined && (e3.tail = r4), r4.prev === undefined && (e3.head = r4), e3.length++, r4;
}
function Pr(e3, t4) {
  e3.tail = new Ir(t4, e3.tail, undefined, e3), e3.head ||= e3.tail, e3.length++;
}
function Fr(e3, t4) {
  e3.head = new Ir(t4, undefined, e3.head, e3), e3.tail ||= e3.head, e3.length++;
}
var ce2, le2, ue = (e, t4) => {
  for (var n4 in t4)
    le2(e, n4, {
      get: t4[n4],
      enumerable: true
    });
}, de, fe = (e) => !!e && typeof e == `object` && (e instanceof Ue || e instanceof r3 || pe(e) || me(e)), pe = (e) => !!e && typeof e == `object` && e instanceof f3 && typeof e.pipe == `function` && e.pipe !== r3.Writable.prototype.pipe, me = (e) => !!e && typeof e == `object` && e instanceof f3 && typeof e.write == `function` && typeof e.end == `function`, h3, g3, _3, he, ge, _e, ve, ye, be, v2, xe, y2, Se, Ce, b3, x2, S2, we, Te, C4, w2, Ee, De, Oe, ke, T4, Ae, je, Me, Ne, E2, Pe = (e) => Promise.resolve().then(e), Fe = (e) => e(), Ie = (e) => e === `end` || e === `finish` || e === `prefinish`, Le = (e) => e instanceof ArrayBuffer || !!e && typeof e == `object` && e.constructor && e.constructor.name === `ArrayBuffer` && e.byteLength >= 0, Re = (e) => !Buffer.isBuffer(e) && ArrayBuffer.isView(e), ze = class {
  src;
  dest;
  opts;
  ondrain;
  constructor(e, t4, n4) {
    this.src = e, this.dest = t4, this.opts = n4, this.ondrain = () => e[Ce](), this.dest.on(`drain`, this.ondrain);
  }
  unpipe() {
    this.dest.removeListener(`drain`, this.ondrain);
  }
  proxyErrors(e) {}
  end() {
    this.unpipe(), this.opts.end && this.dest.end();
  }
}, Be, Ve = (e) => !!e.objectMode, He = (e) => !e.objectMode && !!e.encoding && e.encoding !== `buffer`, Ue, We, D2, O2, Ge, k2, Ke, A2, qe, Je, Ye, Xe, Ze, Qe, $e, et, tt, j2, M3, nt, N2, rt, it, P3, at, ot, st, ct, lt, ut, dt, ft, pt, mt, ht, gt = (e) => !!e.sync && !!e.file, _t = (e) => !e.sync && !!e.file, vt = (e) => !!e.sync && !e.file, yt = (e) => !e.sync && !e.file, bt = (e) => !!e.file, xt = (e) => ht.get(e) || e, St = (e = {}) => {
  if (!e)
    return {};
  let t4 = {};
  for (let [n4, r4] of Object.entries(e)) {
    let e2 = xt(n4);
    t4[e2] = r4;
  }
  return t4.chmod === undefined && t4.noChmod === false && (t4.chmod = true), delete t4.noChmod, t4;
}, Ct = (e, t4, n4, r4, i4) => Object.assign((a4 = [], o4, s3) => {
  Array.isArray(a4) && (o4 = a4, a4 = {}), typeof o4 == `function` && (s3 = o4, o4 = undefined), o4 = o4 ? Array.from(o4) : [];
  let c4 = St(a4);
  if (i4?.(c4, o4), gt(c4)) {
    if (typeof s3 == `function`)
      throw TypeError(`callback not supported for sync tar functions`);
    return e(c4, o4);
  } else if (_t(c4)) {
    let e2 = t4(c4, o4);
    return s3 ? e2.then(() => s3(), s3) : e2;
  } else if (vt(c4)) {
    if (typeof s3 == `function`)
      throw TypeError(`callback not supported for sync tar functions`);
    return n4(c4, o4);
  } else if (yt(c4)) {
    if (typeof s3 == `function`)
      throw TypeError(`callback only supported with file option`);
    return r4(c4, o4);
  }
  throw Error(`impossible options??`);
}, {
  syncFile: e,
  asyncFile: t4,
  syncNoFile: n4,
  asyncNoFile: r4,
  validate: i4
}), wt, F2, Tt, Et, Dt = (e) => e, Ot, kt, At, jt, Mt, Nt, Pt, Ft, It, Lt, Rt, zt, Bt, Vt, Ht = (e, t4) => {
  if (Number.isSafeInteger(e))
    e < 0 ? Wt(e, t4) : Ut(e, t4);
  else
    throw Error(`cannot encode number outside of javascript safe integer range`);
  return t4;
}, Ut = (e, t4) => {
  t4[0] = 128;
  for (var n4 = t4.length;n4 > 1; n4--)
    t4[n4 - 1] = e & 255, e = Math.floor(e / 256);
}, Wt = (e, t4) => {
  t4[0] = 255;
  var n4 = false;
  e *= -1;
  for (var r4 = t4.length;r4 > 1; r4--) {
    var i4 = e & 255;
    e = Math.floor(e / 256), n4 ? t4[r4 - 1] = Jt(i4) : i4 === 0 ? t4[r4 - 1] = 0 : (n4 = true, t4[r4 - 1] = Yt(i4));
  }
}, Gt = (e) => {
  let t4 = e[0], n4 = t4 === 128 ? qt(e.subarray(1, e.length)) : t4 === 255 ? Kt(e) : null;
  if (n4 === null)
    throw Error(`invalid base256 encoding`);
  if (!Number.isSafeInteger(n4))
    throw Error(`parsed number outside of javascript safe integer range`);
  return n4;
}, Kt = (e) => {
  for (var t4 = e.length, n4 = 0, r4 = false, i4 = t4 - 1;i4 > -1; i4--) {
    var a4 = Number(e[i4]), o4;
    r4 ? o4 = Jt(a4) : a4 === 0 ? o4 = a4 : (r4 = true, o4 = Yt(a4)), o4 !== 0 && (n4 -= o4 * 256 ** (t4 - i4 - 1));
  }
  return n4;
}, qt = (e) => {
  for (var t4 = e.length, n4 = 0, r4 = t4 - 1;r4 > -1; r4--) {
    var i4 = Number(e[r4]);
    i4 !== 0 && (n4 += i4 * 256 ** (t4 - r4 - 1));
  }
  return n4;
}, Jt = (e) => (255 ^ e) & 255, Yt = (e) => (255 ^ e) + 1 & 255, Xt, Zt = (e) => en.has(e), Qt = (e) => tn.has(e), $t, en, tn, I3 = class {
  cksumValid = false;
  needPax = false;
  nullBlock = false;
  block;
  path;
  mode;
  uid;
  gid;
  size;
  cksum;
  #t = `Unsupported`;
  linkpath;
  uname;
  gname;
  devmaj = 0;
  devmin = 0;
  atime;
  ctime;
  mtime;
  charset;
  comment;
  constructor(e, t4 = 0, n4, r4) {
    Buffer.isBuffer(e) ? this.decode(e, t4 || 0, n4, r4) : e && this.#i(e);
  }
  decode(e, t4, n4, r4) {
    if (t4 ||= 0, !e || !(e.length >= t4 + 512))
      throw Error(`need 512 bytes for header`);
    let i4 = rn(e, t4 + 156, 1), a4 = $t.has(i4), o4 = a4 ? n4 : undefined, s3 = a4 ? r4 : undefined;
    if (this.path = o4?.path ?? rn(e, t4, 100), this.mode = o4?.mode ?? s3?.mode ?? L2(e, t4 + 100, 8), this.uid = o4?.uid ?? s3?.uid ?? L2(e, t4 + 108, 8), this.gid = o4?.gid ?? s3?.gid ?? L2(e, t4 + 116, 8), this.size = o4?.size ?? s3?.size ?? L2(e, t4 + 124, 12), this.mtime = o4?.mtime ?? s3?.mtime ?? an(e, t4 + 136, 12), this.cksum = L2(e, t4 + 148, 12), s3 && this.#i(s3, true), o4 && this.#i(o4), Zt(i4) && (this.#t = i4 || `0`), this.#t === `0` && this.path.slice(-1) === `/` && (this.#t = `5`), this.#t === `5` && (this.size = 0), this.linkpath = rn(e, t4 + 157, 100), e.subarray(t4 + 257, t4 + 265).toString() === `ustar\x0000`)
      if (this.uname = o4?.uname ?? s3?.uname ?? rn(e, t4 + 265, 32), this.gname = o4?.gname ?? s3?.gname ?? rn(e, t4 + 297, 32), this.devmaj = o4?.devmaj ?? s3?.devmaj ?? L2(e, t4 + 329, 8) ?? 0, this.devmin = o4?.devmin ?? s3?.devmin ?? L2(e, t4 + 337, 8) ?? 0, e[t4 + 475] !== 0) {
        let n5 = rn(e, t4 + 345, 155);
        this.path = n5 + `/` + this.path;
      } else {
        let i5 = rn(e, t4 + 345, 130);
        i5 && (this.path = i5 + `/` + this.path), this.atime = n4?.atime ?? r4?.atime ?? an(e, t4 + 476, 12), this.ctime = n4?.ctime ?? r4?.ctime ?? an(e, t4 + 488, 12);
      }
    let c4 = 256;
    for (let n5 = t4;n5 < t4 + 148; n5++)
      c4 += e[n5];
    for (let n5 = t4 + 156;n5 < t4 + 512; n5++)
      c4 += e[n5];
    this.cksumValid = c4 === this.cksum, this.cksum === undefined && c4 === 256 && (this.nullBlock = true);
  }
  #i(e, t4 = false) {
    Object.assign(this, Object.fromEntries(Object.entries(e).filter(([e2, n4]) => !(n4 == null || e2 === `path` && t4 || e2 === `linkpath` && t4 || e2 === `global`))));
  }
  encode(e, t4 = 0) {
    if (e ||= this.block = Buffer.alloc(512), this.#t === `Unsupported` && (this.#t = `0`), !(e.length >= t4 + 512))
      throw Error(`need 512 bytes for header`);
    let n4 = this.ctime || this.atime ? 130 : 155, r4 = nn(this.path || ``, n4), i4 = r4[0], a4 = r4[1];
    this.needPax = !!r4[2], this.needPax = hn(e, t4, 100, i4) || this.needPax, this.needPax = R3(e, t4 + 100, 8, this.mode) || this.needPax, this.needPax = R3(e, t4 + 108, 8, this.uid) || this.needPax, this.needPax = R3(e, t4 + 116, 8, this.gid) || this.needPax, this.needPax = R3(e, t4 + 124, 12, this.size) || this.needPax, this.needPax = pn(e, t4 + 136, 12, this.mtime) || this.needPax, e[t4 + 156] = Number(this.#t.codePointAt(0)), this.needPax = hn(e, t4 + 157, 100, this.linkpath) || this.needPax, e.write(`ustar\x0000`, t4 + 257, 8), this.needPax = hn(e, t4 + 265, 32, this.uname) || this.needPax, this.needPax = hn(e, t4 + 297, 32, this.gname) || this.needPax, this.needPax = R3(e, t4 + 329, 8, this.devmaj) || this.needPax, this.needPax = R3(e, t4 + 337, 8, this.devmin) || this.needPax, this.needPax = hn(e, t4 + 345, n4, a4) || this.needPax, e[t4 + 475] === 0 ? (this.needPax = hn(e, t4 + 345, 130, a4) || this.needPax, this.needPax = pn(e, t4 + 476, 12, this.atime) || this.needPax, this.needPax = pn(e, t4 + 488, 12, this.ctime) || this.needPax) : this.needPax = hn(e, t4 + 345, 155, a4) || this.needPax;
    let o4 = 256;
    for (let n5 = t4;n5 < t4 + 148; n5++)
      o4 += e[n5];
    for (let n5 = t4 + 156;n5 < t4 + 512; n5++)
      o4 += e[n5];
    return this.cksum = o4, R3(e, t4 + 148, 8, this.cksum), this.cksumValid = true, this.needPax;
  }
  get type() {
    return this.#t === `Unsupported` ? this.#t : en.get(this.#t);
  }
  get typeKey() {
    return this.#t;
  }
  set type(e) {
    let t4 = String(tn.get(e));
    if (Zt(t4) || t4 === `Unsupported`)
      this.#t = t4;
    else if (Zt(e))
      this.#t = e;
    else
      throw TypeError(`invalid entry type: ` + e);
  }
}, nn = (e, t4) => {
  let n4 = e, r4 = ``, i4, a4 = s2.parse(e).root || `.`;
  if (Buffer.byteLength(n4) < 100)
    i4 = [
      n4,
      r4,
      false
    ];
  else {
    r4 = s2.dirname(n4), n4 = s2.basename(n4);
    do
      Buffer.byteLength(n4) <= 100 && Buffer.byteLength(r4) <= t4 ? i4 = [
        n4,
        r4,
        false
      ] : Buffer.byteLength(n4) > 100 && Buffer.byteLength(r4) <= t4 ? i4 = [
        n4.slice(0, 99),
        r4,
        true
      ] : (n4 = s2.join(s2.basename(r4), n4), r4 = s2.dirname(r4));
    while (r4 !== a4 && i4 === undefined);
    i4 ||= [
      e.slice(0, 99),
      ``,
      true
    ];
  }
  return i4;
}, rn = (e, t4, n4) => e.subarray(t4, t4 + n4).toString(`utf8`).replace(/\0.*/, ``), an = (e, t4, n4) => on(L2(e, t4, n4)), on = (e) => e === undefined ? undefined : /* @__PURE__ */ new Date(e * 1000), L2 = (e, t4, n4) => Number(e[t4]) & 128 ? Gt(e.subarray(t4, t4 + n4)) : cn(e, t4, n4), sn = (e) => isNaN(e) ? undefined : e, cn = (e, t4, n4) => sn(parseInt(e.subarray(t4, t4 + n4).toString(`utf8`).replace(/\0.*$/, ``).trim(), 8)), ln, R3 = (e, t4, n4, r4) => r4 === undefined ? false : r4 > ln[n4] || r4 < 0 ? (Ht(r4, e.subarray(t4, t4 + n4)), true) : (un(e, t4, n4, r4), false), un = (e, t4, n4, r4) => e.write(dn(r4, n4), t4, n4, `ascii`), dn = (e, t4) => fn(Math.floor(e).toString(8), t4), fn = (e, t4) => (e.length === t4 - 1 ? e : Array(t4 - e.length - 1).join(`0`) + e + ` `) + `\x00`, pn = (e, t4, n4, r4) => r4 === undefined ? false : R3(e, t4, n4, r4.getTime() / 1000), mn, hn = (e, t4, n4, r4) => r4 === undefined ? false : (e.write(r4 + mn, t4, n4, `utf8`), r4.length !== Buffer.byteLength(r4) || r4.length > n4), gn = class e {
  atime;
  mtime;
  ctime;
  charset;
  comment;
  gid;
  uid;
  gname;
  uname;
  linkpath;
  dev;
  ino;
  nlink;
  path;
  size;
  mode;
  global;
  constructor(e2, t4 = false) {
    this.atime = e2.atime, this.charset = e2.charset, this.comment = e2.comment, this.ctime = e2.ctime, this.dev = e2.dev, this.gid = e2.gid, this.global = t4, this.gname = e2.gname, this.ino = e2.ino, this.linkpath = e2.linkpath, this.mtime = e2.mtime, this.nlink = e2.nlink, this.path = e2.path, this.size = e2.size, this.uid = e2.uid, this.uname = e2.uname;
  }
  encode() {
    let e2 = this.encodeBody();
    if (e2 === ``)
      return Buffer.allocUnsafe(0);
    let t4 = Buffer.byteLength(e2), n4 = 512 * Math.ceil(1 + t4 / 512), r4 = Buffer.allocUnsafe(n4);
    for (let e3 = 0;e3 < 512; e3++)
      r4[e3] = 0;
    new I3({
      path: (`PaxHeader/` + a3(this.path ?? ``)).slice(0, 99),
      mode: this.mode || 420,
      uid: this.uid,
      gid: this.gid,
      size: t4,
      mtime: this.mtime,
      type: this.global ? `GlobalExtendedHeader` : `ExtendedHeader`,
      linkpath: ``,
      uname: this.uname || ``,
      gname: this.gname || ``,
      devmaj: 0,
      devmin: 0,
      atime: this.atime,
      ctime: this.ctime
    }).encode(r4), r4.write(e2, 512, t4, `utf8`);
    for (let e3 = t4 + 512;e3 < r4.length; e3++)
      r4[e3] = 0;
    return r4;
  }
  encodeBody() {
    return this.encodeField(`path`) + this.encodeField(`ctime`) + this.encodeField(`atime`) + this.encodeField(`dev`) + this.encodeField(`ino`) + this.encodeField(`nlink`) + this.encodeField(`charset`) + this.encodeField(`comment`) + this.encodeField(`gid`) + this.encodeField(`gname`) + this.encodeField(`linkpath`) + this.encodeField(`mtime`) + this.encodeField(`size`) + this.encodeField(`uid`) + this.encodeField(`uname`);
  }
  encodeField(e2) {
    if (this[e2] === undefined)
      return ``;
    let t4 = this[e2], n4 = t4 instanceof Date ? t4.getTime() / 1000 : t4, r4 = ` ` + (e2 === `dev` || e2 === `ino` || e2 === `nlink` ? `SCHILY.` : ``) + e2 + `=` + n4 + `
`, i4 = Buffer.byteLength(r4), a4 = Math.floor(Math.log(i4) / Math.log(10)) + 1;
    return i4 + a4 >= 10 ** a4 && (a4 += 1), a4 + i4 + r4;
  }
  static parse(t4, n4, r4 = false) {
    return new e(_n(vn(t4), n4), r4);
  }
}, _n = (e2, t4) => t4 ? Object.assign({}, t4, e2) : e2, vn = (e2) => e2.replace(/\n$/, ``).split(`
`).reduce(yn, Object.create(null)), yn = (e2, t4) => {
  let n4 = parseInt(t4, 10);
  if (n4 !== Buffer.byteLength(t4) + 1)
    return e2;
  t4 = t4.slice((n4 + ` `).length);
  let r4 = t4.split(`=`), i4 = r4.shift();
  if (!i4)
    return e2;
  let a4 = i4.replace(/^SCHILY\.(dev|ino|nlink)/, `$1`), o4 = r4.join(`=`);
  return e2[a4] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(a4) ? /* @__PURE__ */ new Date(Number(o4) * 1000) : /^[0-9]+$/.test(o4) ? +o4 : o4, e2;
}, z2, bn, xn = (e2, t4, n4, r4 = {}) => {
  e2.file && (r4.file = e2.file), e2.cwd && (r4.cwd = e2.cwd), r4.code = n4 instanceof Error && n4.code || t4, r4.tarCode = t4, !e2.strict && r4.recoverable !== false ? (n4 instanceof Error && (r4 = Object.assign(n4, r4), n4 = n4.message), e2.emit(`warn`, t4, n4, r4)) : n4 instanceof Error ? e2.emit(`error`, Object.assign(n4, r4)) : e2.emit(`error`, Object.assign(Error(`${t4}: ${n4}`), r4));
}, Sn, Cn, wn, Tn, B2, En, V3, Dn, On, H2, kn, U3, An, W3, G2, K2, jn, Mn, q2, Nn, Pn, Fn, In, Ln, Rn, zn, Bn, Vn, J2, Hn, Un, Wn, Gn, Kn, qn = () => true, Jn, Yn = (e2) => {
  let t4 = e2.length - 1, n4 = -1;
  for (;t4 > -1 && e2.charAt(t4) === `/`; )
    n4 = t4, t4--;
  return n4 === -1 ? e2 : e2.slice(0, n4);
}, Xn = (e2) => {
  let t4 = e2.onReadEntry;
  e2.onReadEntry = t4 ? (e3) => {
    t4(e3), e3.resume();
  } : (e3) => e3.resume();
}, Zn = (e2, t4) => {
  let n4 = new Map(t4.map((e3) => [Yn(e3), true])), r4 = e2.filter, i4 = (e3, t5 = ``) => {
    let r5 = t5 || te2(e3).root || `.`, a4;
    if (e3 === r5)
      a4 = false;
    else {
      let t6 = n4.get(e3);
      a4 = t6 === undefined ? i4(m4(e3), r5) : t6;
    }
    return n4.set(e3, a4), a4;
  };
  e2.filter = r4 ? (e3, t5) => r4(e3, t5) && i4(Yn(e3)) : (e3) => i4(Yn(e3));
}, Qn, $n = (e2, t4, n4) => (e2 &= 4095, n4 && (e2 = (e2 | 384) & -19), t4 && (e2 & 256 && (e2 |= 64), e2 & 32 && (e2 |= 8), e2 & 4 && (e2 |= 1)), e2), er, tr, nr = (e2) => {
  let t4 = ``, n4 = tr(e2);
  for (;er(e2) || n4.root; ) {
    let r4 = e2.charAt(0) === `/` && e2.slice(0, 4) !== `//?/` ? `/` : n4.root;
    e2 = e2.slice(r4.length), t4 += r4, n4 = tr(e2);
  }
  return [t4, e2];
}, rr, ir, ar, or, sr = (e2) => rr.reduce((e3, t4) => e3.split(t4).join(ar.get(t4)), e2), cr = (e2) => ir.reduce((e3, t4) => e3.split(t4).join(or.get(t4)), e2), lr = (e2, t4) => t4 ? (e2 = z2(e2).replace(/^\.(\/|$)/, ``), Yn(t4) + `/` + e2) : z2(e2), ur, dr, fr, pr, mr, hr, gr, _r, vr, yr, br, xr, Sr, Cr, wr, Tr, Er, Dr, Y2, Or, kr, Ar, jr = (e2) => e2.isFile() ? `File` : e2.isDirectory() ? `Directory` : e2.isSymbolicLink() ? `SymbolicLink` : `Unsupported`, Mr, Ir = class {
  list;
  next;
  prev;
  value;
  constructor(e3, t4, n4, r4) {
    this.list = r4, this.value = e3, t4 ? (t4.next = this, this.prev = t4) : this.prev = undefined, n4 ? (n4.prev = this, this.next = n4) : this.next = undefined;
  }
}, Lr = class {
  path;
  absolute;
  entry;
  stat;
  readdir;
  pending = false;
  pendingLink = false;
  ignore = false;
  piped = false;
  constructor(e3, t4) {
    this.path = e3 || `./`, this.absolute = t4;
  }
}, Rr, zr, Br, X2, Vr, Hr, Ur, Wr, Gr, Z2, Kr, qr, Jr, Yr, Xr, Zr, Qr, $r, ei, ti, ni, ri, ii, ai, oi = (e3, t4) => {
  let n4 = new ai(e3), r4 = new mt(e3.file, { mode: e3.mode || 438 });
  n4.pipe(r4), ci(n4, t4);
}, si = (e3, t4) => {
  let n4 = new ii(e3), r4 = new pt(e3.file, { mode: e3.mode || 438 });
  n4.pipe(r4);
  let i4 = new Promise((e4, t5) => {
    r4.on(`error`, t5), r4.on(`close`, e4), n4.on(`error`, t5);
  });
  return li(n4, t4).catch((e4) => n4.emit(`error`, e4)), i4;
}, ci = (e3, t4) => {
  t4.forEach((t5) => {
    t5.charAt(0) === `@` ? Qn({
      file: i3.resolve(e3.cwd, t5.slice(1)),
      sync: true,
      noResume: true,
      onReadEntry: (t6) => e3.add(t6)
    }) : e3.add(t5);
  }), e3.end();
}, li = async (e3, t4) => {
  for (let n4 of t4)
    n4.charAt(0) === `@` ? await Qn({
      file: i3.resolve(String(e3.cwd), n4.slice(1)),
      noResume: true,
      onReadEntry: (t5) => {
        e3.add(t5);
      }
    }) : e3.add(n4);
  e3.end();
}, ui, di, fi, pi, mi, hi, gi, _i, vi, yi, bi, xi, Si = (e3, n4, r4) => {
  try {
    return t3.lchownSync(e3, n4, r4);
  } catch (e4) {
    if (e4?.code !== `ENOENT`)
      throw e4;
  }
}, Ci = (e3, n4, r4, i4) => {
  t3.lchown(e3, n4, r4, (e4) => {
    i4(e4 && e4?.code !== `ENOENT` ? e4 : null);
  });
}, wi = (e3, t4, n4, r4, a4) => {
  t4.isDirectory() ? Ti(i3.resolve(e3, t4.name), n4, r4, (o4) => {
    if (o4)
      return a4(o4);
    Ci(i3.resolve(e3, t4.name), n4, r4, a4);
  }) : Ci(i3.resolve(e3, t4.name), n4, r4, a4);
}, Ti = (e3, n4, r4, i4) => {
  t3.readdir(e3, { withFileTypes: true }, (t4, a4) => {
    if (t4) {
      if (t4.code === `ENOENT`)
        return i4();
      if (t4.code !== `ENOTDIR` && t4.code !== `ENOTSUP`)
        return i4(t4);
    }
    if (t4 || !a4.length)
      return Ci(e3, n4, r4, i4);
    let o4 = a4.length, s3 = null, c4 = (t5) => {
      if (!s3) {
        if (t5)
          return i4(s3 = t5);
        if (--o4 === 0)
          return Ci(e3, n4, r4, i4);
      }
    };
    for (let t5 of a4)
      wi(e3, t5, n4, r4, c4);
  });
}, Ei = (e3, t4, n4, r4) => {
  t4.isDirectory() && Di(i3.resolve(e3, t4.name), n4, r4), Si(i3.resolve(e3, t4.name), n4, r4);
}, Di = (e3, n4, r4) => {
  let i4;
  try {
    i4 = t3.readdirSync(e3, { withFileTypes: true });
  } catch (t4) {
    let i5 = t4;
    if (i5?.code === `ENOENT`)
      return;
    if (i5?.code === `ENOTDIR` || i5?.code === `ENOTSUP`)
      return Si(e3, n4, r4);
    throw i5;
  }
  for (let t4 of i4)
    Ei(e3, t4, n4, r4);
  return Si(e3, n4, r4);
}, Oi, ki, Ai = (e3, n4) => {
  t3.stat(e3, (t4, r4) => {
    (t4 || !r4.isDirectory()) && (t4 = new Oi(e3, t4?.code || `ENOTDIR`)), n4(t4);
  });
}, ji = (e3, r4, a4) => {
  e3 = z2(e3);
  let o4 = r4.umask ?? 18, s3 = r4.mode | 448, c4 = (s3 & o4) !== 0, l4 = r4.uid, u6 = r4.gid, d3 = typeof l4 == `number` && typeof u6 == `number` && (l4 !== r4.processUid || u6 !== r4.processGid), f4 = r4.preserve, ee3 = r4.unlink, p4 = z2(r4.cwd), m5 = (n4, r5) => {
    n4 ? a4(n4) : r5 && d3 ? Ti(r5, l4, u6, (e4) => m5(e4)) : c4 ? t3.chmod(e3, s3, a4) : a4();
  };
  if (e3 === p4)
    return Ai(e3, m5);
  if (f4)
    return n3.mkdir(e3, {
      mode: s3,
      recursive: true
    }).then((e4) => m5(null, e4 ?? undefined), m5);
  Mi(p4, z2(i3.relative(p4, e3)).split(`/`), s3, ee3, p4, undefined, m5);
}, Mi = (e3, n4, r4, a4, o4, s3, c4) => {
  if (n4.length === 0)
    return c4(null, s3);
  let l4 = n4.shift(), u6 = z2(i3.resolve(e3 + `/` + l4));
  t3.mkdir(u6, r4, Ni(u6, n4, r4, a4, o4, s3, c4));
}, Ni = (e3, n4, r4, i4, a4, o4, s3) => (c4) => {
  c4 ? t3.lstat(e3, (l4, u6) => {
    if (l4)
      l4.path = l4.path && z2(l4.path), s3(l4);
    else if (u6.isDirectory())
      Mi(e3, n4, r4, i4, a4, o4, s3);
    else if (i4)
      t3.unlink(e3, (c5) => {
        if (c5)
          return s3(c5);
        t3.mkdir(e3, r4, Ni(e3, n4, r4, i4, a4, o4, s3));
      });
    else {
      if (u6.isSymbolicLink())
        return s3(new ki(e3, e3 + `/` + n4.join(`/`)));
      s3(c4);
    }
  }) : (o4 ||= e3, Mi(e3, n4, r4, i4, a4, o4, s3));
}, Pi = (e3) => {
  let n4 = false, r4;
  try {
    n4 = t3.statSync(e3).isDirectory();
  } catch (e4) {
    r4 = e4?.code;
  } finally {
    if (!n4)
      throw new Oi(e3, r4 ?? `ENOTDIR`);
  }
}, Fi = (e3, n4) => {
  e3 = z2(e3);
  let r4 = n4.umask ?? 18, a4 = n4.mode | 448, o4 = (a4 & r4) !== 0, s3 = n4.uid, c4 = n4.gid, l4 = typeof s3 == `number` && typeof c4 == `number` && (s3 !== n4.processUid || c4 !== n4.processGid), u6 = n4.preserve, d3 = n4.unlink, f4 = z2(n4.cwd), ee3 = (n5) => {
    n5 && l4 && Di(n5, s3, c4), o4 && t3.chmodSync(e3, a4);
  };
  if (e3 === f4)
    return Pi(f4), ee3();
  if (u6)
    return ee3(t3.mkdirSync(e3, {
      mode: a4,
      recursive: true
    }) ?? undefined);
  let p4 = z2(i3.relative(f4, e3)).split(`/`), m5;
  for (let e4 = p4.shift(), n5 = f4;e4 && (n5 += `/` + e4); e4 = p4.shift()) {
    n5 = z2(i3.resolve(n5));
    try {
      t3.mkdirSync(n5, a4), m5 ||= n5;
    } catch {
      let e5 = t3.lstatSync(n5);
      if (e5.isDirectory())
        continue;
      if (d3) {
        t3.unlinkSync(n5), t3.mkdirSync(n5, a4), m5 ||= n5;
        continue;
      } else if (e5.isSymbolicLink())
        return new ki(n5, n5 + `/` + p4.join(`/`));
    }
  }
  return ee3(m5);
}, Ii, Li = 1e4, Ri, zi = (e3) => {
  Ri.has(e3) ? Ri.delete(e3) : Ii[e3] = e3.normalize(`NFD`).toLocaleLowerCase(`en`).toLocaleUpperCase(`en`), Ri.add(e3);
  let t4 = Ii[e3], n4 = Ri.size - Li;
  if (n4 > Li / 10) {
    for (let e4 of Ri)
      if (Ri.delete(e4), delete Ii[e4], --n4 <= 0)
        break;
  }
  return t4;
}, Bi, Vi = (e3) => e3.split(`/`).slice(0, -1).reduce((e4, t4) => {
  let n4 = e4.at(-1);
  return n4 !== undefined && (t4 = o3(n4, t4)), e4.push(t4 || `/`), e4;
}, []), Hi = class {
  #t = /* @__PURE__ */ new Map;
  #i = /* @__PURE__ */ new Map;
  #s = /* @__PURE__ */ new Set;
  reserve(e3, t4) {
    e3 = Bi ? [`win32 parallelization disabled`] : e3.map((e4) => Yn(o3(zi(e4))));
    let n4 = new Set(e3.map((e4) => Vi(e4)).reduce((e4, t5) => e4.concat(t5)));
    this.#i.set(t4, {
      dirs: n4,
      paths: e3
    });
    for (let n5 of e3) {
      let e4 = this.#t.get(n5);
      e4 ? e4.push(t4) : this.#t.set(n5, [t4]);
    }
    for (let e4 of n4) {
      let n5 = this.#t.get(e4);
      if (!n5)
        this.#t.set(e4, [new Set([t4])]);
      else {
        let e5 = n5.at(-1);
        e5 instanceof Set ? e5.add(t4) : n5.push(new Set([t4]));
      }
    }
    return this.#r(t4);
  }
  #n(e3) {
    let t4 = this.#i.get(e3);
    if (!t4)
      throw Error(`function does not have any path reservations`);
    return {
      paths: t4.paths.map((e4) => this.#t.get(e4)),
      dirs: [...t4.dirs].map((e4) => this.#t.get(e4))
    };
  }
  check(e3) {
    let { paths: t4, dirs: n4 } = this.#n(e3);
    return t4.every((t5) => t5 && t5[0] === e3) && n4.every((t5) => t5 && t5[0] instanceof Set && t5[0].has(e3));
  }
  #r(e3) {
    return this.#s.has(e3) || !this.check(e3) ? false : (this.#s.add(e3), e3(() => this.#e(e3)), true);
  }
  #e(e3) {
    if (!this.#s.has(e3))
      return false;
    let t4 = this.#i.get(e3);
    if (!t4)
      throw Error(`invalid reservation`);
    let { paths: n4, dirs: r4 } = t4, i4 = /* @__PURE__ */ new Set;
    for (let t5 of n4) {
      let n5 = this.#t.get(t5);
      if (!n5 || n5?.[0] !== e3)
        continue;
      let r5 = n5[1];
      if (!r5) {
        this.#t.delete(t5);
        continue;
      }
      if (n5.shift(), typeof r5 == `function`)
        i4.add(r5);
      else
        for (let e4 of r5)
          i4.add(e4);
    }
    for (let t5 of r4) {
      let n5 = this.#t.get(t5), r5 = n5?.[0];
      if (!(!n5 || !(r5 instanceof Set)))
        if (r5.size === 1 && n5.length === 1) {
          this.#t.delete(t5);
          continue;
        } else if (r5.size === 1) {
          n5.shift();
          let e4 = n5[0];
          typeof e4 == `function` && i4.add(e4);
        } else
          r5.delete(e3);
    }
    return this.#s.delete(e3), i4.forEach((e4) => this.#r(e4)), true;
  }
}, Ui = () => process.umask(), Wi, Gi, Ki, qi, Q2, Ji, Yi, Xi, Zi, Qi, $i, ea, ta, na, ra, $2, ia, aa, oa, sa, ca, la, ua, da, fa, pa, ma, ha = 1024, ga = (e3, n4) => {
  if (!ma)
    return t3.unlink(e3, n4);
  let r4 = e3 + `.DELETE.` + se2(16).toString(`hex`);
  t3.rename(e3, r4, (e4) => {
    if (e4)
      return n4(e4);
    t3.unlink(r4, n4);
  });
}, _a = (e3) => {
  if (!ma)
    return t3.unlinkSync(e3);
  let n4 = e3 + `.DELETE.` + se2(16).toString(`hex`);
  t3.renameSync(e3, n4), t3.unlinkSync(n4);
}, va = (e3, t4, n4) => e3 !== undefined && e3 === e3 >>> 0 ? e3 : t4 !== undefined && t4 === t4 >>> 0 ? t4 : n4, ya, ba = (e3) => {
  try {
    return [null, e3()];
  } catch (e4) {
    return [e4, null];
  }
}, xa, Sa, Ca = (e3, n4) => {
  let r4 = new ai(e3), i4 = true, a4, o4;
  try {
    try {
      a4 = t3.openSync(e3.file, `r+`);
    } catch (n5) {
      if (n5?.code === `ENOENT`)
        a4 = t3.openSync(e3.file, `w+`);
      else
        throw n5;
    }
    let s3 = t3.fstatSync(a4), c4 = Buffer.alloc(512);
    t:
      for (o4 = 0;o4 < s3.size; o4 += 512) {
        for (let e4 = 0, n6 = 0;e4 < 512; e4 += n6) {
          if (n6 = t3.readSync(a4, c4, e4, c4.length - e4, o4 + e4), o4 === 0 && c4[0] === 31 && c4[1] === 139)
            throw Error(`cannot append to compressed archives`);
          if (!n6)
            break t;
        }
        let n5 = new I3(c4);
        if (!n5.cksumValid)
          break;
        let r5 = 512 * Math.ceil((n5.size || 0) / 512);
        if (o4 + r5 + 512 > s3.size)
          break;
        o4 += r5, e3.mtimeCache && n5.mtime && e3.mtimeCache.set(String(n5.path), n5.mtime);
      }
    i4 = false, wa(e3, r4, o4, a4, n4);
  } finally {
    if (i4)
      try {
        t3.closeSync(a4);
      } catch {}
  }
}, wa = (e3, t4, n4, r4, i4) => {
  let a4 = new mt(e3.file, {
    fd: r4,
    start: n4
  });
  t4.pipe(a4), Ea(t4, i4);
}, Ta = (e3, n4) => {
  n4 = Array.from(n4);
  let r4 = new ii(e3), i4 = (n5, r5, i5) => {
    let a4 = (e4, r6) => {
      e4 ? t3.close(n5, (t4) => i5(e4)) : i5(null, r6);
    }, o4 = 0;
    if (r5 === 0)
      return a4(null, 0);
    let s3 = 0, c4 = Buffer.alloc(512), l4 = (i6, u6) => {
      if (i6 || u6 === undefined)
        return a4(i6);
      if (s3 += u6, s3 < 512 && u6)
        return t3.read(n5, c4, s3, c4.length - s3, o4 + s3, l4);
      if (o4 === 0 && c4[0] === 31 && c4[1] === 139)
        return a4(Error(`cannot append to compressed archives`));
      if (s3 < 512)
        return a4(null, o4);
      let d3 = new I3(c4);
      if (!d3.cksumValid)
        return a4(null, o4);
      let f4 = 512 * Math.ceil((d3.size ?? 0) / 512);
      if (o4 + f4 + 512 > r5 || (o4 += f4 + 512, o4 >= r5))
        return a4(null, o4);
      e3.mtimeCache && d3.mtime && e3.mtimeCache.set(String(d3.path), d3.mtime), s3 = 0, t3.read(n5, c4, 0, 512, o4, l4);
    };
    t3.read(n5, c4, 0, 512, o4, l4);
  };
  return new Promise((a4, o4) => {
    r4.on(`error`, o4);
    let s3 = `r+`, c4 = (l4, u6) => {
      if (l4 && l4.code === `ENOENT` && s3 === `r+`)
        return s3 = `w+`, t3.open(e3.file, s3, c4);
      if (l4 || !u6)
        return o4(l4);
      t3.fstat(u6, (s4, c5) => {
        if (s4)
          return t3.close(u6, () => o4(s4));
        i4(u6, c5.size, (t4, i5) => {
          if (t4)
            return o4(t4);
          let s5 = new pt(e3.file, {
            fd: u6,
            start: i5
          });
          r4.pipe(s5), s5.on(`error`, o4), s5.on(`close`, a4), Da(r4, n4);
        });
      });
    };
    t3.open(e3.file, s3, c4);
  });
}, Ea = (e3, t4) => {
  t4.forEach((t5) => {
    t5.charAt(0) === `@` ? Qn({
      file: i3.resolve(e3.cwd, t5.slice(1)),
      sync: true,
      noResume: true,
      onReadEntry: (t6) => e3.add(t6)
    }) : e3.add(t5);
  }), e3.end();
}, Da = async (e3, t4) => {
  for (let n4 of t4)
    n4.charAt(0) === `@` ? await Qn({
      file: i3.resolve(String(e3.cwd), n4.slice(1)),
      noResume: true,
      onReadEntry: (t5) => e3.add(t5)
    }) : e3.add(n4);
  e3.end();
}, Oa, ka = (e3) => {
  let t4 = e3.filter;
  e3.mtimeCache ||= /* @__PURE__ */ new Map, e3.filter = t4 ? (n4, r4) => t4(n4, r4) && !((e3.mtimeCache?.get(n4) ?? r4.mtime ?? 0) > (r4.mtime ?? 0)) : (t5, n4) => !((e3.mtimeCache?.get(t5) ?? n4.mtime ?? 0) > (n4.mtime ?? 0));
};
var init_tar = __esm(() => {
  init_rolldown_runtime();
  ce2 = __exportAll({
    Header: () => I3,
    Pack: () => ii,
    PackJob: () => Lr,
    PackSync: () => ai,
    Parser: () => Jn,
    Pax: () => gn,
    ReadEntry: () => bn,
    Unpack: () => ya,
    UnpackSync: () => xa,
    WriteEntry: () => Or,
    WriteEntrySync: () => kr,
    WriteEntryTar: () => Ar,
    c: () => ui,
    create: () => ui,
    extract: () => Sa,
    filesFilter: () => Zn,
    list: () => Qn,
    r: () => Oa,
    replace: () => Oa,
    t: () => Qn,
    types: () => Xt,
    x: () => Sa
  });
  le2 = Object.defineProperty;
  de = typeof process == `object` && process ? process : {
    stdout: null,
    stderr: null
  };
  h3 = Symbol(`EOF`);
  g3 = Symbol(`maybeEmitEnd`);
  _3 = Symbol(`emittedEnd`);
  he = Symbol(`emittingEnd`);
  ge = Symbol(`emittedError`);
  _e = Symbol(`closed`);
  ve = Symbol(`read`);
  ye = Symbol(`flush`);
  be = Symbol(`flushChunk`);
  v2 = Symbol(`encoding`);
  xe = Symbol(`decoder`);
  y2 = Symbol(`flowing`);
  Se = Symbol(`paused`);
  Ce = Symbol(`resume`);
  b3 = Symbol(`buffer`);
  x2 = Symbol(`pipes`);
  S2 = Symbol(`bufferLength`);
  we = Symbol(`bufferPush`);
  Te = Symbol(`bufferShift`);
  C4 = Symbol(`objectMode`);
  w2 = Symbol(`destroyed`);
  Ee = Symbol(`error`);
  De = Symbol(`emitData`);
  Oe = Symbol(`emitEnd`);
  ke = Symbol(`emitEnd2`);
  T4 = Symbol(`async`);
  Ae = Symbol(`abort`);
  je = Symbol(`aborted`);
  Me = Symbol(`signal`);
  Ne = Symbol(`dataListeners`);
  E2 = Symbol(`discarded`);
  Be = class extends ze {
    unpipe() {
      this.src.removeListener(`error`, this.proxyErrors), super.unpipe();
    }
    constructor(e, t4, n4) {
      super(e, t4, n4), this.proxyErrors = (e2) => this.dest.emit(`error`, e2), e.on(`error`, this.proxyErrors);
    }
  };
  Ue = class extends f3 {
    [y2] = false;
    [Se] = false;
    [x2] = [];
    [b3] = [];
    [C4];
    [v2];
    [T4];
    [xe];
    [h3] = false;
    [_3] = false;
    [he] = false;
    [_e] = false;
    [ge] = null;
    [S2] = 0;
    [w2] = false;
    [Me];
    [je] = false;
    [Ne] = 0;
    [E2] = false;
    writable = true;
    readable = true;
    constructor(...e) {
      let t4 = e[0] || {};
      if (super(), t4.objectMode && typeof t4.encoding == `string`)
        throw TypeError(`Encoding and objectMode may not be used together`);
      Ve(t4) ? (this[C4] = true, this[v2] = null) : He(t4) ? (this[v2] = t4.encoding, this[C4] = false) : (this[C4] = false, this[v2] = null), this[T4] = !!t4.async, this[xe] = this[v2] ? new ee2(this[v2]) : null, t4 && t4.debugExposeBuffer === true && Object.defineProperty(this, "buffer", { get: () => this[b3] }), t4 && t4.debugExposePipes === true && Object.defineProperty(this, "pipes", { get: () => this[x2] });
      let { signal: n4 } = t4;
      n4 && (this[Me] = n4, n4.aborted ? this[Ae]() : n4.addEventListener(`abort`, () => this[Ae]()));
    }
    get bufferLength() {
      return this[S2];
    }
    get encoding() {
      return this[v2];
    }
    set encoding(e) {
      throw Error(`Encoding must be set at instantiation time`);
    }
    setEncoding(e) {
      throw Error(`Encoding must be set at instantiation time`);
    }
    get objectMode() {
      return this[C4];
    }
    set objectMode(e) {
      throw Error(`objectMode must be set at instantiation time`);
    }
    get async() {
      return this[T4];
    }
    set async(e) {
      this[T4] = this[T4] || !!e;
    }
    [Ae]() {
      this[je] = true, this.emit(`abort`, this[Me]?.reason), this.destroy(this[Me]?.reason);
    }
    get aborted() {
      return this[je];
    }
    set aborted(e) {}
    write(e, t4, n4) {
      if (this[je])
        return false;
      if (this[h3])
        throw Error(`write after end`);
      if (this[w2])
        return this.emit(`error`, Object.assign(Error(`Cannot call write after a stream was destroyed`), { code: `ERR_STREAM_DESTROYED` })), true;
      typeof t4 == `function` && (n4 = t4, t4 = `utf8`), t4 ||= `utf8`;
      let r4 = this[T4] ? Pe : Fe;
      if (!this[C4] && !Buffer.isBuffer(e)) {
        if (Re(e))
          e = Buffer.from(e.buffer, e.byteOffset, e.byteLength);
        else if (Le(e))
          e = Buffer.from(e);
        else if (typeof e != `string`)
          throw Error(`Non-contiguous data written to non-objectMode stream`);
      }
      return this[C4] ? (this[y2] && this[S2] !== 0 && this[ye](true), this[y2] ? this.emit(`data`, e) : this[we](e), this[S2] !== 0 && this.emit(`readable`), n4 && r4(n4), this[y2]) : e.length ? (typeof e == `string` && !(t4 === this[v2] && !this[xe]?.lastNeed) && (e = Buffer.from(e, t4)), Buffer.isBuffer(e) && this[v2] && (e = this[xe].write(e)), this[y2] && this[S2] !== 0 && this[ye](true), this[y2] ? this.emit(`data`, e) : this[we](e), this[S2] !== 0 && this.emit(`readable`), n4 && r4(n4), this[y2]) : (this[S2] !== 0 && this.emit(`readable`), n4 && r4(n4), this[y2]);
    }
    read(e) {
      if (this[w2])
        return null;
      if (this[E2] = false, this[S2] === 0 || e === 0 || e && e > this[S2])
        return this[g3](), null;
      this[C4] && (e = null), this[b3].length > 1 && !this[C4] && (this[b3] = [this[v2] ? this[b3].join(``) : Buffer.concat(this[b3], this[S2])]);
      let t4 = this[ve](e || null, this[b3][0]);
      return this[g3](), t4;
    }
    [ve](e, t4) {
      if (this[C4])
        this[Te]();
      else {
        let n4 = t4;
        e === n4.length || e === null ? this[Te]() : typeof n4 == `string` ? (this[b3][0] = n4.slice(e), t4 = n4.slice(0, e), this[S2] -= e) : (this[b3][0] = n4.subarray(e), t4 = n4.subarray(0, e), this[S2] -= e);
      }
      return this.emit(`data`, t4), !this[b3].length && !this[h3] && this.emit(`drain`), t4;
    }
    end(e, t4, n4) {
      return typeof e == `function` && (n4 = e, e = undefined), typeof t4 == `function` && (n4 = t4, t4 = `utf8`), e !== undefined && this.write(e, t4), n4 && this.once(`end`, n4), this[h3] = true, this.writable = false, (this[y2] || !this[Se]) && this[g3](), this;
    }
    [Ce]() {
      this[w2] || (!this[Ne] && !this[x2].length && (this[E2] = true), this[Se] = false, this[y2] = true, this.emit(`resume`), this[b3].length ? this[ye]() : this[h3] ? this[g3]() : this.emit(`drain`));
    }
    resume() {
      return this[Ce]();
    }
    pause() {
      this[y2] = false, this[Se] = true, this[E2] = false;
    }
    get destroyed() {
      return this[w2];
    }
    get flowing() {
      return this[y2];
    }
    get paused() {
      return this[Se];
    }
    [we](e) {
      this[C4] ? this[S2] += 1 : this[S2] += e.length, this[b3].push(e);
    }
    [Te]() {
      return this[C4] ? --this[S2] : this[S2] -= this[b3][0].length, this[b3].shift();
    }
    [ye](e = false) {
      do
        ;
      while (this[be](this[Te]()) && this[b3].length);
      !e && !this[b3].length && !this[h3] && this.emit(`drain`);
    }
    [be](e) {
      return this.emit(`data`, e), this[y2];
    }
    pipe(e, t4) {
      if (this[w2])
        return e;
      this[E2] = false;
      let n4 = this[_3];
      return t4 ||= {}, e === de.stdout || e === de.stderr ? t4.end = false : t4.end = t4.end !== false, t4.proxyErrors = !!t4.proxyErrors, n4 ? t4.end && e.end() : (this[x2].push(t4.proxyErrors ? new Be(this, e, t4) : new ze(this, e, t4)), this[T4] ? Pe(() => this[Ce]()) : this[Ce]()), e;
    }
    unpipe(e) {
      let t4 = this[x2].find((t5) => t5.dest === e);
      t4 && (this[x2].length === 1 ? (this[y2] && this[Ne] === 0 && (this[y2] = false), this[x2] = []) : this[x2].splice(this[x2].indexOf(t4), 1), t4.unpipe());
    }
    addListener(e, t4) {
      return this.on(e, t4);
    }
    on(e, t4) {
      let n4 = super.on(e, t4);
      if (e === `data`)
        this[E2] = false, this[Ne]++, !this[x2].length && !this[y2] && this[Ce]();
      else if (e === `readable` && this[S2] !== 0)
        super.emit(`readable`);
      else if (Ie(e) && this[_3])
        super.emit(e), this.removeAllListeners(e);
      else if (e === `error` && this[ge]) {
        let e2 = t4;
        this[T4] ? Pe(() => e2.call(this, this[ge])) : e2.call(this, this[ge]);
      }
      return n4;
    }
    removeListener(e, t4) {
      return this.off(e, t4);
    }
    off(e, t4) {
      let n4 = super.off(e, t4);
      return e === `data` && (this[Ne] = this.listeners(`data`).length, this[Ne] === 0 && !this[E2] && !this[x2].length && (this[y2] = false)), n4;
    }
    removeAllListeners(e) {
      let t4 = super.removeAllListeners(e);
      return (e === `data` || e === undefined) && (this[Ne] = 0, !this[E2] && !this[x2].length && (this[y2] = false)), t4;
    }
    get emittedEnd() {
      return this[_3];
    }
    [g3]() {
      !this[he] && !this[_3] && !this[w2] && this[b3].length === 0 && this[h3] && (this[he] = true, this.emit(`end`), this.emit(`prefinish`), this.emit(`finish`), this[_e] && this.emit(`close`), this[he] = false);
    }
    emit(e, ...t4) {
      let n4 = t4[0];
      if (e !== `error` && e !== `close` && e !== w2 && this[w2])
        return false;
      if (e === `data`)
        return !this[C4] && !n4 ? false : this[T4] ? (Pe(() => this[De](n4)), true) : this[De](n4);
      if (e === `end`)
        return this[Oe]();
      if (e === `close`) {
        if (this[_e] = true, !this[_3] && !this[w2])
          return false;
        let e2 = super.emit(`close`);
        return this.removeAllListeners(`close`), e2;
      } else if (e === `error`) {
        this[ge] = n4, super.emit(Ee, n4);
        let e2 = !this[Me] || this.listeners(`error`).length ? super.emit(`error`, n4) : false;
        return this[g3](), e2;
      } else if (e === `resume`) {
        let e2 = super.emit(`resume`);
        return this[g3](), e2;
      } else if (e === `finish` || e === `prefinish`) {
        let t5 = super.emit(e);
        return this.removeAllListeners(e), t5;
      }
      let r4 = super.emit(e, ...t4);
      return this[g3](), r4;
    }
    [De](e) {
      for (let t5 of this[x2])
        t5.dest.write(e) === false && this.pause();
      let t4 = this[E2] ? false : super.emit(`data`, e);
      return this[g3](), t4;
    }
    [Oe]() {
      return this[_3] ? false : (this[_3] = true, this.readable = false, this[T4] ? (Pe(() => this[ke]()), true) : this[ke]());
    }
    [ke]() {
      if (this[xe]) {
        let e2 = this[xe].end();
        if (e2) {
          for (let t4 of this[x2])
            t4.dest.write(e2);
          this[E2] || super.emit(`data`, e2);
        }
      }
      for (let e2 of this[x2])
        e2.end();
      let e = super.emit(`end`);
      return this.removeAllListeners(`end`), e;
    }
    async collect() {
      let e = Object.assign([], { dataLength: 0 });
      this[C4] || (e.dataLength = 0);
      let t4 = this.promise();
      return this.on(`data`, (t5) => {
        e.push(t5), this[C4] || (e.dataLength += t5.length);
      }), await t4, e;
    }
    async concat() {
      if (this[C4])
        throw Error(`cannot concat in objectMode`);
      let e = await this.collect();
      return this[v2] ? e.join(``) : Buffer.concat(e, e.dataLength);
    }
    async promise() {
      return new Promise((e, t4) => {
        this.on(w2, () => t4(Error(`stream destroyed`))), this.on(`error`, (e2) => t4(e2)), this.on(`end`, () => e());
      });
    }
    [Symbol.asyncIterator]() {
      this[E2] = false;
      let e = false, t4 = async () => (this.pause(), e = true, {
        value: undefined,
        done: true
      });
      return {
        next: () => {
          if (e)
            return t4();
          let n4 = this.read();
          if (n4 !== null)
            return Promise.resolve({
              done: false,
              value: n4
            });
          if (this[h3])
            return t4();
          let r4, i4, a4 = (e2) => {
            this.off(`data`, o4), this.off(`end`, s3), this.off(w2, c4), t4(), i4(e2);
          }, o4 = (e2) => {
            this.off(`error`, a4), this.off(`end`, s3), this.off(w2, c4), this.pause(), r4({
              value: e2,
              done: !!this[h3]
            });
          }, s3 = () => {
            this.off(`error`, a4), this.off(`data`, o4), this.off(w2, c4), t4(), r4({
              done: true,
              value: undefined
            });
          }, c4 = () => a4(Error(`stream destroyed`));
          return new Promise((e2, t5) => {
            i4 = t5, r4 = e2, this.once(w2, c4), this.once(`error`, a4), this.once(`end`, s3), this.once(`data`, o4);
          });
        },
        throw: t4,
        return: t4,
        [Symbol.asyncIterator]() {
          return this;
        },
        [Symbol.asyncDispose]: async () => {}
      };
    }
    [Symbol.iterator]() {
      this[E2] = false;
      let e = false, t4 = () => (this.pause(), this.off(Ee, t4), this.off(w2, t4), this.off(`end`, t4), e = true, {
        done: true,
        value: undefined
      });
      return this.once(`end`, t4), this.once(Ee, t4), this.once(w2, t4), {
        next: () => {
          if (e)
            return t4();
          let n4 = this.read();
          return n4 === null ? t4() : {
            done: false,
            value: n4
          };
        },
        throw: t4,
        return: t4,
        [Symbol.iterator]() {
          return this;
        },
        [Symbol.dispose]: () => {}
      };
    }
    destroy(e) {
      if (this[w2])
        return e ? this.emit(`error`, e) : this.emit(w2), this;
      this[w2] = true, this[E2] = true, this[b3].length = 0, this[S2] = 0;
      let t4 = this;
      return typeof t4.close == `function` && !this[_e] && t4.close(), e ? this.emit(`error`, e) : this.emit(w2), this;
    }
    static get isStream() {
      return fe;
    }
  };
  We = d2.writev;
  D2 = Symbol(`_autoClose`);
  O2 = Symbol(`_close`);
  Ge = Symbol(`_ended`);
  k2 = Symbol(`_fd`);
  Ke = Symbol(`_finished`);
  A2 = Symbol(`_flags`);
  qe = Symbol(`_flush`);
  Je = Symbol(`_handleChunk`);
  Ye = Symbol(`_makeBuf`);
  Xe = Symbol(`_mode`);
  Ze = Symbol(`_needDrain`);
  Qe = Symbol(`_onerror`);
  $e = Symbol(`_onopen`);
  et = Symbol(`_onread`);
  tt = Symbol(`_onwrite`);
  j2 = Symbol(`_open`);
  M3 = Symbol(`_path`);
  nt = Symbol(`_pos`);
  N2 = Symbol(`_queue`);
  rt = Symbol(`_read`);
  it = Symbol(`_readSize`);
  P3 = Symbol(`_reading`);
  at = Symbol(`_remain`);
  ot = Symbol(`_size`);
  st = Symbol(`_write`);
  ct = Symbol(`_writing`);
  lt = Symbol(`_defaultFlag`);
  ut = Symbol(`_errored`);
  dt = class extends Ue {
    [ut] = false;
    [k2];
    [M3];
    [it];
    [P3] = false;
    [ot];
    [at];
    [D2];
    constructor(e, t4) {
      if (t4 ||= {}, super(t4), this.readable = true, this.writable = false, typeof e != `string`)
        throw TypeError(`path must be a string`);
      this[ut] = false, this[k2] = typeof t4.fd == `number` ? t4.fd : undefined, this[M3] = e, this[it] = t4.readSize || 16 * 1024 * 1024, this[P3] = false, this[ot] = typeof t4.size == `number` ? t4.size : Infinity, this[at] = this[ot], this[D2] = typeof t4.autoClose == `boolean` ? t4.autoClose : true, typeof this[k2] == `number` ? this[rt]() : this[j2]();
    }
    get fd() {
      return this[k2];
    }
    get path() {
      return this[M3];
    }
    write() {
      throw TypeError(`this is a readable stream`);
    }
    end() {
      throw TypeError(`this is a readable stream`);
    }
    [j2]() {
      d2.open(this[M3], `r`, (e, t4) => this[$e](e, t4));
    }
    [$e](e, t4) {
      e ? this[Qe](e) : (this[k2] = t4, this.emit(`open`, t4), this[rt]());
    }
    [Ye]() {
      return Buffer.allocUnsafe(Math.min(this[it], this[at]));
    }
    [rt]() {
      if (!this[P3]) {
        this[P3] = true;
        let e = this[Ye]();
        if (e.length === 0)
          return process.nextTick(() => this[et](null, 0, e));
        d2.read(this[k2], e, 0, e.length, null, (e2, t4, n4) => this[et](e2, t4, n4));
      }
    }
    [et](e, t4, n4) {
      this[P3] = false, e ? this[Qe](e) : this[Je](t4, n4) && this[rt]();
    }
    [O2]() {
      if (this[D2] && typeof this[k2] == `number`) {
        let e = this[k2];
        this[k2] = undefined, d2.close(e, (e2) => e2 ? this.emit(`error`, e2) : this.emit(`close`));
      }
    }
    [Qe](e) {
      this[P3] = true, this[O2](), this.emit(`error`, e);
    }
    [Je](e, t4) {
      let n4 = false;
      return this[at] -= e, e > 0 && (n4 = super.write(e < t4.length ? t4.subarray(0, e) : t4)), (e === 0 || this[at] <= 0) && (n4 = false, this[O2](), super.end()), n4;
    }
    emit(e, ...t4) {
      switch (e) {
        case `prefinish`:
        case `finish`:
          return false;
        case `drain`:
          return typeof this[k2] == `number` && this[rt](), false;
        case `error`:
          return this[ut] ? false : (this[ut] = true, super.emit(e, ...t4));
        default:
          return super.emit(e, ...t4);
      }
    }
  };
  ft = class extends dt {
    [j2]() {
      let e = true;
      try {
        this[$e](null, d2.openSync(this[M3], `r`)), e = false;
      } finally {
        e && this[O2]();
      }
    }
    [rt]() {
      let e = true;
      try {
        if (!this[P3]) {
          this[P3] = true;
          do {
            let e2 = this[Ye](), t4 = e2.length === 0 ? 0 : d2.readSync(this[k2], e2, 0, e2.length, null);
            if (!this[Je](t4, e2))
              break;
          } while (true);
          this[P3] = false;
        }
        e = false;
      } finally {
        e && this[O2]();
      }
    }
    [O2]() {
      if (this[D2] && typeof this[k2] == `number`) {
        let e = this[k2];
        this[k2] = undefined, d2.closeSync(e), this.emit(`close`);
      }
    }
  };
  pt = class extends l3 {
    readable = false;
    writable = true;
    [ut] = false;
    [ct] = false;
    [Ge] = false;
    [N2] = [];
    [Ze] = false;
    [M3];
    [Xe];
    [D2];
    [k2];
    [lt];
    [A2];
    [Ke] = false;
    [nt];
    constructor(e, t4) {
      t4 ||= {}, super(t4), this[M3] = e, this[k2] = typeof t4.fd == `number` ? t4.fd : undefined, this[Xe] = t4.mode === undefined ? 438 : t4.mode, this[nt] = typeof t4.start == `number` ? t4.start : undefined, this[D2] = typeof t4.autoClose == `boolean` ? t4.autoClose : true;
      let n4 = this[nt] === undefined ? `w` : `r+`;
      this[lt] = t4.flags === undefined, this[A2] = t4.flags === undefined ? n4 : t4.flags, this[k2] === undefined && this[j2]();
    }
    emit(e, ...t4) {
      if (e === `error`) {
        if (this[ut])
          return false;
        this[ut] = true;
      }
      return super.emit(e, ...t4);
    }
    get fd() {
      return this[k2];
    }
    get path() {
      return this[M3];
    }
    [Qe](e) {
      this[O2](), this[ct] = true, this.emit(`error`, e);
    }
    [j2]() {
      d2.open(this[M3], this[A2], this[Xe], (e, t4) => this[$e](e, t4));
    }
    [$e](e, t4) {
      this[lt] && this[A2] === `r+` && e && e.code === `ENOENT` ? (this[A2] = `w`, this[j2]()) : e ? this[Qe](e) : (this[k2] = t4, this.emit(`open`, t4), this[ct] || this[qe]());
    }
    end(e, t4) {
      return e && this.write(e, t4), this[Ge] = true, !this[ct] && !this[N2].length && typeof this[k2] == `number` && this[tt](null, 0), this;
    }
    write(e, t4) {
      return typeof e == `string` && (e = Buffer.from(e, t4)), this[Ge] ? (this.emit(`error`, Error(`write() after end()`)), false) : this[k2] === undefined || this[ct] || this[N2].length ? (this[N2].push(e), this[Ze] = true, false) : (this[ct] = true, this[st](e), true);
    }
    [st](e) {
      d2.write(this[k2], e, 0, e.length, this[nt], (e2, t4) => this[tt](e2, t4));
    }
    [tt](e, t4) {
      e ? this[Qe](e) : (this[nt] !== undefined && typeof t4 == `number` && (this[nt] += t4), this[N2].length ? this[qe]() : (this[ct] = false, this[Ge] && !this[Ke] ? (this[Ke] = true, this[O2](), this.emit(`finish`)) : this[Ze] && (this[Ze] = false, this.emit(`drain`))));
    }
    [qe]() {
      if (this[N2].length === 0)
        this[Ge] && this[tt](null, 0);
      else if (this[N2].length === 1)
        this[st](this[N2].pop());
      else {
        let e = this[N2];
        this[N2] = [], We(this[k2], e, this[nt], (e2, t4) => this[tt](e2, t4));
      }
    }
    [O2]() {
      if (this[D2] && typeof this[k2] == `number`) {
        let e = this[k2];
        this[k2] = undefined, d2.close(e, (e2) => e2 ? this.emit(`error`, e2) : this.emit(`close`));
      }
    }
  };
  mt = class extends pt {
    [j2]() {
      let e;
      if (this[lt] && this[A2] === `r+`)
        try {
          e = d2.openSync(this[M3], this[A2], this[Xe]);
        } catch (e2) {
          if (e2?.code === `ENOENT`)
            return this[A2] = `w`, this[j2]();
          throw e2;
        }
      else
        e = d2.openSync(this[M3], this[A2], this[Xe]);
      this[$e](null, e);
    }
    [O2]() {
      if (this[D2] && typeof this[k2] == `number`) {
        let e = this[k2];
        this[k2] = undefined, d2.closeSync(e), this.emit(`close`);
      }
    }
    [st](e) {
      let t4 = true;
      try {
        this[tt](null, d2.writeSync(this[k2], e, 0, e.length, this[nt])), t4 = false;
      } finally {
        if (t4)
          try {
            this[O2]();
          } catch {}
      }
    }
  };
  ht = new Map([
    [`C`, `cwd`],
    [`f`, `file`],
    [`z`, `gzip`],
    [`P`, `preservePaths`],
    [`U`, `unlink`],
    [`strip-components`, `strip`],
    [`stripComponents`, `strip`],
    [`keep-newer`, `newer`],
    [`keepNewer`, `newer`],
    [`keep-newer-files`, `newer`],
    [`keepNewerFiles`, `newer`],
    [`k`, `keep`],
    [`keep-existing`, `keep`],
    [`keepExisting`, `keep`],
    [`m`, `noMtime`],
    [`no-mtime`, `noMtime`],
    [`p`, `preserveOwner`],
    [`L`, `follow`],
    [`h`, `follow`],
    [`onentry`, `onReadEntry`]
  ]);
  wt = ae2.constants || { ZLIB_VERNUM: 4736 };
  F2 = Object.freeze(Object.assign(Object.create(null), {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    Z_VERSION_ERROR: -6,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    DEFLATE: 1,
    INFLATE: 2,
    GZIP: 3,
    GUNZIP: 4,
    DEFLATERAW: 5,
    INFLATERAW: 6,
    UNZIP: 7,
    BROTLI_DECODE: 8,
    BROTLI_ENCODE: 9,
    Z_MIN_WINDOWBITS: 8,
    Z_MAX_WINDOWBITS: 15,
    Z_DEFAULT_WINDOWBITS: 15,
    Z_MIN_CHUNK: 64,
    Z_MAX_CHUNK: Infinity,
    Z_DEFAULT_CHUNK: 16384,
    Z_MIN_MEMLEVEL: 1,
    Z_MAX_MEMLEVEL: 9,
    Z_DEFAULT_MEMLEVEL: 8,
    Z_MIN_LEVEL: -1,
    Z_MAX_LEVEL: 9,
    Z_DEFAULT_LEVEL: -1,
    BROTLI_OPERATION_PROCESS: 0,
    BROTLI_OPERATION_FLUSH: 1,
    BROTLI_OPERATION_FINISH: 2,
    BROTLI_OPERATION_EMIT_METADATA: 3,
    BROTLI_MODE_GENERIC: 0,
    BROTLI_MODE_TEXT: 1,
    BROTLI_MODE_FONT: 2,
    BROTLI_DEFAULT_MODE: 0,
    BROTLI_MIN_QUALITY: 0,
    BROTLI_MAX_QUALITY: 11,
    BROTLI_DEFAULT_QUALITY: 11,
    BROTLI_MIN_WINDOW_BITS: 10,
    BROTLI_MAX_WINDOW_BITS: 24,
    BROTLI_LARGE_MAX_WINDOW_BITS: 30,
    BROTLI_DEFAULT_WINDOW: 22,
    BROTLI_MIN_INPUT_BLOCK_BITS: 16,
    BROTLI_MAX_INPUT_BLOCK_BITS: 24,
    BROTLI_PARAM_MODE: 0,
    BROTLI_PARAM_QUALITY: 1,
    BROTLI_PARAM_LGWIN: 2,
    BROTLI_PARAM_LGBLOCK: 3,
    BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
    BROTLI_PARAM_SIZE_HINT: 5,
    BROTLI_PARAM_LARGE_WINDOW: 6,
    BROTLI_PARAM_NPOSTFIX: 7,
    BROTLI_PARAM_NDIRECT: 8,
    BROTLI_DECODER_RESULT_ERROR: 0,
    BROTLI_DECODER_RESULT_SUCCESS: 1,
    BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
    BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
    BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
    BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
    BROTLI_DECODER_NO_ERROR: 0,
    BROTLI_DECODER_SUCCESS: 1,
    BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
    BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
    BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
    BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
    BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
    BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
    BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
    BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
    BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
    BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
    BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
    BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
    BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
    BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
    BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
    BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
    BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
    BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
    BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
    BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
    BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
    BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
    BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
    BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
    BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
    BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
    BROTLI_DECODER_ERROR_UNREACHABLE: -31
  }, wt));
  Tt = re2.concat;
  Et = Object.getOwnPropertyDescriptor(re2, `concat`);
  Ot = Et?.writable === true || Et?.set !== undefined ? (e) => {
    re2.concat = e ? Dt : Tt;
  } : (e) => {};
  kt = Symbol(`_superWrite`);
  At = class extends Error {
    code;
    errno;
    constructor(e, t4) {
      super(`zlib: ` + e.message, { cause: e }), this.code = e.code, this.errno = e.errno, this.code ||= `ZLIB_ERROR`, this.message = `zlib: ` + e.message, Error.captureStackTrace(this, t4 ?? this.constructor);
    }
    get name() {
      return `ZlibError`;
    }
  };
  jt = Symbol(`flushFlag`);
  Mt = class extends Ue {
    #t = false;
    #i = false;
    #s;
    #n;
    #r;
    #e;
    #o;
    get sawError() {
      return this.#t;
    }
    get handle() {
      return this.#e;
    }
    get flushFlag() {
      return this.#s;
    }
    constructor(e, t4) {
      if (!e || typeof e != `object`)
        throw TypeError(`invalid options for ZlibBase constructor`);
      if (super(e), this.#s = e.flush ?? 0, this.#n = e.finishFlush ?? 0, this.#r = e.fullFlushFlag ?? 0, typeof ie2[t4] != `function`)
        throw TypeError(`Compression method not supported: ` + t4);
      try {
        this.#e = new ie2[t4](e);
      } catch (e2) {
        throw new At(e2, this.constructor);
      }
      this.#o = (e2) => {
        this.#t || (this.#t = true, this.close(), this.emit(`error`, e2));
      }, this.#e?.on(`error`, (e2) => this.#o(new At(e2))), this.once(`end`, () => this.close);
    }
    close() {
      this.#e && (this.#e.close(), this.#e = undefined, this.emit(`close`));
    }
    reset() {
      if (!this.#t)
        return ne2(this.#e, `zlib binding closed`), this.#e.reset?.();
    }
    flush(e) {
      this.ended || (typeof e != `number` && (e = this.#r), this.write(Object.assign(re2.alloc(0), { [jt]: e })));
    }
    end(e, t4, n4) {
      return typeof e == `function` && (n4 = e, t4 = undefined, e = undefined), typeof t4 == `function` && (n4 = t4, t4 = undefined), e && (t4 ? this.write(e, t4) : this.write(e)), this.flush(this.#n), this.#i = true, super.end(n4);
    }
    get ended() {
      return this.#i;
    }
    [kt](e) {
      return super.write(e);
    }
    write(e, t4, n4) {
      if (typeof t4 == `function` && (n4 = t4, t4 = `utf8`), typeof e == `string` && (e = re2.from(e, t4)), this.#t)
        return;
      ne2(this.#e, `zlib binding closed`);
      let r4 = this.#e._handle, i4 = r4.close;
      r4.close = () => {};
      let a4 = this.#e.close;
      this.#e.close = () => {}, Ot(true);
      let o4;
      try {
        let t5 = typeof e[jt] == `number` ? e[jt] : this.#s;
        o4 = this.#e._processChunk(e, t5), Ot(false);
      } catch (e2) {
        Ot(false), this.#o(new At(e2, this.write));
      } finally {
        this.#e && (this.#e._handle = r4, r4.close = i4, this.#e.close = a4, this.#e.removeAllListeners(`error`));
      }
      this.#e && this.#e.on(`error`, (e2) => this.#o(new At(e2, this.write)));
      let s3;
      if (o4)
        if (Array.isArray(o4) && o4.length > 0) {
          let e2 = o4[0];
          s3 = this[kt](re2.from(e2));
          for (let e3 = 1;e3 < o4.length; e3++)
            s3 = this[kt](o4[e3]);
        } else
          s3 = this[kt](re2.from(o4));
      return n4 && n4(), s3;
    }
  };
  Nt = class extends Mt {
    #t;
    #i;
    constructor(e, t4) {
      e ||= {}, e.flush = e.flush || F2.Z_NO_FLUSH, e.finishFlush = e.finishFlush || F2.Z_FINISH, e.fullFlushFlag = F2.Z_FULL_FLUSH, super(e, t4), this.#t = e.level, this.#i = e.strategy;
    }
    params(e, t4) {
      if (!this.sawError) {
        if (!this.handle)
          throw Error(`cannot switch params when binding is closed`);
        if (!this.handle.params)
          throw Error(`not supported in this implementation`);
        if (this.#t !== e || this.#i !== t4) {
          this.flush(F2.Z_SYNC_FLUSH), ne2(this.handle, `zlib binding closed`);
          let n4 = this.handle.flush;
          this.handle.flush = (e2, t5) => {
            typeof e2 == `function` && (t5 = e2, e2 = this.flushFlag), this.flush(e2), t5?.();
          };
          try {
            this.handle.params(e, t4);
          } finally {
            this.handle.flush = n4;
          }
          this.handle && (this.#t = e, this.#i = t4);
        }
      }
    }
  };
  Pt = class extends Nt {
    #t;
    constructor(e) {
      super(e, `Gzip`), this.#t = e && !!e.portable;
    }
    [kt](e) {
      return this.#t ? (this.#t = false, e[9] = 255, super[kt](e)) : super[kt](e);
    }
  };
  Ft = class extends Nt {
    constructor(e) {
      super(e, `Unzip`);
    }
  };
  It = class extends Mt {
    constructor(e, t4) {
      e ||= {}, e.flush = e.flush || F2.BROTLI_OPERATION_PROCESS, e.finishFlush = e.finishFlush || F2.BROTLI_OPERATION_FINISH, e.fullFlushFlag = F2.BROTLI_OPERATION_FLUSH, super(e, t4);
    }
  };
  Lt = class extends It {
    constructor(e) {
      super(e, `BrotliCompress`);
    }
  };
  Rt = class extends It {
    constructor(e) {
      super(e, `BrotliDecompress`);
    }
  };
  zt = class extends Mt {
    constructor(e, t4) {
      e ||= {}, e.flush = e.flush || F2.ZSTD_e_continue, e.finishFlush = e.finishFlush || F2.ZSTD_e_end, e.fullFlushFlag = F2.ZSTD_e_flush, super(e, t4);
    }
  };
  Bt = class extends zt {
    constructor(e) {
      super(e, `ZstdCompress`);
    }
  };
  Vt = class extends zt {
    constructor(e) {
      super(e, `ZstdDecompress`);
    }
  };
  Xt = {};
  ue(Xt, {
    code: () => tn,
    isCode: () => Zt,
    isName: () => Qt,
    name: () => en,
    normalFsTypes: () => $t
  });
  $t = new Set([
    `0`,
    ``,
    `1`,
    `2`,
    `3`,
    `4`,
    `5`,
    `6`,
    `7`,
    `D`
  ]);
  en = new Map([
    [`0`, `File`],
    [``, `OldFile`],
    [`1`, `Link`],
    [`2`, `SymbolicLink`],
    [`3`, `CharacterDevice`],
    [`4`, `BlockDevice`],
    [`5`, `Directory`],
    [`6`, `FIFO`],
    [`7`, `ContiguousFile`],
    [`g`, `GlobalExtendedHeader`],
    [`x`, `ExtendedHeader`],
    [`A`, `SolarisACL`],
    [`D`, `GNUDumpDir`],
    [`I`, `Inode`],
    [`K`, `NextFileHasLongLinkpath`],
    [`L`, `NextFileHasLongPath`],
    [`M`, `ContinuationFile`],
    [`N`, `OldGnuLongPath`],
    [`S`, `SparseFile`],
    [`V`, `TapeVolumeHeader`],
    [`X`, `OldExtendedHeader`]
  ]);
  tn = new Map(Array.from(en).map((e) => [e[1], e[0]]));
  ln = {
    12: 8589934591,
    8: 2097151
  };
  mn = Array(156).join(`\x00`);
  z2 = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === `win32` ? (e2) => e2 && e2.replaceAll(/\\/g, `/`) : (e2) => e2;
  bn = class extends Ue {
    extended;
    globalExtended;
    header;
    startBlockSize;
    blockRemain;
    remain;
    type;
    meta = false;
    ignore = false;
    path;
    mode;
    uid;
    gid;
    uname;
    gname;
    size = 0;
    mtime;
    atime;
    ctime;
    linkpath;
    dev;
    ino;
    nlink;
    invalid = false;
    absolute;
    unsupported = false;
    constructor(e2, t4, n4) {
      switch (super({}), this.pause(), this.extended = t4, this.globalExtended = n4, this.header = e2, this.remain = e2.size ?? 0, this.startBlockSize = 512 * Math.ceil(this.remain / 512), this.blockRemain = this.startBlockSize, this.type = e2.type, this.type) {
        case `File`:
        case `OldFile`:
        case `Link`:
        case `SymbolicLink`:
        case `CharacterDevice`:
        case `BlockDevice`:
        case `Directory`:
        case `FIFO`:
        case `ContiguousFile`:
        case `GNUDumpDir`:
          break;
        case `NextFileHasLongLinkpath`:
        case `NextFileHasLongPath`:
        case `OldGnuLongPath`:
        case `GlobalExtendedHeader`:
        case `ExtendedHeader`:
        case `OldExtendedHeader`:
          this.meta = true;
          break;
        default:
          this.ignore = true;
      }
      if (!e2.path)
        throw Error(`no path provided for tar.ReadEntry`);
      this.path = z2(e2.path), this.mode = e2.mode, this.mode && (this.mode &= 4095), this.uid = e2.uid, this.gid = e2.gid, this.uname = e2.uname, this.gname = e2.gname, this.size = this.remain, this.mtime = e2.mtime, this.atime = e2.atime, this.ctime = e2.ctime, this.linkpath = e2.linkpath ? z2(e2.linkpath) : undefined, this.uname = e2.uname, this.gname = e2.gname, t4 && this.#t(t4), n4 && this.#t(n4, true);
    }
    write(e2) {
      let t4 = e2.length;
      if (t4 > this.blockRemain)
        throw Error(`writing more to entry than is appropriate`);
      let n4 = this.remain, r4 = this.blockRemain;
      return this.remain = Math.max(0, n4 - t4), this.blockRemain = Math.max(0, r4 - t4), this.ignore ? true : n4 >= t4 ? super.write(e2) : super.write(e2.subarray(0, n4));
    }
    #t(e2, t4 = false) {
      e2.path &&= z2(e2.path), e2.linkpath &&= z2(e2.linkpath), Object.assign(this, Object.fromEntries(Object.entries(e2).filter(([e3, n4]) => !(n4 == null || e3 === `path` && t4))));
    }
  };
  Sn = 1024 * 1024;
  Cn = Buffer.from([31, 139]);
  wn = Buffer.from([
    40,
    181,
    47,
    253
  ]);
  Tn = Math.max(Cn.length, wn.length);
  B2 = Symbol(`state`);
  En = Symbol(`writeEntry`);
  V3 = Symbol(`readEntry`);
  Dn = Symbol(`nextEntry`);
  On = Symbol(`processEntry`);
  H2 = Symbol(`extendedHeader`);
  kn = Symbol(`globalExtendedHeader`);
  U3 = Symbol(`meta`);
  An = Symbol(`emitMeta`);
  W3 = Symbol(`buffer`);
  G2 = Symbol(`queue`);
  K2 = Symbol(`ended`);
  jn = Symbol(`emittedEnd`);
  Mn = Symbol(`emit`);
  q2 = Symbol(`unzip`);
  Nn = Symbol(`consumeChunk`);
  Pn = Symbol(`consumeChunkSub`);
  Fn = Symbol(`consumeBody`);
  In = Symbol(`consumeMeta`);
  Ln = Symbol(`consumeHeader`);
  Rn = Symbol(`consuming`);
  zn = Symbol(`bufferConcat`);
  Bn = Symbol(`maybeEnd`);
  Vn = Symbol(`writing`);
  J2 = Symbol(`aborted`);
  Hn = Symbol(`onDone`);
  Un = Symbol(`sawValidEntry`);
  Wn = Symbol(`sawNullBlock`);
  Gn = Symbol(`sawEOF`);
  Kn = Symbol(`closeStream`);
  Jn = class extends u5 {
    file;
    strict;
    maxMetaEntrySize;
    filter;
    brotli;
    zstd;
    writable = true;
    readable = false;
    [G2] = [];
    [W3];
    [V3];
    [En];
    [B2] = `begin`;
    [U3] = ``;
    [H2];
    [kn];
    [K2] = false;
    [q2];
    [J2] = false;
    [Un];
    [Wn] = false;
    [Gn] = false;
    [Vn] = false;
    [Rn] = false;
    [jn] = false;
    constructor(e2 = {}) {
      super(), this.file = e2.file || ``, this.on(Hn, () => {
        (this[B2] === `begin` || this[Un] === false) && this.warn(`TAR_BAD_ARCHIVE`, `Unrecognized archive format`);
      }), e2.ondone ? this.on(Hn, e2.ondone) : this.on(Hn, () => {
        this.emit(`prefinish`), this.emit(`finish`), this.emit(`end`);
      }), this.strict = !!e2.strict, this.maxMetaEntrySize = e2.maxMetaEntrySize || Sn, this.filter = typeof e2.filter == `function` ? e2.filter : qn;
      let t4 = e2.file && (e2.file.endsWith(`.tar.br`) || e2.file.endsWith(`.tbr`));
      this.brotli = !(e2.gzip || e2.zstd) && e2.brotli !== undefined ? e2.brotli : t4 ? undefined : false;
      let n4 = e2.file && (e2.file.endsWith(`.tar.zst`) || e2.file.endsWith(`.tzst`));
      this.zstd = !(e2.gzip || e2.brotli) && e2.zstd !== undefined ? e2.zstd : n4 ? true : undefined, this.on(`end`, () => this[Kn]()), typeof e2.onwarn == `function` && this.on(`warn`, e2.onwarn), typeof e2.onReadEntry == `function` && this.on(`entry`, e2.onReadEntry);
    }
    warn(e2, t4, n4 = {}) {
      xn(this, e2, t4, n4);
    }
    [Ln](e2, t4) {
      this[Un] === undefined && (this[Un] = false);
      let n4;
      try {
        n4 = new I3(e2, t4, this[H2], this[kn]);
      } catch (e3) {
        return this.warn(`TAR_ENTRY_INVALID`, e3);
      }
      if (n4.nullBlock)
        this[Wn] ? (this[Gn] = true, this[B2] === `begin` && (this[B2] = `header`), this[Mn](`eof`)) : (this[Wn] = true, this[Mn](`nullBlock`));
      else if (this[Wn] = false, !n4.cksumValid)
        this.warn(`TAR_ENTRY_INVALID`, `checksum failure`, { header: n4 });
      else if (!n4.path)
        this.warn(`TAR_ENTRY_INVALID`, `path is required`, { header: n4 });
      else {
        let e3 = n4.type;
        if (/^(Symbolic)?Link$/.test(e3) && !n4.linkpath)
          this.warn(`TAR_ENTRY_INVALID`, `linkpath required`, { header: n4 });
        else if (!/^(Symbolic)?Link$/.test(e3) && !/^(Global)?ExtendedHeader$/.test(e3) && n4.linkpath)
          this.warn(`TAR_ENTRY_INVALID`, `linkpath forbidden`, { header: n4 });
        else {
          let e4 = this[En] = new bn(n4, this[H2], this[kn]);
          this[Un] || (e4.remain ? e4.on(`end`, () => {
            e4.invalid || (this[Un] = true);
          }) : this[Un] = true), e4.meta ? e4.size > this.maxMetaEntrySize ? (e4.ignore = true, this[Mn](`ignoredEntry`, e4), this[B2] = `ignore`, e4.resume()) : e4.size > 0 && (this[U3] = ``, e4.on(`data`, (e5) => this[U3] += e5), this[B2] = `meta`) : (this[H2] = undefined, e4.ignore = e4.ignore || !this.filter(e4.path, e4), e4.ignore ? (this[Mn](`ignoredEntry`, e4), this[B2] = e4.remain ? `ignore` : `header`, e4.resume()) : (e4.remain ? this[B2] = `body` : (this[B2] = `header`, e4.end()), this[V3] ? this[G2].push(e4) : (this[G2].push(e4), this[Dn]())));
        }
      }
    }
    [Kn]() {
      queueMicrotask(() => this.emit(`close`));
    }
    [On](e2) {
      let t4 = true;
      if (!e2)
        this[V3] = undefined, t4 = false;
      else if (Array.isArray(e2)) {
        let [t5, ...n4] = e2;
        this.emit(t5, ...n4);
      } else
        this[V3] = e2, this.emit(`entry`, e2), e2.emittedEnd || (e2.on(`end`, () => this[Dn]()), t4 = false);
      return t4;
    }
    [Dn]() {
      do
        ;
      while (this[On](this[G2].shift()));
      if (this[G2].length === 0) {
        let e2 = this[V3];
        !e2 || e2.flowing || e2.size === e2.remain ? this[Vn] || this.emit(`drain`) : e2.once(`drain`, () => this.emit(`drain`));
      }
    }
    [Fn](e2, t4) {
      let n4 = this[En];
      if (!n4)
        throw Error(`attempt to consume body without entry??`);
      let r4 = n4.blockRemain ?? 0, i4 = r4 >= e2.length && t4 === 0 ? e2 : e2.subarray(t4, t4 + r4);
      return n4.write(i4), n4.blockRemain || (this[B2] = `header`, this[En] = undefined, n4.end()), i4.length;
    }
    [In](e2, t4) {
      let n4 = this[En], r4 = this[Fn](e2, t4);
      return !this[En] && n4 && this[An](n4), r4;
    }
    [Mn](e2, t4, n4) {
      this[G2].length === 0 && !this[V3] ? this.emit(e2, t4, n4) : this[G2].push([
        e2,
        t4,
        n4
      ]);
    }
    [An](e2) {
      switch (this[Mn](`meta`, this[U3]), e2.type) {
        case `ExtendedHeader`:
        case `OldExtendedHeader`:
          this[H2] = gn.parse(this[U3], this[H2], false);
          break;
        case `GlobalExtendedHeader`:
          this[kn] = gn.parse(this[U3], this[kn], true);
          break;
        case `NextFileHasLongPath`:
        case `OldGnuLongPath`: {
          let e3 = this[H2] ?? Object.create(null);
          this[H2] = e3, e3.path = this[U3].replace(/\0.*/, ``);
          break;
        }
        case `NextFileHasLongLinkpath`: {
          let e3 = this[H2] || Object.create(null);
          this[H2] = e3, e3.linkpath = this[U3].replace(/\0.*/, ``);
          break;
        }
        default:
          throw Error(`unknown meta: ` + e2.type);
      }
    }
    abort(e2) {
      this[J2] = true, this.emit(`abort`, e2), this.warn(`TAR_ABORT`, e2, { recoverable: false });
    }
    write(e2, t4, n4) {
      if (typeof t4 == `function` && (n4 = t4, t4 = undefined), typeof e2 == `string` && (e2 = Buffer.from(e2, typeof t4 == `string` ? t4 : `utf8`)), this[J2])
        return n4?.(), false;
      if ((this[q2] === undefined || this.brotli === undefined && this[q2] === false) && e2) {
        if (this[W3] && (e2 = Buffer.concat([this[W3], e2]), this[W3] = undefined), e2.length < Tn)
          return this[W3] = e2, n4?.(), true;
        for (let t6 = 0;this[q2] === undefined && t6 < Cn.length; t6++)
          e2[t6] !== Cn[t6] && (this[q2] = false);
        let t5 = false;
        if (this[q2] === false && this.zstd !== false) {
          t5 = true;
          for (let n5 = 0;n5 < wn.length; n5++)
            if (e2[n5] !== wn[n5]) {
              t5 = false;
              break;
            }
        }
        let r5 = this.brotli === undefined && !t5;
        if (this[q2] === false && r5)
          if (e2.length < 512)
            if (this[K2])
              this.brotli = true;
            else
              return this[W3] = e2, n4?.(), true;
          else
            try {
              new I3(e2.subarray(0, 512)), this.brotli = false;
            } catch {
              this.brotli = true;
            }
        if (this[q2] === undefined || this[q2] === false && (this.brotli || t5)) {
          let r6 = this[K2];
          this[K2] = false, this[q2] = this[q2] === undefined ? new Ft({}) : t5 ? new Vt({}) : new Rt({}), this[q2].on(`data`, (e3) => this[Nn](e3)), this[q2].on(`error`, (e3) => this.abort(e3)), this[q2].on(`end`, () => {
            this[K2] = true, this[Nn]();
          }), this[Vn] = true;
          let i4 = !!this[q2][r6 ? `end` : `write`](e2);
          return this[Vn] = false, n4?.(), i4;
        }
      }
      this[Vn] = true, this[q2] ? this[q2].write(e2) : this[Nn](e2), this[Vn] = false;
      let r4 = this[G2].length > 0 ? false : this[V3] ? this[V3].flowing : true;
      return !r4 && this[G2].length === 0 && this[V3]?.once(`drain`, () => this.emit(`drain`)), n4?.(), r4;
    }
    [zn](e2) {
      e2 && !this[J2] && (this[W3] = this[W3] ? Buffer.concat([this[W3], e2]) : e2);
    }
    [Bn]() {
      if (this[K2] && !this[jn] && !this[J2] && !this[Rn]) {
        this[jn] = true;
        let e2 = this[En];
        if (e2 && e2.blockRemain) {
          let t4 = this[W3] ? this[W3].length : 0;
          this.warn(`TAR_BAD_ARCHIVE`, `Truncated input (needed ${e2.blockRemain} more bytes, only ${t4} available)`, { entry: e2 }), this[W3] && e2.write(this[W3]), e2.end();
        }
        this[Mn](Hn);
      }
    }
    [Nn](e2) {
      if (this[Rn] && e2)
        this[zn](e2);
      else if (!e2 && !this[W3])
        this[Bn]();
      else if (e2) {
        if (this[Rn] = true, this[W3]) {
          this[zn](e2);
          let t4 = this[W3];
          this[W3] = undefined, this[Pn](t4);
        } else
          this[Pn](e2);
        for (;this[W3] && this[W3]?.length >= 512 && !this[J2] && !this[Gn]; ) {
          let e3 = this[W3];
          this[W3] = undefined, this[Pn](e3);
        }
        this[Rn] = false;
      }
      (!this[W3] || this[K2]) && this[Bn]();
    }
    [Pn](e2) {
      let t4 = 0, n4 = e2.length;
      for (;t4 + 512 <= n4 && !this[J2] && !this[Gn]; )
        switch (this[B2]) {
          case `begin`:
          case `header`:
            this[Ln](e2, t4), t4 += 512;
            break;
          case `ignore`:
          case `body`:
            t4 += this[Fn](e2, t4);
            break;
          case `meta`:
            t4 += this[In](e2, t4);
            break;
          default:
            throw Error(`invalid state: ` + this[B2]);
        }
      t4 < n4 && (this[W3] = this[W3] ? Buffer.concat([e2.subarray(t4), this[W3]]) : e2.subarray(t4));
    }
    end(e2, t4, n4) {
      return typeof e2 == `function` && (n4 = e2, t4 = undefined, e2 = undefined), typeof t4 == `function` && (n4 = t4, t4 = undefined), typeof e2 == `string` && (e2 = Buffer.from(e2, t4)), n4 && this.once(`finish`, n4), this[J2] || (this[q2] ? (e2 && this[q2].write(e2), this[q2].end()) : (this[K2] = true, (this.brotli === undefined || this.zstd === undefined) && (e2 ||= Buffer.alloc(0)), e2 && this.write(e2), this[Bn]())), this;
    }
  };
  Qn = Ct((e2) => {
    let n4 = new Jn(e2), r4 = e2.file, i4;
    try {
      i4 = t3.openSync(r4, `r`);
      let a4 = t3.fstatSync(i4), o4 = e2.maxReadSize || 16 * 1024 * 1024;
      if (a4.size < o4) {
        let e3 = Buffer.allocUnsafe(a4.size), r5 = t3.readSync(i4, e3, 0, a4.size, 0);
        n4.end(r5 === e3.byteLength ? e3 : e3.subarray(0, r5));
      } else {
        let e3 = 0, r5 = Buffer.allocUnsafe(o4);
        for (;e3 < a4.size; ) {
          let a5 = t3.readSync(i4, r5, 0, o4, e3);
          if (a5 === 0)
            break;
          e3 += a5, n4.write(r5.subarray(0, a5));
        }
        n4.end();
      }
    } finally {
      if (typeof i4 == `number`)
        try {
          t3.closeSync(i4);
        } catch {}
    }
  }, (e2, n4) => {
    let r4 = new Jn(e2), i4 = e2.maxReadSize || 16 * 1024 * 1024, a4 = e2.file;
    return new Promise((e3, n5) => {
      r4.on(`error`, n5), r4.on(`end`, e3), t3.stat(a4, (e4, t4) => {
        if (e4)
          n5(e4);
        else {
          let e5 = new dt(a4, {
            readSize: i4,
            size: t4.size
          });
          e5.on(`error`, n5), e5.pipe(r4);
        }
      });
    });
  }, (e2) => new Jn(e2), (e2) => new Jn(e2), (e2, t4) => {
    t4?.length && Zn(e2, t4), e2.noResume || Xn(e2);
  });
  ({ isAbsolute: er, parse: tr } = c3);
  rr = [
    `|`,
    `<`,
    `>`,
    `?`,
    `:`
  ];
  ir = rr.map((e2) => String.fromCodePoint(61440 + Number(e2.codePointAt(0))));
  ar = new Map(rr.map((e2, t4) => [e2, ir[t4]]));
  or = new Map(ir.map((e2, t4) => [e2, rr[t4]]));
  ur = 16 * 1024 * 1024;
  dr = Symbol(`process`);
  fr = Symbol(`file`);
  pr = Symbol(`directory`);
  mr = Symbol(`symlink`);
  hr = Symbol(`hardlink`);
  gr = Symbol(`header`);
  _r = Symbol(`read`);
  vr = Symbol(`lstat`);
  yr = Symbol(`onlstat`);
  br = Symbol(`onread`);
  xr = Symbol(`onreadlink`);
  Sr = Symbol(`openfile`);
  Cr = Symbol(`onopenfile`);
  wr = Symbol(`close`);
  Tr = Symbol(`mode`);
  Er = Symbol(`awaitDrain`);
  Dr = Symbol(`ondrain`);
  Y2 = Symbol(`prefix`);
  Or = class extends Ue {
    path;
    portable;
    myuid = process.getuid && process.getuid() || 0;
    myuser = process.env.USER || ``;
    maxReadSize;
    linkCache;
    statCache;
    preservePaths;
    cwd;
    strict;
    mtime;
    noPax;
    noMtime;
    prefix;
    fd;
    blockLen = 0;
    blockRemain = 0;
    buf;
    pos = 0;
    remain = 0;
    length = 0;
    offset = 0;
    win32;
    absolute;
    header;
    type;
    linkpath;
    stat;
    onWriteEntry;
    #t = false;
    constructor(e2, t4 = {}) {
      let n4 = St(t4);
      super(), this.path = z2(e2), this.portable = !!n4.portable, this.maxReadSize = n4.maxReadSize || ur, this.linkCache = n4.linkCache || /* @__PURE__ */ new Map, this.statCache = n4.statCache || /* @__PURE__ */ new Map, this.preservePaths = !!n4.preservePaths, this.cwd = z2(n4.cwd || process.cwd()), this.strict = !!n4.strict, this.noPax = !!n4.noPax, this.noMtime = !!n4.noMtime, this.mtime = n4.mtime, this.prefix = n4.prefix ? z2(n4.prefix) : undefined, this.onWriteEntry = n4.onWriteEntry, typeof n4.onwarn == `function` && this.on(`warn`, n4.onwarn);
      let r4 = false;
      if (!this.preservePaths) {
        let [e3, t5] = nr(this.path);
        e3 && typeof t5 == `string` && (this.path = t5, r4 = e3);
      }
      this.win32 = !!n4.win32 || process.platform === `win32`, this.win32 && (this.path = cr(this.path.replaceAll(/\\/g, `/`)), e2 = e2.replaceAll(/\\/g, `/`)), this.absolute = z2(n4.absolute || p3.resolve(this.cwd, e2)), this.path === `` && (this.path = `./`), r4 && this.warn(`TAR_ENTRY_INFO`, `stripping ${r4} from absolute path`, {
        entry: this,
        path: r4 + this.path
      });
      let i4 = this.statCache.get(this.absolute);
      i4 ? this[yr](i4) : this[vr]();
    }
    warn(e2, t4, n4 = {}) {
      return xn(this, e2, t4, n4);
    }
    emit(e2, ...t4) {
      return e2 === `error` && (this.#t = true), super.emit(e2, ...t4);
    }
    [vr]() {
      d2.lstat(this.absolute, (e2, t4) => {
        if (e2)
          return this.emit(`error`, e2);
        this[yr](t4);
      });
    }
    [yr](e2) {
      this.statCache.set(this.absolute, e2), this.stat = e2, e2.isFile() || (e2.size = 0), this.type = jr(e2), this.emit(`stat`, e2), this[dr]();
    }
    [dr]() {
      switch (this.type) {
        case `File`:
          return this[fr]();
        case `Directory`:
          return this[pr]();
        case `SymbolicLink`:
          return this[mr]();
        default:
          return this.end();
      }
    }
    [Tr](e2) {
      return $n(e2, this.type === `Directory`, this.portable);
    }
    [Y2](e2) {
      return lr(e2, this.prefix);
    }
    [gr]() {
      if (!this.stat)
        throw Error(`cannot write header before stat`);
      this.type === `Directory` && this.portable && (this.noMtime = true), this.onWriteEntry?.(this), this.header = new I3({
        path: this[Y2](this.path),
        linkpath: this.type === `Link` && this.linkpath !== undefined ? this[Y2](this.linkpath) : this.linkpath,
        mode: this[Tr](this.stat.mode),
        uid: this.portable ? undefined : this.stat.uid,
        gid: this.portable ? undefined : this.stat.gid,
        size: this.stat.size,
        mtime: this.noMtime ? undefined : this.mtime || this.stat.mtime,
        type: this.type === `Unsupported` ? undefined : this.type,
        uname: this.portable ? undefined : this.stat.uid === this.myuid ? this.myuser : ``,
        atime: this.portable ? undefined : this.stat.atime,
        ctime: this.portable ? undefined : this.stat.ctime
      }), this.header.encode() && !this.noPax && super.write(new gn({
        atime: this.portable ? undefined : this.header.atime,
        ctime: this.portable ? undefined : this.header.ctime,
        gid: this.portable ? undefined : this.header.gid,
        mtime: this.noMtime ? undefined : this.mtime || this.header.mtime,
        path: this[Y2](this.path),
        linkpath: this.type === `Link` && this.linkpath !== undefined ? this[Y2](this.linkpath) : this.linkpath,
        size: this.header.size,
        uid: this.portable ? undefined : this.header.uid,
        uname: this.portable ? undefined : this.header.uname,
        dev: this.portable ? undefined : this.stat.dev,
        ino: this.portable ? undefined : this.stat.ino,
        nlink: this.portable ? undefined : this.stat.nlink
      }).encode());
      let e2 = this.header?.block;
      if (!e2)
        throw Error(`failed to encode header`);
      super.write(e2);
    }
    [pr]() {
      if (!this.stat)
        throw Error(`cannot create directory entry without stat`);
      this.path.slice(-1) !== `/` && (this.path += `/`), this.stat.size = 0, this[gr](), this.end();
    }
    [mr]() {
      d2.readlink(this.absolute, (e2, t4) => {
        if (e2)
          return this.emit(`error`, e2);
        this[xr](t4);
      });
    }
    [xr](e2) {
      this.linkpath = z2(e2), this[gr](), this.end();
    }
    [hr](e2) {
      if (!this.stat)
        throw Error(`cannot create link entry without stat`);
      this.type = `Link`, this.linkpath = z2(p3.relative(this.cwd, e2)), this.stat.size = 0, this[gr](), this.end();
    }
    [fr]() {
      if (!this.stat)
        throw Error(`cannot create file entry without stat`);
      if (this.stat.nlink > 1) {
        let e2 = `${this.stat.dev}:${this.stat.ino}`, t4 = this.linkCache.get(e2);
        if (t4?.indexOf(this.cwd) === 0)
          return this[hr](t4);
        this.linkCache.set(e2, this.absolute);
      }
      if (this[gr](), this.stat.size === 0)
        return this.end();
      this[Sr]();
    }
    [Sr]() {
      d2.open(this.absolute, `r`, (e2, t4) => {
        if (e2)
          return this.emit(`error`, e2);
        this[Cr](t4);
      });
    }
    [Cr](e2) {
      if (this.fd = e2, this.#t)
        return this[wr]();
      if (!this.stat)
        throw Error(`should stat before calling onopenfile`);
      this.blockLen = 512 * Math.ceil(this.stat.size / 512), this.blockRemain = this.blockLen;
      let t4 = Math.min(this.blockLen, this.maxReadSize);
      this.buf = Buffer.allocUnsafe(t4), this.offset = 0, this.pos = 0, this.remain = this.stat.size, this.length = this.buf.length, this[_r]();
    }
    [_r]() {
      let { fd: e2, buf: t4, offset: n4, length: r4, pos: i4 } = this;
      if (e2 === undefined || t4 === undefined)
        throw Error(`cannot read file without first opening`);
      d2.read(e2, t4, n4, r4, i4, (e3, t5) => {
        if (e3)
          return this[wr](() => this.emit(`error`, e3));
        this[br](t5);
      });
    }
    [wr](e2 = () => {}) {
      this.fd !== undefined && d2.close(this.fd, e2);
    }
    [br](e2) {
      if (e2 <= 0 && this.remain > 0) {
        let e3 = Object.assign(Error(`encountered unexpected EOF`), {
          path: this.absolute,
          syscall: `read`,
          code: `EOF`
        });
        return this[wr](() => this.emit(`error`, e3));
      }
      if (e2 > this.remain) {
        let e3 = Object.assign(Error(`did not encounter expected EOF`), {
          path: this.absolute,
          syscall: `read`,
          code: `EOF`
        });
        return this[wr](() => this.emit(`error`, e3));
      }
      if (!this.buf)
        throw Error(`should have created buffer prior to reading`);
      if (e2 === this.remain)
        for (let t5 = e2;t5 < this.length && e2 < this.blockRemain; t5++)
          this.buf[t5 + this.offset] = 0, e2++, this.remain++;
      let t4 = this.offset === 0 && e2 === this.buf.length ? this.buf : this.buf.subarray(this.offset, this.offset + e2);
      this.write(t4) ? this[Dr]() : this[Er](() => this[Dr]());
    }
    [Er](e2) {
      this.once(`drain`, e2);
    }
    write(e2, t4, n4) {
      if (typeof t4 == `function` && (n4 = t4, t4 = undefined), typeof e2 == `string` && (e2 = Buffer.from(e2, typeof t4 == `string` ? t4 : `utf8`)), this.blockRemain < e2.length) {
        let e3 = Object.assign(Error(`writing more data than expected`), { path: this.absolute });
        return this.emit(`error`, e3);
      }
      return this.remain -= e2.length, this.blockRemain -= e2.length, this.pos += e2.length, this.offset += e2.length, super.write(e2, null, n4);
    }
    [Dr]() {
      if (!this.remain)
        return this.blockRemain && super.write(Buffer.alloc(this.blockRemain)), this[wr]((e2) => e2 ? this.emit(`error`, e2) : this.end());
      if (!this.buf)
        throw Error(`buffer lost somehow in ONDRAIN`);
      this.offset >= this.length && (this.buf = Buffer.allocUnsafe(Math.min(this.blockRemain, this.buf.length)), this.offset = 0), this.length = this.buf.length - this.offset, this[_r]();
    }
  };
  kr = class extends Or {
    sync = true;
    [vr]() {
      this[yr](d2.lstatSync(this.absolute));
    }
    [mr]() {
      this[xr](d2.readlinkSync(this.absolute));
    }
    [Sr]() {
      this[Cr](d2.openSync(this.absolute, `r`));
    }
    [_r]() {
      let e2 = true;
      try {
        let { fd: t4, buf: n4, offset: r4, length: i4, pos: a4 } = this;
        if (t4 === undefined || n4 === undefined)
          throw Error(`fd and buf must be set in READ method`);
        let o4 = d2.readSync(t4, n4, r4, i4, a4);
        this[br](o4), e2 = false;
      } finally {
        if (e2)
          try {
            this[wr](() => {});
          } catch {}
      }
    }
    [Er](e2) {
      e2();
    }
    [wr](e2 = () => {}) {
      this.fd !== undefined && d2.closeSync(this.fd), e2();
    }
  };
  Ar = class extends Ue {
    blockLen = 0;
    blockRemain = 0;
    buf = 0;
    pos = 0;
    remain = 0;
    length = 0;
    preservePaths;
    portable;
    strict;
    noPax;
    noMtime;
    readEntry;
    type;
    prefix;
    path;
    mode;
    uid;
    gid;
    uname;
    gname;
    header;
    mtime;
    atime;
    ctime;
    linkpath;
    size;
    onWriteEntry;
    warn(e2, t4, n4 = {}) {
      return xn(this, e2, t4, n4);
    }
    constructor(e2, t4 = {}) {
      let n4 = St(t4);
      super(), this.preservePaths = !!n4.preservePaths, this.portable = !!n4.portable, this.strict = !!n4.strict, this.noPax = !!n4.noPax, this.noMtime = !!n4.noMtime, this.onWriteEntry = n4.onWriteEntry, this.readEntry = e2;
      let { type: r4 } = e2;
      if (r4 === `Unsupported`)
        throw Error(`writing entry that should be ignored`);
      this.type = r4, this.type === `Directory` && this.portable && (this.noMtime = true), this.prefix = n4.prefix, this.path = z2(e2.path), this.mode = e2.mode === undefined ? undefined : this[Tr](e2.mode), this.uid = this.portable ? undefined : e2.uid, this.gid = this.portable ? undefined : e2.gid, this.uname = this.portable ? undefined : e2.uname, this.gname = this.portable ? undefined : e2.gname, this.size = e2.size, this.mtime = this.noMtime ? undefined : n4.mtime || e2.mtime, this.atime = this.portable ? undefined : e2.atime, this.ctime = this.portable ? undefined : e2.ctime, this.linkpath = e2.linkpath === undefined ? undefined : z2(e2.linkpath), typeof n4.onwarn == `function` && this.on(`warn`, n4.onwarn);
      let i4 = false;
      if (!this.preservePaths) {
        let [e3, t5] = nr(this.path);
        e3 && typeof t5 == `string` && (this.path = t5, i4 = e3);
      }
      this.remain = e2.size, this.blockRemain = e2.startBlockSize, this.onWriteEntry?.(this), this.header = new I3({
        path: this[Y2](this.path),
        linkpath: this.type === `Link` && this.linkpath !== undefined ? this[Y2](this.linkpath) : this.linkpath,
        mode: this.mode,
        uid: this.portable ? undefined : this.uid,
        gid: this.portable ? undefined : this.gid,
        size: this.size,
        mtime: this.noMtime ? undefined : this.mtime,
        type: this.type,
        uname: this.portable ? undefined : this.uname,
        atime: this.portable ? undefined : this.atime,
        ctime: this.portable ? undefined : this.ctime
      }), i4 && this.warn(`TAR_ENTRY_INFO`, `stripping ${i4} from absolute path`, {
        entry: this,
        path: i4 + this.path
      }), this.header.encode() && !this.noPax && super.write(new gn({
        atime: this.portable ? undefined : this.atime,
        ctime: this.portable ? undefined : this.ctime,
        gid: this.portable ? undefined : this.gid,
        mtime: this.noMtime ? undefined : this.mtime,
        path: this[Y2](this.path),
        linkpath: this.type === `Link` && this.linkpath !== undefined ? this[Y2](this.linkpath) : this.linkpath,
        size: this.size,
        uid: this.portable ? undefined : this.uid,
        uname: this.portable ? undefined : this.uname,
        dev: this.portable ? undefined : this.readEntry.dev,
        ino: this.portable ? undefined : this.readEntry.ino,
        nlink: this.portable ? undefined : this.readEntry.nlink
      }).encode());
      let a4 = this.header?.block;
      if (!a4)
        throw Error(`failed to encode header`);
      super.write(a4), e2.pipe(this);
    }
    [Y2](e2) {
      return lr(e2, this.prefix);
    }
    [Tr](e2) {
      return $n(e2, this.type === `Directory`, this.portable);
    }
    write(e2, t4, n4) {
      typeof t4 == `function` && (n4 = t4, t4 = undefined), typeof e2 == `string` && (e2 = Buffer.from(e2, typeof t4 == `string` ? t4 : `utf8`));
      let r4 = e2.length;
      if (r4 > this.blockRemain)
        throw Error(`writing more to entry than is appropriate`);
      return this.blockRemain -= r4, super.write(e2, n4);
    }
    end(e2, t4, n4) {
      return this.blockRemain && super.write(Buffer.alloc(this.blockRemain)), typeof e2 == `function` && (n4 = e2, t4 = undefined, e2 = undefined), typeof t4 == `function` && (n4 = t4, t4 = undefined), typeof e2 == `string` && (e2 = Buffer.from(e2, t4 ?? `utf8`)), n4 && this.once(`finish`, n4), e2 ? super.end(e2, n4) : super.end(n4), this;
    }
  };
  Mr = class e2 {
    tail;
    head;
    length = 0;
    static create(t4 = []) {
      return new e2(t4);
    }
    constructor(e3 = []) {
      for (let t4 of e3)
        this.push(t4);
    }
    *[Symbol.iterator]() {
      for (let e3 = this.head;e3; e3 = e3.next)
        yield e3.value;
    }
    removeNode(e3) {
      if (e3.list !== this)
        throw Error(`removing node which does not belong to this list`);
      let { next: t4, prev: n4 } = e3;
      return t4 && (t4.prev = n4), n4 && (n4.next = t4), e3 === this.head && (this.head = t4), e3 === this.tail && (this.tail = n4), this.length--, e3.next = undefined, e3.prev = undefined, e3.list = undefined, t4;
    }
    unshiftNode(e3) {
      if (e3 === this.head)
        return;
      e3.list && e3.list.removeNode(e3);
      let t4 = this.head;
      e3.list = this, e3.next = t4, t4 && (t4.prev = e3), this.head = e3, this.tail ||= e3, this.length++;
    }
    pushNode(e3) {
      if (e3 === this.tail)
        return;
      e3.list && e3.list.removeNode(e3);
      let t4 = this.tail;
      e3.list = this, e3.prev = t4, t4 && (t4.next = e3), this.tail = e3, this.head ||= e3, this.length++;
    }
    push(...e3) {
      for (let t4 = 0, n4 = e3.length;t4 < n4; t4++)
        Pr(this, e3[t4]);
      return this.length;
    }
    unshift(...e3) {
      for (var t4 = 0, n4 = e3.length;t4 < n4; t4++)
        Fr(this, e3[t4]);
      return this.length;
    }
    pop() {
      if (!this.tail)
        return;
      let e3 = this.tail.value, t4 = this.tail;
      return this.tail = this.tail.prev, this.tail ? this.tail.next = undefined : this.head = undefined, t4.list = undefined, this.length--, e3;
    }
    shift() {
      if (!this.head)
        return;
      let e3 = this.head.value, t4 = this.head;
      return this.head = this.head.next, this.head ? this.head.prev = undefined : this.tail = undefined, t4.list = undefined, this.length--, e3;
    }
    forEach(e3, t4) {
      t4 ||= this;
      for (let n4 = this.head, r4 = 0;n4; r4++)
        e3.call(t4, n4.value, r4, this), n4 = n4.next;
    }
    forEachReverse(e3, t4) {
      t4 ||= this;
      for (let n4 = this.tail, r4 = this.length - 1;n4; r4--)
        e3.call(t4, n4.value, r4, this), n4 = n4.prev;
    }
    get(e3) {
      let t4 = 0, n4 = this.head;
      for (;n4 && t4 < e3; t4++)
        n4 = n4.next;
      if (t4 === e3 && n4)
        return n4.value;
    }
    getReverse(e3) {
      let t4 = 0, n4 = this.tail;
      for (;n4 && t4 < e3; t4++)
        n4 = n4.prev;
      if (t4 === e3 && n4)
        return n4.value;
    }
    map(t4, n4) {
      n4 ||= this;
      let r4 = new e2;
      for (let e3 = this.head;e3; )
        r4.push(t4.call(n4, e3.value, this)), e3 = e3.next;
      return r4;
    }
    mapReverse(t4, n4) {
      n4 ||= this;
      var r4 = new e2;
      for (let e3 = this.tail;e3; )
        r4.push(t4.call(n4, e3.value, this)), e3 = e3.prev;
      return r4;
    }
    reduce(e3, t4) {
      let n4, r4 = this.head;
      if (arguments.length > 1)
        n4 = t4;
      else if (this.head)
        r4 = this.head.next, n4 = this.head.value;
      else
        throw TypeError(`Reduce of empty list with no initial value`);
      for (var i4 = 0;r4; i4++)
        n4 = e3(n4, r4.value, i4), r4 = r4.next;
      return n4;
    }
    reduceReverse(e3, t4) {
      let n4, r4 = this.tail;
      if (arguments.length > 1)
        n4 = t4;
      else if (this.tail)
        r4 = this.tail.prev, n4 = this.tail.value;
      else
        throw TypeError(`Reduce of empty list with no initial value`);
      for (let t5 = this.length - 1;r4; t5--)
        n4 = e3(n4, r4.value, t5), r4 = r4.prev;
      return n4;
    }
    toArray() {
      let e3 = Array(this.length);
      for (let t4 = 0, n4 = this.head;n4; t4++)
        e3[t4] = n4.value, n4 = n4.next;
      return e3;
    }
    toArrayReverse() {
      let e3 = Array(this.length);
      for (let t4 = 0, n4 = this.tail;n4; t4++)
        e3[t4] = n4.value, n4 = n4.prev;
      return e3;
    }
    slice(t4 = 0, n4 = this.length) {
      n4 < 0 && (n4 += this.length), t4 < 0 && (t4 += this.length);
      let r4 = new e2;
      if (n4 < t4 || n4 < 0)
        return r4;
      t4 < 0 && (t4 = 0), n4 > this.length && (n4 = this.length);
      let i4 = this.head, a4 = 0;
      for (a4 = 0;i4 && a4 < t4; a4++)
        i4 = i4.next;
      for (;i4 && a4 < n4; a4++, i4 = i4.next)
        r4.push(i4.value);
      return r4;
    }
    sliceReverse(t4 = 0, n4 = this.length) {
      n4 < 0 && (n4 += this.length), t4 < 0 && (t4 += this.length);
      let r4 = new e2;
      if (n4 < t4 || n4 < 0)
        return r4;
      t4 < 0 && (t4 = 0), n4 > this.length && (n4 = this.length);
      let i4 = this.length, a4 = this.tail;
      for (;a4 && i4 > n4; i4--)
        a4 = a4.prev;
      for (;a4 && i4 > t4; i4--, a4 = a4.prev)
        r4.push(a4.value);
      return r4;
    }
    splice(e3, t4 = 0, ...n4) {
      e3 > this.length && (e3 = this.length - 1), e3 < 0 && (e3 = this.length + e3);
      let r4 = this.head;
      for (let t5 = 0;r4 && t5 < e3; t5++)
        r4 = r4.next;
      let i4 = [];
      for (let e4 = 0;r4 && e4 < t4; e4++)
        i4.push(r4.value), r4 = this.removeNode(r4);
      r4 ? r4 !== this.tail && (r4 = r4.prev) : r4 = this.tail;
      for (let e4 of n4)
        r4 = Nr(this, r4, e4);
      return i4;
    }
    reverse() {
      let e3 = this.head, t4 = this.tail;
      for (let t5 = e3;t5; t5 = t5.prev) {
        let e4 = t5.prev;
        t5.prev = t5.next, t5.next = e4;
      }
      return this.head = t4, this.tail = e3, this;
    }
  };
  Rr = Buffer.alloc(1024);
  zr = Symbol(`onStat`);
  Br = Symbol(`ended`);
  X2 = Symbol(`queue`);
  Vr = Symbol(`pendingLinks`);
  Hr = Symbol(`current`);
  Ur = Symbol(`process`);
  Wr = Symbol(`processing`);
  Gr = Symbol(`processJob`);
  Z2 = Symbol(`jobs`);
  Kr = Symbol(`jobDone`);
  qr = Symbol(`addFSEntry`);
  Jr = Symbol(`addTarEntry`);
  Yr = Symbol(`stat`);
  Xr = Symbol(`readdir`);
  Zr = Symbol(`onreaddir`);
  Qr = Symbol(`pipe`);
  $r = Symbol(`entry`);
  ei = Symbol(`entryOpt`);
  ti = Symbol(`writeEntryClass`);
  ni = Symbol(`write`);
  ri = Symbol(`ondrain`);
  ii = class extends Ue {
    sync = false;
    opt;
    cwd;
    maxReadSize;
    preservePaths;
    strict;
    noPax;
    prefix;
    linkCache;
    statCache;
    file;
    portable;
    zip;
    readdirCache;
    noDirRecurse;
    follow;
    noMtime;
    mtime;
    filter;
    jobs;
    [ti];
    onWriteEntry;
    [X2];
    [Vr] = /* @__PURE__ */ new Map;
    [Z2] = 0;
    [Wr] = false;
    [Br] = false;
    constructor(e3 = {}) {
      if (super(), this.opt = e3, this.file = e3.file || ``, this.cwd = e3.cwd || process.cwd(), this.maxReadSize = e3.maxReadSize, this.preservePaths = !!e3.preservePaths, this.strict = !!e3.strict, this.noPax = !!e3.noPax, this.prefix = z2(e3.prefix || ``), this.linkCache = e3.linkCache || /* @__PURE__ */ new Map, this.statCache = e3.statCache || /* @__PURE__ */ new Map, this.readdirCache = e3.readdirCache || /* @__PURE__ */ new Map, this.onWriteEntry = e3.onWriteEntry, this[ti] = Or, typeof e3.onwarn == `function` && this.on(`warn`, e3.onwarn), this.portable = !!e3.portable, e3.gzip || e3.brotli || e3.zstd) {
        if (+!!e3.gzip + +!!e3.brotli + +!!e3.zstd > 1)
          throw TypeError(`gzip, brotli, zstd are mutually exclusive`);
        if (e3.gzip && (typeof e3.gzip != `object` && (e3.gzip = {}), this.portable && (e3.gzip.portable = true), this.zip = new Pt(e3.gzip)), e3.brotli && (typeof e3.brotli != `object` && (e3.brotli = {}), this.zip = new Lt(e3.brotli)), e3.zstd && (typeof e3.zstd != `object` && (e3.zstd = {}), this.zip = new Bt(e3.zstd)), !this.zip)
          throw Error(`impossible`);
        let t4 = this.zip;
        t4.on(`data`, (e4) => super.write(e4)), t4.on(`end`, () => super.end()), t4.on(`drain`, () => this[ri]()), this.on(`resume`, () => t4.resume());
      } else
        this.on(`drain`, this[ri]);
      this.noDirRecurse = !!e3.noDirRecurse, this.follow = !!e3.follow, this.noMtime = !!e3.noMtime, e3.mtime && (this.mtime = e3.mtime), this.filter = typeof e3.filter == `function` ? e3.filter : () => true, this[X2] = new Mr, this[Z2] = 0, this.jobs = Number(e3.jobs) || 4, this[Wr] = false, this[Br] = false;
    }
    [ni](e3) {
      return super.write(e3);
    }
    add(e3) {
      return this.write(e3), this;
    }
    end(e3, t4, n4) {
      return typeof e3 == `function` && (n4 = e3, e3 = undefined), typeof t4 == `function` && (n4 = t4, t4 = undefined), e3 && this.add(e3), this[Br] = true, this[Ur](), n4 && n4(), this;
    }
    write(e3) {
      if (this[Br])
        throw Error(`write after end`);
      return typeof e3 == `string` ? this[qr](e3) : this[Jr](e3), this.flowing;
    }
    [Jr](e3) {
      let t4 = z2(p3.resolve(this.cwd, e3.path));
      if (!this.filter(e3.path, e3))
        e3.resume();
      else {
        let n4 = new Lr(e3.path, t4);
        n4.entry = new Ar(e3, this[ei](n4)), n4.entry.on(`end`, () => this[Kr](n4)), this[Z2] += 1, this[X2].push(n4);
      }
      this[Ur]();
    }
    [qr](e3) {
      let t4 = z2(p3.resolve(this.cwd, e3));
      this[X2].push(new Lr(e3, t4)), this[Ur]();
    }
    [Yr](e3) {
      e3.pending = true, this[Z2] += 1, d2[this.follow ? `stat` : `lstat`](e3.absolute, (t4, n4) => {
        e3.pending = false, --this[Z2], t4 ? this.emit(`error`, t4) : this[zr](e3, n4);
      });
    }
    [zr](e3, t4) {
      if (this.statCache.set(e3.absolute, t4), e3.stat = t4, !this.filter(e3.path, t4))
        e3.ignore = true;
      else if (t4.isFile() && t4.nlink > 1 && !this.linkCache.get(`${t4.dev}:${t4.ino}`) && !this.sync)
        if (e3 === this[Hr])
          this[Gr](e3);
        else {
          let n4 = `${t4.dev}:${t4.ino}`, r4 = this[Vr].get(n4);
          r4 ? r4.push(e3) : this[Vr].set(n4, [e3]), e3.pendingLink = true, e3.pending = true;
        }
      this[Ur]();
    }
    [Xr](e3) {
      e3.pending = true, this[Z2] += 1, d2.readdir(e3.absolute, (t4, n4) => {
        if (e3.pending = false, --this[Z2], t4)
          return this.emit(`error`, t4);
        this[Zr](e3, n4);
      });
    }
    [Zr](e3, t4) {
      this.readdirCache.set(e3.absolute, t4), e3.readdir = t4, this[Ur]();
    }
    [Ur]() {
      if (!this[Wr]) {
        this[Wr] = true;
        for (let e3 = this[X2].head;e3 && this[Z2] < this.jobs; e3 = e3.next)
          if (this[Gr](e3.value), e3.value.ignore) {
            let t4 = e3.next;
            this[X2].removeNode(e3), e3.next = t4;
          }
        this[Wr] = false, this[Br] && this[X2].length === 0 && this[Z2] === 0 && (this.zip ? this.zip.end(Rr) : (super.write(Rr), super.end()));
      }
    }
    get [Hr]() {
      return this[X2] && this[X2].head && this[X2].head.value;
    }
    [Kr](e3) {
      this[X2].shift(), --this[Z2];
      let { stat: t4 } = e3;
      if (t4 && t4.isFile() && t4.nlink > 1) {
        let e4 = `${t4.dev}:${t4.ino}`, n4 = this[Vr].get(e4);
        if (n4) {
          this[Vr].delete(e4);
          for (let e5 of n4)
            e5.pending = false, this[Gr](e5);
        }
      }
      this[Ur]();
    }
    [Gr](e3) {
      if (e3.pending && e3.pendingLink && e3 === this[Hr] && (e3.pending = false, e3.pendingLink = false), !e3.pending) {
        if (e3.entry) {
          e3 === this[Hr] && !e3.piped && this[Qr](e3);
          return;
        }
        if (!e3.stat) {
          let t4 = this.statCache.get(e3.absolute);
          t4 ? this[zr](e3, t4) : this[Yr](e3);
        }
        if (e3.stat && !e3.ignore) {
          if (!this.noDirRecurse && e3.stat.isDirectory() && !e3.readdir) {
            let t4 = this.readdirCache.get(e3.absolute);
            if (t4 ? this[Zr](e3, t4) : this[Xr](e3), !e3.readdir)
              return;
          }
          if (e3.entry = this[$r](e3), !e3.entry) {
            e3.ignore = true;
            return;
          }
          e3 === this[Hr] && !e3.piped && this[Qr](e3);
        }
      }
    }
    [ei](e3) {
      return {
        onwarn: (e4, t4, n4) => this.warn(e4, t4, n4),
        noPax: this.noPax,
        cwd: this.cwd,
        absolute: e3.absolute,
        preservePaths: this.preservePaths,
        maxReadSize: this.maxReadSize,
        strict: this.strict,
        portable: this.portable,
        linkCache: this.linkCache,
        statCache: this.statCache,
        noMtime: this.noMtime,
        mtime: this.mtime,
        prefix: this.prefix,
        onWriteEntry: this.onWriteEntry
      };
    }
    [$r](e3) {
      this[Z2] += 1;
      try {
        return new this[ti](e3.path, this[ei](e3)).on(`end`, () => this[Kr](e3)).on(`error`, (e4) => this.emit(`error`, e4));
      } catch (e4) {
        this.emit(`error`, e4);
      }
    }
    [ri]() {
      this[Hr] && this[Hr].entry && this[Hr].entry.resume();
    }
    [Qr](e3) {
      e3.piped = true, e3.readdir && e3.readdir.forEach((t5) => {
        let n5 = e3.path, r4 = n5 === `./` ? `` : n5.replace(/\/*$/, `/`);
        this[qr](r4 + t5);
      });
      let t4 = e3.entry, n4 = this.zip;
      if (!t4)
        throw Error(`cannot pipe without source`);
      n4 ? t4.on(`data`, (e4) => {
        n4.write(e4) || t4.pause();
      }) : t4.on(`data`, (e4) => {
        super.write(e4) || t4.pause();
      });
    }
    pause() {
      return this.zip && this.zip.pause(), super.pause();
    }
    warn(e3, t4, n4 = {}) {
      xn(this, e3, t4, n4);
    }
  };
  ai = class extends ii {
    sync = true;
    constructor(e3) {
      super(e3), this[ti] = kr;
    }
    pause() {}
    resume() {}
    [Yr](e3) {
      let t4 = this.follow ? `statSync` : `lstatSync`;
      this[zr](e3, d2[t4](e3.absolute));
    }
    [Xr](e3) {
      this[Zr](e3, d2.readdirSync(e3.absolute));
    }
    [Qr](e3) {
      let t4 = e3.entry, n4 = this.zip;
      if (e3.readdir && e3.readdir.forEach((t5) => {
        let n5 = e3.path, r4 = n5 === `./` ? `` : n5.replace(/\/*$/, `/`);
        this[qr](r4 + t5);
      }), !t4)
        throw Error(`Cannot pipe without source`);
      n4 ? t4.on(`data`, (e4) => {
        n4.write(e4);
      }) : t4.on(`data`, (e4) => {
        super[ni](e4);
      });
    }
  };
  ui = Ct(oi, si, (e3, t4) => {
    let n4 = new ai(e3);
    return ci(n4, t4), n4;
  }, (e3, t4) => {
    let n4 = new ii(e3);
    return li(n4, t4).catch((e4) => n4.emit(`error`, e4)), n4;
  }, (e3, t4) => {
    if (!t4?.length)
      throw TypeError(`no paths specified to add to archive`);
  });
  di = (process.env.__FAKE_PLATFORM__ || process.platform) === `win32`;
  ({ O_CREAT: fi, O_NOFOLLOW: pi, O_TRUNC: mi, O_WRONLY: hi } = d2.constants);
  gi = Number(process.env.__FAKE_FS_O_FILENAME__) || d2.constants.UV_FS_O_FILEMAP || 0;
  _i = di && !!gi;
  vi = 512 * 1024;
  yi = gi | mi | fi | hi;
  bi = !di && typeof pi == `number` ? pi | mi | fi | hi : null;
  xi = bi === null ? _i ? (e3) => e3 < vi ? yi : `w` : () => `w` : () => bi;
  Oi = class extends Error {
    path;
    code;
    syscall = `chdir`;
    constructor(e3, t4) {
      super(`${t4}: Cannot cd into '${e3}'`), this.path = e3, this.code = t4;
    }
    get name() {
      return `CwdError`;
    }
  };
  ki = class extends Error {
    path;
    symlink;
    syscall = `symlink`;
    code = `TAR_SYMLINK_ERROR`;
    constructor(e3, t4) {
      super(`TAR_SYMLINK_ERROR: Cannot extract through symbolic link`), this.symlink = e3, this.path = t4;
    }
    get name() {
      return `SymlinkError`;
    }
  };
  Ii = Object.create(null);
  Ri = /* @__PURE__ */ new Set;
  Bi = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === `win32`;
  Wi = Symbol(`onEntry`);
  Gi = Symbol(`checkFs`);
  Ki = Symbol(`checkFs2`);
  qi = Symbol(`isReusable`);
  Q2 = Symbol(`makeFs`);
  Ji = Symbol(`file`);
  Yi = Symbol(`directory`);
  Xi = Symbol(`link`);
  Zi = Symbol(`symlink`);
  Qi = Symbol(`hardlink`);
  $i = Symbol(`ensureNoSymlink`);
  ea = Symbol(`unsupported`);
  ta = Symbol(`checkPath`);
  na = Symbol(`stripAbsolutePath`);
  ra = Symbol(`mkdir`);
  $2 = Symbol(`onError`);
  ia = Symbol(`pending`);
  aa = Symbol(`pend`);
  oa = Symbol(`unpend`);
  sa = Symbol(`ended`);
  ca = Symbol(`maybeClose`);
  la = Symbol(`skip`);
  ua = Symbol(`doChown`);
  da = Symbol(`uid`);
  fa = Symbol(`gid`);
  pa = Symbol(`checkedCwd`);
  ma = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === `win32`;
  ya = class extends Jn {
    [sa] = false;
    [pa] = false;
    [ia] = 0;
    reservations = new Hi;
    transform;
    writable = true;
    readable = false;
    uid;
    gid;
    setOwner;
    preserveOwner;
    processGid;
    processUid;
    maxDepth;
    forceChown;
    win32;
    newer;
    keep;
    noMtime;
    preservePaths;
    unlink;
    cwd;
    strip;
    processUmask;
    umask;
    dmode;
    fmode;
    chmod;
    constructor(e3 = {}) {
      if (e3.ondone = () => {
        this[sa] = true, this[ca]();
      }, super(e3), this.transform = e3.transform, this.chmod = !!e3.chmod, typeof e3.uid == `number` || typeof e3.gid == `number`) {
        if (typeof e3.uid != `number` || typeof e3.gid != `number`)
          throw TypeError(`cannot set owner without number uid and gid`);
        if (e3.preserveOwner)
          throw TypeError(`cannot preserve owner in archive and also set owner explicitly`);
        this.uid = e3.uid, this.gid = e3.gid, this.setOwner = true;
      } else
        this.uid = undefined, this.gid = undefined, this.setOwner = false;
      this.preserveOwner = e3.preserveOwner === undefined && typeof e3.uid != `number` ? !!(process.getuid && process.getuid() === 0) : !!e3.preserveOwner, this.processUid = (this.preserveOwner || this.setOwner) && process.getuid ? process.getuid() : undefined, this.processGid = (this.preserveOwner || this.setOwner) && process.getgid ? process.getgid() : undefined, this.maxDepth = typeof e3.maxDepth == `number` ? e3.maxDepth : ha, this.forceChown = e3.forceChown === true, this.win32 = !!e3.win32 || ma, this.newer = !!e3.newer, this.keep = !!e3.keep, this.noMtime = !!e3.noMtime, this.preservePaths = !!e3.preservePaths, this.unlink = !!e3.unlink, this.cwd = z2(i3.resolve(e3.cwd || process.cwd())), this.strip = Number(e3.strip) || 0, this.processUmask = this.chmod ? typeof e3.processUmask == `number` ? e3.processUmask : Ui() : 0, this.umask = typeof e3.umask == `number` ? e3.umask : this.processUmask, this.dmode = e3.dmode || 511 & ~this.umask, this.fmode = e3.fmode || 438 & ~this.umask, this.on(`entry`, (e4) => this[Wi](e4));
    }
    warn(e3, t4, n4 = {}) {
      return (e3 === `TAR_BAD_ARCHIVE` || e3 === `TAR_ABORT`) && (n4.recoverable = false), super.warn(e3, t4, n4);
    }
    [ca]() {
      this[sa] && this[ia] === 0 && (this.emit(`prefinish`), this.emit(`finish`), this.emit(`end`));
    }
    [na](e3, t4) {
      let n4 = e3[t4], { type: r4 } = e3;
      if (!n4 || this.preservePaths)
        return true;
      let [a4, o4] = nr(n4), s3 = o4.replaceAll(/\\/g, `/`).split(`/`);
      if (s3.includes(`..`) || ma && /^[a-z]:\.\.$/i.test(s3[0] ?? ``)) {
        if (t4 === `path` || r4 === `Link`)
          return this.warn(`TAR_ENTRY_ERROR`, `${t4} contains '..'`, {
            entry: e3,
            [t4]: n4
          }), false;
        let a5 = i3.posix.dirname(e3.path), o5 = i3.posix.normalize(i3.posix.join(a5, s3.join(`/`)));
        if (o5.startsWith(`../`) || o5 === `..`)
          return this.warn(`TAR_ENTRY_ERROR`, `${t4} escapes extraction directory`, {
            entry: e3,
            [t4]: n4
          }), false;
      }
      return a4 && (e3[t4] = String(o4), this.warn(`TAR_ENTRY_INFO`, `stripping ${a4} from absolute ${t4}`, {
        entry: e3,
        [t4]: n4
      })), true;
    }
    [ta](e3) {
      let t4 = z2(e3.path), n4 = t4.split(`/`);
      if (this.strip) {
        if (n4.length < this.strip)
          return false;
        if (e3.type === `Link`) {
          let t5 = z2(String(e3.linkpath)).split(`/`);
          if (t5.length >= this.strip)
            e3.linkpath = t5.slice(this.strip).join(`/`);
          else
            return false;
        }
        n4.splice(0, this.strip), e3.path = n4.join(`/`);
      }
      if (isFinite(this.maxDepth) && n4.length > this.maxDepth)
        return this.warn(`TAR_ENTRY_ERROR`, `path excessively deep`, {
          entry: e3,
          path: t4,
          depth: n4.length,
          maxDepth: this.maxDepth
        }), false;
      if (!this[na](e3, `path`) || !this[na](e3, `linkpath`))
        return false;
      if (e3.absolute = i3.isAbsolute(e3.path) ? z2(i3.resolve(e3.path)) : z2(i3.resolve(this.cwd, e3.path)), !this.preservePaths && typeof e3.absolute == `string` && e3.absolute.indexOf(this.cwd + `/`) !== 0 && e3.absolute !== this.cwd)
        return this.warn(`TAR_ENTRY_ERROR`, `path escaped extraction target`, {
          entry: e3,
          path: z2(e3.path),
          resolvedPath: e3.absolute,
          cwd: this.cwd
        }), false;
      if (e3.absolute === this.cwd && e3.type !== `Directory` && e3.type !== `GNUDumpDir`)
        return false;
      if (this.win32) {
        let { root: t5 } = i3.win32.parse(String(e3.absolute));
        e3.absolute = t5 + sr(String(e3.absolute).slice(t5.length));
        let { root: n5 } = i3.win32.parse(e3.path);
        e3.path = n5 + sr(e3.path.slice(n5.length));
      }
      return true;
    }
    [Wi](e3) {
      if (!this[ta](e3))
        return e3.resume();
      switch (oe2.equal(typeof e3.absolute, `string`), e3.type) {
        case `Directory`:
        case `GNUDumpDir`:
          e3.mode && (e3.mode |= 448);
        case `File`:
        case `OldFile`:
        case `ContiguousFile`:
        case `Link`:
        case `SymbolicLink`:
          return this[Gi](e3);
        default:
          return this[ea](e3);
      }
    }
    [$2](e3, t4) {
      e3.name === `CwdError` ? this.emit(`error`, e3) : (this.warn(`TAR_ENTRY_ERROR`, e3, { entry: t4 }), this[oa](), t4.resume());
    }
    [ra](e3, t4, n4) {
      ji(z2(e3), {
        uid: this.uid,
        gid: this.gid,
        processUid: this.processUid,
        processGid: this.processGid,
        umask: this.processUmask,
        preserve: this.preservePaths,
        unlink: this.unlink,
        cwd: this.cwd,
        mode: t4
      }, n4);
    }
    [ua](e3) {
      return this.forceChown || this.preserveOwner && (typeof e3.uid == `number` && e3.uid !== this.processUid || typeof e3.gid == `number` && e3.gid !== this.processGid) || typeof this.uid == `number` && this.uid !== this.processUid || typeof this.gid == `number` && this.gid !== this.processGid;
    }
    [da](e3) {
      return va(this.uid, e3.uid, this.processUid);
    }
    [fa](e3) {
      return va(this.gid, e3.gid, this.processGid);
    }
    [Ji](e3, n4) {
      let r4 = typeof e3.mode == `number` ? e3.mode & 4095 : this.fmode, i4 = new pt(String(e3.absolute), {
        flags: xi(e3.size),
        mode: r4,
        autoClose: false
      });
      i4.on(`error`, (r5) => {
        i4.fd && t3.close(i4.fd, () => {}), i4.write = () => true, this[$2](r5, e3), n4();
      });
      let a4 = 1, o4 = (r5) => {
        if (r5) {
          i4.fd && t3.close(i4.fd, () => {}), this[$2](r5, e3), n4();
          return;
        }
        --a4 === 0 && i4.fd !== undefined && t3.close(i4.fd, (t4) => {
          t4 ? this[$2](t4, e3) : this[oa](), n4();
        });
      };
      i4.on(`finish`, () => {
        let n5 = String(e3.absolute), r5 = i4.fd;
        if (typeof r5 == `number` && e3.mtime && !this.noMtime) {
          a4++;
          let i5 = e3.atime || /* @__PURE__ */ new Date, s4 = e3.mtime;
          t3.futimes(r5, i5, s4, (e4) => e4 ? t3.utimes(n5, i5, s4, (t4) => o4(t4 && e4)) : o4());
        }
        if (typeof r5 == `number` && this[ua](e3)) {
          a4++;
          let i5 = this[da](e3), s4 = this[fa](e3);
          typeof i5 == `number` && typeof s4 == `number` && t3.fchown(r5, i5, s4, (e4) => e4 ? t3.chown(n5, i5, s4, (t4) => o4(t4 && e4)) : o4());
        }
        o4();
      });
      let s3 = this.transform && this.transform(e3) || e3;
      s3 !== e3 && (s3.on(`error`, (t4) => {
        this[$2](t4, e3), n4();
      }), e3.pipe(s3)), s3.pipe(i4);
    }
    [Yi](e3, n4) {
      let r4 = typeof e3.mode == `number` ? e3.mode & 4095 : this.dmode;
      this[ra](String(e3.absolute), r4, (r5) => {
        if (r5) {
          this[$2](r5, e3), n4();
          return;
        }
        let i4 = 1, a4 = () => {
          --i4 === 0 && (n4(), this[oa](), e3.resume());
        };
        e3.mtime && !this.noMtime && (i4++, t3.utimes(String(e3.absolute), e3.atime || /* @__PURE__ */ new Date, e3.mtime, a4)), this[ua](e3) && (i4++, t3.chown(String(e3.absolute), Number(this[da](e3)), Number(this[fa](e3)), a4)), a4();
      });
    }
    [ea](e3) {
      e3.unsupported = true, this.warn(`TAR_ENTRY_UNSUPPORTED`, `unsupported entry type: ${e3.type}`, { entry: e3 }), e3.resume();
    }
    [Zi](e3, t4) {
      let n4 = z2(i3.relative(this.cwd, i3.resolve(i3.dirname(String(e3.absolute)), String(e3.linkpath)))).split(`/`);
      this[$i](e3, this.cwd, n4, () => this[Xi](e3, String(e3.linkpath), `symlink`, t4), (n5) => {
        this[$2](n5, e3), t4();
      });
    }
    [Qi](e3, t4) {
      let n4 = z2(i3.resolve(this.cwd, String(e3.linkpath))), r4 = z2(String(e3.linkpath)).split(`/`);
      this[$i](e3, this.cwd, r4, () => this[Xi](e3, n4, `link`, t4), (n5) => {
        this[$2](n5, e3), t4();
      });
    }
    [$i](e3, n4, r4, a4, o4) {
      let s3 = r4.shift();
      if (this.preservePaths || s3 === undefined)
        return a4();
      let c4 = i3.resolve(n4, s3);
      t3.lstat(c4, (t4, n5) => {
        if (t4)
          return a4();
        if (n5?.isSymbolicLink())
          return o4(new ki(c4, i3.resolve(c4, r4.join(`/`))));
        this[$i](e3, c4, r4, a4, o4);
      });
    }
    [aa]() {
      this[ia]++;
    }
    [oa]() {
      this[ia]--, this[ca]();
    }
    [la](e3) {
      this[oa](), e3.resume();
    }
    [qi](e3, t4) {
      return e3.type === `File` && !this.unlink && t4.isFile() && t4.nlink <= 1 && !ma;
    }
    [Gi](e3) {
      this[aa]();
      let t4 = [e3.path];
      e3.linkpath && t4.push(e3.linkpath), this.reservations.reserve(t4, (t5) => this[Ki](e3, t5));
    }
    [Ki](e3, n4) {
      let r4 = (e4) => {
        n4(e4);
      }, a4 = () => {
        this[ra](this.cwd, this.dmode, (t4) => {
          if (t4) {
            this[$2](t4, e3), r4();
            return;
          }
          this[pa] = true, o4();
        });
      }, o4 = () => {
        if (e3.absolute !== this.cwd) {
          let t4 = z2(i3.dirname(String(e3.absolute)));
          if (t4 !== this.cwd)
            return this[ra](t4, this.dmode, (t5) => {
              if (t5) {
                this[$2](t5, e3), r4();
                return;
              }
              s3();
            });
        }
        s3();
      }, s3 = () => {
        t3.lstat(String(e3.absolute), (n5, i4) => {
          if (i4 && (this.keep || this.newer && i4.mtime > (e3.mtime ?? i4.mtime))) {
            this[la](e3), r4();
            return;
          }
          if (n5 || this[qi](e3, i4))
            return this[Q2](null, e3, r4);
          if (i4.isDirectory()) {
            if (e3.type === `Directory`) {
              let n6 = this.chmod && e3.mode && (i4.mode & 4095) !== e3.mode, a5 = (t4) => this[Q2](t4 ?? null, e3, r4);
              return n6 ? t3.chmod(String(e3.absolute), Number(e3.mode), a5) : a5();
            }
            if (e3.absolute !== this.cwd)
              return t3.rmdir(String(e3.absolute), (t4) => this[Q2](t4 ?? null, e3, r4));
          }
          if (e3.absolute === this.cwd)
            return this[Q2](null, e3, r4);
          ga(String(e3.absolute), (t4) => this[Q2](t4 ?? null, e3, r4));
        });
      };
      this[pa] ? o4() : a4();
    }
    [Q2](e3, t4, n4) {
      if (e3) {
        this[$2](e3, t4), n4();
        return;
      }
      switch (t4.type) {
        case `File`:
        case `OldFile`:
        case `ContiguousFile`:
          return this[Ji](t4, n4);
        case `Link`:
          return this[Qi](t4, n4);
        case `SymbolicLink`:
          return this[Zi](t4, n4);
        case `Directory`:
        case `GNUDumpDir`:
          return this[Yi](t4, n4);
      }
    }
    [Xi](e3, n4, r4, i4) {
      t3[r4](n4, String(e3.absolute), (t4) => {
        t4 ? this[$2](t4, e3) : (this[oa](), e3.resume()), i4();
      });
    }
  };
  xa = class extends ya {
    sync = true;
    [Q2](e3, t4) {
      return super[Q2](e3, t4, () => {});
    }
    [Gi](e3) {
      if (!this[pa]) {
        let t4 = this[ra](this.cwd, this.dmode);
        if (t4)
          return this[$2](t4, e3);
        this[pa] = true;
      }
      if (e3.absolute !== this.cwd) {
        let t4 = z2(i3.dirname(String(e3.absolute)));
        if (t4 !== this.cwd) {
          let n5 = this[ra](t4, this.dmode);
          if (n5)
            return this[$2](n5, e3);
        }
      }
      let [n4, r4] = ba(() => t3.lstatSync(String(e3.absolute)));
      if (r4 && (this.keep || this.newer && r4.mtime > (e3.mtime ?? r4.mtime)))
        return this[la](e3);
      if (n4 || this[qi](e3, r4))
        return this[Q2](null, e3);
      if (r4.isDirectory()) {
        if (e3.type === `Directory`) {
          let [n6] = this.chmod && e3.mode && (r4.mode & 4095) !== e3.mode ? ba(() => {
            t3.chmodSync(String(e3.absolute), Number(e3.mode));
          }) : [];
          return this[Q2](n6, e3);
        }
        let [n5] = ba(() => t3.rmdirSync(String(e3.absolute)));
        this[Q2](n5, e3);
      }
      let [a4] = e3.absolute === this.cwd ? [] : ba(() => _a(String(e3.absolute)));
      this[Q2](a4, e3);
    }
    [Ji](e3, n4) {
      let r4 = typeof e3.mode == `number` ? e3.mode & 4095 : this.fmode, i4 = (r5) => {
        let i5;
        try {
          t3.closeSync(a4);
        } catch (e4) {
          i5 = e4;
        }
        (r5 || i5) && this[$2](r5 || i5, e3), n4();
      }, a4;
      try {
        a4 = t3.openSync(String(e3.absolute), xi(e3.size), r4);
      } catch (e4) {
        return i4(e4);
      }
      let o4 = this.transform && this.transform(e3) || e3;
      o4 !== e3 && (o4.on(`error`, (t4) => this[$2](t4, e3)), e3.pipe(o4)), o4.on(`data`, (e4) => {
        try {
          t3.writeSync(a4, e4, 0, e4.length);
        } catch (e5) {
          i4(e5);
        }
      }), o4.on(`end`, () => {
        let n5 = null;
        if (e3.mtime && !this.noMtime) {
          let r5 = e3.atime || /* @__PURE__ */ new Date, i5 = e3.mtime;
          try {
            t3.futimesSync(a4, r5, i5);
          } catch (a5) {
            try {
              t3.utimesSync(String(e3.absolute), r5, i5);
            } catch {
              n5 = a5;
            }
          }
        }
        if (this[ua](e3)) {
          let r5 = this[da](e3), i5 = this[fa](e3);
          try {
            t3.fchownSync(a4, Number(r5), Number(i5));
          } catch (a5) {
            try {
              t3.chownSync(String(e3.absolute), Number(r5), Number(i5));
            } catch {
              n5 ||= a5;
            }
          }
        }
        i4(n5);
      });
    }
    [Yi](e3, n4) {
      let r4 = typeof e3.mode == `number` ? e3.mode & 4095 : this.dmode, i4 = this[ra](String(e3.absolute), r4);
      if (i4) {
        this[$2](i4, e3), n4();
        return;
      }
      if (e3.mtime && !this.noMtime)
        try {
          t3.utimesSync(String(e3.absolute), e3.atime || /* @__PURE__ */ new Date, e3.mtime);
        } catch {}
      if (this[ua](e3))
        try {
          t3.chownSync(String(e3.absolute), Number(this[da](e3)), Number(this[fa](e3)));
        } catch {}
      n4(), e3.resume();
    }
    [ra](e3, t4) {
      try {
        return Fi(z2(e3), {
          uid: this.uid,
          gid: this.gid,
          processUid: this.processUid,
          processGid: this.processGid,
          umask: this.processUmask,
          preserve: this.preservePaths,
          unlink: this.unlink,
          cwd: this.cwd,
          mode: t4
        });
      } catch (e4) {
        return e4;
      }
    }
    [$i](e3, n4, r4, a4, o4) {
      if (this.preservePaths || r4.length === 0)
        return a4();
      let s3 = n4;
      for (let e4 of r4) {
        s3 = i3.resolve(s3, e4);
        let [c4, l4] = ba(() => t3.lstatSync(s3));
        if (c4)
          return a4();
        if (l4.isSymbolicLink())
          return o4(new ki(s3, i3.resolve(n4, r4.join(`/`))));
      }
      a4();
    }
    [Xi](e3, n4, r4, i4) {
      let a4 = `${r4}Sync`;
      try {
        t3[a4](n4, String(e3.absolute)), i4(), e3.resume();
      } catch (t4) {
        return this[$2](t4, e3);
      }
    }
  };
  Sa = Ct((e3) => {
    let n4 = new xa(e3), r4 = e3.file, i4 = t3.statSync(r4);
    new ft(r4, {
      readSize: e3.maxReadSize || 16 * 1024 * 1024,
      size: i4.size
    }).pipe(n4);
  }, (e3, n4) => {
    let r4 = new ya(e3), i4 = e3.maxReadSize || 16 * 1024 * 1024, a4 = e3.file;
    return new Promise((e4, n5) => {
      r4.on(`error`, n5), r4.on(`close`, e4), t3.stat(a4, (e5, t4) => {
        if (e5)
          n5(e5);
        else {
          let e6 = new dt(a4, {
            readSize: i4,
            size: t4.size
          });
          e6.on(`error`, n5), e6.pipe(r4);
        }
      });
    });
  }, (e3) => new xa(e3), (e3) => new ya(e3), (e3, t4) => {
    t4?.length && Zn(e3, t4);
  });
  Oa = Ct(Ca, Ta, () => {
    throw TypeError(`file is required`);
  }, () => {
    throw TypeError(`file is required`);
  }, (e3, t4) => {
    if (!bt(e3))
      throw TypeError(`file is required`);
    if (e3.gzip || e3.brotli || e3.zstd || e3.file.endsWith(`.br`) || e3.file.endsWith(`.tbr`))
      throw TypeError(`cannot append to compressed archives`);
    if (!t4?.length)
      throw TypeError(`no paths specified to add/replace`);
  });
  Ct(Oa.syncFile, Oa.asyncFile, Oa.syncNoFile, Oa.asyncNoFile, (e3, t4 = []) => {
    Oa.validate?.(e3, t4), ka(e3);
  });
});

// node_modules/kind-of/index.js
var require_kind_of = __commonJS((exports, module) => {
  var toString = Object.prototype.toString;
  module.exports = function kindOf(val) {
    if (val === undefined)
      return "undefined";
    if (val === null)
      return "null";
    var type = typeof val;
    if (type === "boolean")
      return "boolean";
    if (type === "string")
      return "string";
    if (type === "number")
      return "number";
    if (type === "symbol")
      return "symbol";
    if (type === "function") {
      return isGeneratorFn(val) ? "generatorfunction" : "function";
    }
    if (isArray(val))
      return "array";
    if (isBuffer(val))
      return "buffer";
    if (isArguments(val))
      return "arguments";
    if (isDate(val))
      return "date";
    if (isError(val))
      return "error";
    if (isRegexp(val))
      return "regexp";
    switch (ctorName(val)) {
      case "Symbol":
        return "symbol";
      case "Promise":
        return "promise";
      case "WeakMap":
        return "weakmap";
      case "WeakSet":
        return "weakset";
      case "Map":
        return "map";
      case "Set":
        return "set";
      case "Int8Array":
        return "int8array";
      case "Uint8Array":
        return "uint8array";
      case "Uint8ClampedArray":
        return "uint8clampedarray";
      case "Int16Array":
        return "int16array";
      case "Uint16Array":
        return "uint16array";
      case "Int32Array":
        return "int32array";
      case "Uint32Array":
        return "uint32array";
      case "Float32Array":
        return "float32array";
      case "Float64Array":
        return "float64array";
    }
    if (isGeneratorObj(val)) {
      return "generator";
    }
    type = toString.call(val);
    switch (type) {
      case "[object Object]":
        return "object";
      case "[object Map Iterator]":
        return "mapiterator";
      case "[object Set Iterator]":
        return "setiterator";
      case "[object String Iterator]":
        return "stringiterator";
      case "[object Array Iterator]":
        return "arrayiterator";
    }
    return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
  };
  function ctorName(val) {
    return typeof val.constructor === "function" ? val.constructor.name : null;
  }
  function isArray(val) {
    if (Array.isArray)
      return Array.isArray(val);
    return val instanceof Array;
  }
  function isError(val) {
    return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
  }
  function isDate(val) {
    if (val instanceof Date)
      return true;
    return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
  }
  function isRegexp(val) {
    if (val instanceof RegExp)
      return true;
    return typeof val.flags === "string" && typeof val.ignoreCase === "boolean" && typeof val.multiline === "boolean" && typeof val.global === "boolean";
  }
  function isGeneratorFn(name, val) {
    return ctorName(name) === "GeneratorFunction";
  }
  function isGeneratorObj(val) {
    return typeof val.throw === "function" && typeof val.return === "function" && typeof val.next === "function";
  }
  function isArguments(val) {
    try {
      if (typeof val.length === "number" && typeof val.callee === "function") {
        return true;
      }
    } catch (err) {
      if (err.message.indexOf("callee") !== -1) {
        return true;
      }
    }
    return false;
  }
  function isBuffer(val) {
    if (val.constructor && typeof val.constructor.isBuffer === "function") {
      return val.constructor.isBuffer(val);
    }
    return false;
  }
});

// node_modules/is-extendable/index.js
var require_is_extendable = __commonJS((exports, module) => {
  /*!
   * is-extendable <https://github.com/jonschlinkert/is-extendable>
   *
   * Copyright (c) 2015, Jon Schlinkert.
   * Licensed under the MIT License.
   */
  module.exports = function isExtendable(val) {
    return typeof val !== "undefined" && val !== null && (typeof val === "object" || typeof val === "function");
  };
});

// node_modules/extend-shallow/index.js
var require_extend_shallow = __commonJS((exports, module) => {
  var isObject = require_is_extendable();
  module.exports = function extend(o4) {
    if (!isObject(o4)) {
      o4 = {};
    }
    var len = arguments.length;
    for (var i4 = 1;i4 < len; i4++) {
      var obj = arguments[i4];
      if (isObject(obj)) {
        assign(o4, obj);
      }
    }
    return o4;
  };
  function assign(a4, b4) {
    for (var key in b4) {
      if (hasOwn(b4, key)) {
        a4[key] = b4[key];
      }
    }
  }
  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
});

// node_modules/section-matter/index.js
var require_section_matter = __commonJS((exports, module) => {
  var typeOf = require_kind_of();
  var extend = require_extend_shallow();
  module.exports = function(input, options2) {
    if (typeof options2 === "function") {
      options2 = { parse: options2 };
    }
    var file = toObject(input);
    var defaults = { section_delimiter: "---", parse: identity };
    var opts = extend({}, defaults, options2);
    var delim = opts.section_delimiter;
    var lines = file.content.split(/\r?\n/);
    var sections = null;
    var section = createSection();
    var content = [];
    var stack = [];
    function initSections(val) {
      file.content = val;
      sections = [];
      content = [];
    }
    function closeSection(val) {
      if (stack.length) {
        section.key = getKey(stack[0], delim);
        section.content = val;
        opts.parse(section, sections);
        sections.push(section);
        section = createSection();
        content = [];
        stack = [];
      }
    }
    for (var i4 = 0;i4 < lines.length; i4++) {
      var line = lines[i4];
      var len = stack.length;
      var ln2 = line.trim();
      if (isDelimiter(ln2, delim)) {
        if (ln2.length === 3 && i4 !== 0) {
          if (len === 0 || len === 2) {
            content.push(line);
            continue;
          }
          stack.push(ln2);
          section.data = content.join(`
`);
          content = [];
          continue;
        }
        if (sections === null) {
          initSections(content.join(`
`));
        }
        if (len === 2) {
          closeSection(content.join(`
`));
        }
        stack.push(ln2);
        continue;
      }
      content.push(line);
    }
    if (sections === null) {
      initSections(content.join(`
`));
    } else {
      closeSection(content.join(`
`));
    }
    file.sections = sections;
    return file;
  };
  function isDelimiter(line, delim) {
    if (line.slice(0, delim.length) !== delim) {
      return false;
    }
    if (line.charAt(delim.length + 1) === delim.slice(-1)) {
      return false;
    }
    return true;
  }
  function toObject(input) {
    if (typeOf(input) !== "object") {
      input = { content: input };
    }
    if (typeof input.content !== "string" && !isBuffer(input.content)) {
      throw new TypeError("expected a buffer or string");
    }
    input.content = input.content.toString();
    input.sections = [];
    return input;
  }
  function getKey(val, delim) {
    return val ? val.slice(delim.length).trim() : "";
  }
  function createSection() {
    return { key: "", data: "", content: "" };
  }
  function identity(val) {
    return val;
  }
  function isBuffer(val) {
    if (val && val.constructor && typeof val.constructor.isBuffer === "function") {
      return val.constructor.isBuffer(val);
    }
    return false;
  }
});

// node_modules/js-yaml/lib/js-yaml/common.js
var require_common = __commonJS((exports, module) => {
  function isNothing(subject) {
    return typeof subject === "undefined" || subject === null;
  }
  function isObject(subject) {
    return typeof subject === "object" && subject !== null;
  }
  function toArray(sequence) {
    if (Array.isArray(sequence))
      return sequence;
    else if (isNothing(sequence))
      return [];
    return [sequence];
  }
  function extend(target, source) {
    var index, length, key, sourceKeys;
    if (source) {
      sourceKeys = Object.keys(source);
      for (index = 0, length = sourceKeys.length;index < length; index += 1) {
        key = sourceKeys[index];
        target[key] = source[key];
      }
    }
    return target;
  }
  function repeat(string, count) {
    var result = "", cycle;
    for (cycle = 0;cycle < count; cycle += 1) {
      result += string;
    }
    return result;
  }
  function isNegativeZero(number) {
    return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
  }
  exports.isNothing = isNothing;
  exports.isObject = isObject;
  exports.toArray = toArray;
  exports.repeat = repeat;
  exports.isNegativeZero = isNegativeZero;
  exports.extend = extend;
});

// node_modules/js-yaml/lib/js-yaml/exception.js
var require_exception = __commonJS((exports, module) => {
  function YAMLException(reason, mark) {
    Error.call(this);
    this.name = "YAMLException";
    this.reason = reason;
    this.mark = mark;
    this.message = (this.reason || "(unknown reason)") + (this.mark ? " " + this.mark.toString() : "");
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack || "";
    }
  }
  YAMLException.prototype = Object.create(Error.prototype);
  YAMLException.prototype.constructor = YAMLException;
  YAMLException.prototype.toString = function toString(compact) {
    var result = this.name + ": ";
    result += this.reason || "(unknown reason)";
    if (!compact && this.mark) {
      result += " " + this.mark.toString();
    }
    return result;
  };
  module.exports = YAMLException;
});

// node_modules/js-yaml/lib/js-yaml/mark.js
var require_mark = __commonJS((exports, module) => {
  var common = require_common();
  function Mark(name, buffer, position, line, column) {
    this.name = name;
    this.buffer = buffer;
    this.position = position;
    this.line = line;
    this.column = column;
  }
  Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
    var head, start, tail, end, snippet;
    if (!this.buffer)
      return null;
    indent = indent || 4;
    maxLength = maxLength || 75;
    head = "";
    start = this.position;
    while (start > 0 && `\x00\r
\u2028\u2029`.indexOf(this.buffer.charAt(start - 1)) === -1) {
      start -= 1;
      if (this.position - start > maxLength / 2 - 1) {
        head = " ... ";
        start += 5;
        break;
      }
    }
    tail = "";
    end = this.position;
    while (end < this.buffer.length && `\x00\r
\u2028\u2029`.indexOf(this.buffer.charAt(end)) === -1) {
      end += 1;
      if (end - this.position > maxLength / 2 - 1) {
        tail = " ... ";
        end -= 5;
        break;
      }
    }
    snippet = this.buffer.slice(start, end);
    return common.repeat(" ", indent) + head + snippet + tail + `
` + common.repeat(" ", indent + this.position - start + head.length) + "^";
  };
  Mark.prototype.toString = function toString(compact) {
    var snippet, where = "";
    if (this.name) {
      where += 'in "' + this.name + '" ';
    }
    where += "at line " + (this.line + 1) + ", column " + (this.column + 1);
    if (!compact) {
      snippet = this.getSnippet();
      if (snippet) {
        where += `:
` + snippet;
      }
    }
    return where;
  };
  module.exports = Mark;
});

// node_modules/js-yaml/lib/js-yaml/type.js
var require_type = __commonJS((exports, module) => {
  var YAMLException = require_exception();
  var TYPE_CONSTRUCTOR_OPTIONS = [
    "kind",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "defaultStyle",
    "styleAliases"
  ];
  var YAML_NODE_KINDS = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function compileStyleAliases(map) {
    var result = {};
    if (map !== null) {
      Object.keys(map).forEach(function(style) {
        map[style].forEach(function(alias) {
          result[String(alias)] = style;
        });
      });
    }
    return result;
  }
  function Type(tag, options2) {
    options2 = options2 || {};
    Object.keys(options2).forEach(function(name) {
      if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
        throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
      }
    });
    this.tag = tag;
    this.kind = options2["kind"] || null;
    this.resolve = options2["resolve"] || function() {
      return true;
    };
    this.construct = options2["construct"] || function(data) {
      return data;
    };
    this.instanceOf = options2["instanceOf"] || null;
    this.predicate = options2["predicate"] || null;
    this.represent = options2["represent"] || null;
    this.defaultStyle = options2["defaultStyle"] || null;
    this.styleAliases = compileStyleAliases(options2["styleAliases"] || null);
    if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
      throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
    }
  }
  module.exports = Type;
});

// node_modules/js-yaml/lib/js-yaml/schema.js
var require_schema = __commonJS((exports, module) => {
  var common = require_common();
  var YAMLException = require_exception();
  var Type = require_type();
  function compileList(schema, name, result) {
    var exclude = [];
    schema.include.forEach(function(includedSchema) {
      result = compileList(includedSchema, name, result);
    });
    schema[name].forEach(function(currentType) {
      result.forEach(function(previousType, previousIndex) {
        if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
          exclude.push(previousIndex);
        }
      });
      result.push(currentType);
    });
    return result.filter(function(type, index) {
      return exclude.indexOf(index) === -1;
    });
  }
  function compileMap() {
    var result = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {}
    }, index, length;
    function collectType(type) {
      result[type.kind][type.tag] = result["fallback"][type.tag] = type;
    }
    for (index = 0, length = arguments.length;index < length; index += 1) {
      arguments[index].forEach(collectType);
    }
    return result;
  }
  function Schema(definition) {
    this.include = definition.include || [];
    this.implicit = definition.implicit || [];
    this.explicit = definition.explicit || [];
    this.implicit.forEach(function(type) {
      if (type.loadKind && type.loadKind !== "scalar") {
        throw new YAMLException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      }
    });
    this.compiledImplicit = compileList(this, "implicit", []);
    this.compiledExplicit = compileList(this, "explicit", []);
    this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
  }
  Schema.DEFAULT = null;
  Schema.create = function createSchema() {
    var schemas, types;
    switch (arguments.length) {
      case 1:
        schemas = Schema.DEFAULT;
        types = arguments[0];
        break;
      case 2:
        schemas = arguments[0];
        types = arguments[1];
        break;
      default:
        throw new YAMLException("Wrong number of arguments for Schema.create function");
    }
    schemas = common.toArray(schemas);
    types = common.toArray(types);
    if (!schemas.every(function(schema) {
      return schema instanceof Schema;
    })) {
      throw new YAMLException("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");
    }
    if (!types.every(function(type) {
      return type instanceof Type;
    })) {
      throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    return new Schema({
      include: schemas,
      explicit: types
    });
  };
  module.exports = Schema;
});

// node_modules/js-yaml/lib/js-yaml/type/str.js
var require_str = __commonJS((exports, module) => {
  var Type = require_type();
  module.exports = new Type("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(data) {
      return data !== null ? data : "";
    }
  });
});

// node_modules/js-yaml/lib/js-yaml/type/seq.js
var require_seq = __commonJS((exports, module) => {
  var Type = require_type();
  module.exports = new Type("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(data) {
      return data !== null ? data : [];
    }
  });
});

// node_modules/js-yaml/lib/js-yaml/type/map.js
var require_map = __commonJS((exports, module) => {
  var Type = require_type();
  module.exports = new Type("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(data) {
      return data !== null ? data : {};
    }
  });
});

// node_modules/js-yaml/lib/js-yaml/schema/failsafe.js
var require_failsafe = __commonJS((exports, module) => {
  var Schema = require_schema();
  module.exports = new Schema({
    explicit: [
      require_str(),
      require_seq(),
      require_map()
    ]
  });
});

// node_modules/js-yaml/lib/js-yaml/type/null.js
var require_null = __commonJS((exports, module) => {
  var Type = require_type();
  function resolveYamlNull(data) {
    if (data === null)
      return true;
    var max = data.length;
    return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
  }
  function constructYamlNull() {
    return null;
  }
  function isNull(object) {
    return object === null;
  }
  module.exports = new Type("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: resolveYamlNull,
    construct: constructYamlNull,
    predicate: isNull,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      }
    },
    defaultStyle: "lowercase"
  });
});

// node_modules/js-yaml/lib/js-yaml/type/bool.js
var require_bool = __commonJS((exports, module) => {
  var Type = require_type();
  function resolveYamlBoolean(data) {
    if (data === null)
      return false;
    var max = data.length;
    return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
  }
  function constructYamlBoolean(data) {
    return data === "true" || data === "True" || data === "TRUE";
  }
  function isBoolean(object) {
    return Object.prototype.toString.call(object) === "[object Boolean]";
  }
  module.exports = new Type("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: resolveYamlBoolean,
    construct: constructYamlBoolean,
    predicate: isBoolean,
    represent: {
      lowercase: function(object) {
        return object ? "true" : "false";
      },
      uppercase: function(object) {
        return object ? "TRUE" : "FALSE";
      },
      camelcase: function(object) {
        return object ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  });
});

// node_modules/js-yaml/lib/js-yaml/type/int.js
var require_int = __commonJS((exports, module) => {
  var common = require_common();
  var Type = require_type();
  function isHexCode(c4) {
    return 48 <= c4 && c4 <= 57 || 65 <= c4 && c4 <= 70 || 97 <= c4 && c4 <= 102;
  }
  function isOctCode(c4) {
    return 48 <= c4 && c4 <= 55;
  }
  function isDecCode(c4) {
    return 48 <= c4 && c4 <= 57;
  }
  function resolveYamlInteger(data) {
    if (data === null)
      return false;
    var max = data.length, index = 0, hasDigits = false, ch;
    if (!max)
      return false;
    ch = data[index];
    if (ch === "-" || ch === "+") {
      ch = data[++index];
    }
    if (ch === "0") {
      if (index + 1 === max)
        return true;
      ch = data[++index];
      if (ch === "b") {
        index++;
        for (;index < max; index++) {
          ch = data[index];
          if (ch === "_")
            continue;
          if (ch !== "0" && ch !== "1")
            return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "x") {
        index++;
        for (;index < max; index++) {
          ch = data[index];
          if (ch === "_")
            continue;
          if (!isHexCode(data.charCodeAt(index)))
            return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      for (;index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (!isOctCode(data.charCodeAt(index)))
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "_")
      return false;
    for (;index < max; index++) {
      ch = data[index];
      if (ch === "_")
        continue;
      if (ch === ":")
        break;
      if (!isDecCode(data.charCodeAt(index))) {
        return false;
      }
      hasDigits = true;
    }
    if (!hasDigits || ch === "_")
      return false;
    if (ch !== ":")
      return true;
    return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
  }
  function constructYamlInteger(data) {
    var value = data, sign = 1, ch, base, digits = [];
    if (value.indexOf("_") !== -1) {
      value = value.replace(/_/g, "");
    }
    ch = value[0];
    if (ch === "-" || ch === "+") {
      if (ch === "-")
        sign = -1;
      value = value.slice(1);
      ch = value[0];
    }
    if (value === "0")
      return 0;
    if (ch === "0") {
      if (value[1] === "b")
        return sign * parseInt(value.slice(2), 2);
      if (value[1] === "x")
        return sign * parseInt(value, 16);
      return sign * parseInt(value, 8);
    }
    if (value.indexOf(":") !== -1) {
      value.split(":").forEach(function(v3) {
        digits.unshift(parseInt(v3, 10));
      });
      value = 0;
      base = 1;
      digits.forEach(function(d3) {
        value += d3 * base;
        base *= 60;
      });
      return sign * value;
    }
    return sign * parseInt(value, 10);
  }
  function isInteger(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
  }
  module.exports = new Type("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: resolveYamlInteger,
    construct: constructYamlInteger,
    predicate: isInteger,
    represent: {
      binary: function(obj) {
        return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
      },
      octal: function(obj) {
        return obj >= 0 ? "0" + obj.toString(8) : "-0" + obj.toString(8).slice(1);
      },
      decimal: function(obj) {
        return obj.toString(10);
      },
      hexadecimal: function(obj) {
        return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  });
});

// node_modules/js-yaml/lib/js-yaml/type/float.js
var require_float = __commonJS((exports, module) => {
  var common = require_common();
  var Type = require_type();
  var YAML_FLOAT_PATTERN = new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?" + "|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?" + "|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*" + "|[-+]?\\.(?:inf|Inf|INF)" + "|\\.(?:nan|NaN|NAN))$");
  function resolveYamlFloat(data) {
    if (data === null)
      return false;
    if (!YAML_FLOAT_PATTERN.test(data) || data[data.length - 1] === "_") {
      return false;
    }
    return true;
  }
  function constructYamlFloat(data) {
    var value, sign, base, digits;
    value = data.replace(/_/g, "").toLowerCase();
    sign = value[0] === "-" ? -1 : 1;
    digits = [];
    if ("+-".indexOf(value[0]) >= 0) {
      value = value.slice(1);
    }
    if (value === ".inf") {
      return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    } else if (value === ".nan") {
      return NaN;
    } else if (value.indexOf(":") >= 0) {
      value.split(":").forEach(function(v3) {
        digits.unshift(parseFloat(v3, 10));
      });
      value = 0;
      base = 1;
      digits.forEach(function(d3) {
        value += d3 * base;
        base *= 60;
      });
      return sign * value;
    }
    return sign * parseFloat(value, 10);
  }
  var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
  function representYamlFloat(object, style) {
    var res;
    if (isNaN(object)) {
      switch (style) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    } else if (Number.POSITIVE_INFINITY === object) {
      switch (style) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    } else if (Number.NEGATIVE_INFINITY === object) {
      switch (style) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    } else if (common.isNegativeZero(object)) {
      return "-0.0";
    }
    res = object.toString(10);
    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
  }
  function isFloat(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
  }
  module.exports = new Type("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: resolveYamlFloat,
    construct: constructYamlFloat,
    predicate: isFloat,
    represent: representYamlFloat,
    defaultStyle: "lowercase"
  });
});

// node_modules/js-yaml/lib/js-yaml/schema/json.js
var require_json = __commonJS((exports, module) => {
  var Schema = require_schema();
  module.exports = new Schema({
    include: [
      require_failsafe()
    ],
    implicit: [
      require_null(),
      require_bool(),
      require_int(),
      require_float()
    ]
  });
});

// node_modules/js-yaml/lib/js-yaml/schema/core.js
var require_core = __commonJS((exports, module) => {
  var Schema = require_schema();
  module.exports = new Schema({
    include: [
      require_json()
    ]
  });
});

// node_modules/js-yaml/lib/js-yaml/type/timestamp.js
var require_timestamp = __commonJS((exports, module) => {
  var Type = require_type();
  var YAML_DATE_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])" + "-([0-9][0-9])" + "-([0-9][0-9])$");
  var YAML_TIMESTAMP_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])" + "-([0-9][0-9]?)" + "-([0-9][0-9]?)" + "(?:[Tt]|[ \\t]+)" + "([0-9][0-9]?)" + ":([0-9][0-9])" + ":([0-9][0-9])" + "(?:\\.([0-9]*))?" + "(?:[ \\t]*(Z|([-+])([0-9][0-9]?)" + "(?::([0-9][0-9]))?))?$");
  function resolveYamlTimestamp(data) {
    if (data === null)
      return false;
    if (YAML_DATE_REGEXP.exec(data) !== null)
      return true;
    if (YAML_TIMESTAMP_REGEXP.exec(data) !== null)
      return true;
    return false;
  }
  function constructYamlTimestamp(data) {
    var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
    match = YAML_DATE_REGEXP.exec(data);
    if (match === null)
      match = YAML_TIMESTAMP_REGEXP.exec(data);
    if (match === null)
      throw new Error("Date resolve error");
    year = +match[1];
    month = +match[2] - 1;
    day = +match[3];
    if (!match[4]) {
      return new Date(Date.UTC(year, month, day));
    }
    hour = +match[4];
    minute = +match[5];
    second = +match[6];
    if (match[7]) {
      fraction = match[7].slice(0, 3);
      while (fraction.length < 3) {
        fraction += "0";
      }
      fraction = +fraction;
    }
    if (match[9]) {
      tz_hour = +match[10];
      tz_minute = +(match[11] || 0);
      delta = (tz_hour * 60 + tz_minute) * 60000;
      if (match[9] === "-")
        delta = -delta;
    }
    date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
    if (delta)
      date.setTime(date.getTime() - delta);
    return date;
  }
  function representYamlTimestamp(object) {
    return object.toISOString();
  }
  module.exports = new Type("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: resolveYamlTimestamp,
    construct: constructYamlTimestamp,
    instanceOf: Date,
    represent: representYamlTimestamp
  });
});

// node_modules/js-yaml/lib/js-yaml/type/merge.js
var require_merge = __commonJS((exports, module) => {
  var Type = require_type();
  function resolveYamlMerge(data) {
    return data === "<<" || data === null;
  }
  module.exports = new Type("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: resolveYamlMerge
  });
});

// node_modules/js-yaml/lib/js-yaml/type/binary.js
var require_binary = __commonJS((exports, module) => {
  var NodeBuffer;
  try {
    _require = __require;
    NodeBuffer = _require("buffer").Buffer;
  } catch (__) {}
  var _require;
  var Type = require_type();
  var BASE64_MAP = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function resolveYamlBinary(data) {
    if (data === null)
      return false;
    var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;
    for (idx = 0;idx < max; idx++) {
      code = map.indexOf(data.charAt(idx));
      if (code > 64)
        continue;
      if (code < 0)
        return false;
      bitlen += 6;
    }
    return bitlen % 8 === 0;
  }
  function constructYamlBinary(data) {
    var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map = BASE64_MAP, bits = 0, result = [];
    for (idx = 0;idx < max; idx++) {
      if (idx % 4 === 0 && idx) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
      }
      bits = bits << 6 | map.indexOf(input.charAt(idx));
    }
    tailbits = max % 4 * 6;
    if (tailbits === 0) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    } else if (tailbits === 18) {
      result.push(bits >> 10 & 255);
      result.push(bits >> 2 & 255);
    } else if (tailbits === 12) {
      result.push(bits >> 4 & 255);
    }
    if (NodeBuffer) {
      return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
    }
    return result;
  }
  function representYamlBinary(object) {
    var result = "", bits = 0, idx, tail, max = object.length, map = BASE64_MAP;
    for (idx = 0;idx < max; idx++) {
      if (idx % 3 === 0 && idx) {
        result += map[bits >> 18 & 63];
        result += map[bits >> 12 & 63];
        result += map[bits >> 6 & 63];
        result += map[bits & 63];
      }
      bits = (bits << 8) + object[idx];
    }
    tail = max % 3;
    if (tail === 0) {
      result += map[bits >> 18 & 63];
      result += map[bits >> 12 & 63];
      result += map[bits >> 6 & 63];
      result += map[bits & 63];
    } else if (tail === 2) {
      result += map[bits >> 10 & 63];
      result += map[bits >> 4 & 63];
      result += map[bits << 2 & 63];
      result += map[64];
    } else if (tail === 1) {
      result += map[bits >> 2 & 63];
      result += map[bits << 4 & 63];
      result += map[64];
      result += map[64];
    }
    return result;
  }
  function isBinary(object) {
    return NodeBuffer && NodeBuffer.isBuffer(object);
  }
  module.exports = new Type("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: resolveYamlBinary,
    construct: constructYamlBinary,
    predicate: isBinary,
    represent: representYamlBinary
  });
});

// node_modules/js-yaml/lib/js-yaml/type/omap.js
var require_omap = __commonJS((exports, module) => {
  var Type = require_type();
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  var _toString = Object.prototype.toString;
  function resolveYamlOmap(data) {
    if (data === null)
      return true;
    var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
    for (index = 0, length = object.length;index < length; index += 1) {
      pair = object[index];
      pairHasKey = false;
      if (_toString.call(pair) !== "[object Object]")
        return false;
      for (pairKey in pair) {
        if (_hasOwnProperty.call(pair, pairKey)) {
          if (!pairHasKey)
            pairHasKey = true;
          else
            return false;
        }
      }
      if (!pairHasKey)
        return false;
      if (objectKeys.indexOf(pairKey) === -1)
        objectKeys.push(pairKey);
      else
        return false;
    }
    return true;
  }
  function constructYamlOmap(data) {
    return data !== null ? data : [];
  }
  module.exports = new Type("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: resolveYamlOmap,
    construct: constructYamlOmap
  });
});

// node_modules/js-yaml/lib/js-yaml/type/pairs.js
var require_pairs = __commonJS((exports, module) => {
  var Type = require_type();
  var _toString = Object.prototype.toString;
  function resolveYamlPairs(data) {
    if (data === null)
      return true;
    var index, length, pair, keys, result, object = data;
    result = new Array(object.length);
    for (index = 0, length = object.length;index < length; index += 1) {
      pair = object[index];
      if (_toString.call(pair) !== "[object Object]")
        return false;
      keys = Object.keys(pair);
      if (keys.length !== 1)
        return false;
      result[index] = [keys[0], pair[keys[0]]];
    }
    return true;
  }
  function constructYamlPairs(data) {
    if (data === null)
      return [];
    var index, length, pair, keys, result, object = data;
    result = new Array(object.length);
    for (index = 0, length = object.length;index < length; index += 1) {
      pair = object[index];
      keys = Object.keys(pair);
      result[index] = [keys[0], pair[keys[0]]];
    }
    return result;
  }
  module.exports = new Type("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: resolveYamlPairs,
    construct: constructYamlPairs
  });
});

// node_modules/js-yaml/lib/js-yaml/type/set.js
var require_set = __commonJS((exports, module) => {
  var Type = require_type();
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  function resolveYamlSet(data) {
    if (data === null)
      return true;
    var key, object = data;
    for (key in object) {
      if (_hasOwnProperty.call(object, key)) {
        if (object[key] !== null)
          return false;
      }
    }
    return true;
  }
  function constructYamlSet(data) {
    return data !== null ? data : {};
  }
  module.exports = new Type("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: resolveYamlSet,
    construct: constructYamlSet
  });
});

// node_modules/js-yaml/lib/js-yaml/schema/default_safe.js
var require_default_safe = __commonJS((exports, module) => {
  var Schema = require_schema();
  module.exports = new Schema({
    include: [
      require_core()
    ],
    implicit: [
      require_timestamp(),
      require_merge()
    ],
    explicit: [
      require_binary(),
      require_omap(),
      require_pairs(),
      require_set()
    ]
  });
});

// node_modules/js-yaml/lib/js-yaml/type/js/undefined.js
var require_undefined = __commonJS((exports, module) => {
  var Type = require_type();
  function resolveJavascriptUndefined() {
    return true;
  }
  function constructJavascriptUndefined() {
    return;
  }
  function representJavascriptUndefined() {
    return "";
  }
  function isUndefined(object) {
    return typeof object === "undefined";
  }
  module.exports = new Type("tag:yaml.org,2002:js/undefined", {
    kind: "scalar",
    resolve: resolveJavascriptUndefined,
    construct: constructJavascriptUndefined,
    predicate: isUndefined,
    represent: representJavascriptUndefined
  });
});

// node_modules/js-yaml/lib/js-yaml/type/js/regexp.js
var require_regexp = __commonJS((exports, module) => {
  var Type = require_type();
  function resolveJavascriptRegExp(data) {
    if (data === null)
      return false;
    if (data.length === 0)
      return false;
    var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = "";
    if (regexp[0] === "/") {
      if (tail)
        modifiers = tail[1];
      if (modifiers.length > 3)
        return false;
      if (regexp[regexp.length - modifiers.length - 1] !== "/")
        return false;
    }
    return true;
  }
  function constructJavascriptRegExp(data) {
    var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = "";
    if (regexp[0] === "/") {
      if (tail)
        modifiers = tail[1];
      regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
    }
    return new RegExp(regexp, modifiers);
  }
  function representJavascriptRegExp(object) {
    var result = "/" + object.source + "/";
    if (object.global)
      result += "g";
    if (object.multiline)
      result += "m";
    if (object.ignoreCase)
      result += "i";
    return result;
  }
  function isRegExp(object) {
    return Object.prototype.toString.call(object) === "[object RegExp]";
  }
  module.exports = new Type("tag:yaml.org,2002:js/regexp", {
    kind: "scalar",
    resolve: resolveJavascriptRegExp,
    construct: constructJavascriptRegExp,
    predicate: isRegExp,
    represent: representJavascriptRegExp
  });
});

// node_modules/js-yaml/lib/js-yaml/type/js/function.js
var require_function = __commonJS((exports, module) => {
  var esprima;
  try {
    _require = __require;
    esprima = _require("esprima");
  } catch (_4) {
    if (typeof window !== "undefined")
      esprima = window.esprima;
  }
  var _require;
  var Type = require_type();
  function resolveJavascriptFunction(data) {
    if (data === null)
      return false;
    try {
      var source = "(" + data + ")", ast = esprima.parse(source, { range: true });
      if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement" || ast.body[0].expression.type !== "ArrowFunctionExpression" && ast.body[0].expression.type !== "FunctionExpression") {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  function constructJavascriptFunction(data) {
    var source = "(" + data + ")", ast = esprima.parse(source, { range: true }), params = [], body;
    if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement" || ast.body[0].expression.type !== "ArrowFunctionExpression" && ast.body[0].expression.type !== "FunctionExpression") {
      throw new Error("Failed to resolve function");
    }
    ast.body[0].expression.params.forEach(function(param) {
      params.push(param.name);
    });
    body = ast.body[0].expression.body.range;
    if (ast.body[0].expression.body.type === "BlockStatement") {
      return new Function(params, source.slice(body[0] + 1, body[1] - 1));
    }
    return new Function(params, "return " + source.slice(body[0], body[1]));
  }
  function representJavascriptFunction(object) {
    return object.toString();
  }
  function isFunction(object) {
    return Object.prototype.toString.call(object) === "[object Function]";
  }
  module.exports = new Type("tag:yaml.org,2002:js/function", {
    kind: "scalar",
    resolve: resolveJavascriptFunction,
    construct: constructJavascriptFunction,
    predicate: isFunction,
    represent: representJavascriptFunction
  });
});

// node_modules/js-yaml/lib/js-yaml/schema/default_full.js
var require_default_full = __commonJS((exports, module) => {
  var Schema = require_schema();
  module.exports = Schema.DEFAULT = new Schema({
    include: [
      require_default_safe()
    ],
    explicit: [
      require_undefined(),
      require_regexp(),
      require_function()
    ]
  });
});

// node_modules/js-yaml/lib/js-yaml/loader.js
var require_loader = __commonJS((exports, module) => {
  var common = require_common();
  var YAMLException = require_exception();
  var Mark = require_mark();
  var DEFAULT_SAFE_SCHEMA = require_default_safe();
  var DEFAULT_FULL_SCHEMA = require_default_full();
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  var CONTEXT_FLOW_IN = 1;
  var CONTEXT_FLOW_OUT = 2;
  var CONTEXT_BLOCK_IN = 3;
  var CONTEXT_BLOCK_OUT = 4;
  var CHOMPING_CLIP = 1;
  var CHOMPING_STRIP = 2;
  var CHOMPING_KEEP = 3;
  var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
  var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
  var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
  var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function _class(obj) {
    return Object.prototype.toString.call(obj);
  }
  function is_EOL(c4) {
    return c4 === 10 || c4 === 13;
  }
  function is_WHITE_SPACE(c4) {
    return c4 === 9 || c4 === 32;
  }
  function is_WS_OR_EOL(c4) {
    return c4 === 9 || c4 === 32 || c4 === 10 || c4 === 13;
  }
  function is_FLOW_INDICATOR(c4) {
    return c4 === 44 || c4 === 91 || c4 === 93 || c4 === 123 || c4 === 125;
  }
  function fromHexCode(c4) {
    var lc;
    if (48 <= c4 && c4 <= 57) {
      return c4 - 48;
    }
    lc = c4 | 32;
    if (97 <= lc && lc <= 102) {
      return lc - 97 + 10;
    }
    return -1;
  }
  function escapedHexLen(c4) {
    if (c4 === 120) {
      return 2;
    }
    if (c4 === 117) {
      return 4;
    }
    if (c4 === 85) {
      return 8;
    }
    return 0;
  }
  function fromDecimalCode(c4) {
    if (48 <= c4 && c4 <= 57) {
      return c4 - 48;
    }
    return -1;
  }
  function simpleEscapeSequence(c4) {
    return c4 === 48 ? "\x00" : c4 === 97 ? "\x07" : c4 === 98 ? "\b" : c4 === 116 ? "\t" : c4 === 9 ? "\t" : c4 === 110 ? `
` : c4 === 118 ? "\v" : c4 === 102 ? "\f" : c4 === 114 ? "\r" : c4 === 101 ? "\x1B" : c4 === 32 ? " " : c4 === 34 ? '"' : c4 === 47 ? "/" : c4 === 92 ? "\\" : c4 === 78 ? "" : c4 === 95 ? " " : c4 === 76 ? "\u2028" : c4 === 80 ? "\u2029" : "";
  }
  function charFromCodepoint(c4) {
    if (c4 <= 65535) {
      return String.fromCharCode(c4);
    }
    return String.fromCharCode((c4 - 65536 >> 10) + 55296, (c4 - 65536 & 1023) + 56320);
  }
  function setProperty(object, key, value) {
    if (key === "__proto__") {
      Object.defineProperty(object, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value
      });
    } else {
      object[key] = value;
    }
  }
  var simpleEscapeCheck = new Array(256);
  var simpleEscapeMap = new Array(256);
  for (i4 = 0;i4 < 256; i4++) {
    simpleEscapeCheck[i4] = simpleEscapeSequence(i4) ? 1 : 0;
    simpleEscapeMap[i4] = simpleEscapeSequence(i4);
  }
  var i4;
  function State(input, options2) {
    this.input = input;
    this.filename = options2["filename"] || null;
    this.schema = options2["schema"] || DEFAULT_FULL_SCHEMA;
    this.onWarning = options2["onWarning"] || null;
    this.legacy = options2["legacy"] || false;
    this.json = options2["json"] || false;
    this.listener = options2["listener"] || null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.typeMap = this.schema.compiledTypeMap;
    this.length = input.length;
    this.position = 0;
    this.line = 0;
    this.lineStart = 0;
    this.lineIndent = 0;
    this.documents = [];
  }
  function generateError(state, message) {
    return new YAMLException(message, new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart));
  }
  function throwError(state, message) {
    throw generateError(state, message);
  }
  function throwWarning(state, message) {
    if (state.onWarning) {
      state.onWarning.call(null, generateError(state, message));
    }
  }
  var directiveHandlers = {
    YAML: function handleYamlDirective(state, name, args) {
      var match, major, minor;
      if (state.version !== null) {
        throwError(state, "duplication of %YAML directive");
      }
      if (args.length !== 1) {
        throwError(state, "YAML directive accepts exactly one argument");
      }
      match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
      if (match === null) {
        throwError(state, "ill-formed argument of the YAML directive");
      }
      major = parseInt(match[1], 10);
      minor = parseInt(match[2], 10);
      if (major !== 1) {
        throwError(state, "unacceptable YAML version of the document");
      }
      state.version = args[0];
      state.checkLineBreaks = minor < 2;
      if (minor !== 1 && minor !== 2) {
        throwWarning(state, "unsupported YAML version of the document");
      }
    },
    TAG: function handleTagDirective(state, name, args) {
      var handle, prefix;
      if (args.length !== 2) {
        throwError(state, "TAG directive accepts exactly two arguments");
      }
      handle = args[0];
      prefix = args[1];
      if (!PATTERN_TAG_HANDLE.test(handle)) {
        throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
      }
      if (_hasOwnProperty.call(state.tagMap, handle)) {
        throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
      }
      if (!PATTERN_TAG_URI.test(prefix)) {
        throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
      }
      state.tagMap[handle] = prefix;
    }
  };
  function captureSegment(state, start, end, checkJson) {
    var _position, _length, _character, _result;
    if (start < end) {
      _result = state.input.slice(start, end);
      if (checkJson) {
        for (_position = 0, _length = _result.length;_position < _length; _position += 1) {
          _character = _result.charCodeAt(_position);
          if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
            throwError(state, "expected valid JSON character");
          }
        }
      } else if (PATTERN_NON_PRINTABLE.test(_result)) {
        throwError(state, "the stream contains non-printable characters");
      }
      state.result += _result;
    }
  }
  function mergeMappings(state, destination, source, overridableKeys) {
    var sourceKeys, key, index, quantity;
    if (!common.isObject(source)) {
      throwError(state, "cannot merge mappings; the provided source object is unacceptable");
    }
    sourceKeys = Object.keys(source);
    for (index = 0, quantity = sourceKeys.length;index < quantity; index += 1) {
      key = sourceKeys[index];
      if (!_hasOwnProperty.call(destination, key)) {
        setProperty(destination, key, source[key]);
        overridableKeys[key] = true;
      }
    }
  }
  function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
    var index, quantity;
    if (Array.isArray(keyNode)) {
      keyNode = Array.prototype.slice.call(keyNode);
      for (index = 0, quantity = keyNode.length;index < quantity; index += 1) {
        if (Array.isArray(keyNode[index])) {
          throwError(state, "nested arrays are not supported inside keys");
        }
        if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
          keyNode[index] = "[object Object]";
        }
      }
    }
    if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
      keyNode = "[object Object]";
    }
    keyNode = String(keyNode);
    if (_result === null) {
      _result = {};
    }
    if (keyTag === "tag:yaml.org,2002:merge") {
      if (Array.isArray(valueNode)) {
        for (index = 0, quantity = valueNode.length;index < quantity; index += 1) {
          mergeMappings(state, _result, valueNode[index], overridableKeys);
        }
      } else {
        mergeMappings(state, _result, valueNode, overridableKeys);
      }
    } else {
      if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
        state.line = startLine || state.line;
        state.position = startPos || state.position;
        throwError(state, "duplicated mapping key");
      }
      setProperty(_result, keyNode, valueNode);
      delete overridableKeys[keyNode];
    }
    return _result;
  }
  function readLineBreak(state) {
    var ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 10) {
      state.position++;
    } else if (ch === 13) {
      state.position++;
      if (state.input.charCodeAt(state.position) === 10) {
        state.position++;
      }
    } else {
      throwError(state, "a line break is expected");
    }
    state.line += 1;
    state.lineStart = state.position;
  }
  function skipSeparationSpace(state, allowComments, checkIndent) {
    var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (allowComments && ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 10 && ch !== 13 && ch !== 0);
      }
      if (is_EOL(ch)) {
        readLineBreak(state);
        ch = state.input.charCodeAt(state.position);
        lineBreaks++;
        state.lineIndent = 0;
        while (ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
      } else {
        break;
      }
    }
    if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
      throwWarning(state, "deficient indentation");
    }
    return lineBreaks;
  }
  function testDocumentSeparator(state) {
    var _position = state.position, ch;
    ch = state.input.charCodeAt(_position);
    if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
      _position += 3;
      ch = state.input.charCodeAt(_position);
      if (ch === 0 || is_WS_OR_EOL(ch)) {
        return true;
      }
    }
    return false;
  }
  function writeFoldedLines(state, count) {
    if (count === 1) {
      state.result += " ";
    } else if (count > 1) {
      state.result += common.repeat(`
`, count - 1);
    }
  }
  function readPlainScalar(state, nodeIndent, withinFlowCollection) {
    var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
    ch = state.input.charCodeAt(state.position);
    if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
      return false;
    }
    if (ch === 63 || ch === 45) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        return false;
      }
    }
    state.kind = "scalar";
    state.result = "";
    captureStart = captureEnd = state.position;
    hasPendingContent = false;
    while (ch !== 0) {
      if (ch === 58) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          break;
        }
      } else if (ch === 35) {
        preceding = state.input.charCodeAt(state.position - 1);
        if (is_WS_OR_EOL(preceding)) {
          break;
        }
      } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
        break;
      } else if (is_EOL(ch)) {
        _line = state.line;
        _lineStart = state.lineStart;
        _lineIndent = state.lineIndent;
        skipSeparationSpace(state, false, -1);
        if (state.lineIndent >= nodeIndent) {
          hasPendingContent = true;
          ch = state.input.charCodeAt(state.position);
          continue;
        } else {
          state.position = captureEnd;
          state.line = _line;
          state.lineStart = _lineStart;
          state.lineIndent = _lineIndent;
          break;
        }
      }
      if (hasPendingContent) {
        captureSegment(state, captureStart, captureEnd, false);
        writeFoldedLines(state, state.line - _line);
        captureStart = captureEnd = state.position;
        hasPendingContent = false;
      }
      if (!is_WHITE_SPACE(ch)) {
        captureEnd = state.position + 1;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, captureEnd, false);
    if (state.result) {
      return true;
    }
    state.kind = _kind;
    state.result = _result;
    return false;
  }
  function readSingleQuotedScalar(state, nodeIndent) {
    var ch, captureStart, captureEnd;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 39) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 39) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (ch === 39) {
          captureStart = state.position;
          state.position++;
          captureEnd = state.position;
        } else {
          return true;
        }
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a single quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a single quoted scalar");
  }
  function readDoubleQuotedScalar(state, nodeIndent) {
    var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 34) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 34) {
        captureSegment(state, captureStart, state.position, true);
        state.position++;
        return true;
      } else if (ch === 92) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (is_EOL(ch)) {
          skipSeparationSpace(state, false, nodeIndent);
        } else if (ch < 256 && simpleEscapeCheck[ch]) {
          state.result += simpleEscapeMap[ch];
          state.position++;
        } else if ((tmp = escapedHexLen(ch)) > 0) {
          hexLength = tmp;
          hexResult = 0;
          for (;hexLength > 0; hexLength--) {
            ch = state.input.charCodeAt(++state.position);
            if ((tmp = fromHexCode(ch)) >= 0) {
              hexResult = (hexResult << 4) + tmp;
            } else {
              throwError(state, "expected hexadecimal character");
            }
          }
          state.result += charFromCodepoint(hexResult);
          state.position++;
        } else {
          throwError(state, "unknown escape sequence");
        }
        captureStart = captureEnd = state.position;
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a double quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a double quoted scalar");
  }
  function readFlowCollection(state, nodeIndent) {
    var readNext = true, _line, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = {}, keyNode, keyTag, valueNode, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 91) {
      terminator = 93;
      isMapping = false;
      _result = [];
    } else if (ch === 123) {
      terminator = 125;
      isMapping = true;
      _result = {};
    } else {
      return false;
    }
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(++state.position);
    while (ch !== 0) {
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === terminator) {
        state.position++;
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = isMapping ? "mapping" : "sequence";
        state.result = _result;
        return true;
      } else if (!readNext) {
        throwError(state, "missed comma between flow collection entries");
      }
      keyTag = keyNode = valueNode = null;
      isPair = isExplicitPair = false;
      if (ch === 63) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following)) {
          isPair = isExplicitPair = true;
          state.position++;
          skipSeparationSpace(state, true, nodeIndent);
        }
      }
      _line = state.line;
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      keyTag = state.tag;
      keyNode = state.result;
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if ((isExplicitPair || state.line === _line) && ch === 58) {
        isPair = true;
        ch = state.input.charCodeAt(++state.position);
        skipSeparationSpace(state, true, nodeIndent);
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        valueNode = state.result;
      }
      if (isMapping) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
      } else if (isPair) {
        _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
      } else {
        _result.push(keyNode);
      }
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === 44) {
        readNext = true;
        ch = state.input.charCodeAt(++state.position);
      } else {
        readNext = false;
      }
    }
    throwError(state, "unexpected end of the stream within a flow collection");
  }
  function readBlockScalar(state, nodeIndent) {
    var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 124) {
      folding = false;
    } else if (ch === 62) {
      folding = true;
    } else {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    while (ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
      if (ch === 43 || ch === 45) {
        if (CHOMPING_CLIP === chomping) {
          chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
        } else {
          throwError(state, "repeat of a chomping mode identifier");
        }
      } else if ((tmp = fromDecimalCode(ch)) >= 0) {
        if (tmp === 0) {
          throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
        } else if (!detectedIndent) {
          textIndent = nodeIndent + tmp - 1;
          detectedIndent = true;
        } else {
          throwError(state, "repeat of an indentation width identifier");
        }
      } else {
        break;
      }
    }
    if (is_WHITE_SPACE(ch)) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (is_WHITE_SPACE(ch));
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (!is_EOL(ch) && ch !== 0);
      }
    }
    while (ch !== 0) {
      readLineBreak(state);
      state.lineIndent = 0;
      ch = state.input.charCodeAt(state.position);
      while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
      if (!detectedIndent && state.lineIndent > textIndent) {
        textIndent = state.lineIndent;
      }
      if (is_EOL(ch)) {
        emptyLines++;
        continue;
      }
      if (state.lineIndent < textIndent) {
        if (chomping === CHOMPING_KEEP) {
          state.result += common.repeat(`
`, didReadContent ? 1 + emptyLines : emptyLines);
        } else if (chomping === CHOMPING_CLIP) {
          if (didReadContent) {
            state.result += `
`;
          }
        }
        break;
      }
      if (folding) {
        if (is_WHITE_SPACE(ch)) {
          atMoreIndented = true;
          state.result += common.repeat(`
`, didReadContent ? 1 + emptyLines : emptyLines);
        } else if (atMoreIndented) {
          atMoreIndented = false;
          state.result += common.repeat(`
`, emptyLines + 1);
        } else if (emptyLines === 0) {
          if (didReadContent) {
            state.result += " ";
          }
        } else {
          state.result += common.repeat(`
`, emptyLines);
        }
      } else {
        state.result += common.repeat(`
`, didReadContent ? 1 + emptyLines : emptyLines);
      }
      didReadContent = true;
      detectedIndent = true;
      emptyLines = 0;
      captureStart = state.position;
      while (!is_EOL(ch) && ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, state.position, false);
    }
    return true;
  }
  function readBlockSequence(state, nodeIndent) {
    var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (ch !== 45) {
        break;
      }
      following = state.input.charCodeAt(state.position + 1);
      if (!is_WS_OR_EOL(following)) {
        break;
      }
      detected = true;
      state.position++;
      if (skipSeparationSpace(state, true, -1)) {
        if (state.lineIndent <= nodeIndent) {
          _result.push(null);
          ch = state.input.charCodeAt(state.position);
          continue;
        }
      }
      _line = state.line;
      composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
      _result.push(state.result);
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a sequence entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "sequence";
      state.result = _result;
      return true;
    }
    return false;
  }
  function readBlockMapping(state, nodeIndent, flowIndent) {
    var following, allowCompact, _line, _pos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = {}, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      following = state.input.charCodeAt(state.position + 1);
      _line = state.line;
      _pos = state.position;
      if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
        if (ch === 63) {
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = true;
          allowCompact = true;
        } else if (atExplicitKey) {
          atExplicitKey = false;
          allowCompact = true;
        } else {
          throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
        }
        state.position += 1;
        ch = following;
      } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        if (state.line === _line) {
          ch = state.input.charCodeAt(state.position);
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 58) {
            ch = state.input.charCodeAt(++state.position);
            if (!is_WS_OR_EOL(ch)) {
              throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
            }
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = false;
            allowCompact = false;
            keyTag = state.tag;
            keyNode = state.result;
          } else if (detected) {
            throwError(state, "can not read an implicit mapping pair; a colon is missed");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        } else if (detected) {
          throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else {
        break;
      }
      if (state.line === _line || state.lineIndent > nodeIndent) {
        if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
          if (atExplicitKey) {
            keyNode = state.result;
          } else {
            valueNode = state.result;
          }
        }
        if (!atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
          keyTag = keyNode = valueNode = null;
        }
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
      }
      if (state.lineIndent > nodeIndent && ch !== 0) {
        throwError(state, "bad indentation of a mapping entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (atExplicitKey) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "mapping";
      state.result = _result;
    }
    return detected;
  }
  function readTagProperty(state) {
    var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 33)
      return false;
    if (state.tag !== null) {
      throwError(state, "duplication of a tag property");
    }
    ch = state.input.charCodeAt(++state.position);
    if (ch === 60) {
      isVerbatim = true;
      ch = state.input.charCodeAt(++state.position);
    } else if (ch === 33) {
      isNamed = true;
      tagHandle = "!!";
      ch = state.input.charCodeAt(++state.position);
    } else {
      tagHandle = "!";
    }
    _position = state.position;
    if (isVerbatim) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0 && ch !== 62);
      if (state.position < state.length) {
        tagName = state.input.slice(_position, state.position);
        ch = state.input.charCodeAt(++state.position);
      } else {
        throwError(state, "unexpected end of the stream within a verbatim tag");
      }
    } else {
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        if (ch === 33) {
          if (!isNamed) {
            tagHandle = state.input.slice(_position - 1, state.position + 1);
            if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
              throwError(state, "named tag handle cannot contain such characters");
            }
            isNamed = true;
            _position = state.position + 1;
          } else {
            throwError(state, "tag suffix cannot contain exclamation marks");
          }
        }
        ch = state.input.charCodeAt(++state.position);
      }
      tagName = state.input.slice(_position, state.position);
      if (PATTERN_FLOW_INDICATORS.test(tagName)) {
        throwError(state, "tag suffix cannot contain flow indicator characters");
      }
    }
    if (tagName && !PATTERN_TAG_URI.test(tagName)) {
      throwError(state, "tag name cannot contain such characters: " + tagName);
    }
    if (isVerbatim) {
      state.tag = tagName;
    } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
      state.tag = state.tagMap[tagHandle] + tagName;
    } else if (tagHandle === "!") {
      state.tag = "!" + tagName;
    } else if (tagHandle === "!!") {
      state.tag = "tag:yaml.org,2002:" + tagName;
    } else {
      throwError(state, 'undeclared tag handle "' + tagHandle + '"');
    }
    return true;
  }
  function readAnchorProperty(state) {
    var _position, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 38)
      return false;
    if (state.anchor !== null) {
      throwError(state, "duplication of an anchor property");
    }
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an anchor node must contain at least one character");
    }
    state.anchor = state.input.slice(_position, state.position);
    return true;
  }
  function readAlias(state) {
    var _position, alias, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 42)
      return false;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an alias node must contain at least one character");
    }
    alias = state.input.slice(_position, state.position);
    if (!_hasOwnProperty.call(state.anchorMap, alias)) {
      throwError(state, 'unidentified alias "' + alias + '"');
    }
    state.result = state.anchorMap[alias];
    skipSeparationSpace(state, true, -1);
    return true;
  }
  function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, type, flowIndent, blockIndent;
    if (state.listener !== null) {
      state.listener("open", state);
    }
    state.tag = null;
    state.anchor = null;
    state.kind = null;
    state.result = null;
    allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
    if (allowToSeek) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      }
    }
    if (indentStatus === 1) {
      while (readTagProperty(state) || readAnchorProperty(state)) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          allowBlockCollections = allowBlockStyles;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        } else {
          allowBlockCollections = false;
        }
      }
    }
    if (allowBlockCollections) {
      allowBlockCollections = atNewLine || allowCompact;
    }
    if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
      if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
        flowIndent = parentIndent;
      } else {
        flowIndent = parentIndent + 1;
      }
      blockIndent = state.position - state.lineStart;
      if (indentStatus === 1) {
        if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
          hasContent = true;
        } else {
          if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
            hasContent = true;
          } else if (readAlias(state)) {
            hasContent = true;
            if (state.tag !== null || state.anchor !== null) {
              throwError(state, "alias node should not have any properties");
            }
          } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
            hasContent = true;
            if (state.tag === null) {
              state.tag = "?";
            }
          }
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      } else if (indentStatus === 0) {
        hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
      }
    }
    if (state.tag !== null && state.tag !== "!") {
      if (state.tag === "?") {
        if (state.result !== null && state.kind !== "scalar") {
          throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
        }
        for (typeIndex = 0, typeQuantity = state.implicitTypes.length;typeIndex < typeQuantity; typeIndex += 1) {
          type = state.implicitTypes[typeIndex];
          if (type.resolve(state.result)) {
            state.result = type.construct(state.result);
            state.tag = type.tag;
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
            break;
          }
        }
      } else if (_hasOwnProperty.call(state.typeMap[state.kind || "fallback"], state.tag)) {
        type = state.typeMap[state.kind || "fallback"][state.tag];
        if (state.result !== null && type.kind !== state.kind) {
          throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
        }
        if (!type.resolve(state.result)) {
          throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
        } else {
          state.result = type.construct(state.result);
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      } else {
        throwError(state, "unknown tag !<" + state.tag + ">");
      }
    }
    if (state.listener !== null) {
      state.listener("close", state);
    }
    return state.tag !== null || state.anchor !== null || hasContent;
  }
  function readDocument(state) {
    var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
    state.version = null;
    state.checkLineBreaks = state.legacy;
    state.tagMap = {};
    state.anchorMap = {};
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if (state.lineIndent > 0 || ch !== 37) {
        break;
      }
      hasDirectives = true;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveName = state.input.slice(_position, state.position);
      directiveArgs = [];
      if (directiveName.length < 1) {
        throwError(state, "directive name must not be less than one character in length");
      }
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0 && !is_EOL(ch));
          break;
        }
        if (is_EOL(ch))
          break;
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveArgs.push(state.input.slice(_position, state.position));
      }
      if (ch !== 0)
        readLineBreak(state);
      if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
        directiveHandlers[directiveName](state, directiveName, directiveArgs);
      } else {
        throwWarning(state, 'unknown document directive "' + directiveName + '"');
      }
    }
    skipSeparationSpace(state, true, -1);
    if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    } else if (hasDirectives) {
      throwError(state, "directives end mark is expected");
    }
    composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
    skipSeparationSpace(state, true, -1);
    if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
      throwWarning(state, "non-ASCII line breaks are interpreted as content");
    }
    state.documents.push(state.result);
    if (state.position === state.lineStart && testDocumentSeparator(state)) {
      if (state.input.charCodeAt(state.position) === 46) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      }
      return;
    }
    if (state.position < state.length - 1) {
      throwError(state, "end of the stream or a document separator is expected");
    } else {
      return;
    }
  }
  function loadDocuments(input, options2) {
    input = String(input);
    options2 = options2 || {};
    if (input.length !== 0) {
      if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
        input += `
`;
      }
      if (input.charCodeAt(0) === 65279) {
        input = input.slice(1);
      }
    }
    var state = new State(input, options2);
    var nullpos = input.indexOf("\x00");
    if (nullpos !== -1) {
      state.position = nullpos;
      throwError(state, "null byte is not allowed in input");
    }
    state.input += "\x00";
    while (state.input.charCodeAt(state.position) === 32) {
      state.lineIndent += 1;
      state.position += 1;
    }
    while (state.position < state.length - 1) {
      readDocument(state);
    }
    return state.documents;
  }
  function loadAll(input, iterator, options2) {
    if (iterator !== null && typeof iterator === "object" && typeof options2 === "undefined") {
      options2 = iterator;
      iterator = null;
    }
    var documents = loadDocuments(input, options2);
    if (typeof iterator !== "function") {
      return documents;
    }
    for (var index = 0, length = documents.length;index < length; index += 1) {
      iterator(documents[index]);
    }
  }
  function load(input, options2) {
    var documents = loadDocuments(input, options2);
    if (documents.length === 0) {
      return;
    } else if (documents.length === 1) {
      return documents[0];
    }
    throw new YAMLException("expected a single document in the stream, but found more");
  }
  function safeLoadAll(input, iterator, options2) {
    if (typeof iterator === "object" && iterator !== null && typeof options2 === "undefined") {
      options2 = iterator;
      iterator = null;
    }
    return loadAll(input, iterator, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
  }
  function safeLoad(input, options2) {
    return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
  }
  exports.loadAll = loadAll;
  exports.load = load;
  exports.safeLoadAll = safeLoadAll;
  exports.safeLoad = safeLoad;
});

// node_modules/js-yaml/lib/js-yaml/dumper.js
var require_dumper = __commonJS((exports, module) => {
  var common = require_common();
  var YAMLException = require_exception();
  var DEFAULT_FULL_SCHEMA = require_default_full();
  var DEFAULT_SAFE_SCHEMA = require_default_safe();
  var _toString = Object.prototype.toString;
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  var CHAR_TAB = 9;
  var CHAR_LINE_FEED = 10;
  var CHAR_CARRIAGE_RETURN = 13;
  var CHAR_SPACE = 32;
  var CHAR_EXCLAMATION = 33;
  var CHAR_DOUBLE_QUOTE = 34;
  var CHAR_SHARP = 35;
  var CHAR_PERCENT = 37;
  var CHAR_AMPERSAND = 38;
  var CHAR_SINGLE_QUOTE = 39;
  var CHAR_ASTERISK = 42;
  var CHAR_COMMA = 44;
  var CHAR_MINUS = 45;
  var CHAR_COLON = 58;
  var CHAR_EQUALS = 61;
  var CHAR_GREATER_THAN = 62;
  var CHAR_QUESTION = 63;
  var CHAR_COMMERCIAL_AT = 64;
  var CHAR_LEFT_SQUARE_BRACKET = 91;
  var CHAR_RIGHT_SQUARE_BRACKET = 93;
  var CHAR_GRAVE_ACCENT = 96;
  var CHAR_LEFT_CURLY_BRACKET = 123;
  var CHAR_VERTICAL_LINE = 124;
  var CHAR_RIGHT_CURLY_BRACKET = 125;
  var ESCAPE_SEQUENCES = {};
  ESCAPE_SEQUENCES[0] = "\\0";
  ESCAPE_SEQUENCES[7] = "\\a";
  ESCAPE_SEQUENCES[8] = "\\b";
  ESCAPE_SEQUENCES[9] = "\\t";
  ESCAPE_SEQUENCES[10] = "\\n";
  ESCAPE_SEQUENCES[11] = "\\v";
  ESCAPE_SEQUENCES[12] = "\\f";
  ESCAPE_SEQUENCES[13] = "\\r";
  ESCAPE_SEQUENCES[27] = "\\e";
  ESCAPE_SEQUENCES[34] = "\\\"";
  ESCAPE_SEQUENCES[92] = "\\\\";
  ESCAPE_SEQUENCES[133] = "\\N";
  ESCAPE_SEQUENCES[160] = "\\_";
  ESCAPE_SEQUENCES[8232] = "\\L";
  ESCAPE_SEQUENCES[8233] = "\\P";
  var DEPRECATED_BOOLEANS_SYNTAX = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ];
  function compileStyleMap(schema, map) {
    var result, keys, index, length, tag, style, type;
    if (map === null)
      return {};
    result = {};
    keys = Object.keys(map);
    for (index = 0, length = keys.length;index < length; index += 1) {
      tag = keys[index];
      style = String(map[tag]);
      if (tag.slice(0, 2) === "!!") {
        tag = "tag:yaml.org,2002:" + tag.slice(2);
      }
      type = schema.compiledTypeMap["fallback"][tag];
      if (type && _hasOwnProperty.call(type.styleAliases, style)) {
        style = type.styleAliases[style];
      }
      result[tag] = style;
    }
    return result;
  }
  function encodeHex(character) {
    var string, handle, length;
    string = character.toString(16).toUpperCase();
    if (character <= 255) {
      handle = "x";
      length = 2;
    } else if (character <= 65535) {
      handle = "u";
      length = 4;
    } else if (character <= 4294967295) {
      handle = "U";
      length = 8;
    } else {
      throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");
    }
    return "\\" + handle + common.repeat("0", length - string.length) + string;
  }
  function State(options2) {
    this.schema = options2["schema"] || DEFAULT_FULL_SCHEMA;
    this.indent = Math.max(1, options2["indent"] || 2);
    this.noArrayIndent = options2["noArrayIndent"] || false;
    this.skipInvalid = options2["skipInvalid"] || false;
    this.flowLevel = common.isNothing(options2["flowLevel"]) ? -1 : options2["flowLevel"];
    this.styleMap = compileStyleMap(this.schema, options2["styles"] || null);
    this.sortKeys = options2["sortKeys"] || false;
    this.lineWidth = options2["lineWidth"] || 80;
    this.noRefs = options2["noRefs"] || false;
    this.noCompatMode = options2["noCompatMode"] || false;
    this.condenseFlow = options2["condenseFlow"] || false;
    this.implicitTypes = this.schema.compiledImplicit;
    this.explicitTypes = this.schema.compiledExplicit;
    this.tag = null;
    this.result = "";
    this.duplicates = [];
    this.usedDuplicates = null;
  }
  function indentString(string, spaces) {
    var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
    while (position < length) {
      next = string.indexOf(`
`, position);
      if (next === -1) {
        line = string.slice(position);
        position = length;
      } else {
        line = string.slice(position, next + 1);
        position = next + 1;
      }
      if (line.length && line !== `
`)
        result += ind;
      result += line;
    }
    return result;
  }
  function generateNextLine(state, level) {
    return `
` + common.repeat(" ", state.indent * level);
  }
  function testImplicitResolving(state, str2) {
    var index, length, type;
    for (index = 0, length = state.implicitTypes.length;index < length; index += 1) {
      type = state.implicitTypes[index];
      if (type.resolve(str2)) {
        return true;
      }
    }
    return false;
  }
  function isWhitespace(c4) {
    return c4 === CHAR_SPACE || c4 === CHAR_TAB;
  }
  function isPrintable(c4) {
    return 32 <= c4 && c4 <= 126 || 161 <= c4 && c4 <= 55295 && c4 !== 8232 && c4 !== 8233 || 57344 <= c4 && c4 <= 65533 && c4 !== 65279 || 65536 <= c4 && c4 <= 1114111;
  }
  function isNsChar(c4) {
    return isPrintable(c4) && !isWhitespace(c4) && c4 !== 65279 && c4 !== CHAR_CARRIAGE_RETURN && c4 !== CHAR_LINE_FEED;
  }
  function isPlainSafe(c4, prev) {
    return isPrintable(c4) && c4 !== 65279 && c4 !== CHAR_COMMA && c4 !== CHAR_LEFT_SQUARE_BRACKET && c4 !== CHAR_RIGHT_SQUARE_BRACKET && c4 !== CHAR_LEFT_CURLY_BRACKET && c4 !== CHAR_RIGHT_CURLY_BRACKET && c4 !== CHAR_COLON && (c4 !== CHAR_SHARP || prev && isNsChar(prev));
  }
  function isPlainSafeFirst(c4) {
    return isPrintable(c4) && c4 !== 65279 && !isWhitespace(c4) && c4 !== CHAR_MINUS && c4 !== CHAR_QUESTION && c4 !== CHAR_COLON && c4 !== CHAR_COMMA && c4 !== CHAR_LEFT_SQUARE_BRACKET && c4 !== CHAR_RIGHT_SQUARE_BRACKET && c4 !== CHAR_LEFT_CURLY_BRACKET && c4 !== CHAR_RIGHT_CURLY_BRACKET && c4 !== CHAR_SHARP && c4 !== CHAR_AMPERSAND && c4 !== CHAR_ASTERISK && c4 !== CHAR_EXCLAMATION && c4 !== CHAR_VERTICAL_LINE && c4 !== CHAR_EQUALS && c4 !== CHAR_GREATER_THAN && c4 !== CHAR_SINGLE_QUOTE && c4 !== CHAR_DOUBLE_QUOTE && c4 !== CHAR_PERCENT && c4 !== CHAR_COMMERCIAL_AT && c4 !== CHAR_GRAVE_ACCENT;
  }
  function needIndentIndicator(string) {
    var leadingSpaceRe = /^\n* /;
    return leadingSpaceRe.test(string);
  }
  var STYLE_PLAIN = 1;
  var STYLE_SINGLE = 2;
  var STYLE_LITERAL = 3;
  var STYLE_FOLDED = 4;
  var STYLE_DOUBLE = 5;
  function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
    var i4;
    var char, prev_char;
    var hasLineBreak = false;
    var hasFoldableLine = false;
    var shouldTrackWidth = lineWidth !== -1;
    var previousLineBreak = -1;
    var plain = isPlainSafeFirst(string.charCodeAt(0)) && !isWhitespace(string.charCodeAt(string.length - 1));
    if (singleLineOnly) {
      for (i4 = 0;i4 < string.length; i4++) {
        char = string.charCodeAt(i4);
        if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        prev_char = i4 > 0 ? string.charCodeAt(i4 - 1) : null;
        plain = plain && isPlainSafe(char, prev_char);
      }
    } else {
      for (i4 = 0;i4 < string.length; i4++) {
        char = string.charCodeAt(i4);
        if (char === CHAR_LINE_FEED) {
          hasLineBreak = true;
          if (shouldTrackWidth) {
            hasFoldableLine = hasFoldableLine || i4 - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
            previousLineBreak = i4;
          }
        } else if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        prev_char = i4 > 0 ? string.charCodeAt(i4 - 1) : null;
        plain = plain && isPlainSafe(char, prev_char);
      }
      hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i4 - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
    }
    if (!hasLineBreak && !hasFoldableLine) {
      return plain && !testAmbiguousType(string) ? STYLE_PLAIN : STYLE_SINGLE;
    }
    if (indentPerLevel > 9 && needIndentIndicator(string)) {
      return STYLE_DOUBLE;
    }
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  function writeScalar(state, string, level, iskey) {
    state.dump = function() {
      if (string.length === 0) {
        return "''";
      }
      if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
        return "'" + string + "'";
      }
      var indent = state.indent * Math.max(1, level);
      var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
      var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
      function testAmbiguity(string2) {
        return testImplicitResolving(state, string2);
      }
      switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
        case STYLE_PLAIN:
          return string;
        case STYLE_SINGLE:
          return "'" + string.replace(/'/g, "''") + "'";
        case STYLE_LITERAL:
          return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
        case STYLE_FOLDED:
          return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
        case STYLE_DOUBLE:
          return '"' + escapeString(string, lineWidth) + '"';
        default:
          throw new YAMLException("impossible error: invalid scalar style");
      }
    }();
  }
  function blockHeader(string, indentPerLevel) {
    var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
    var clip = string[string.length - 1] === `
`;
    var keep = clip && (string[string.length - 2] === `
` || string === `
`);
    var chomp = keep ? "+" : clip ? "" : "-";
    return indentIndicator + chomp + `
`;
  }
  function dropEndingNewline(string) {
    return string[string.length - 1] === `
` ? string.slice(0, -1) : string;
  }
  function foldString(string, width) {
    var lineRe = /(\n+)([^\n]*)/g;
    var result = function() {
      var nextLF = string.indexOf(`
`);
      nextLF = nextLF !== -1 ? nextLF : string.length;
      lineRe.lastIndex = nextLF;
      return foldLine(string.slice(0, nextLF), width);
    }();
    var prevMoreIndented = string[0] === `
` || string[0] === " ";
    var moreIndented;
    var match;
    while (match = lineRe.exec(string)) {
      var prefix = match[1], line = match[2];
      moreIndented = line[0] === " ";
      result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? `
` : "") + foldLine(line, width);
      prevMoreIndented = moreIndented;
    }
    return result;
  }
  function foldLine(line, width) {
    if (line === "" || line[0] === " ")
      return line;
    var breakRe = / [^ ]/g;
    var match;
    var start = 0, end, curr = 0, next = 0;
    var result = "";
    while (match = breakRe.exec(line)) {
      next = match.index;
      if (next - start > width) {
        end = curr > start ? curr : next;
        result += `
` + line.slice(start, end);
        start = end + 1;
      }
      curr = next;
    }
    result += `
`;
    if (line.length - start > width && curr > start) {
      result += line.slice(start, curr) + `
` + line.slice(curr + 1);
    } else {
      result += line.slice(start);
    }
    return result.slice(1);
  }
  function escapeString(string) {
    var result = "";
    var char, nextChar;
    var escapeSeq;
    for (var i4 = 0;i4 < string.length; i4++) {
      char = string.charCodeAt(i4);
      if (char >= 55296 && char <= 56319) {
        nextChar = string.charCodeAt(i4 + 1);
        if (nextChar >= 56320 && nextChar <= 57343) {
          result += encodeHex((char - 55296) * 1024 + nextChar - 56320 + 65536);
          i4++;
          continue;
        }
      }
      escapeSeq = ESCAPE_SEQUENCES[char];
      result += !escapeSeq && isPrintable(char) ? string[i4] : escapeSeq || encodeHex(char);
    }
    return result;
  }
  function writeFlowSequence(state, level, object) {
    var _result = "", _tag = state.tag, index, length;
    for (index = 0, length = object.length;index < length; index += 1) {
      if (writeNode(state, level, object[index], false, false)) {
        if (index !== 0)
          _result += "," + (!state.condenseFlow ? " " : "");
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = "[" + _result + "]";
  }
  function writeBlockSequence(state, level, object, compact) {
    var _result = "", _tag = state.tag, index, length;
    for (index = 0, length = object.length;index < length; index += 1) {
      if (writeNode(state, level + 1, object[index], true, true)) {
        if (!compact || index !== 0) {
          _result += generateNextLine(state, level);
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          _result += "-";
        } else {
          _result += "- ";
        }
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = _result || "[]";
  }
  function writeFlowMapping(state, level, object) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
    for (index = 0, length = objectKeyList.length;index < length; index += 1) {
      pairBuffer = "";
      if (index !== 0)
        pairBuffer += ", ";
      if (state.condenseFlow)
        pairBuffer += '"';
      objectKey = objectKeyList[index];
      objectValue = object[objectKey];
      if (!writeNode(state, level, objectKey, false, false)) {
        continue;
      }
      if (state.dump.length > 1024)
        pairBuffer += "? ";
      pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
      if (!writeNode(state, level, objectValue, false, false)) {
        continue;
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = "{" + _result + "}";
  }
  function writeBlockMapping(state, level, object, compact) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
    if (state.sortKeys === true) {
      objectKeyList.sort();
    } else if (typeof state.sortKeys === "function") {
      objectKeyList.sort(state.sortKeys);
    } else if (state.sortKeys) {
      throw new YAMLException("sortKeys must be a boolean or a function");
    }
    for (index = 0, length = objectKeyList.length;index < length; index += 1) {
      pairBuffer = "";
      if (!compact || index !== 0) {
        pairBuffer += generateNextLine(state, level);
      }
      objectKey = objectKeyList[index];
      objectValue = object[objectKey];
      if (!writeNode(state, level + 1, objectKey, true, true, true)) {
        continue;
      }
      explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
      if (explicitPair) {
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += "?";
        } else {
          pairBuffer += "? ";
        }
      }
      pairBuffer += state.dump;
      if (explicitPair) {
        pairBuffer += generateNextLine(state, level);
      }
      if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
        continue;
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += ":";
      } else {
        pairBuffer += ": ";
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = _result || "{}";
  }
  function detectType(state, object, explicit) {
    var _result, typeList, index, length, type, style;
    typeList = explicit ? state.explicitTypes : state.implicitTypes;
    for (index = 0, length = typeList.length;index < length; index += 1) {
      type = typeList[index];
      if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === "object" && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
        state.tag = explicit ? type.tag : "?";
        if (type.represent) {
          style = state.styleMap[type.tag] || type.defaultStyle;
          if (_toString.call(type.represent) === "[object Function]") {
            _result = type.represent(object, style);
          } else if (_hasOwnProperty.call(type.represent, style)) {
            _result = type.represent[style](object, style);
          } else {
            throw new YAMLException("!<" + type.tag + '> tag resolver accepts not "' + style + '" style');
          }
          state.dump = _result;
        }
        return true;
      }
    }
    return false;
  }
  function writeNode(state, level, object, block2, compact, iskey) {
    state.tag = null;
    state.dump = object;
    if (!detectType(state, object, false)) {
      detectType(state, object, true);
    }
    var type = _toString.call(state.dump);
    if (block2) {
      block2 = state.flowLevel < 0 || state.flowLevel > level;
    }
    var objectOrArray = type === "[object Object]" || type === "[object Array]", duplicateIndex, duplicate;
    if (objectOrArray) {
      duplicateIndex = state.duplicates.indexOf(object);
      duplicate = duplicateIndex !== -1;
    }
    if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
      compact = false;
    }
    if (duplicate && state.usedDuplicates[duplicateIndex]) {
      state.dump = "*ref_" + duplicateIndex;
    } else {
      if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
        state.usedDuplicates[duplicateIndex] = true;
      }
      if (type === "[object Object]") {
        if (block2 && Object.keys(state.dump).length !== 0) {
          writeBlockMapping(state, level, state.dump, compact);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowMapping(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type === "[object Array]") {
        var arrayLevel = state.noArrayIndent && level > 0 ? level - 1 : level;
        if (block2 && state.dump.length !== 0) {
          writeBlockSequence(state, arrayLevel, state.dump, compact);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowSequence(state, arrayLevel, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type === "[object String]") {
        if (state.tag !== "?") {
          writeScalar(state, state.dump, level, iskey);
        }
      } else {
        if (state.skipInvalid)
          return false;
        throw new YAMLException("unacceptable kind of an object to dump " + type);
      }
      if (state.tag !== null && state.tag !== "?") {
        state.dump = "!<" + state.tag + "> " + state.dump;
      }
    }
    return true;
  }
  function getDuplicateReferences(object, state) {
    var objects = [], duplicatesIndexes = [], index, length;
    inspectNode(object, objects, duplicatesIndexes);
    for (index = 0, length = duplicatesIndexes.length;index < length; index += 1) {
      state.duplicates.push(objects[duplicatesIndexes[index]]);
    }
    state.usedDuplicates = new Array(length);
  }
  function inspectNode(object, objects, duplicatesIndexes) {
    var objectKeyList, index, length;
    if (object !== null && typeof object === "object") {
      index = objects.indexOf(object);
      if (index !== -1) {
        if (duplicatesIndexes.indexOf(index) === -1) {
          duplicatesIndexes.push(index);
        }
      } else {
        objects.push(object);
        if (Array.isArray(object)) {
          for (index = 0, length = object.length;index < length; index += 1) {
            inspectNode(object[index], objects, duplicatesIndexes);
          }
        } else {
          objectKeyList = Object.keys(object);
          for (index = 0, length = objectKeyList.length;index < length; index += 1) {
            inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
          }
        }
      }
    }
  }
  function dump(input, options2) {
    options2 = options2 || {};
    var state = new State(options2);
    if (!state.noRefs)
      getDuplicateReferences(input, state);
    if (writeNode(state, 0, input, true, true))
      return state.dump + `
`;
    return "";
  }
  function safeDump(input, options2) {
    return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
  }
  exports.dump = dump;
  exports.safeDump = safeDump;
});

// node_modules/js-yaml/lib/js-yaml.js
var require_js_yaml = __commonJS((exports, module) => {
  var loader = require_loader();
  var dumper = require_dumper();
  function deprecated(name) {
    return function() {
      throw new Error("Function " + name + " is deprecated and cannot be used.");
    };
  }
  exports.Type = require_type();
  exports.Schema = require_schema();
  exports.FAILSAFE_SCHEMA = require_failsafe();
  exports.JSON_SCHEMA = require_json();
  exports.CORE_SCHEMA = require_core();
  exports.DEFAULT_SAFE_SCHEMA = require_default_safe();
  exports.DEFAULT_FULL_SCHEMA = require_default_full();
  exports.load = loader.load;
  exports.loadAll = loader.loadAll;
  exports.safeLoad = loader.safeLoad;
  exports.safeLoadAll = loader.safeLoadAll;
  exports.dump = dumper.dump;
  exports.safeDump = dumper.safeDump;
  exports.YAMLException = require_exception();
  exports.MINIMAL_SCHEMA = require_failsafe();
  exports.SAFE_SCHEMA = require_default_safe();
  exports.DEFAULT_SCHEMA = require_default_full();
  exports.scan = deprecated("scan");
  exports.parse = deprecated("parse");
  exports.compose = deprecated("compose");
  exports.addConstructor = deprecated("addConstructor");
});

// node_modules/js-yaml/index.js
var require_js_yaml2 = __commonJS((exports, module) => {
  var yaml = require_js_yaml();
  module.exports = yaml;
});

// node_modules/gray-matter/lib/engines.js
var require_engines = __commonJS((exports, module) => {
  var yaml = require_js_yaml2();
  var engines = exports = module.exports;
  engines.yaml = {
    parse: yaml.safeLoad.bind(yaml),
    stringify: yaml.safeDump.bind(yaml)
  };
  engines.json = {
    parse: JSON.parse.bind(JSON),
    stringify: function(obj, options2) {
      const opts = Object.assign({ replacer: null, space: 2 }, options2);
      return JSON.stringify(obj, opts.replacer, opts.space);
    }
  };
  engines.javascript = {
    parse: function parse(str, options, wrap) {
      try {
        if (wrap !== false) {
          str = `(function() {
return ` + str.trim() + `;
}());`;
        }
        return eval(str) || {};
      } catch (err) {
        if (wrap !== false && /(unexpected|identifier)/i.test(err.message)) {
          return parse(str, options, false);
        }
        throw new SyntaxError(err);
      }
    },
    stringify: function() {
      throw new Error("stringifying JavaScript is not supported");
    }
  };
});

// node_modules/strip-bom-string/index.js
var require_strip_bom_string = __commonJS((exports, module) => {
  /*!
   * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>
   *
   * Copyright (c) 2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  module.exports = function(str2) {
    if (typeof str2 === "string" && str2.charAt(0) === "\uFEFF") {
      return str2.slice(1);
    }
    return str2;
  };
});

// node_modules/gray-matter/lib/utils.js
var require_utils = __commonJS((exports) => {
  var stripBom = require_strip_bom_string();
  var typeOf = require_kind_of();
  exports.define = function(obj, key, val) {
    Reflect.defineProperty(obj, key, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: val
    });
  };
  exports.isBuffer = function(val) {
    return typeOf(val) === "buffer";
  };
  exports.isObject = function(val) {
    return typeOf(val) === "object";
  };
  exports.toBuffer = function(input) {
    return typeof input === "string" ? Buffer.from(input) : input;
  };
  exports.toString = function(input) {
    if (exports.isBuffer(input))
      return stripBom(String(input));
    if (typeof input !== "string") {
      throw new TypeError("expected input to be a string or buffer");
    }
    return stripBom(input);
  };
  exports.arrayify = function(val) {
    return val ? Array.isArray(val) ? val : [val] : [];
  };
  exports.startsWith = function(str2, substr, len) {
    if (typeof len !== "number")
      len = substr.length;
    return str2.slice(0, len) === substr;
  };
});

// node_modules/gray-matter/lib/defaults.js
var require_defaults = __commonJS((exports, module) => {
  var engines = require_engines();
  var utils = require_utils();
  module.exports = function(options2) {
    const opts = Object.assign({}, options2);
    opts.delimiters = utils.arrayify(opts.delims || opts.delimiters || "---");
    if (opts.delimiters.length === 1) {
      opts.delimiters.push(opts.delimiters[0]);
    }
    opts.language = (opts.language || opts.lang || "yaml").toLowerCase();
    opts.engines = Object.assign({}, engines, opts.parsers, opts.engines);
    return opts;
  };
});

// node_modules/gray-matter/lib/engine.js
var require_engine = __commonJS((exports, module) => {
  module.exports = function(name, options2) {
    let engine = options2.engines[name] || options2.engines[aliase(name)];
    if (typeof engine === "undefined") {
      throw new Error('gray-matter engine "' + name + '" is not registered');
    }
    if (typeof engine === "function") {
      engine = { parse: engine };
    }
    return engine;
  };
  function aliase(name) {
    switch (name.toLowerCase()) {
      case "js":
      case "javascript":
        return "javascript";
      case "coffee":
      case "coffeescript":
      case "cson":
        return "coffee";
      case "yaml":
      case "yml":
        return "yaml";
      default: {
        return name;
      }
    }
  }
});

// node_modules/gray-matter/lib/stringify.js
var require_stringify = __commonJS((exports, module) => {
  var typeOf = require_kind_of();
  var getEngine = require_engine();
  var defaults = require_defaults();
  module.exports = function(file, data, options2) {
    if (data == null && options2 == null) {
      switch (typeOf(file)) {
        case "object":
          data = file.data;
          options2 = {};
          break;
        case "string":
          return file;
        default: {
          throw new TypeError("expected file to be a string or object");
        }
      }
    }
    const str2 = file.content;
    const opts = defaults(options2);
    if (data == null) {
      if (!opts.data)
        return file;
      data = opts.data;
    }
    const language = file.language || opts.language;
    const engine = getEngine(language, opts);
    if (typeof engine.stringify !== "function") {
      throw new TypeError('expected "' + language + '.stringify" to be a function');
    }
    data = Object.assign({}, file.data, data);
    const open = opts.delimiters[0];
    const close = opts.delimiters[1];
    const matter = engine.stringify(data, options2).trim();
    let buf = "";
    if (matter !== "{}") {
      buf = newline(open) + newline(matter) + newline(close);
    }
    if (typeof file.excerpt === "string" && file.excerpt !== "") {
      if (str2.indexOf(file.excerpt.trim()) === -1) {
        buf += newline(file.excerpt) + newline(close);
      }
    }
    return buf + newline(str2);
  };
  function newline(str2) {
    return str2.slice(-1) !== `
` ? str2 + `
` : str2;
  }
});

// node_modules/gray-matter/lib/excerpt.js
var require_excerpt = __commonJS((exports, module) => {
  var defaults = require_defaults();
  module.exports = function(file, options2) {
    const opts = defaults(options2);
    if (file.data == null) {
      file.data = {};
    }
    if (typeof opts.excerpt === "function") {
      return opts.excerpt(file, opts);
    }
    const sep = file.data.excerpt_separator || opts.excerpt_separator;
    if (sep == null && (opts.excerpt === false || opts.excerpt == null)) {
      return file;
    }
    const delimiter = typeof opts.excerpt === "string" ? opts.excerpt : sep || opts.delimiters[0];
    const idx = file.content.indexOf(delimiter);
    if (idx !== -1) {
      file.excerpt = file.content.slice(0, idx);
    }
    return file;
  };
});

// node_modules/gray-matter/lib/to-file.js
var require_to_file = __commonJS((exports, module) => {
  var typeOf = require_kind_of();
  var stringify = require_stringify();
  var utils = require_utils();
  module.exports = function(file) {
    if (typeOf(file) !== "object") {
      file = { content: file };
    }
    if (typeOf(file.data) !== "object") {
      file.data = {};
    }
    if (file.contents && file.content == null) {
      file.content = file.contents;
    }
    utils.define(file, "orig", utils.toBuffer(file.content));
    utils.define(file, "language", file.language || "");
    utils.define(file, "matter", file.matter || "");
    utils.define(file, "stringify", function(data, options2) {
      if (options2 && options2.language) {
        file.language = options2.language;
      }
      return stringify(file, data, options2);
    });
    file.content = utils.toString(file.content);
    file.isEmpty = false;
    file.excerpt = "";
    return file;
  };
});

// node_modules/gray-matter/lib/parse.js
var require_parse = __commonJS((exports, module) => {
  var getEngine = require_engine();
  var defaults = require_defaults();
  module.exports = function(language, str2, options2) {
    const opts = defaults(options2);
    const engine = getEngine(language, opts);
    if (typeof engine.parse !== "function") {
      throw new TypeError('expected "' + language + '.parse" to be a function');
    }
    return engine.parse(str2, opts);
  };
});

// node_modules/gray-matter/index.js
var require_gray_matter = __commonJS((exports, module) => {
  var fs = __require("fs");
  var sections = require_section_matter();
  var defaults = require_defaults();
  var stringify = require_stringify();
  var excerpt = require_excerpt();
  var engines = require_engines();
  var toFile = require_to_file();
  var parse2 = require_parse();
  var utils = require_utils();
  function matter(input, options2) {
    if (input === "") {
      return { data: {}, content: input, excerpt: "", orig: input };
    }
    let file = toFile(input);
    const cached = matter.cache[file.content];
    if (!options2) {
      if (cached) {
        file = Object.assign({}, cached);
        file.orig = cached.orig;
        return file;
      }
      matter.cache[file.content] = file;
    }
    return parseMatter(file, options2);
  }
  function parseMatter(file, options2) {
    const opts = defaults(options2);
    const open = opts.delimiters[0];
    const close = `
` + opts.delimiters[1];
    let str2 = file.content;
    if (opts.language) {
      file.language = opts.language;
    }
    const openLen = open.length;
    if (!utils.startsWith(str2, open, openLen)) {
      excerpt(file, opts);
      return file;
    }
    if (str2.charAt(openLen) === open.slice(-1)) {
      return file;
    }
    str2 = str2.slice(openLen);
    const len = str2.length;
    const language = matter.language(str2, opts);
    if (language.name) {
      file.language = language.name;
      str2 = str2.slice(language.raw.length);
    }
    let closeIndex = str2.indexOf(close);
    if (closeIndex === -1) {
      closeIndex = len;
    }
    file.matter = str2.slice(0, closeIndex);
    const block2 = file.matter.replace(/^\s*#[^\n]+/gm, "").trim();
    if (block2 === "") {
      file.isEmpty = true;
      file.empty = file.content;
      file.data = {};
    } else {
      file.data = parse2(file.language, file.matter, opts);
    }
    if (closeIndex === len) {
      file.content = "";
    } else {
      file.content = str2.slice(closeIndex + close.length);
      if (file.content[0] === "\r") {
        file.content = file.content.slice(1);
      }
      if (file.content[0] === `
`) {
        file.content = file.content.slice(1);
      }
    }
    excerpt(file, opts);
    if (opts.sections === true || typeof opts.section === "function") {
      sections(file, opts.section);
    }
    return file;
  }
  matter.engines = engines;
  matter.stringify = function(file, data, options2) {
    if (typeof file === "string")
      file = matter(file, options2);
    return stringify(file, data, options2);
  };
  matter.read = function(filepath, options2) {
    const str2 = fs.readFileSync(filepath, "utf8");
    const file = matter(str2, options2);
    file.path = filepath;
    return file;
  };
  matter.test = function(str2, options2) {
    return utils.startsWith(str2, defaults(options2).delimiters[0]);
  };
  matter.language = function(str2, options2) {
    const opts = defaults(options2);
    const open = opts.delimiters[0];
    if (matter.test(str2)) {
      str2 = str2.slice(open.length);
    }
    const language = str2.slice(0, str2.search(/\r?\n/));
    return {
      raw: language,
      name: language ? language.trim() : ""
    };
  };
  matter.cache = {};
  matter.clearCache = function() {
    matter.cache = {};
  };
  module.exports = matter;
});

// src/main.ts
import process2 from "node:process";

// node_modules/commander/esm.mjs
var import__ = __toESM(require_commander(), 1);
var {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  Command,
  Argument,
  Option,
  Help
} = import__.default;

// node_modules/@clack/core/dist/index.mjs
import { styleText } from "node:util";
import { stdout, stdin } from "node:process";
import * as l from "node:readline";
import l__default from "node:readline";

// node_modules/fast-string-truncated-width/dist/utils.js
var getCodePointsLength = (() => {
  const SURROGATE_PAIR_RE = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  return (input) => {
    let surrogatePairsNr = 0;
    SURROGATE_PAIR_RE.lastIndex = 0;
    while (SURROGATE_PAIR_RE.test(input)) {
      surrogatePairsNr += 1;
    }
    return input.length - surrogatePairsNr;
  };
})();
var isFullWidth = (x) => {
  return x === 12288 || x >= 65281 && x <= 65376 || x >= 65504 && x <= 65510;
};
var isWideNotCJKTNotEmoji = (x) => {
  return x === 8987 || x === 9001 || x >= 12272 && x <= 12287 || x >= 12289 && x <= 12350 || x >= 12441 && x <= 12543 || x >= 12549 && x <= 12591 || x >= 12593 && x <= 12686 || x >= 12688 && x <= 12771 || x >= 12783 && x <= 12830 || x >= 12832 && x <= 12871 || x >= 12880 && x <= 19903 || x >= 65040 && x <= 65049 || x >= 65072 && x <= 65106 || x >= 65108 && x <= 65126 || x >= 65128 && x <= 65131 || x >= 127488 && x <= 127490 || x >= 127504 && x <= 127547 || x >= 127552 && x <= 127560 || x >= 131072 && x <= 196605 || x >= 196608 && x <= 262141;
};

// node_modules/fast-string-truncated-width/dist/index.js
var ANSI_RE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]|\u001b\]8;[^;]*;.*?(?:\u0007|\u001b\u005c)/y;
var CONTROL_RE = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
var CJKT_WIDE_RE = /(?:(?![\uFF61-\uFF9F\uFF00-\uFFEF])[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Tangut}]){1,1000}/yu;
var TAB_RE = /\t{1,1000}/y;
var EMOJI_RE = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/yu;
var LATIN_RE = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
var MODIFIER_RE = /\p{M}+/gu;
var NO_TRUNCATION = { limit: Infinity, ellipsis: "" };
var getStringTruncatedWidth = (input, truncationOptions = {}, widthOptions = {}) => {
  const LIMIT = truncationOptions.limit ?? Infinity;
  const ELLIPSIS = truncationOptions.ellipsis ?? "";
  const ELLIPSIS_WIDTH = truncationOptions?.ellipsisWidth ?? (ELLIPSIS ? getStringTruncatedWidth(ELLIPSIS, NO_TRUNCATION, widthOptions).width : 0);
  const ANSI_WIDTH = 0;
  const CONTROL_WIDTH = widthOptions.controlWidth ?? 0;
  const TAB_WIDTH = widthOptions.tabWidth ?? 8;
  const EMOJI_WIDTH = widthOptions.emojiWidth ?? 2;
  const FULL_WIDTH_WIDTH = 2;
  const REGULAR_WIDTH = widthOptions.regularWidth ?? 1;
  const WIDE_WIDTH = widthOptions.wideWidth ?? FULL_WIDTH_WIDTH;
  const PARSE_BLOCKS = [
    [LATIN_RE, REGULAR_WIDTH],
    [ANSI_RE, ANSI_WIDTH],
    [CONTROL_RE, CONTROL_WIDTH],
    [TAB_RE, TAB_WIDTH],
    [EMOJI_RE, EMOJI_WIDTH],
    [CJKT_WIDE_RE, WIDE_WIDTH]
  ];
  let indexPrev = 0;
  let index = 0;
  let length = input.length;
  let lengthExtra = 0;
  let truncationEnabled = false;
  let truncationIndex = length;
  let truncationLimit = Math.max(0, LIMIT - ELLIPSIS_WIDTH);
  let unmatchedStart = 0;
  let unmatchedEnd = 0;
  let width = 0;
  let widthExtra = 0;
  outer:
    while (true) {
      if (unmatchedEnd > unmatchedStart || index >= length && index > indexPrev) {
        const unmatched = input.slice(unmatchedStart, unmatchedEnd) || input.slice(indexPrev, index);
        lengthExtra = 0;
        for (const char of unmatched.replaceAll(MODIFIER_RE, "")) {
          const codePoint = char.codePointAt(0) || 0;
          if (isFullWidth(codePoint)) {
            widthExtra = FULL_WIDTH_WIDTH;
          } else if (isWideNotCJKTNotEmoji(codePoint)) {
            widthExtra = WIDE_WIDTH;
          } else {
            widthExtra = REGULAR_WIDTH;
          }
          if (width + widthExtra > truncationLimit) {
            truncationIndex = Math.min(truncationIndex, Math.max(unmatchedStart, indexPrev) + lengthExtra);
          }
          if (width + widthExtra > LIMIT) {
            truncationEnabled = true;
            break outer;
          }
          lengthExtra += char.length;
          width += widthExtra;
        }
        unmatchedStart = unmatchedEnd = 0;
      }
      if (index >= length) {
        break outer;
      }
      for (let i = 0, l = PARSE_BLOCKS.length;i < l; i++) {
        const [BLOCK_RE, BLOCK_WIDTH] = PARSE_BLOCKS[i];
        BLOCK_RE.lastIndex = index;
        if (BLOCK_RE.test(input)) {
          lengthExtra = BLOCK_RE === CJKT_WIDE_RE ? getCodePointsLength(input.slice(index, BLOCK_RE.lastIndex)) : BLOCK_RE === EMOJI_RE ? 1 : BLOCK_RE.lastIndex - index;
          widthExtra = lengthExtra * BLOCK_WIDTH;
          if (width + widthExtra > truncationLimit) {
            truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / BLOCK_WIDTH));
          }
          if (width + widthExtra > LIMIT) {
            truncationEnabled = true;
            break outer;
          }
          width += widthExtra;
          unmatchedStart = indexPrev;
          unmatchedEnd = index;
          index = indexPrev = BLOCK_RE.lastIndex;
          continue outer;
        }
      }
      index += 1;
    }
  return {
    width: truncationEnabled ? truncationLimit : width,
    index: truncationEnabled ? truncationIndex : length,
    truncated: truncationEnabled,
    ellipsed: truncationEnabled && LIMIT >= ELLIPSIS_WIDTH
  };
};
var dist_default = getStringTruncatedWidth;

// node_modules/fast-string-width/dist/index.js
var NO_TRUNCATION2 = {
  limit: Infinity,
  ellipsis: "",
  ellipsisWidth: 0
};
var fastStringWidth = (input, options2 = {}) => {
  return dist_default(input, NO_TRUNCATION2, options2).width;
};
var dist_default2 = fastStringWidth;

// node_modules/fast-wrap-ansi/lib/main.js
var ESC = "\x1B";
var CSI = "";
var END_CODE = 39;
var ANSI_ESCAPE_BELL = "\x07";
var ANSI_CSI = "[";
var ANSI_OSC = "]";
var ANSI_SGR_TERMINATOR = "m";
var ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;
var GROUP_REGEX = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`, "y");
var getClosingCode = (openingCode) => {
  if (openingCode >= 30 && openingCode <= 37)
    return 39;
  if (openingCode >= 90 && openingCode <= 97)
    return 39;
  if (openingCode >= 40 && openingCode <= 47)
    return 49;
  if (openingCode >= 100 && openingCode <= 107)
    return 49;
  if (openingCode === 1 || openingCode === 2)
    return 22;
  if (openingCode === 3)
    return 23;
  if (openingCode === 4)
    return 24;
  if (openingCode === 7)
    return 27;
  if (openingCode === 8)
    return 28;
  if (openingCode === 9)
    return 29;
  if (openingCode === 0)
    return 0;
  return;
};
var wrapAnsiCode = (code) => `${ESC}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
var wrapAnsiHyperlink = (url) => `${ESC}${ANSI_ESCAPE_LINK}${url}${ANSI_ESCAPE_BELL}`;
var wrapWord = (rows, word, columns) => {
  const characters = word[Symbol.iterator]();
  let isInsideEscape = false;
  let isInsideLinkEscape = false;
  let lastRow = rows.at(-1);
  let visible = lastRow === undefined ? 0 : dist_default2(lastRow);
  let currentCharacter = characters.next();
  let nextCharacter = characters.next();
  let rawCharacterIndex = 0;
  while (!currentCharacter.done) {
    const character = currentCharacter.value;
    const characterLength = dist_default2(character);
    if (visible + characterLength <= columns) {
      rows[rows.length - 1] += character;
    } else {
      rows.push(character);
      visible = 0;
    }
    if (character === ESC || character === CSI) {
      isInsideEscape = true;
      isInsideLinkEscape = word.startsWith(ANSI_ESCAPE_LINK, rawCharacterIndex + 1);
    }
    if (isInsideEscape) {
      if (isInsideLinkEscape) {
        if (character === ANSI_ESCAPE_BELL) {
          isInsideEscape = false;
          isInsideLinkEscape = false;
        }
      } else if (character === ANSI_SGR_TERMINATOR) {
        isInsideEscape = false;
      }
    } else {
      visible += characterLength;
      if (visible === columns && !nextCharacter.done) {
        rows.push("");
        visible = 0;
      }
    }
    currentCharacter = nextCharacter;
    nextCharacter = characters.next();
    rawCharacterIndex += character.length;
  }
  lastRow = rows.at(-1);
  if (!visible && lastRow !== undefined && lastRow.length && rows.length > 1) {
    rows[rows.length - 2] += rows.pop();
  }
};
var stringVisibleTrimSpacesRight = (string) => {
  const words = string.split(" ");
  let last = words.length;
  while (last) {
    if (dist_default2(words[last - 1])) {
      break;
    }
    last--;
  }
  if (last === words.length) {
    return string;
  }
  return words.slice(0, last).join(" ") + words.slice(last).join("");
};
var exec = (string, columns, options2 = {}) => {
  if (options2.trim !== false && string.trim() === "") {
    return "";
  }
  let returnValue = "";
  let escapeCode;
  let escapeUrl;
  const words = string.split(" ");
  let rows = [""];
  let rowLength = 0;
  for (let index = 0;index < words.length; index++) {
    const word = words[index];
    if (options2.trim !== false) {
      const row = rows.at(-1) ?? "";
      const trimmed = row.trimStart();
      if (row.length !== trimmed.length) {
        rows[rows.length - 1] = trimmed;
        rowLength = dist_default2(trimmed);
      }
    }
    if (index !== 0) {
      if (rowLength >= columns && (options2.wordWrap === false || options2.trim === false)) {
        rows.push("");
        rowLength = 0;
      }
      if (rowLength || options2.trim === false) {
        rows[rows.length - 1] += " ";
        rowLength++;
      }
    }
    const wordLength = dist_default2(word);
    if (options2.hard && wordLength > columns) {
      const remainingColumns = columns - rowLength;
      const breaksStartingThisLine = 1 + Math.floor((wordLength - remainingColumns - 1) / columns);
      const breaksStartingNextLine = Math.floor((wordLength - 1) / columns);
      if (breaksStartingNextLine < breaksStartingThisLine) {
        rows.push("");
      }
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    if (rowLength + wordLength > columns && rowLength && wordLength) {
      if (options2.wordWrap === false && rowLength < columns) {
        wrapWord(rows, word, columns);
        rowLength = dist_default2(rows.at(-1) ?? "");
        continue;
      }
      rows.push("");
      rowLength = 0;
    }
    if (rowLength + wordLength > columns && options2.wordWrap === false) {
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    rows[rows.length - 1] += word;
    rowLength += wordLength;
  }
  if (options2.trim !== false) {
    rows = rows.map((row) => stringVisibleTrimSpacesRight(row));
  }
  const preString = rows.join(`
`);
  let inSurrogate = false;
  for (let i = 0;i < preString.length; i++) {
    const character = preString[i];
    returnValue += character;
    if (!inSurrogate) {
      inSurrogate = character >= "\uD800" && character <= "\uDBFF";
      if (inSurrogate) {
        continue;
      }
    } else {
      inSurrogate = false;
    }
    if (character === ESC || character === CSI) {
      GROUP_REGEX.lastIndex = i + 1;
      const groupsResult = GROUP_REGEX.exec(preString);
      const groups = groupsResult?.groups;
      if (groups?.code !== undefined) {
        const code = Number.parseFloat(groups.code);
        escapeCode = code === END_CODE ? undefined : code;
      } else if (groups?.uri !== undefined) {
        escapeUrl = groups.uri.length === 0 ? undefined : groups.uri;
      }
    }
    if (preString[i + 1] === `
`) {
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink("");
      }
      const closingCode = escapeCode ? getClosingCode(escapeCode) : undefined;
      if (escapeCode && closingCode) {
        returnValue += wrapAnsiCode(closingCode);
      }
    } else if (character === `
`) {
      if (escapeCode && getClosingCode(escapeCode)) {
        returnValue += wrapAnsiCode(escapeCode);
      }
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink(escapeUrl);
      }
    }
  }
  return returnValue;
};
var CRLF_OR_LF = /\r?\n/;
function wrapAnsi(string, columns, options2) {
  return String(string).normalize().split(CRLF_OR_LF).map((line) => exec(line, columns, options2)).join(`
`);
}

// node_modules/@clack/core/dist/index.mjs
var import_sisteransi = __toESM(require_src(), 1);
import { ReadStream } from "node:tty";
function findCursor(s, o, l2) {
  if (!l2.some((r) => !r.disabled))
    return s;
  const t = s + o, n = Math.max(l2.length - 1, 0), e = t < 0 ? n : t > n ? 0 : t;
  return l2[e]?.disabled ? findCursor(e, o < 0 ? -1 : 1, l2) : e;
}
function findTextCursor(s, o, l2, i) {
  const t = i.split(`
`);
  let n = 0, e = s;
  for (const r of t) {
    if (e <= r.length)
      break;
    e -= r.length + 1, n++;
  }
  for (n = Math.max(0, Math.min(t.length - 1, n + l2)), e = Math.min(e, t[n].length) + o;e < 0 && n > 0; )
    n--, e += t[n].length + 1;
  for (;e > t[n].length && n < t.length - 1; )
    e -= t[n].length + 1, n++;
  e = Math.max(0, Math.min(t[n].length, e));
  let h = 0;
  for (let r = 0;r < n; r++)
    h += t[r].length + 1;
  return h + e;
}
var a$1 = ["up", "down", "left", "right", "space", "enter", "cancel"];
var t = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var settings = {
  actions: new Set(a$1),
  aliases: /* @__PURE__ */ new Map([
    ["k", "up"],
    ["j", "down"],
    ["h", "left"],
    ["l", "right"],
    ["\x03", "cancel"],
    ["escape", "cancel"]
  ]),
  messages: {
    cancel: "Canceled",
    error: "Something went wrong"
  },
  withGuide: true,
  date: {
    monthNames: [...t],
    messages: {
      required: "Please enter a valid date",
      invalidMonth: "There are only 12 months in a year",
      invalidDay: (n, e) => `There are only ${n} days in ${e}`,
      afterMin: (n) => `Date must be on or after ${n.toISOString().slice(0, 10)}`,
      beforeMax: (n) => `Date must be on or before ${n.toISOString().slice(0, 10)}`
    }
  }
};
function isActionKey(n, e) {
  if (typeof n == "string")
    return settings.aliases.get(n) === e;
  for (const s of n)
    if (s !== undefined && isActionKey(s, e))
      return true;
  return false;
}
function diffLines(i, s) {
  if (i === s)
    return;
  const e = i.split(`
`), t2 = s.split(`
`), r = Math.max(e.length, t2.length), f = [];
  for (let n = 0;n < r; n++)
    e[n] !== t2[n] && f.push(n);
  return {
    lines: f,
    numLinesBefore: e.length,
    numLinesAfter: t2.length,
    numLines: r
  };
}
var R = globalThis.process.platform.startsWith("win");
var CANCEL_SYMBOL = Symbol("clack:cancel");
function isCancel(e) {
  return e === CANCEL_SYMBOL;
}
function setRawMode(e, r) {
  const o = e;
  o.isTTY && o.setRawMode(r);
}
function block({
  input: e = stdin,
  output: r = stdout,
  overwrite: o = true,
  hideCursor: t2 = true
} = {}) {
  const s = l.createInterface({
    input: e,
    output: r,
    prompt: "",
    tabSize: 1
  });
  l.emitKeypressEvents(e, s), e instanceof ReadStream && e.isTTY && e.setRawMode(true);
  const n = (f, { name: a, sequence: p }) => {
    const c = String(f);
    if (isActionKey([c, a, p], "cancel")) {
      t2 && r.write(import_sisteransi.cursor.show), process.exit(0);
      return;
    }
    if (!o)
      return;
    const i = a === "return" ? 0 : -1, m = a === "return" ? -1 : 0;
    l.moveCursor(r, i, m, () => {
      l.clearLine(r, 1, () => {
        e.once("keypress", n);
      });
    });
  };
  return t2 && r.write(import_sisteransi.cursor.hide), e.once("keypress", n), () => {
    e.off("keypress", n), t2 && r.write(import_sisteransi.cursor.show), e instanceof ReadStream && e.isTTY && !R && e.setRawMode(false), s.terminal = false, s.close();
  };
}
var getColumns = (e) => ("columns" in e) && typeof e.columns == "number" ? e.columns : 80;
var getRows = (e) => ("rows" in e) && typeof e.rows == "number" ? e.rows : 20;
function wrapTextWithPrefix(e, r, o, t2 = o, s = o, n) {
  const f = getColumns(e ?? stdout);
  return wrapAnsi(r, f - o.length, {
    hard: true,
    trim: false
  }).split(`
`).map((c, i, m) => {
    const d = n ? n(c, i) : c;
    return i === 0 ? `${t2}${d}` : i === m.length - 1 ? `${s}${d}` : `${o}${d}`;
  }).join(`
`);
}
function runValidation(e, n) {
  if ("~standard" in e) {
    const a = e["~standard"].validate(n);
    if (a instanceof Promise)
      throw new TypeError("Schema validation must be synchronous. Update `validate()` and remove any asynchronous logic.");
    return a.issues?.at(0)?.message;
  }
  return e(n);
}

class V {
  input;
  output;
  _abortSignal;
  rl;
  opts;
  _render;
  _track = false;
  _prevFrame = "";
  _subscribers = /* @__PURE__ */ new Map;
  _cursor = 0;
  state = "initial";
  error = "";
  value;
  userInput = "";
  constructor(t2, e = true) {
    const { input: i = stdin, output: n = stdout, render: s, signal: r, ...o } = t2;
    this.opts = o, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = s.bind(this), this._track = e, this._abortSignal = r, this.input = i, this.output = n;
  }
  unsubscribe() {
    this._subscribers.clear();
  }
  setSubscriber(t2, e) {
    const i = this._subscribers.get(t2) ?? [];
    i.push(e), this._subscribers.set(t2, i);
  }
  on(t2, e) {
    this.setSubscriber(t2, { cb: e });
  }
  once(t2, e) {
    this.setSubscriber(t2, { cb: e, once: true });
  }
  emit(t2, ...e) {
    const i = this._subscribers.get(t2) ?? [], n = [];
    for (const s of i)
      s.cb(...e), s.once && n.push(() => i.splice(i.indexOf(s), 1));
    for (const s of n)
      s();
  }
  prompt() {
    return new Promise((t2) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted)
          return this.state = "cancel", this.close(), t2(CANCEL_SYMBOL);
        this._abortSignal.addEventListener("abort", () => {
          this.state = "cancel", this.close();
        }, { once: true });
      }
      this.rl = l__default.createInterface({
        input: this.input,
        tabSize: 2,
        prompt: "",
        escapeCodeTimeout: 50,
        terminal: true
      }), this.rl.prompt(), this.opts.initialUserInput !== undefined && this._setUserInput(this.opts.initialUserInput, true), this.input.on("keypress", this.onKeypress), setRawMode(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), setRawMode(this.input, false), t2(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), setRawMode(this.input, false), t2(CANCEL_SYMBOL);
      });
    });
  }
  _isActionKey(t2, e) {
    return t2 === "\t";
  }
  _shouldSubmit(t2, e) {
    return true;
  }
  _setValue(t2) {
    this.value = t2, this.emit("value", this.value);
  }
  _setUserInput(t2, e) {
    this.userInput = t2 ?? "", this.emit("userInput", this.userInput), e && this._track && this.rl && (this.rl.write(this.userInput), this._cursor = this.rl.cursor);
  }
  _clearUserInput() {
    this.rl?.write(null, { ctrl: true, name: "u" }), this._setUserInput("");
  }
  onKeypress(t2, e) {
    if (this._track && e.name !== "return" && (e.name && this._isActionKey(t2, e) && this.rl?.write(null, { ctrl: true, name: "h" }), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), e?.name && (!this._track && settings.aliases.has(e.name) && this.emit("cursor", settings.aliases.get(e.name)), settings.actions.has(e.name) && this.emit("cursor", e.name)), t2 && (t2.toLowerCase() === "y" || t2.toLowerCase() === "n") && this.emit("confirm", t2.toLowerCase() === "y"), this.emit("key", t2, e), e?.name === "return" && this._shouldSubmit(t2, e)) {
      if (this.opts.validate) {
        const i = runValidation(this.opts.validate, this.value);
        i && (this.error = i instanceof Error ? i.message : i, this.state = "error", this.rl?.write(this.userInput));
      }
      this.state !== "error" && (this.state = "submit");
    }
    isActionKey([t2, e?.name, e?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), setRawMode(this.input, false), this.rl?.close(), this.rl = undefined, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const t2 = wrapAnsi(this._prevFrame, process.stdout.columns, { hard: true, trim: false }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, t2 * -1));
  }
  render() {
    const t2 = wrapAnsi(this._render(this) ?? "", process.stdout.columns, {
      hard: true,
      trim: false
    });
    if (t2 !== this._prevFrame) {
      if (this.state === "initial")
        this.output.write(import_sisteransi.cursor.hide);
      else {
        const e = diffLines(this._prevFrame, t2), i = getRows(this.output);
        if (this.restoreCursor(), e) {
          const n = Math.max(0, e.numLinesAfter - i), s = Math.max(0, e.numLinesBefore - i);
          let r = e.lines.find((o) => o >= n);
          if (r === undefined) {
            this._prevFrame = t2;
            return;
          }
          if (e.lines.length === 1) {
            this.output.write(import_sisteransi.cursor.move(0, r - s)), this.output.write(import_sisteransi.erase.lines(1));
            const o = t2.split(`
`);
            this.output.write(o[r]), this._prevFrame = t2, this.output.write(import_sisteransi.cursor.move(0, o.length - r - 1));
            return;
          } else if (e.lines.length > 1) {
            if (n < s)
              r = n;
            else {
              const h = r - s;
              h > 0 && this.output.write(import_sisteransi.cursor.move(0, h));
            }
            this.output.write(import_sisteransi.erase.down());
            const f = t2.split(`
`).slice(r);
            this.output.write(f.join(`
`)), this._prevFrame = t2;
            return;
          }
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(t2), this.state === "initial" && (this.state = "active"), this._prevFrame = t2;
    }
  }
}
function p$1(l2, e) {
  if (l2 === undefined || e.length === 0)
    return 0;
  const i = e.findIndex((s) => s.value === l2);
  return i !== -1 ? i : 0;
}
function g(l2, e) {
  return (e.label ?? String(e.value)).toLowerCase().includes(l2.toLowerCase());
}
function m(l2, e) {
  if (e)
    return l2 ? e : e[0];
}
var T$1 = class T extends V {
  filteredOptions;
  multiple;
  isNavigating = false;
  selectedValues = [];
  focusedValue;
  #e = 0;
  #s = "";
  #t;
  #i;
  #n;
  get cursor() {
    return this.#e;
  }
  get userInputWithCursor() {
    if (!this.userInput)
      return styleText(["inverse", "hidden"], "_");
    if (this._cursor >= this.userInput.length)
      return `${this.userInput}█`;
    const e = this.userInput.slice(0, this.cursor), t2 = this.userInput.slice(this.cursor, this.cursor + 1), i = this.userInput.slice(this.cursor + 1);
    return `${e}${styleText("inverse", t2)}${i}`;
  }
  get options() {
    return typeof this.#i == "function" ? this.#i() : this.#i;
  }
  constructor(e) {
    super(e), this.#i = e.options, this.#n = e.placeholder;
    const t2 = this.options;
    this.filteredOptions = [...t2], this.multiple = e.multiple === true, this.#t = typeof e.options == "function" ? e.filter : e.filter ?? g;
    let i;
    if (e.initialValue && Array.isArray(e.initialValue) ? this.multiple ? i = e.initialValue : i = e.initialValue.slice(0, 1) : !this.multiple && this.options.length > 0 && (i = [this.options[0]?.value]), i)
      for (const s of i) {
        const n = t2.findIndex((o) => o.value === s);
        n !== -1 && (this.toggleSelected(s), this.#e = n);
      }
    this.focusedValue = this.options[this.#e]?.value, this.on("key", (s, n) => this.#l(s, n)), this.on("userInput", (s) => this.#u(s));
  }
  _isActionKey(e, t2) {
    return e === "\t" || this.multiple && this.isNavigating && t2.name === "space" && e !== undefined && e !== "";
  }
  #l(e, t2) {
    const i = t2.name === "up", s = t2.name === "down", n = t2.name === "return", o = this.userInput === "" || this.userInput === "\t", u = this.#n, a = this.options, f = u !== undefined && u !== "" && a.some((r) => !r.disabled && (this.#t ? this.#t(u, r) : true));
    if (t2.name === "tab" && o && f) {
      this.userInput === "\t" && this._clearUserInput(), this._setUserInput(u, true), this.isNavigating = false;
      return;
    }
    i || s ? (this.#e = findCursor(this.#e, i ? -1 : 1, this.filteredOptions), this.focusedValue = this.filteredOptions[this.#e]?.value, this.multiple || (this.selectedValues = [this.focusedValue]), this.isNavigating = true) : n ? this.value = m(this.multiple, this.selectedValues) : this.multiple ? this.focusedValue !== undefined && (t2.name === "tab" || this.isNavigating && t2.name === "space") ? this.toggleSelected(this.focusedValue) : this.isNavigating = false : (this.focusedValue && (this.selectedValues = [this.focusedValue]), this.isNavigating = false);
  }
  deselectAll() {
    this.selectedValues = [];
  }
  toggleSelected(e) {
    this.filteredOptions.length !== 0 && (this.multiple ? this.selectedValues.includes(e) ? this.selectedValues = this.selectedValues.filter((t2) => t2 !== e) : this.selectedValues = [...this.selectedValues, e] : this.selectedValues = [e]);
  }
  #u(e) {
    if (e !== this.#s) {
      this.#s = e;
      const t2 = this.options;
      e && this.#t ? this.filteredOptions = t2.filter((n) => this.#t?.(e, n)) : this.filteredOptions = [...t2];
      const i = p$1(this.focusedValue, this.filteredOptions);
      this.#e = findCursor(i, 0, this.filteredOptions);
      const s = this.filteredOptions[this.#e];
      s && !s.disabled ? this.focusedValue = s.value : this.focusedValue = undefined, this.multiple || (this.focusedValue !== undefined ? this.toggleSelected(this.focusedValue) : this.deselectAll());
    }
  }
};
var _ = {
  Y: { type: "year", len: 4 },
  M: { type: "month", len: 2 },
  D: { type: "day", len: 2 }
};
function M(r) {
  return [...r].map((t2) => _[t2]);
}
function P(r) {
  const i = new Intl.DateTimeFormat(r, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date(2000, 0, 15)), s = [];
  let n = "/";
  for (const e of i)
    e.type === "literal" ? n = e.value.trim() || e.value : (e.type === "year" || e.type === "month" || e.type === "day") && s.push({ type: e.type, len: e.type === "year" ? 4 : 2 });
  return { segments: s, separator: n };
}
function p(r) {
  return Number.parseInt((r || "0").replace(/_/g, "0"), 10) || 0;
}
function f(r) {
  return {
    year: p(r.year),
    month: p(r.month),
    day: p(r.day)
  };
}
function c(r, t2) {
  return new Date(r || 2001, t2 || 1, 0).getDate();
}
function b(r) {
  const { year: t2, month: i, day: s } = f(r);
  if (!t2 || t2 < 0 || t2 > 9999 || !i || i < 1 || i > 12 || !s || s < 1)
    return;
  const n = new Date(Date.UTC(t2, i - 1, s));
  if (!(n.getUTCFullYear() !== t2 || n.getUTCMonth() !== i - 1 || n.getUTCDate() !== s))
    return { year: t2, month: i, day: s };
}
function C(r) {
  const t2 = b(r);
  return t2 ? new Date(Date.UTC(t2.year, t2.month - 1, t2.day)) : undefined;
}
function T2(r, t2, i, s) {
  const n = i ? {
    year: i.getUTCFullYear(),
    month: i.getUTCMonth() + 1,
    day: i.getUTCDate()
  } : null, e = s ? {
    year: s.getUTCFullYear(),
    month: s.getUTCMonth() + 1,
    day: s.getUTCDate()
  } : null;
  return r === "year" ? { min: n?.year ?? 1, max: e?.year ?? 9999 } : r === "month" ? {
    min: n && t2.year === n.year ? n.month : 1,
    max: e && t2.year === e.year ? e.month : 12
  } : {
    min: n && t2.year === n.year && t2.month === n.month ? n.day : 1,
    max: e && t2.year === e.year && t2.month === e.month ? e.day : c(t2.year, t2.month)
  };
}

class U extends V {
  #i;
  #o;
  #t;
  #h;
  #u;
  #e = { segmentIndex: 0, positionInSegment: 0 };
  #n = true;
  #s = null;
  inlineError = "";
  get segmentCursor() {
    return { ...this.#e };
  }
  get segmentValues() {
    return { ...this.#t };
  }
  get segments() {
    return this.#i;
  }
  get separator() {
    return this.#o;
  }
  get formattedValue() {
    return this.#l(this.#t);
  }
  #l(t2) {
    return this.#i.map((i) => t2[i.type]).join(this.#o);
  }
  #r() {
    this._setUserInput(this.#l(this.#t)), this._setValue(C(this.#t) ?? undefined);
  }
  constructor(t2) {
    const i = t2.format ? { segments: M(t2.format), separator: t2.separator ?? "/" } : P(t2.locale), s = t2.separator ?? i.separator, n = t2.format ? M(t2.format) : i.segments, e = t2.initialValue ?? t2.defaultValue, m2 = e ? {
      year: String(e.getUTCFullYear()).padStart(4, "0"),
      month: String(e.getUTCMonth() + 1).padStart(2, "0"),
      day: String(e.getUTCDate()).padStart(2, "0")
    } : { year: "____", month: "__", day: "__" }, o = n.map((a) => m2[a.type]).join(s);
    super({ ...t2, initialUserInput: o }, false), this.#i = n, this.#o = s, this.#t = m2, this.#h = t2.minDate, this.#u = t2.maxDate, this.#r(), this.on("cursor", (a) => this.#f(a)), this.on("key", (a, u) => this.#y(a, u)), this.on("finalize", () => this.#p(t2));
  }
  #a() {
    const t2 = Math.max(0, Math.min(this.#e.segmentIndex, this.#i.length - 1)), i = this.#i[t2];
    if (i)
      return this.#e.positionInSegment = Math.max(0, Math.min(this.#e.positionInSegment, i.len - 1)), { segment: i, index: t2 };
  }
  #m(t2) {
    this.inlineError = "", this.#s = null;
    const i = this.#a();
    i && (this.#e.segmentIndex = Math.max(0, Math.min(this.#i.length - 1, i.index + t2)), this.#e.positionInSegment = 0, this.#n = true);
  }
  #d(t2) {
    const i = this.#a();
    if (!i)
      return;
    const { segment: s } = i, n = this.#t[s.type], e = !n || n.replace(/_/g, "") === "", m2 = Number.parseInt((n || "0").replace(/_/g, "0"), 10) || 0, o = T2(s.type, f(this.#t), this.#h, this.#u);
    let a;
    e ? a = t2 === 1 ? o.min : o.max : a = Math.max(Math.min(o.max, m2 + t2), o.min), this.#t = {
      ...this.#t,
      [s.type]: a.toString().padStart(s.len, "0")
    }, this.#n = true, this.#s = null, this.#r();
  }
  #f(t2) {
    if (t2)
      switch (t2) {
        case "right":
          return this.#m(1);
        case "left":
          return this.#m(-1);
        case "up":
          return this.#d(1);
        case "down":
          return this.#d(-1);
      }
  }
  #y(t2, i) {
    if (i?.name === "backspace" || i?.sequence === "" || i?.sequence === "\b" || t2 === "" || t2 === "\b") {
      this.inlineError = "";
      const n = this.#a();
      if (!n)
        return;
      if (!this.#t[n.segment.type].replace(/_/g, "")) {
        this.#m(-1);
        return;
      }
      this.#t[n.segment.type] = "_".repeat(n.segment.len), this.#n = true, this.#e.positionInSegment = 0, this.#r();
      return;
    }
    if (i?.name === "tab") {
      this.inlineError = "";
      const n = this.#a();
      if (!n)
        return;
      const e = i.shift ? -1 : 1, m2 = n.index + e;
      m2 >= 0 && m2 < this.#i.length && (this.#e.segmentIndex = m2, this.#e.positionInSegment = 0, this.#n = true);
      return;
    }
    if (t2 && /^[0-9]$/.test(t2)) {
      const n = this.#a();
      if (!n)
        return;
      const { segment: e } = n, m2 = !this.#t[e.type].replace(/_/g, "");
      if (this.#n && this.#s !== null && !m2) {
        const h = this.#s + t2, d = { ...this.#t, [e.type]: h }, g2 = this.#g(d, e);
        if (g2) {
          this.inlineError = g2, this.#s = null, this.#n = false;
          return;
        }
        this.inlineError = "", this.#t[e.type] = h, this.#s = null, this.#n = false, this.#r(), n.index < this.#i.length - 1 && (this.#e.segmentIndex = n.index + 1, this.#e.positionInSegment = 0, this.#n = true);
        return;
      }
      this.#n && !m2 && (this.#t[e.type] = "_".repeat(e.len), this.#e.positionInSegment = 0), this.#n = false, this.#s = null;
      const o = this.#t[e.type], a = o.indexOf("_"), u = a >= 0 ? a : Math.min(this.#e.positionInSegment, e.len - 1);
      if (u < 0 || u >= e.len)
        return;
      let l2 = o.slice(0, u) + t2 + o.slice(u + 1), D = false;
      if (u === 0 && o === "__" && (e.type === "month" || e.type === "day")) {
        const h = Number.parseInt(t2, 10);
        l2 = `0${t2}`, D = h <= (e.type === "month" ? 1 : 2);
      }
      if (e.type === "year" && (l2 = (o.replace(/_/g, "") + t2).padStart(e.len, "_")), !l2.includes("_")) {
        const h = { ...this.#t, [e.type]: l2 }, d = this.#g(h, e);
        if (d) {
          this.inlineError = d;
          return;
        }
      }
      this.inlineError = "", this.#t[e.type] = l2;
      const y = l2.includes("_") ? undefined : b(this.#t);
      if (y) {
        const { year: h, month: d } = y, g2 = c(h, d);
        this.#t = {
          year: String(Math.max(0, Math.min(9999, h))).padStart(4, "0"),
          month: String(Math.max(1, Math.min(12, d))).padStart(2, "0"),
          day: String(Math.max(1, Math.min(g2, y.day))).padStart(2, "0")
        };
      }
      this.#r();
      const S = l2.indexOf("_");
      D ? (this.#n = true, this.#s = t2) : S >= 0 ? this.#e.positionInSegment = S : a >= 0 && n.index < this.#i.length - 1 ? (this.#e.segmentIndex = n.index + 1, this.#e.positionInSegment = 0, this.#n = true) : this.#e.positionInSegment = Math.min(u + 1, e.len - 1);
    }
  }
  #g(t2, i) {
    const { month: s, day: n } = f(t2);
    if (i.type === "month" && (s < 0 || s > 12))
      return settings.date.messages.invalidMonth;
    if (i.type === "day" && (n < 0 || n > 31))
      return settings.date.messages.invalidDay(31, "any month");
  }
  #p(t2) {
    const { year: i, month: s, day: n } = f(this.#t);
    if (i && s && n) {
      const e = c(i, s);
      this.#t = {
        ...this.#t,
        day: String(Math.min(n, e)).padStart(2, "0")
      };
    }
    this.value = C(this.#t) ?? t2.defaultValue ?? undefined;
  }
}
var u$2 = class u extends V {
  options;
  cursor = 0;
  #t;
  getGroupItems(t2) {
    return this.options.filter((r) => r.group === t2);
  }
  isGroupSelected(t2) {
    const r = this.getGroupItems(t2), e = this.value;
    return e === undefined ? false : r.every((s) => e.includes(s.value));
  }
  toggleValue() {
    const t2 = this.options[this.cursor];
    if (t2 !== undefined)
      if (this.value === undefined && (this.value = []), t2.group === true) {
        const r = t2.value, e = this.getGroupItems(r);
        this.isGroupSelected(r) ? this.value = this.value.filter((s) => e.findIndex((i) => i.value === s) === -1) : this.value = [...this.value, ...e.map((s) => s.value)], this.value = Array.from(new Set(this.value));
      } else {
        const r = this.value.includes(t2.value);
        this.value = r ? this.value.filter((e) => e !== t2.value) : [...this.value, t2.value];
      }
  }
  constructor(t2) {
    super(t2, false);
    const { options: r } = t2;
    this.#t = t2.selectableGroups !== false, this.options = Object.entries(r).flatMap(([e, s]) => [
      { value: e, group: true, label: e },
      ...s.map((i) => ({ ...i, group: e }))
    ]), this.value = [...t2.initialValues ?? []], this.cursor = Math.max(this.options.findIndex(({ value: e }) => e === t2.cursorAt), this.#t ? 0 : 1), this.on("cursor", (e) => {
      switch (e) {
        case "left":
        case "up": {
          this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          const s = this.options[this.cursor]?.group === true;
          !this.#t && s && (this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1);
          break;
        }
        case "down":
        case "right": {
          this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          const s = this.options[this.cursor]?.group === true;
          !this.#t && s && (this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1);
          break;
        }
        case "space":
          this.toggleValue();
          break;
      }
    });
  }
};
var o = /* @__PURE__ */ new Set(["up", "down", "left", "right"]);

class h extends V {
  #t = false;
  #s;
  focused = "editor";
  get userInputWithCursor() {
    if (this.state === "submit")
      return this.userInput;
    const t2 = this.userInput;
    if (this.cursor >= t2.length)
      return `${t2}█`;
    const s = t2.slice(0, this.cursor), r = t2.slice(this.cursor, this.cursor + 1), i = t2.slice(this.cursor + 1);
    return r === `
` ? `${s}█
${i}` : `${s}${styleText("inverse", r)}${i}`;
  }
  get cursor() {
    return this._cursor;
  }
  #r(t2) {
    if (this.userInput.length === 0) {
      this._setUserInput(t2);
      return;
    }
    this._setUserInput(this.userInput.slice(0, this.cursor) + t2 + this.userInput.slice(this.cursor));
  }
  #i(t2) {
    const s = this.value ?? "";
    switch (t2) {
      case "up":
        this._cursor = findTextCursor(this._cursor, 0, -1, s);
        return;
      case "down":
        this._cursor = findTextCursor(this._cursor, 0, 1, s);
        return;
      case "left":
        this._cursor = findTextCursor(this._cursor, -1, 0, s);
        return;
      case "right":
        this._cursor = findTextCursor(this._cursor, 1, 0, s);
        return;
    }
  }
  _shouldSubmit(t2, s) {
    if (this.#s)
      return this.focused === "submit" ? true : (this.#r(`
`), this._cursor++, false);
    const r = this.#t;
    return this.#t = true, r && this.cursor === this.userInput.length ? (this.userInput[this.cursor - 1] === `
` && (this._setUserInput(this.userInput.slice(0, this.cursor - 1) + this.userInput.slice(this.cursor)), this._cursor--), true) : (this.#r(`
`), this._cursor++, false);
  }
  constructor(t2) {
    const s = t2.initialUserInput ?? t2.initialValue;
    super({
      ...t2,
      initialUserInput: s
    }, false), s !== undefined && (this._cursor = s.length), this.#s = t2.showSubmit ?? false, this.on("key", (r, i) => {
      if (i?.name && o.has(i.name)) {
        this.#t = false, this.#i(i.name);
        return;
      }
      if (r === "\t" && this.#s) {
        this.focused = this.focused === "editor" ? "submit" : "editor";
        return;
      }
      if (i?.name !== "return") {
        if (this.#t = false, i?.name === "backspace" && this.cursor > 0) {
          this._setUserInput(this.userInput.slice(0, this.cursor - 1) + this.userInput.slice(this.cursor)), this._cursor--;
          return;
        }
        if (i?.name === "delete" && this.cursor < this.userInput.length) {
          this._setUserInput(this.userInput.slice(0, this.cursor) + this.userInput.slice(this.cursor + 1));
          return;
        }
        r && (this.#s && this.focused === "submit" && (this.focused = "editor"), this.#r(r ?? ""), this._cursor++);
      }
    }), this.on("userInput", (r) => {
      this._setValue(r);
    }), this.on("finalize", () => {
      this.value || (this.value = t2.defaultValue), this.value === undefined && (this.value = "");
    });
  }
}

class a extends V {
  options;
  cursor = 0;
  get _value() {
    return this.options[this.cursor]?.value;
  }
  get _enabledOptions() {
    return this.options.filter((e) => e.disabled !== true);
  }
  toggleAll() {
    const e = this._enabledOptions, i = this.value !== undefined && this.value.length === e.length;
    this.value = i ? [] : e.map((t2) => t2.value);
  }
  toggleInvert() {
    const e = this.value;
    if (!e)
      return;
    const i = this._enabledOptions.filter((t2) => !e.includes(t2.value));
    this.value = i.map((t2) => t2.value);
  }
  toggleValue() {
    this.value === undefined && (this.value = []);
    const e = this.value.includes(this._value);
    this.value = e ? this.value.filter((i) => i !== this._value) : [...this.value, this._value];
  }
  constructor(e) {
    super(e, false), this.options = e.options, this.value = [...e.initialValues ?? []];
    const i = Math.max(this.options.findIndex(({ value: t2 }) => t2 === e.cursorAt), 0);
    this.cursor = this.options[i]?.disabled ? findCursor(i, 1, this.options) : i, this.on("key", (t2, l2) => {
      l2.name === "a" && this.toggleAll(), l2.name === "i" && this.toggleInvert();
    }), this.on("cursor", (t2) => {
      switch (t2) {
        case "left":
        case "up":
          this.cursor = findCursor(this.cursor, -1, this.options);
          break;
        case "down":
        case "right":
          this.cursor = findCursor(this.cursor, 1, this.options);
          break;
        case "space":
          this.toggleValue();
          break;
      }
    });
  }
}

// node_modules/@clack/prompts/dist/index.mjs
import { styleText as styleText2, stripVTControlCharacters } from "node:util";
import process$1 from "node:process";
var import_sisteransi2 = __toESM(require_src(), 1);
function isUnicodeSupported() {
  if (process$1.platform !== "win32") {
    return process$1.env.TERM !== "linux";
  }
  return Boolean(process$1.env.CI) || Boolean(process$1.env.WT_SESSION) || Boolean(process$1.env.TERMINUS_SUBLIME) || process$1.env.ConEmuTask === "{cmd::Cmder}" || process$1.env.TERM_PROGRAM === "Terminus-Sublime" || process$1.env.TERM_PROGRAM === "vscode" || process$1.env.TERM === "xterm-256color" || process$1.env.TERM === "alacritty" || process$1.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var unicode = isUnicodeSupported();
var isCI = () => process.env.CI === "true";
var unicodeOr = (o2, e) => unicode ? o2 : e;
var S_STEP_ACTIVE = unicodeOr("◆", "*");
var S_STEP_CANCEL = unicodeOr("■", "x");
var S_STEP_ERROR = unicodeOr("▲", "x");
var S_STEP_SUBMIT = unicodeOr("◇", "o");
var S_BAR_START = unicodeOr("┌", "T");
var S_BAR = unicodeOr("│", "|");
var S_BAR_END = unicodeOr("└", "—");
var S_BAR_START_RIGHT = unicodeOr("┐", "T");
var S_BAR_END_RIGHT = unicodeOr("┘", "—");
var S_RADIO_ACTIVE = unicodeOr("●", ">");
var S_RADIO_INACTIVE = unicodeOr("○", " ");
var S_CHECKBOX_ACTIVE = unicodeOr("◻", "[•]");
var S_CHECKBOX_SELECTED = unicodeOr("◼", "[+]");
var S_CHECKBOX_INACTIVE = unicodeOr("◻", "[ ]");
var S_PASSWORD_MASK = unicodeOr("▪", "•");
var S_BAR_H = unicodeOr("─", "-");
var S_CORNER_TOP_RIGHT = unicodeOr("╮", "+");
var S_CONNECT_LEFT = unicodeOr("├", "+");
var S_CORNER_BOTTOM_RIGHT = unicodeOr("╯", "+");
var S_CORNER_BOTTOM_LEFT = unicodeOr("╰", "+");
var S_CORNER_TOP_LEFT = unicodeOr("╭", "+");
var S_INFO = unicodeOr("●", "•");
var S_SUCCESS = unicodeOr("◆", "*");
var S_WARN = unicodeOr("▲", "!");
var S_ERROR = unicodeOr("■", "x");
var symbol = (o2) => {
  switch (o2) {
    case "initial":
    case "active":
      return styleText2("cyan", S_STEP_ACTIVE);
    case "cancel":
      return styleText2("red", S_STEP_CANCEL);
    case "error":
      return styleText2("yellow", S_STEP_ERROR);
    case "submit":
      return styleText2("green", S_STEP_SUBMIT);
  }
};
var symbolBar = (o2) => {
  switch (o2) {
    case "initial":
    case "active":
      return styleText2("cyan", S_BAR);
    case "cancel":
      return styleText2("red", S_BAR);
    case "error":
      return styleText2("yellow", S_BAR);
    case "submit":
      return styleText2("green", S_BAR);
  }
};
function formatInstructionFooter(o2, e) {
  const r2 = [`${e ? `${styleText2("cyan", S_BAR)}  ` : ""}${o2.join(" • ")}`];
  return e && r2.push(styleText2("cyan", S_BAR_END)), r2;
}
var I = (l2, e, w, p2, b2, C2 = false) => {
  let r2 = e, O = 0;
  if (C2)
    for (let i = p2 - 1;i >= w; i--) {
      const m2 = l2[i];
      if (m2 && (r2 -= m2.length), O++, r2 <= b2)
        break;
    }
  else
    for (let i = w;i < p2; i++) {
      const m2 = l2[i];
      if (m2 && (r2 -= m2.length), O++, r2 <= b2)
        break;
    }
  return { lineCount: r2, removals: O };
};
var limitOptions = ({
  cursor: l2,
  options: e,
  style: w,
  output: p2 = process.stdout,
  maxItems: b2 = Number.POSITIVE_INFINITY,
  columnPadding: C2 = 0,
  rowPadding: r2 = 4
}) => {
  const i = getColumns(p2) - C2, m2 = getRows(p2), M2 = styleText2("dim", "..."), v = Math.max(m2 - r2, 0), a2 = Math.max(Math.min(b2, v), 5);
  let f2 = 0;
  l2 >= a2 - 3 && (f2 = Math.max(Math.min(l2 - a2 + 3, e.length - a2), 0));
  let d = a2 < e.length && f2 > 0, c2 = a2 < e.length && f2 + a2 < e.length;
  const W = Math.min(f2 + a2, e.length), s = [];
  let g2 = 0;
  d && g2++, c2 && g2++;
  const T3 = f2 + (d ? 1 : 0), y = W - (c2 ? 1 : 0);
  for (let t2 = T3;t2 < y; t2++) {
    const n2 = e[t2], o2 = n2 ? w(n2, t2 === l2) : "", h2 = wrapAnsi(o2, i, {
      hard: true,
      trim: false
    }).split(`
`);
    s.push(h2), g2 += h2.length;
  }
  if (g2 > v) {
    let t2 = 0, n2 = 0, o2 = g2;
    const h2 = l2 - T3;
    let u3 = v;
    const L = () => I(s, o2, 0, h2, u3), E = () => I(s, o2, h2 + 1, s.length, u3, true);
    d ? ({ lineCount: o2, removals: t2 } = L(), o2 > u3 && (c2 || (u3 -= 1), { lineCount: o2, removals: n2 } = E())) : (c2 || (u3 -= 1), { lineCount: o2, removals: n2 } = E(), o2 > u3 && (u3 -= 1, { lineCount: o2, removals: t2 } = L())), t2 > 0 && (d = true, s.splice(0, t2)), n2 > 0 && (c2 = true, s.splice(s.length - n2, n2));
  }
  const x = [];
  d && x.push(M2);
  for (const t2 of s)
    for (const n2 of t2)
      x.push(n2);
  return c2 && x.push(M2), x;
};
var MULTISELECT_INSTRUCTIONS = [
  `${styleText2("dim", "↑/↓")} to navigate`,
  `${styleText2("dim", "Space:")} select`,
  `${styleText2("dim", "Enter:")} confirm`
];
var m2 = (i, u3) => i.split(`
`).map((d) => u3(d)).join(`
`);
var multiselect = (i) => {
  const u3 = (t2, a2) => {
    const r2 = t2.label ?? String(t2.value);
    return a2 === "disabled" ? `${styleText2("gray", S_CHECKBOX_INACTIVE)} ${m2(r2, (o2) => styleText2(["strikethrough", "gray"], o2))}${t2.hint ? ` ${styleText2("dim", `(${t2.hint ?? "disabled"})`)}` : ""}` : a2 === "active" ? `${styleText2("cyan", S_CHECKBOX_ACTIVE)} ${r2}${t2.hint ? ` ${styleText2("dim", `(${t2.hint})`)}` : ""}` : a2 === "selected" ? `${styleText2("green", S_CHECKBOX_SELECTED)} ${m2(r2, (o2) => styleText2("dim", o2))}${t2.hint ? ` ${styleText2("dim", `(${t2.hint})`)}` : ""}` : a2 === "cancelled" ? `${m2(r2, (o2) => styleText2(["strikethrough", "dim"], o2))}` : a2 === "active-selected" ? `${styleText2("green", S_CHECKBOX_SELECTED)} ${r2}${t2.hint ? ` ${styleText2("dim", `(${t2.hint})`)}` : ""}` : a2 === "submitted" ? `${m2(r2, (o2) => styleText2("dim", o2))}` : `${styleText2("dim", S_CHECKBOX_INACTIVE)} ${m2(r2, (o2) => styleText2("dim", o2))}`;
  }, d = i.required ?? true, v = i.showInstructions ?? true;
  return new a({
    options: i.options,
    signal: i.signal,
    input: i.input,
    output: i.output,
    initialValues: i.initialValues,
    required: d,
    cursorAt: i.cursorAt,
    validate(t2) {
      if (d && (t2 === undefined || t2.length === 0))
        return `Please select at least one option.
${styleText2("reset", styleText2("dim", `Press ${styleText2(["gray", "bgWhite", "inverse"], " space ")} to select, ${styleText2("gray", styleText2("bgWhite", styleText2("inverse", " enter ")))} to submit`))}`;
    },
    render() {
      const t2 = i.withGuide ?? settings.withGuide, a2 = wrapTextWithPrefix(i.output, i.message, t2 ? `${symbolBar(this.state)}  ` : "", `${symbol(this.state)}  `), r2 = `${t2 ? `${styleText2("gray", S_BAR)}
` : ""}${a2}
`, o2 = this.value ?? [], p2 = (n2, l2) => {
        if (n2.disabled)
          return u3(n2, "disabled");
        const s = o2.includes(n2.value);
        return l2 && s ? u3(n2, "active-selected") : s ? u3(n2, "selected") : u3(n2, l2 ? "active" : "inactive");
      };
      switch (this.state) {
        case "submit": {
          const n2 = this.options.filter(({ value: s }) => o2.includes(s)).map((s) => u3(s, "submitted")).join(styleText2("dim", ", ")) || styleText2("dim", "none"), l2 = wrapTextWithPrefix(i.output, n2, t2 ? `${styleText2("gray", S_BAR)}  ` : "");
          return `${r2}${l2}`;
        }
        case "cancel": {
          const n2 = this.options.filter(({ value: s }) => o2.includes(s)).map((s) => u3(s, "cancelled")).join(styleText2("dim", ", "));
          if (n2.trim() === "")
            return `${r2}${styleText2("gray", S_BAR)}`;
          const l2 = wrapTextWithPrefix(i.output, n2, t2 ? `${styleText2("gray", S_BAR)}  ` : "");
          return `${r2}${l2}${t2 ? `
${styleText2("gray", S_BAR)}` : ""}`;
        }
        case "error": {
          const n2 = t2 ? `${styleText2("yellow", S_BAR)}  ` : "", l2 = this.error.split(`
`).map(($, C2) => C2 === 0 ? `${t2 ? `${styleText2("yellow", S_BAR_END)}  ` : ""}${styleText2("yellow", $)}` : `   ${$}`).join(`
`), s = r2.split(`
`).length, h2 = l2.split(`
`).length + 1;
          return `${r2}${n2}${limitOptions({
            output: i.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: i.maxItems,
            columnPadding: n2.length,
            rowPadding: s + h2,
            style: p2
          }).join(`
${n2}`)}
${l2}
`;
        }
        default: {
          const n2 = t2 ? `${styleText2("cyan", S_BAR)}  ` : "", l2 = r2.split(`
`).length, s = v ? formatInstructionFooter(MULTISELECT_INSTRUCTIONS, t2) : t2 ? [styleText2("cyan", S_BAR_END)] : [], h2 = s.join(`
`), $ = s.length + 1;
          return `${r2}${n2}${limitOptions({
            output: i.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: i.maxItems,
            columnPadding: n2.length,
            rowPadding: l2 + $,
            style: p2
          }).join(`
${n2}`)}
${h2}
`;
        }
      }
    }
  }).prompt();
};
var log = {
  message: (s = [], {
    symbol: e = styleText2("gray", S_BAR),
    secondarySymbol: r2 = styleText2("gray", S_BAR),
    output: m3 = process.stdout,
    spacing: l2 = 1,
    withGuide: c2
  } = {}) => {
    const t2 = [], o2 = c2 ?? settings.withGuide, f2 = o2 ? r2 : "", O = o2 ? `${e}  ` : "", u3 = o2 ? `${r2}  ` : "";
    for (let i = 0;i < l2; i++)
      t2.push(f2);
    const g2 = Array.isArray(s) ? s : s.split(`
`);
    if (g2.length > 0) {
      const [i, ...y] = g2;
      i.length > 0 ? t2.push(`${O}${i}`) : t2.push(o2 ? e : "");
      for (const p2 of y)
        p2.length > 0 ? t2.push(`${u3}${p2}`) : t2.push(o2 ? r2 : "");
    }
    m3.write(`${t2.join(`
`)}
`);
  },
  info: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("blue", S_INFO) });
  },
  success: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("green", S_SUCCESS) });
  },
  step: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("green", S_STEP_SUBMIT) });
  },
  warn: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("yellow", S_WARN) });
  },
  warning: (s, e) => {
    log.warn(s, e);
  },
  error: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("red", S_ERROR) });
  }
};
var cancel = (o2 = "", t2) => {
  const i = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR_END)}  ` : "";
  i.write(`${e}${styleText2("red", o2)}

`);
};
var intro = (o2 = "", t2) => {
  const i = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR_START)}  ` : "";
  i.write(`${e}${o2}
`);
};
var outro = (o2 = "", t2) => {
  const i = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR)}
${styleText2("gray", S_BAR_END)}  ` : "";
  i.write(`${e}${o2}

`);
};
var W$1 = (o2) => o2;
var C2 = (o2, e, s) => {
  const a2 = {
    hard: true,
    trim: false
  }, i = wrapAnsi(o2, e, a2).split(`
`), c2 = i.reduce((n2, t2) => Math.max(dist_default2(t2), n2), 0), u3 = i.map(s).reduce((n2, t2) => Math.max(dist_default2(t2), n2), 0), g2 = e - (u3 - c2);
  return wrapAnsi(o2, g2, a2);
};
var note = (o2 = "", e = "", s) => {
  const a2 = s?.output ?? process$1.stdout, i = s?.withGuide ?? settings.withGuide, c2 = s?.format ?? W$1, g2 = ["", ...C2(o2, getColumns(a2) - 6, c2).split(`
`).map(c2), ""], n2 = dist_default2(e), t2 = Math.max(g2.reduce((m3, F) => {
    const O = dist_default2(F);
    return O > m3 ? O : m3;
  }, 0), n2) + 2, h2 = g2.map((m3) => `${styleText2("gray", S_BAR)}  ${m3}${" ".repeat(t2 - dist_default2(m3))}${styleText2("gray", S_BAR)}`).join(`
`), T3 = i ? `${styleText2("gray", S_BAR)}
` : "", l$1 = i ? S_CONNECT_LEFT : S_CORNER_BOTTOM_LEFT;
  a2.write(`${T3}${styleText2("green", S_STEP_SUBMIT)}  ${styleText2("reset", e)} ${styleText2("gray", S_BAR_H.repeat(Math.max(t2 - n2 - 1, 1)) + S_CORNER_TOP_RIGHT)}
${h2}
${styleText2("gray", l$1 + S_BAR_H.repeat(t2 + 2) + S_CORNER_BOTTOM_RIGHT)}
`);
};
var W = (l2) => styleText2("magenta", l2);
var spinner = ({
  indicator: l2 = "dots",
  onCancel: h2,
  output: n2 = process.stdout,
  cancelMessage: G,
  errorMessage: O,
  frames: E = unicode ? ["◒", "◐", "◓", "◑"] : ["•", "o", "O", "0"],
  delay: F = unicode ? 80 : 120,
  signal: m3,
  ...I2
} = {}) => {
  const u3 = isCI();
  let M2, T3, d = false, S = false, s = "", p2, w = performance.now();
  const x = getColumns(n2), k = I2?.styleFrame ?? W, g2 = (e) => {
    const r2 = e > 1 ? O ?? settings.messages.error : G ?? settings.messages.cancel;
    S = e === 1, d && (a2(r2, e), S && typeof h2 == "function" && h2());
  }, f2 = () => g2(2), i = () => g2(1), A = () => {
    process.on("uncaughtExceptionMonitor", f2), process.on("unhandledRejection", f2), process.on("SIGINT", i), process.on("SIGTERM", i), process.on("exit", g2), m3 && m3.addEventListener("abort", i);
  }, H = () => {
    process.removeListener("uncaughtExceptionMonitor", f2), process.removeListener("unhandledRejection", f2), process.removeListener("SIGINT", i), process.removeListener("SIGTERM", i), process.removeListener("exit", g2), m3 && m3.removeEventListener("abort", i);
  }, y = () => {
    if (p2 === undefined)
      return;
    u3 && n2.write(`
`);
    const r2 = wrapAnsi(p2, x, {
      hard: true,
      trim: false
    }).split(`
`);
    r2.length > 1 && n2.write(import_sisteransi2.cursor.up(r2.length - 1)), n2.write(import_sisteransi2.cursor.to(0)), n2.write(import_sisteransi2.erase.down());
  }, C3 = (e) => e.replace(/\.+$/, ""), _2 = (e) => {
    const r2 = (performance.now() - e) / 1000, t2 = Math.floor(r2 / 60), o2 = Math.floor(r2 % 60);
    return t2 > 0 ? `[${t2}m ${o2}s]` : `[${o2}s]`;
  }, N = I2.withGuide ?? settings.withGuide, P2 = (e = "") => {
    d = true, M2 = block({ output: n2 }), s = C3(e), w = performance.now(), N && n2.write(`${styleText2("gray", S_BAR)}
`);
    let r2 = 0, t2 = 0;
    A(), T3 = setInterval(() => {
      if (u3 && s === p2)
        return;
      y(), p2 = s;
      const o2 = k(E[r2]);
      let v;
      if (u3)
        v = `${o2}  ${s}...`;
      else if (l2 === "timer")
        v = `${o2}  ${s} ${_2(w)}`;
      else {
        const B = ".".repeat(Math.floor(t2)).slice(0, 3);
        v = `${o2}  ${s}${B}`;
      }
      const j = wrapAnsi(v, x, {
        hard: true,
        trim: false
      });
      n2.write(j), r2 = r2 + 1 < E.length ? r2 + 1 : 0, t2 = t2 < 4 ? t2 + 0.125 : 0;
    }, F);
  }, a2 = (e = "", r2 = 0, t2 = false) => {
    if (!d)
      return;
    d = false, clearInterval(T3), y();
    const o2 = r2 === 0 ? styleText2("green", S_STEP_SUBMIT) : r2 === 1 ? styleText2("red", S_STEP_CANCEL) : styleText2("red", S_STEP_ERROR);
    s = e ?? s, t2 || (l2 === "timer" ? n2.write(`${o2}  ${s} ${_2(w)}
`) : n2.write(`${o2}  ${s}
`)), H(), M2();
  };
  return {
    start: P2,
    stop: (e = "") => a2(e, 0),
    message: (e = "") => {
      s = C3(e ?? s);
    },
    cancel: (e = "") => a2(e, 1),
    error: (e = "") => a2(e, 2),
    clear: () => a2("", 0, true),
    get isCancelled() {
      return S;
    }
  };
};
var u3 = {
  light: unicodeOr("─", "-"),
  heavy: unicodeOr("━", "="),
  block: unicodeOr("█", "#")
};
var SELECT_INSTRUCTIONS = [
  `${styleText2("dim", "↑/↓")} to navigate`,
  `${styleText2("dim", "Enter:")} confirm`
];
var i = `${styleText2("gray", S_BAR)}  `;

// src/commands/add/command.ts
var import_picocolors = __toESM(require_picocolors(), 1);

// src/error/code.ts
var AppErrorCode = {
  COMMANDER_NORMAL_EXIT_CODE: "commander_normal_exit_code",
  COMMANDER_HELP_DISPLAYED_CODE: "commander_help_displayed_code",
  COMMANDER_UNKNOWN_COMMAND_CODE: "commander_unknown_command_code",
  COMMANDER_UNKNOWN_OPTION_CODE: "commander_unknown_option_code",
  COMMANDER_OPTION_MISSING_ARGUMENT_CODE: "commander_option_missing_argument_code",
  COMMANDER_MANDATORY_OPTION_VALUE_MISSING_CODE: "commander_mandatory_option_value_missing_code",
  COMMANDER_MISSING_ARGUMENT_CODE: "commander_missing_argument_code",
  COMMANDER_EXCESS_ARGUMENTS_CODE: "commander_excess_arguments_code",
  UNEXPECTED_ERROR_CODE: "unexpected_error_code",
  PACKAGE_BIN_CONFIG_MISSING_CODE: "package_bin_config_missing_code",
  PACKAGE_CONFIG_JSON_INVALID_CODE: "package_config_json_invalid_code",
  PACKAGE_CONFIG_SCHEMA_INVALID_CODE: "package_config_schema_invalid_code",
  PACKAGE_CONFIG_NOT_FOUND_CODE: "package_config_not_found_code",
  PLATFORM_NOT_FOUND_CODE: "platform_not_found_code",
  REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE: "remote_repository_download_failed_code",
  REMOTE_SKILL_EMPTY_CODE: "remote_skill_empty_code",
  REMOTE_SKILL_NOT_FOUND_CODE: "remote_skill_not_found_code",
  REMOTE_SKILL_ENTRY_INVALID_CODE: "remote_skill_entry_invalid_code",
  REMOTE_SKILL_ENTRY_MISSING_CODE: "remote_skill_entry_missing_code",
  REMOTE_SKILL_DIRECTORY_INVALID_CODE: "remote_skill_directory_invalid_code",
  PLATFORM_SKILL_DIRECTORY_INVALID_CODE: "platform_skill_directory_invalid_code",
  SKILL_OPTION_INVALID_FORMAT_CODE: "skill_option_invalid_format_code",
  SKILL_ADD_FAILED_CODE: "skill_add_failed_code",
  LOCAL_SKILL_EMPTY_CODE: "local_skill_empty_code",
  LOCAL_SKILL_NOT_FOUND_CODE: "local_skill_not_found_code",
  PROMPT_CANCELLED_CODE: "prompt_cancelled_code",
  DIRECTORY_REMOVE_FAILED_CODE: "directory_remove_failed_code",
  REMOTE_REPOSITORY_NOT_LOADED_CODE: "remote_repository_not_loaded_code",
  REMOTE_SKILL_LIST_NOT_LOADED_CODE: "remote_skill_list_not_loaded_code",
  LOCAL_PLATFORM_LIST_NOT_LOADED_CODE: "local_platform_list_not_loaded_code",
  APP_ERROR_PARAM_MISSING_CODE: "app_error_param_missing_code"
};
var CommanderErrorCode = {
  UNKNOWN_COMMAND_CODE: "commander.unknownCommand",
  UNKNOWN_OPTION_CODE: "commander.unknownOption",
  OPTION_MISSING_ARGUMENT_CODE: "commander.optionMissingArgument",
  MISSING_MANDATORY_OPTION_VALUE_CODE: "commander.missingMandatoryOptionValue",
  MISSING_ARGUMENT_CODE: "commander.missingArgument",
  EXCESS_ARGUMENTS_CODE: "commander.excessArguments"
};
var COMMANDER_HELP_DISPLAYED_CODE = "commander.help";

// src/error/definition.ts
var appErrorDefinitionMap = {
  [AppErrorCode.COMMANDER_NORMAL_EXIT_CODE]: {
    appErrorTitle: "命令已结束",
    buildAppErrorMessage() {
      return "命令已正常结束。";
    }
  },
  [AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE]: {
    appErrorTitle: "已显示帮助",
    buildAppErrorMessage() {
      return "已显示帮助信息。";
    }
  },
  [AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE]: {
    appErrorTitle: "命令不存在",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE }
        });
      }
      return appErrorParam.detailMessage;
    }
  },
  [AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE]: {
    appErrorTitle: "选项不受支持",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE }
        });
      }
      return appErrorParam.detailMessage;
    }
  },
  [AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE]: {
    appErrorTitle: "选项缺少参数值",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE }
        });
      }
      return appErrorParam.detailMessage;
    }
  },
  [AppErrorCode.COMMANDER_MANDATORY_OPTION_VALUE_MISSING_CODE]: {
    appErrorTitle: "必填选项值缺失",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_MANDATORY_OPTION_VALUE_MISSING_CODE }
        });
      }
      return appErrorParam.detailMessage;
    }
  },
  [AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE]: {
    appErrorTitle: "缺少必填参数",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE }
        });
      }
      return appErrorParam.detailMessage;
    }
  },
  [AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE]: {
    appErrorTitle: "命令参数过多",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE }
        });
      }
      return appErrorParam.detailMessage;
    }
  },
  [AppErrorCode.UNEXPECTED_ERROR_CODE]: {
    appErrorTitle: "程序异常",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.UNEXPECTED_ERROR_CODE }
        });
      }
      return appErrorParam.detailMessage;
    }
  },
  [AppErrorCode.PACKAGE_BIN_CONFIG_MISSING_CODE]: {
    appErrorTitle: "package.json bin 配置缺失",
    buildAppErrorMessage() {
      return "package.json 中缺少 bin 配置。";
    }
  },
  [AppErrorCode.PACKAGE_CONFIG_JSON_INVALID_CODE]: {
    appErrorTitle: "package.json 语法错误",
    buildAppErrorMessage() {
      return "package.json JSON 语法不正确。";
    }
  },
  [AppErrorCode.PACKAGE_CONFIG_SCHEMA_INVALID_CODE]: {
    appErrorTitle: "package.json 结构不合法",
    buildAppErrorMessage() {
      return "package.json 内容不符合预期结构。";
    }
  },
  [AppErrorCode.PACKAGE_CONFIG_NOT_FOUND_CODE]: {
    appErrorTitle: "package.json 未找到",
    buildAppErrorMessage() {
      return "未找到 package.json。";
    }
  },
  [AppErrorCode.PLATFORM_NOT_FOUND_CODE]: {
    appErrorTitle: "平台不存在",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.PLATFORM_NOT_FOUND_CODE }
        });
      }
      return `以下平台不存在：${appErrorParam.platformNameList.join("、")}。`;
    }
  },
  [AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE]: {
    appErrorTitle: "下载远程仓库失败",
    buildAppErrorMessage() {
      return "下载远程仓库失败，请检查网络后重试。";
    }
  },
  [AppErrorCode.REMOTE_SKILL_EMPTY_CODE]: {
    appErrorTitle: "远端技能为空",
    buildAppErrorMessage() {
      return "远端仓库中没有可安装的技能。";
    }
  },
  [AppErrorCode.REMOTE_SKILL_NOT_FOUND_CODE]: {
    appErrorTitle: "远端技能不存在",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.REMOTE_SKILL_NOT_FOUND_CODE }
        });
      }
      const skillNameList = appErrorParam.skillNameList;
      if (skillNameList.length === 1) {
        return `远端技能"${skillNameList[0]}"不存在。`;
      }
      return `以下远端技能不存在：${skillNameList.join("、")}。`;
    }
  },
  [AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE]: {
    appErrorTitle: "远端技能条目不合法",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE }
        });
      }
      return `远端技能条目"${appErrorParam.skillEntryFilePath}"不符合预期结构。`;
    }
  },
  [AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE]: {
    appErrorTitle: "远端技能条目缺失",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE }
        });
      }
      return `远端技能条目"${appErrorParam.skillEntryFilePath}"未找到。`;
    }
  },
  [AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE]: {
    appErrorTitle: "远端技能目录不可读",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE }
        });
      }
      return `远端技能目录"${appErrorParam.remoteSkillDirectoryPath}"读取失败。`;
    }
  },
  [AppErrorCode.PLATFORM_SKILL_DIRECTORY_INVALID_CODE]: {
    appErrorTitle: "平台技能目录不可读",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.PLATFORM_SKILL_DIRECTORY_INVALID_CODE }
        });
      }
      return `平台"${appErrorParam.platformName}"的技能目录"${appErrorParam.platformSkillDirectoryPath}"读取失败。`;
    }
  },
  [AppErrorCode.SKILL_OPTION_INVALID_FORMAT_CODE]: {
    appErrorTitle: "参数错误",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.SKILL_OPTION_INVALID_FORMAT_CODE }
        });
      }
      return `技能选项"${appErrorParam.rawSkillNameText}"格式不正确，应类似 mingto-mt-ui 或 mingto-mt-ui-1,mingto-mt-ui-2（多个技能用英文逗号分隔）。`;
    }
  },
  [AppErrorCode.SKILL_ADD_FAILED_CODE]: {
    appErrorTitle: "技能添加失败",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.SKILL_ADD_FAILED_CODE }
        });
      }
      return `从"${appErrorParam.sourceDirectoryPath}"添加到"${appErrorParam.targetDirectoryPath}"失败。`;
    }
  },
  [AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE]: {
    appErrorTitle: "删除目录失败",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE }
        });
      }
      return `删除目录"${appErrorParam.directoryPath}"失败。`;
    }
  },
  [AppErrorCode.PROMPT_CANCELLED_CODE]: {
    appErrorTitle: "已取消操作",
    buildAppErrorMessage() {
      return "已取消本次操作。";
    }
  },
  [AppErrorCode.LOCAL_SKILL_EMPTY_CODE]: {
    appErrorTitle: "本地技能为空",
    buildAppErrorMessage() {
      return "当前本地平台上没有已安装的技能。";
    }
  },
  [AppErrorCode.LOCAL_SKILL_NOT_FOUND_CODE]: {
    appErrorTitle: "本地技能不存在",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.LOCAL_SKILL_NOT_FOUND_CODE }
        });
      }
      const skillNameList = appErrorParam.skillNameList;
      if (skillNameList.length === 1) {
        return `技能"${skillNameList[0]}"未在本地添加。`;
      }
      return `以下技能未在本地添加：${skillNameList.join("、")}。`;
    }
  },
  [AppErrorCode.REMOTE_REPOSITORY_NOT_LOADED_CODE]: {
    appErrorTitle: "远端仓库尚未加载",
    buildAppErrorMessage() {
      return "远端仓库本地目录路径尚未加载完成。";
    }
  },
  [AppErrorCode.REMOTE_SKILL_LIST_NOT_LOADED_CODE]: {
    appErrorTitle: "远端技能列表尚未加载",
    buildAppErrorMessage() {
      return "远端技能列表尚未加载完成。";
    }
  },
  [AppErrorCode.LOCAL_PLATFORM_LIST_NOT_LOADED_CODE]: {
    appErrorTitle: "本地平台列表尚未加载",
    buildAppErrorMessage() {
      return "本地平台列表尚未加载完成。";
    }
  },
  [AppErrorCode.APP_ERROR_PARAM_MISSING_CODE]: {
    appErrorTitle: "错误参数缺失",
    buildAppErrorMessage(appErrorParam) {
      if (appErrorParam === undefined) {
        return "错误码构造时缺少必填 param 参数。";
      }
      return `错误码"${appErrorParam.appErrorCode}"构造时缺少必填 param 参数。`;
    }
  }
};
function getAppErrorDefinition(appErrorCode) {
  return appErrorDefinitionMap[appErrorCode];
}

// src/error/app.ts
class AppError extends Error {
  appErrorCode;
  appErrorTitle;
  constructor(appErrorCode, appErrorOption) {
    const definition = getAppErrorDefinition(appErrorCode);
    super(definition.buildAppErrorMessage(appErrorOption?.param));
    this.name = new.target.name;
    this.appErrorCode = appErrorCode;
    this.appErrorTitle = definition.appErrorTitle;
  }
}
// src/error/handler.ts
function parseQuotedValue(errorMessageText) {
  const matchedResult = errorMessageText.match(/'([^']+)'/);
  if (matchedResult === null) {
    throw new AppError(AppErrorCode.UNEXPECTED_ERROR_CODE, {
      param: {
        detailMessage: `CommanderError.message 未包含引号包裹的值：${errorMessageText}`
      }
    });
  }
  return matchedResult[1];
}
function parseExcessArgumentCountInfo(errorMessageText) {
  const matchedResult = errorMessageText.match(/Expected (\d+) arguments? but got (\d+)\./);
  if (matchedResult === null) {
    throw new AppError(AppErrorCode.UNEXPECTED_ERROR_CODE, {
      param: {
        detailMessage: `CommanderError.message 不符合 excessArguments 预期格式：${errorMessageText}`
      }
    });
  }
  const [, expectedCount, actualCount] = matchedResult;
  return { expectedCount, actualCount };
}
function isCommanderErrorCodeType(code) {
  const commanderErrorCodeList = Object.values(CommanderErrorCode);
  return commanderErrorCodeList.includes(code);
}
var commanderErrorToAppErrorMap = {
  [CommanderErrorCode.UNKNOWN_COMMAND_CODE]: (error) => {
    const quotedValue = parseQuotedValue(error.message);
    return new AppError(AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE, {
      param: {
        detailMessage: `命令"${quotedValue}"不存在，请使用 --help 查看可用命令。`
      }
    });
  },
  [CommanderErrorCode.UNKNOWN_OPTION_CODE]: (error) => {
    const quotedValue = parseQuotedValue(error.message);
    return new AppError(AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE, {
      param: {
        detailMessage: `选项"${quotedValue}"不受支持，请使用 --help 查看可用选项。`
      }
    });
  },
  [CommanderErrorCode.OPTION_MISSING_ARGUMENT_CODE]: (error) => {
    const quotedValue = parseQuotedValue(error.message);
    return new AppError(AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE, {
      param: {
        detailMessage: `选项"${quotedValue}"缺少参数值。`
      }
    });
  },
  [CommanderErrorCode.MISSING_MANDATORY_OPTION_VALUE_CODE]: (error) => {
    const quotedValue = parseQuotedValue(error.message);
    return new AppError(AppErrorCode.COMMANDER_MANDATORY_OPTION_VALUE_MISSING_CODE, {
      param: {
        detailMessage: `缺少必填选项"${quotedValue}"。`
      }
    });
  },
  [CommanderErrorCode.MISSING_ARGUMENT_CODE]: (error) => {
    const quotedValue = parseQuotedValue(error.message);
    return new AppError(AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE, {
      param: {
        detailMessage: `缺少必填参数"${quotedValue}"。`
      }
    });
  },
  [CommanderErrorCode.EXCESS_ARGUMENTS_CODE]: (error) => {
    const { expectedCount, actualCount } = parseExcessArgumentCountInfo(error.message);
    return new AppError(AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE, {
      param: {
        detailMessage: `命令参数过多，期望 ${expectedCount} 个，实际收到 ${actualCount} 个。`
      }
    });
  }
};
function buildAppErrorFromCommanderError(error) {
  if (error.code === COMMANDER_HELP_DISPLAYED_CODE) {
    throw new AppError(AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE);
  }
  if (error.exitCode === 0) {
    throw new AppError(AppErrorCode.COMMANDER_NORMAL_EXIT_CODE);
  }
  if (!isCommanderErrorCodeType(error.code)) {
    throw new AppError(AppErrorCode.UNEXPECTED_ERROR_CODE, {
      param: {
        detailMessage: `未支持的 CommanderError.code：${error.code}`
      }
    });
  }
  throw commanderErrorToAppErrorMap[error.code](error);
}
// src/features/platform/local.ts
import { access } from "node:fs/promises";

// src/config/platform/local.ts
import { homedir } from "node:os";
import { join } from "node:path";
var userHomeDirectoryPath = homedir();
var localPlatformConfig = {
  localPlatformList: [
    {
      localPlatformName: "Codex",
      localPlatformHomeDirectoryPath: join(userHomeDirectoryPath, ".codex"),
      localPlatformSkillDirectoryPath: join(userHomeDirectoryPath, ".codex", "skills")
    },
    {
      localPlatformName: "Claude Code",
      localPlatformHomeDirectoryPath: join(userHomeDirectoryPath, ".claude"),
      localPlatformSkillDirectoryPath: join(userHomeDirectoryPath, ".claude", "skills")
    },
    {
      localPlatformName: "Trae",
      localPlatformHomeDirectoryPath: join(userHomeDirectoryPath, ".trae"),
      localPlatformSkillDirectoryPath: join(userHomeDirectoryPath, ".trae", "skills")
    }
  ]
};
// src/features/platform/local.ts
class LocalPlatformService {
  static localPlatformConfig = localPlatformConfig;
  static localPlatformList;
  static initLocalPlatformPromise = null;
  static async initLocalPlatform() {
    if (LocalPlatformService.initLocalPlatformPromise === null) {
      LocalPlatformService.initLocalPlatformPromise = LocalPlatformService.createLoadLocalPlatformListPromise();
    }
    return LocalPlatformService.initLocalPlatformPromise;
  }
  static async createLoadLocalPlatformListPromise() {
    const localPlatformList = await LocalPlatformService.loadLocalPlatformList();
    LocalPlatformService.localPlatformList = localPlatformList;
  }
  static async loadLocalPlatformList() {
    const tempLocalPlatformList = LocalPlatformService.localPlatformConfig.localPlatformList.map((localPlatformItem) => ({
      platformName: localPlatformItem.localPlatformName,
      platformHomeDirectoryPath: localPlatformItem.localPlatformHomeDirectoryPath,
      platformSkillDirectoryPath: localPlatformItem.localPlatformSkillDirectoryPath
    }));
    const localPlatformList = [];
    await Promise.all(tempLocalPlatformList.map(async (localPlatformItem) => {
      try {
        await access(localPlatformItem.platformHomeDirectoryPath);
        await access(localPlatformItem.platformSkillDirectoryPath);
        localPlatformList.push(localPlatformItem);
      } catch {}
    }));
    localPlatformList.sort((leftPlatformItem, rightPlatformItem) => leftPlatformItem.platformName.localeCompare(rightPlatformItem.platformName));
    if (localPlatformList.length === 0) {
      const localPlatformNameList = LocalPlatformService.localPlatformConfig.localPlatformList.map((localPlatformItem) => localPlatformItem.localPlatformName);
      throw new AppError(AppErrorCode.PLATFORM_NOT_FOUND_CODE, {
        param: {
          platformNameList: localPlatformNameList
        }
      });
    }
    return localPlatformList;
  }
  static async getLocalPlatformList() {
    await LocalPlatformService.initLocalPlatform();
    if (LocalPlatformService.localPlatformList === undefined) {
      throw new AppError(AppErrorCode.LOCAL_PLATFORM_LIST_NOT_LOADED_CODE);
    }
    return LocalPlatformService.localPlatformList;
  }
  static async clearLocalPlatform() {
    LocalPlatformService.localPlatformList = undefined;
    LocalPlatformService.initLocalPlatformPromise = null;
  }
}

// src/features/platform/builder.ts
async function buildPlatformListByPlatformNameList(platformNameList) {
  const localPlatformList = await LocalPlatformService.getLocalPlatformList();
  const platformList = [];
  const notFoundPlatformNameList = [];
  platformNameList.forEach((platformName) => {
    const matchedPlatformItem = localPlatformList.find((localPlatformItem) => localPlatformItem.platformName === platformName);
    if (matchedPlatformItem !== undefined) {
      platformList.push(matchedPlatformItem);
      return;
    }
    notFoundPlatformNameList.push(platformName);
  });
  if (notFoundPlatformNameList.length > 0) {
    throw new AppError(AppErrorCode.PLATFORM_NOT_FOUND_CODE, {
      param: { platformNameList: notFoundPlatformNameList }
    });
  }
  return platformList;
}
// src/features/repository/remote.ts
import { mkdtemp as mkdtemp2 } from "node:fs/promises";
import { tmpdir as tmpdir2 } from "node:os";
import { join as join3 } from "node:path";

// node_modules/giget/dist/_chunks/giget.mjs
init_nypm();
import { createWriteStream, existsSync, readdirSync, renameSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { PassThrough, Readable, pipeline } from "node:stream";
import { pipeline as pipeline$1 } from "node:stream/promises";
import { spawn, spawnSync } from "node:child_process";
import { homedir as homedir2, tmpdir } from "node:os";
import { promisify } from "node:util";
import { join as join2 } from "node:path";
async function download(url, filePath, options2 = {}) {
  const infoPath = filePath + ".json";
  const info = JSON.parse(await readFile(infoPath, "utf8").catch(() => "{}"));
  const etag = (await sendFetch(url, {
    method: "HEAD",
    headers: options2.headers
  }).catch(() => {
    return;
  }))?.headers.get("etag");
  if (info.etag === etag && existsSync(filePath))
    return;
  if (typeof etag === "string")
    info.etag = etag;
  const response = await sendFetch(url, { headers: options2.headers });
  if (response.status >= 400)
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  const stream = createWriteStream(filePath);
  await promisify(pipeline)(response.body, stream);
  await writeFile(infoPath, JSON.stringify(info), "utf8");
}
var inputRegex = /^(?<repo>[-\w.]+\/[-\w.]+)(?<subdir>[^#]+)?(?<ref>#[-\w./@]+)?/;
var expandedInputRegex = /^(?<repo>[-\w.]+(?:\/[-\w.]+)+?)(?:::(?<subdir>[^#]*))?(?<ref>#[-\w./@]+)?$/;
function parseGitURI(input, options2) {
  const useExpanded = options2?.expandRepo || input.includes("::");
  const m5 = input.match(useExpanded ? expandedInputRegex : inputRegex)?.groups || {};
  const subdir = useExpanded ? m5.subdir ? "/" + m5.subdir : "/" : m5.subdir || "/";
  return {
    repo: m5.repo || "",
    subdir,
    ref: m5.ref ? m5.ref.slice(1) : "main"
  };
}
function debug(...args) {
  if (process.env.DEBUG)
    console.debug("[giget]", ...args);
}
async function sendFetch(url, options2 = {}) {
  if (options2.headers?.["sec-fetch-mode"])
    options2.mode = options2.headers["sec-fetch-mode"];
  const res = await fetch(url, {
    ...options2,
    headers: normalizeHeaders(options2.headers)
  }).catch((error) => {
    throw new Error(`Failed to download ${url}: ${error}`, { cause: error });
  });
  if (options2.validateStatus && res.status >= 400)
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return res;
}
function cacheDirectory() {
  const cacheDir = process.env.XDG_CACHE_HOME ? C3(process.env.XDG_CACHE_HOME, "giget") : C3(homedir2(), ".cache/giget");
  if (process.platform === "win32") {
    const windowsCacheDir = C3(tmpdir(), "giget");
    if (!existsSync(windowsCacheDir) && existsSync(cacheDir))
      try {
        renameSync(cacheDir, windowsCacheDir);
      } catch {}
    return windowsCacheDir;
  }
  return cacheDir;
}
function normalizeHeaders(headers = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(headers)) {
    if (!value)
      continue;
    normalized[key.toLowerCase()] = value;
  }
  return normalized;
}
var git = (input, options2) => {
  const parsed = parseGitCloneURI(input);
  return {
    name: parsed.name,
    version: parsed.subdir ? `${parsed.version || "default"}-${parsed.subdir.replaceAll("/", "-")}` : parsed.version,
    tar: ({ auth } = {}) => _cloneAndTar(parsed, auth ?? options2.auth)
  };
};
function parseGitCloneURI(input, opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  let uri = input.replace(/#.*$/, "");
  let pathSubdir;
  if (/^[./]/.test(input))
    uri = C3(cwd, uri);
  else if (/^https?:\/\//.test(uri)) {
    const httpMatch = /^(https?:\/\/[^/]+)\/([\w.-]+\/[\w.-]+?)(?:\.git)?(?:\/(.+))?$/.exec(uri);
    if (httpMatch) {
      const [, origin, repo, rest] = httpMatch;
      uri = `${origin}/${repo}`;
      if (rest)
        pathSubdir = rest;
    }
  } else if (uri.includes("@")) {
    const sshMatch = /^(.*?:[\w.-]+\/[\w.-]+?)(?:\.git)?(?:\/(.+))?$/.exec(uri);
    if (sshMatch) {
      const [, repoUri, rest] = sshMatch;
      uri = repoUri;
      if (rest)
        pathSubdir = rest;
    }
  } else {
    const hostMap = {
      "github:": "https://github.com/",
      "gh:": "https://github.com/",
      "gitlab:": "https://gitlab.com/",
      "bitbucket:": "https://bitbucket.org/",
      "sourcehut:": "https://git.sr.ht/~"
    };
    const host = /^(.+?:)/.exec(uri)?.at(1);
    if (host && hostMap[host])
      uri = uri.replace(host, hostMap[host]);
    else if (!host)
      uri = `${(process.env.GIGET_GIT_HOST || "https://github.com/").replace(/\/$/, "")}/${uri}`;
    const httpMatch = /^(https?:\/\/[^/]+\/~?[\w.-]+\/[\w.-]+?)(?:\.git)?(?:\/(.+))?$/.exec(uri);
    if (httpMatch) {
      const [, repoUri, rest] = httpMatch;
      uri = repoUri;
      if (rest)
        pathSubdir = rest;
    }
  }
  const name = uri.replace(/^https?:\/\//, "").replace(/^.+@/, "").replace(/(\.git)?(#.*)?$/, "").replace(/^\W+/, "").replaceAll(/[:/]/g, "-");
  const [version, hashSubdir] = /#(.+)$/.exec(input)?.at(1)?.split(":") ?? [];
  const resolvedVersion = version || undefined;
  const subdir = hashSubdir || pathSubdir;
  return {
    uri,
    name,
    ...resolvedVersion && { version: resolvedVersion },
    ...subdir && { subdir }
  };
}
async function _cloneAndTar(parsed, token) {
  const tmpDir = await mkdtemp(join2(tmpdir(), "giget-git-"));
  if (token && /[\r\n]/.test(token))
    throw new Error("Auth token must not contain newline characters");
  const execEnv = {
    ...process.env,
    GIT_TERMINAL_PROMPT: "0"
  };
  if (token) {
    execEnv.GIT_CONFIG_COUNT = "1";
    execEnv.GIT_CONFIG_KEY_0 = "http.extraHeader";
    execEnv.GIT_CONFIG_VALUE_0 = `Authorization: Bearer ${token}`;
  }
  const execOpts = {
    env: execEnv,
    timeout: 60000
  };
  const status = _createStatus();
  const gitExec = (args) => _gitSpawn(args, execOpts, status);
  const gitExecIn = (args) => _gitSpawn(args, {
    ...execOpts,
    cwd: tmpDir
  }, status);
  try {
    const cloneArgs = [
      "clone",
      "--progress",
      "--depth",
      "1"
    ];
    if (parsed.subdir)
      cloneArgs.push("--filter=blob:none", "--sparse", "--no-checkout");
    if (parsed.version)
      cloneArgs.push("--branch", parsed.version);
    cloneArgs.push("--", parsed.uri, tmpDir);
    try {
      status.update("Cloning...");
      await gitExec(cloneArgs);
      status.update("Cloned.");
    } catch (cloneError) {
      if (!parsed.version)
        throw cloneError;
      debug("Shallow clone failed, falling back to full clone:", cloneError);
      status.update("Shallow clone failed, cloning...");
      await rm(tmpDir, {
        recursive: true,
        force: true
      });
      await mkdir(tmpDir, { recursive: true });
      await gitExecIn(["init"]);
      await gitExecIn([
        "remote",
        "add",
        "origin",
        parsed.uri
      ]);
      await gitExecIn(["fetch", "origin"]);
      await gitExecIn(["checkout", parsed.version]);
      status.update("Fetched.");
    }
    if (parsed.subdir) {
      status.update(`Sparse checkout ${parsed.subdir}...`);
      await gitExecIn([
        "sparse-checkout",
        "set",
        parsed.subdir
      ]);
      await gitExecIn(["checkout"]);
    }
    status.update("Packing...");
    const tarDir = parsed.subdir ? join2(tmpDir, parsed.subdir) : tmpDir;
    const { create } = await Promise.resolve().then(() => (init_tar(), exports_tar)).then((n4) => n4.index_min_exports);
    status.done();
    const stream = create({
      gzip: true,
      cwd: tarDir,
      filter: (path) => !path.startsWith(".git/") && path !== ".git" && !path.startsWith("./.git/") && path !== "./.git"
    }, ["."]).pipe(new PassThrough);
    let cleaned = false;
    const cleanup = () => {
      if (cleaned)
        return;
      cleaned = true;
      rm(tmpDir, {
        recursive: true,
        force: true
      });
    };
    stream.on("end", cleanup);
    stream.on("error", cleanup);
    stream.on("close", cleanup);
    return stream;
  } catch (error) {
    status.done();
    await rm(tmpDir, {
      recursive: true,
      force: true
    });
    throw error;
  }
}
var _spinnerFrames = [
  "⠋",
  "⠙",
  "⠹",
  "⠸",
  "⠼",
  "⠴",
  "⠦",
  "⠧",
  "⠇",
  "⠏"
];
function _gitSpawn(args, opts, status) {
  return new Promise((resolve, reject) => {
    const proc = spawn("git", args, {
      ...opts,
      stdio: [
        "ignore",
        "pipe",
        "pipe"
      ]
    });
    proc.stdout.resume();
    let lastLine = "";
    proc.stderr?.on("data", (chunk) => {
      const str2 = chunk.toString();
      for (const line of str2.split(/[\r\n]/)) {
        const clean = line.trim();
        if (clean)
          lastLine = clean;
      }
      if (status)
        status.update(lastLine);
    });
    proc.on("close", (code) => {
      if (code === 0)
        resolve(lastLine);
      else
        reject(/* @__PURE__ */ new Error(`git ${args[0]} exited with code ${code}. Is git installed?`));
    });
    proc.on("error", (err) => {
      if (err.code === "ENOENT")
        reject(/* @__PURE__ */ new Error("git is not installed or not found in PATH"));
      else
        reject(err);
    });
  });
}
function _createStatus() {
  if (!process.stderr.isTTY)
    return {
      update(_text) {},
      done() {}
    };
  let msg = "";
  let frame = 0;
  const render = () => {
    const spinner2 = _spinnerFrames[frame % _spinnerFrames.length];
    frame++;
    process.stderr.write(`\x1B[2K\r\x1B[2m${spinner2} ${msg}\x1B[0m`);
  };
  const interval = setInterval(render, 80);
  return {
    update(text) {
      msg = text;
      render();
    },
    done() {
      clearInterval(interval);
      process.stderr.write("\x1B[2K\r");
    }
  };
}
var http = async (input, options2) => {
  if (input.endsWith(".json"))
    return await _httpJSON(input, options2);
  const url = new URL(input);
  let name = D(url.pathname);
  try {
    const head = await sendFetch(url.href, {
      method: "HEAD",
      validateStatus: true,
      headers: { authorization: options2.auth ? `Bearer ${options2.auth}` : undefined }
    });
    if ((head.headers.get("content-type") || "").includes("application/json"))
      return await _httpJSON(input, options2);
    const filename = head.headers.get("content-disposition")?.match(/filename="?(.+)"?/)?.[1];
    if (filename)
      name = filename.split(".")[0];
  } catch (error) {
    debug(`Failed to fetch HEAD for ${url.href}:`, error);
  }
  return {
    name: `${name}-${url.href.slice(0, 8)}`,
    version: "",
    subdir: "",
    tar: url.href,
    defaultDir: name,
    headers: { Authorization: options2.auth ? `Bearer ${options2.auth}` : undefined }
  };
};
var _httpJSON = async (input, options2) => {
  const info = await (await sendFetch(input, {
    validateStatus: true,
    headers: { authorization: options2.auth ? `Bearer ${options2.auth}` : undefined }
  })).json();
  if (!info.tar || !info.name)
    throw new Error(`Invalid template info from ${input}. name or tar fields are missing!`);
  return info;
};
var github = (input, options2) => {
  const parsed = parseGitURI(input);
  const githubAPIURL = process.env.GIGET_GITHUB_URL || "https://api.github.com";
  return {
    name: parsed.repo.replace("/", "-"),
    version: parsed.ref,
    subdir: parsed.subdir,
    headers: {
      Authorization: options2.auth ? `Bearer ${options2.auth}` : undefined,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    url: `${githubAPIURL.replace("api.github.com", "github.com")}/${parsed.repo}/tree/${parsed.ref}${parsed.subdir}`,
    tar: `${githubAPIURL}/repos/${parsed.repo}/tarball/${parsed.ref}`
  };
};
var gitlab = (input, options2) => {
  const parsed = parseGitURI(input, { expandRepo: true });
  const gitlab2 = process.env.GIGET_GITLAB_URL || "https://gitlab.com";
  return {
    name: parsed.repo.replace("/", "-"),
    version: parsed.ref,
    subdir: parsed.subdir,
    headers: {
      authorization: options2.auth ? `Bearer ${options2.auth}` : undefined,
      "sec-fetch-mode": "same-origin"
    },
    url: `${gitlab2}/${parsed.repo}/tree/${parsed.ref}${parsed.subdir}`,
    tar: `${gitlab2}/${parsed.repo}/-/archive/${parsed.ref}.tar.gz`
  };
};
var bitbucket = (input, options2) => {
  const parsed = parseGitURI(input);
  return {
    name: parsed.repo.replace("/", "-"),
    version: parsed.ref,
    subdir: parsed.subdir,
    headers: { authorization: options2.auth ? `Bearer ${options2.auth}` : undefined },
    url: `https://bitbucket.com/${parsed.repo}/src/${parsed.ref}${parsed.subdir}`,
    tar: `https://bitbucket.org/${parsed.repo}/get/${parsed.ref}.tar.gz`
  };
};
var sourcehut = (input, options2) => {
  const parsed = parseGitURI(input);
  return {
    name: parsed.repo.replace("/", "-"),
    version: parsed.ref,
    subdir: parsed.subdir,
    headers: { authorization: options2.auth ? `Bearer ${options2.auth}` : undefined },
    url: `https://git.sr.ht/~${parsed.repo}/tree/${parsed.ref}/item${parsed.subdir}`,
    tar: `https://git.sr.ht/~${parsed.repo}/archive/${parsed.ref}.tar.gz`
  };
};
var providers = {
  http,
  https: http,
  git,
  github,
  gh: github,
  gitlab,
  bitbucket,
  sourcehut
};
var DEFAULT_REGISTRY = "https://raw.githubusercontent.com/unjs/giget/main/templates";
var registryProvider = (registryEndpoint = DEFAULT_REGISTRY, options2 = {}) => {
  return async (input) => {
    const start = Date.now();
    const registryURL = `${registryEndpoint}/${input}.json`;
    const result = await sendFetch(registryURL, { headers: { authorization: options2.auth ? `Bearer ${options2.auth}` : undefined } });
    if (result.status >= 400)
      throw new Error(`Failed to download ${input} template info from ${registryURL}: ${result.status} ${result.statusText}`);
    const info = await result.json();
    if (!info.tar || !info.name)
      throw new Error(`Invalid template info from ${registryURL}. name or tar fields are missing!`);
    debug(`Fetched ${input} template info from ${registryURL} in ${Date.now() - start}ms`);
    return info;
  };
};
var sourceProtoRe = /^([\w+-.]+):/;
function resolveIgnore(ignore) {
  if (!ignore)
    return;
  if (typeof ignore === "function")
    return ignore;
  const matchesGlob = globalThis.process.getBuiltinModule?.("node:path")?.matchesGlob;
  if (typeof matchesGlob !== "function")
    throw new TypeError("Ignore patterns require `path.matchesGlob` which is supported in Node.js v22.5.0, v20.17.0 or later.");
  return (path) => ignore.some((pattern) => matchesGlob(path, pattern));
}
async function downloadTemplate(input, options2 = {}) {
  const ignore = resolveIgnore(options2.ignore);
  options2.registry = process.env.GIGET_REGISTRY ?? options2.registry;
  options2.auth = process.env.GIGET_AUTH ?? options2.auth;
  const registry = options2.registry === false ? undefined : registryProvider(options2.registry, { auth: options2.auth });
  let providerName = options2.provider || (registry ? "registry" : "github");
  let source = input;
  const sourceProviderMatch = input.match(sourceProtoRe);
  if (sourceProviderMatch) {
    providerName = sourceProviderMatch[1];
    source = input.slice(sourceProviderMatch[0].length);
    if (providerName === "http" || providerName === "https")
      source = input;
  }
  if (providerName.endsWith("+git")) {
    source = `${providerName.slice(0, -4)}:${source}`;
    providerName = "git";
  }
  const provider = options2.providers?.[providerName] || providers[providerName] || registry;
  if (!provider)
    throw new Error(`Unsupported provider: ${providerName}`);
  const template = await Promise.resolve().then(() => provider(source, { auth: options2.auth })).catch((error) => {
    throw new Error(`Failed to download template from ${providerName}: ${error.message}`);
  });
  if (!template)
    throw new Error(`Failed to resolve template from ${providerName}`);
  template.name = (template.name || "template").replace(/[^\da-z-]/gi, "-");
  template.defaultDir = (template.defaultDir || template.name).replace(/[^\da-z-]/gi, "-");
  const tarPath = C3(C3(cacheDirectory(), providerName, template.name), (template.version || template.name) + ".tar.gz");
  if (options2.preferOffline && existsSync(tarPath))
    options2.offline = true;
  if (!options2.offline) {
    await mkdir(E(tarPath), { recursive: true });
    const s4 = Date.now();
    if (typeof template.tar === "function") {
      const tarFn = template.tar;
      await (async () => {
        const stream = await tarFn({ auth: options2.auth });
        await pipeline$1(stream instanceof Readable ? stream : Readable.fromWeb(stream), createWriteStream(tarPath));
      })().catch((error) => {
        if (!existsSync(tarPath))
          throw error;
        debug("Download error. Using cached version:", error);
        options2.offline = true;
      });
    } else
      await download(template.tar, tarPath, { headers: {
        Authorization: options2.auth ? `Bearer ${options2.auth}` : undefined,
        ...normalizeHeaders(template.headers)
      } }).catch((error) => {
        if (!existsSync(tarPath))
          throw error;
        debug("Download error. Using cached version:", error);
        options2.offline = true;
      });
    debug(`Downloaded to ${tarPath} in ${Date.now() - s4}ms`);
  }
  if (!existsSync(tarPath))
    throw new Error(`Tarball not found: ${tarPath} (offline: ${options2.offline})`);
  const extractPath = C3(C3(options2.cwd || "."), options2.dir || template.defaultDir);
  if (options2.forceClean)
    await rm(extractPath, {
      recursive: true,
      force: true
    });
  if (!options2.force && existsSync(extractPath) && readdirSync(extractPath).length > 0)
    throw new Error(`Destination ${extractPath} already exists.`);
  await mkdir(extractPath, { recursive: true });
  const s3 = Date.now();
  const subdir = template.subdir?.replace(/^\//, "") || "";
  const { extract } = await Promise.resolve().then(() => (init_tar(), exports_tar)).then((n4) => n4.index_min_exports);
  await extract({
    file: tarPath,
    cwd: extractPath,
    onReadEntry(entry) {
      entry.path = entry.path.split("/").splice(1).join("/");
      if (subdir)
        if (entry.path.startsWith(subdir + "/"))
          entry.path = entry.path.slice(subdir.length);
        else
          entry.path = "";
      if (ignore && entry.path && ignore(entry.path.replace(/^\//, "")))
        entry.path = "";
    }
  });
  debug(`Extracted to ${extractPath} in ${Date.now() - s3}ms`);
  if (options2.install) {
    debug("Installing dependencies...");
    const { installDependencies } = await Promise.resolve().then(() => (init_nypm(), exports_nypm)).then((n4) => n4.dist_exports);
    await installDependencies({
      cwd: extractPath,
      silent: options2.silent,
      ...typeof options2.install === "object" ? options2.install : {}
    });
  }
  return {
    ...template,
    source,
    dir: extractPath
  };
}

// src/config/repository/remote.ts
var remoteRepositoryConfig = {
  remoteRepositoryBaseUrl: "http://git.mingto.net",
  remoteRepositoryOwner: "hcc",
  remoteRepositoryName: "mt-utils",
  remoteRepositoryBranch: "main",
  remoteRepositorySkillDirectoryName: "skills"
};
// src/tools/filesystem/directory.ts
import { cp, rm as rm2 } from "node:fs/promises";
async function copyDirectory(sourceDirectoryPath, targetDirectoryPath) {
  await cp(sourceDirectoryPath, targetDirectoryPath, {
    recursive: true,
    force: true
  });
}
async function removeDirectory(directoryPath) {
  await rm2(directoryPath, { force: true, recursive: true });
}
// src/features/repository/remote.ts
class RemoteRepositoryService {
  static remoteRepositoryConfig = remoteRepositoryConfig;
  static localRepositoryDirectoryPath;
  static initRemoteRepositoryPromise = null;
  static async initRemoteRepository() {
    if (RemoteRepositoryService.initRemoteRepositoryPromise === null) {
      RemoteRepositoryService.initRemoteRepositoryPromise = RemoteRepositoryService.createLoadLocalRepositoryDirectoryPathPromise();
    }
    return RemoteRepositoryService.initRemoteRepositoryPromise;
  }
  static async createLoadLocalRepositoryDirectoryPathPromise() {
    const localRepositoryDirectoryPath = await RemoteRepositoryService.loadLocalRepositoryDirectoryPath();
    RemoteRepositoryService.localRepositoryDirectoryPath = localRepositoryDirectoryPath;
  }
  static async loadLocalRepositoryDirectoryPath() {
    const loadSpinner = spinner();
    loadSpinner.start("拉取远程仓库中");
    const tempDirectoryPath = await mkdtemp2(join3(tmpdir2(), "mingto-skills-repo-"));
    try {
      const downloadResult = await downloadTemplate(RemoteRepositoryService.getRemoteRepositoryRequestPath(), {
        dir: tempDirectoryPath,
        forceClean: true
      });
      loadSpinner.stop("拉取远程仓库完成。");
      return downloadResult.dir;
    } catch (error) {
      try {
        await removeDirectory(tempDirectoryPath);
      } catch {}
      loadSpinner.stop("拉取远程仓库失败。");
      if (error instanceof Error) {
        throw new AppError(AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE);
      }
      throw error;
    }
  }
  static getRemoteRepositoryRequestPath() {
    const {
      remoteRepositoryBaseUrl,
      remoteRepositoryOwner,
      remoteRepositoryName,
      remoteRepositoryBranch
    } = RemoteRepositoryService.remoteRepositoryConfig;
    return `${remoteRepositoryBaseUrl}/${remoteRepositoryOwner}/${remoteRepositoryName}/-/archive/${remoteRepositoryBranch}/${remoteRepositoryName}-${remoteRepositoryBranch}.tar.gz`;
  }
  static async getLocalRepositoryDirectoryPath() {
    await RemoteRepositoryService.initRemoteRepository();
    if (RemoteRepositoryService.localRepositoryDirectoryPath === undefined) {
      throw new AppError(AppErrorCode.REMOTE_REPOSITORY_NOT_LOADED_CODE);
    }
    return RemoteRepositoryService.localRepositoryDirectoryPath;
  }
  static async getLocalRepositorySkillDirectoryPath() {
    await RemoteRepositoryService.initRemoteRepository();
    if (RemoteRepositoryService.localRepositoryDirectoryPath === undefined) {
      throw new AppError(AppErrorCode.REMOTE_REPOSITORY_NOT_LOADED_CODE);
    }
    return join3(RemoteRepositoryService.localRepositoryDirectoryPath, RemoteRepositoryService.remoteRepositoryConfig.remoteRepositorySkillDirectoryName);
  }
  static async clearRemoteRepository() {
    if (RemoteRepositoryService.localRepositoryDirectoryPath === undefined) {
      RemoteRepositoryService.initRemoteRepositoryPromise = null;
      return;
    }
    const directoryPath = RemoteRepositoryService.localRepositoryDirectoryPath;
    try {
      await removeDirectory(directoryPath);
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE, {
          param: {
            directoryPath
          }
        });
      }
      throw error;
    } finally {
      RemoteRepositoryService.localRepositoryDirectoryPath = undefined;
      RemoteRepositoryService.initRemoteRepositoryPromise = null;
    }
  }
}
// src/features/skill/add.ts
import { resolve } from "node:path";
async function addSkillListToPlatformList(skillList, platformList) {
  const skillSourceRootDirectoryPath = await RemoteRepositoryService.getLocalRepositorySkillDirectoryPath();
  await Promise.all(skillList.flatMap((skillItem) => platformList.map(async (platformItem) => addSkillItemToPlatformItem(skillItem, platformItem, skillSourceRootDirectoryPath))));
}
async function addSkillItemToPlatformItem(skillItem, platformItem, skillSourceRootDirectoryPath) {
  const skillSourceDirectoryPath = resolve(skillSourceRootDirectoryPath, skillItem.skillName);
  const targetSkillDirectoryPath = resolve(platformItem.platformSkillDirectoryPath, skillItem.skillName);
  try {
    await copyDirectory(skillSourceDirectoryPath, targetSkillDirectoryPath);
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(AppErrorCode.SKILL_ADD_FAILED_CODE, {
        param: {
          sourceDirectoryPath: skillSourceDirectoryPath,
          targetDirectoryPath: targetSkillDirectoryPath
        }
      });
    }
    throw error;
  }
}
// src/features/skill/builder.ts
import { readdir as readdir2 } from "node:fs/promises";

// src/features/skill/remote.ts
var import_gray_matter = __toESM(require_gray_matter(), 1);
import { readdir, readFile as readFile2 } from "node:fs/promises";
import { join as join4 } from "node:path";

// node_modules/zod/v3/external.js
var exports_external = {};
__export(exports_external, {
  void: () => voidType,
  util: () => util,
  unknown: () => unknownType,
  union: () => unionType,
  undefined: () => undefinedType,
  tuple: () => tupleType,
  transformer: () => effectsType,
  symbol: () => symbolType,
  string: () => stringType,
  strictObject: () => strictObjectType,
  setErrorMap: () => setErrorMap,
  set: () => setType,
  record: () => recordType,
  quotelessJson: () => quotelessJson,
  promise: () => promiseType,
  preprocess: () => preprocessType,
  pipeline: () => pipelineType,
  ostring: () => ostring,
  optional: () => optionalType,
  onumber: () => onumber,
  oboolean: () => oboolean,
  objectUtil: () => objectUtil,
  object: () => objectType,
  number: () => numberType,
  nullable: () => nullableType,
  null: () => nullType,
  never: () => neverType,
  nativeEnum: () => nativeEnumType,
  nan: () => nanType,
  map: () => mapType,
  makeIssue: () => makeIssue,
  literal: () => literalType,
  lazy: () => lazyType,
  late: () => late,
  isValid: () => isValid,
  isDirty: () => isDirty,
  isAsync: () => isAsync,
  isAborted: () => isAborted,
  intersection: () => intersectionType,
  instanceof: () => instanceOfType,
  getParsedType: () => getParsedType,
  getErrorMap: () => getErrorMap,
  function: () => functionType,
  enum: () => enumType,
  effect: () => effectsType,
  discriminatedUnion: () => discriminatedUnionType,
  defaultErrorMap: () => en_default,
  datetimeRegex: () => datetimeRegex,
  date: () => dateType,
  custom: () => custom,
  coerce: () => coerce,
  boolean: () => booleanType,
  bigint: () => bigIntType,
  array: () => arrayType,
  any: () => anyType,
  addIssueToContext: () => addIssueToContext,
  ZodVoid: () => ZodVoid,
  ZodUnknown: () => ZodUnknown,
  ZodUnion: () => ZodUnion,
  ZodUndefined: () => ZodUndefined,
  ZodType: () => ZodType,
  ZodTuple: () => ZodTuple,
  ZodTransformer: () => ZodEffects,
  ZodSymbol: () => ZodSymbol,
  ZodString: () => ZodString,
  ZodSet: () => ZodSet,
  ZodSchema: () => ZodType,
  ZodRecord: () => ZodRecord,
  ZodReadonly: () => ZodReadonly,
  ZodPromise: () => ZodPromise,
  ZodPipeline: () => ZodPipeline,
  ZodParsedType: () => ZodParsedType,
  ZodOptional: () => ZodOptional,
  ZodObject: () => ZodObject,
  ZodNumber: () => ZodNumber,
  ZodNullable: () => ZodNullable,
  ZodNull: () => ZodNull,
  ZodNever: () => ZodNever,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNaN: () => ZodNaN,
  ZodMap: () => ZodMap,
  ZodLiteral: () => ZodLiteral,
  ZodLazy: () => ZodLazy,
  ZodIssueCode: () => ZodIssueCode,
  ZodIntersection: () => ZodIntersection,
  ZodFunction: () => ZodFunction,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodError: () => ZodError,
  ZodEnum: () => ZodEnum,
  ZodEffects: () => ZodEffects,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodDefault: () => ZodDefault,
  ZodDate: () => ZodDate,
  ZodCatch: () => ZodCatch,
  ZodBranded: () => ZodBranded,
  ZodBoolean: () => ZodBoolean,
  ZodBigInt: () => ZodBigInt,
  ZodArray: () => ZodArray,
  ZodAny: () => ZodAny,
  Schema: () => ZodType,
  ParseStatus: () => ParseStatus,
  OK: () => OK,
  NEVER: () => NEVER,
  INVALID: () => INVALID,
  EMPTY_PATH: () => EMPTY_PATH,
  DIRTY: () => DIRTY,
  BRAND: () => BRAND
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_4) => {};
  function assertIs(_arg) {}
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error;
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k3) => typeof obj[obj[k3]] !== "number");
    const filtered = {};
    for (const k3 of validKeys) {
      filtered[k3] = obj[k3];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e3) {
      return obj[e3];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_4, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t4 = typeof data;
  switch (t4) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};

class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i4 = 0;
          while (i4 < issue.path.length) {
            const el = issue.path[i4];
            const terminal = i4 === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i4++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== undefined) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m5) => !!m5).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === en_default ? undefined : en_default
    ].filter((x3) => !!x3)
  });
  ctx.common.issues.push(issue);
}

class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s3 of results) {
      if (s3.status === "aborted")
        return INVALID;
      if (s3.status === "dirty")
        status.dirty();
      arrayValue.push(s3.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x3) => x3.status === "aborted";
var isDirty = (x3) => x3.status === "dirty";
var isValid = (x3) => x3.status === "valid";
var isAsync = (x3) => typeof Promise !== "undefined" && x3 instanceof Promise;
// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}

class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus,
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(undefined).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}

class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options2) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options2) });
  }
  ip(options2) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options2) });
  }
  cidr(options2) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options2) });
  }
  datetime(options2) {
    if (typeof options2 === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options2
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options2?.precision === "undefined" ? null : options2?.precision,
      offset: options2?.offset ?? false,
      local: options2?.local ?? false,
      ...errorUtil.errToObj(options2?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options2) {
    if (typeof options2 === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options2
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options2?.precision === "undefined" ? null : options2?.precision,
      ...errorUtil.errToObj(options2?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options2) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options2?.position,
      ...errorUtil.errToObj(options2?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}

class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};

class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};

class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};

class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};

class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};

class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};

class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};

class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};

class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};

class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};

class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};

class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : undefined,
          maximum: tooBig ? def.exactLength.value : undefined,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i4) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i4));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i4) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i4));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}

class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {} else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== undefined ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};

class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options2 = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options2.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = undefined;
      const issues = [];
      for (const option of options2) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [undefined];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [undefined, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};

class ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(discriminator, options2, params) {
    const optionsMap = new Map;
    for (const type of options2) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options: options2,
      optionsMap,
      ...processCreateParams(params)
    });
  }
}
function mergeValues(a4, b4) {
  const aType = getParsedType(a4);
  const bType = getParsedType(b4);
  if (a4 === b4) {
    return { valid: true, data: a4 };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b4);
    const sharedKeys = util.objectKeys(a4).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a4, ...b4 };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a4[key], b4[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a4.length !== b4.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0;index < a4.length; index++) {
      const itemA = a4[index];
      const itemB = b4[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a4 === +b4) {
    return { valid: true, data: a4 };
  } else {
    return { valid: false };
  }
}

class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};

class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x3) => !!x3);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};

class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}

class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = new Map;
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = new Map;
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};

class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = new Set;
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i4) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i4)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};

class ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x3) => !!x3),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x3) => !!x3),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn2 = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me2 = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me2._def.args.parseAsync(args, params).catch((e3) => {
          error.addIssue(makeArgsIssue(args, e3));
          throw error;
        });
        const result = await Reflect.apply(fn2, this, parsedArgs);
        const parsedReturns = await me2._def.returns._def.type.parseAsync(result, params).catch((e3) => {
          error.addIssue(makeReturnsIssue(result, e3));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me2 = this;
      return OK(function(...args) {
        const parsedArgs = me2._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn2, this, parsedArgs.data);
        const parsedReturns = me2._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
}

class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};

class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}

class ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
ZodEnum.create = createZodEnum;

class ZodNativeEnum extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};

class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};

class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(undefined);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};

class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};

class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};

class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};

class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");

class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}

class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a4, b4) {
    return new ZodPipeline({
      in: a4,
      out: b4,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}

class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p4 = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p22 = typeof p4 === "string" ? { message: p4 } : p4;
  return p22;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r4 = check(data);
      if (r4 instanceof Promise) {
        return r4.then((r5) => {
          if (!r5) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r4) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
// src/schemas/skill/parser.ts
var rawSkillNameTextSchema = exports_external.string().refine((rawSkillNameText) => {
  return rawSkillNameText.split(",").every((csvSegment) => csvSegment.trim().length > 0);
}, {
  message: "技能名格式错误，多个技能名使用英文逗号分隔，技能名不能为空。"
});
// src/schemas/skill/remote.ts
var skillEntryFileObjectSchema = exports_external.object({
  name: exports_external.string(),
  description: exports_external.string()
}).passthrough();
// src/features/skill/remote.ts
var SKILL_ENTRY_FILE_NAME = "SKILL.md";

class RemoteSkillService {
  static remoteSkillList;
  static initRemoteSkillPromise = null;
  static async initRemoteSkill() {
    if (RemoteSkillService.initRemoteSkillPromise === null) {
      RemoteSkillService.initRemoteSkillPromise = RemoteSkillService.createLoadRemoteSkillListPromise();
    }
    return RemoteSkillService.initRemoteSkillPromise;
  }
  static async createLoadRemoteSkillListPromise() {
    const remoteSkillList = await RemoteSkillService.loadRemoteSkillList();
    RemoteSkillService.remoteSkillList = remoteSkillList;
  }
  static async loadRemoteSkillList() {
    const remoteSkillDirectoryPath = await RemoteRepositoryService.getLocalRepositorySkillDirectoryPath();
    let remoteSkillDirectoryEntryList;
    try {
      remoteSkillDirectoryEntryList = await readdir(remoteSkillDirectoryPath, { withFileTypes: true });
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE, {
          param: { remoteSkillDirectoryPath }
        });
      }
      throw error;
    }
    const remoteSkillSubdirectoryEntryList = remoteSkillDirectoryEntryList.filter((remoteSkillDirectoryEntryItem) => remoteSkillDirectoryEntryItem.isDirectory());
    const remoteSkillList = await Promise.all(remoteSkillSubdirectoryEntryList.map(async (remoteSkillDirectoryEntryItem) => {
      const skillEntryFilePath = join4(remoteSkillDirectoryPath, remoteSkillDirectoryEntryItem.name, SKILL_ENTRY_FILE_NAME);
      try {
        const rawSkillEntryFileText = await readFile2(skillEntryFilePath, "utf-8");
        const rawSkillEntryFileObject = skillEntryFileObjectSchema.parse(import_gray_matter.default(rawSkillEntryFileText).data);
        return {
          skillName: rawSkillEntryFileObject.name,
          skillDescription: rawSkillEntryFileObject.description
        };
      } catch (error) {
        if (error instanceof ZodError) {
          throw new AppError(AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE, {
            param: { skillEntryFilePath }
          });
        }
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
          throw new AppError(AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE, {
            param: { skillEntryFilePath }
          });
        }
        throw error;
      }
    }));
    remoteSkillList.sort((leftSkillItem, rightSkillItem) => leftSkillItem.skillName.localeCompare(rightSkillItem.skillName));
    if (remoteSkillList.length === 0) {
      throw new AppError(AppErrorCode.REMOTE_SKILL_EMPTY_CODE);
    }
    return remoteSkillList;
  }
  static async validateSkillNameListExistInRemoteSkillList(skillNameList) {
    await RemoteSkillService.initRemoteSkill();
    if (RemoteSkillService.remoteSkillList === undefined) {
      throw new AppError(AppErrorCode.REMOTE_SKILL_LIST_NOT_LOADED_CODE);
    }
    const remoteSkillList = RemoteSkillService.remoteSkillList;
    const notExistSkillNameList = skillNameList.filter((skillName) => !remoteSkillList.some((skillItem) => skillItem.skillName === skillName));
    if (notExistSkillNameList.length > 0) {
      throw new AppError(AppErrorCode.REMOTE_SKILL_NOT_FOUND_CODE, {
        param: { skillNameList: notExistSkillNameList }
      });
    }
  }
  static async getRemoteSkillList() {
    await RemoteSkillService.initRemoteSkill();
    if (RemoteSkillService.remoteSkillList === undefined) {
      throw new AppError(AppErrorCode.REMOTE_SKILL_LIST_NOT_LOADED_CODE);
    }
    return RemoteSkillService.remoteSkillList;
  }
  static async clearRemoteSkill() {
    RemoteSkillService.remoteSkillList = undefined;
    RemoteSkillService.initRemoteSkillPromise = null;
  }
}

// src/features/skill/builder.ts
async function buildRemoteSkillListBySkillNameList(skillNameList) {
  const remoteSkillList = await RemoteSkillService.getRemoteSkillList();
  const skillList = [];
  const notFoundSkillNameList = [];
  skillNameList.forEach((skillName) => {
    const matchedSkillItem = remoteSkillList.find((skillItem) => skillItem.skillName === skillName);
    if (matchedSkillItem !== undefined) {
      skillList.push(matchedSkillItem);
      return;
    }
    notFoundSkillNameList.push(skillName);
  });
  if (notFoundSkillNameList.length > 0) {
    throw new AppError(AppErrorCode.REMOTE_SKILL_NOT_FOUND_CODE, {
      param: {
        skillNameList: notFoundSkillNameList
      }
    });
  }
  return skillList;
}
async function buildAddedSkillPlatformList(skillList, platformList) {
  const skillPlatformNameMap = {};
  await Promise.all(platformList.map(async ({ platformSkillDirectoryPath, platformName }) => {
    let directoryEntryList;
    try {
      directoryEntryList = await readdir2(platformSkillDirectoryPath, { withFileTypes: true });
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(AppErrorCode.PLATFORM_SKILL_DIRECTORY_INVALID_CODE, {
          param: { platformName, platformSkillDirectoryPath }
        });
      }
      throw error;
    }
    const addedSkillNameList = directoryEntryList.filter((directoryEntryItem) => directoryEntryItem.isDirectory()).map(({ name }) => name).filter((directoryName) => skillList.some((skillItem) => skillItem.skillName === directoryName));
    addedSkillNameList.forEach((skillName) => {
      if (skillPlatformNameMap[skillName] === undefined) {
        skillPlatformNameMap[skillName] = [];
      }
      skillPlatformNameMap[skillName].push(platformName);
    });
  }));
  return skillList.map(({ skillName }) => ({
    skillName,
    addedPlatformNameList: skillPlatformNameMap[skillName] ?? []
  })).filter(({ addedPlatformNameList }) => addedPlatformNameList.length > 0);
}
// src/tools/string/split-csv.ts
function splitCsvString(csvString) {
  return Array.from(new Set(csvString.split(",").map((csvSegment) => csvSegment.trim()).filter((csvSegment) => csvSegment.length > 0)));
}
// node_modules/ansi-regex/index.js
function ansiRegex({ onlyFirst = false } = {}) {
  const ST = "(?:\\u0007|\\u001B\\u005C|\\u009C)";
  const osc = `(?:\\u001B\\][\\s\\S]*?${ST})`;
  const csi = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
  const pattern = `${osc}|${csi}`;
  return new RegExp(pattern, onlyFirst ? undefined : "g");
}

// node_modules/strip-ansi/index.js
var regex = ansiRegex();
function stripAnsi(string) {
  if (typeof string !== "string") {
    throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
  }
  if (!string.includes("\x1B") && !string.includes("")) {
    return string;
  }
  return string.replace(regex, "");
}

// node_modules/get-east-asian-width/lookup-data.js
var ambiguousMinimalCodePoint = 161;
var ambiguousMaximumCodePoint = 1114109;
var ambiguousRanges = [161, 161, 164, 164, 167, 168, 170, 170, 173, 174, 176, 180, 182, 186, 188, 191, 198, 198, 208, 208, 215, 216, 222, 225, 230, 230, 232, 234, 236, 237, 240, 240, 242, 243, 247, 250, 252, 252, 254, 254, 257, 257, 273, 273, 275, 275, 283, 283, 294, 295, 299, 299, 305, 307, 312, 312, 319, 322, 324, 324, 328, 331, 333, 333, 338, 339, 358, 359, 363, 363, 462, 462, 464, 464, 466, 466, 468, 468, 470, 470, 472, 472, 474, 474, 476, 476, 593, 593, 609, 609, 708, 708, 711, 711, 713, 715, 717, 717, 720, 720, 728, 731, 733, 733, 735, 735, 768, 879, 913, 929, 931, 937, 945, 961, 963, 969, 1025, 1025, 1040, 1103, 1105, 1105, 8208, 8208, 8211, 8214, 8216, 8217, 8220, 8221, 8224, 8226, 8228, 8231, 8240, 8240, 8242, 8243, 8245, 8245, 8251, 8251, 8254, 8254, 8308, 8308, 8319, 8319, 8321, 8324, 8364, 8364, 8451, 8451, 8453, 8453, 8457, 8457, 8467, 8467, 8470, 8470, 8481, 8482, 8486, 8486, 8491, 8491, 8531, 8532, 8539, 8542, 8544, 8555, 8560, 8569, 8585, 8585, 8592, 8601, 8632, 8633, 8658, 8658, 8660, 8660, 8679, 8679, 8704, 8704, 8706, 8707, 8711, 8712, 8715, 8715, 8719, 8719, 8721, 8721, 8725, 8725, 8730, 8730, 8733, 8736, 8739, 8739, 8741, 8741, 8743, 8748, 8750, 8750, 8756, 8759, 8764, 8765, 8776, 8776, 8780, 8780, 8786, 8786, 8800, 8801, 8804, 8807, 8810, 8811, 8814, 8815, 8834, 8835, 8838, 8839, 8853, 8853, 8857, 8857, 8869, 8869, 8895, 8895, 8978, 8978, 9312, 9449, 9451, 9547, 9552, 9587, 9600, 9615, 9618, 9621, 9632, 9633, 9635, 9641, 9650, 9651, 9654, 9655, 9660, 9661, 9664, 9665, 9670, 9672, 9675, 9675, 9678, 9681, 9698, 9701, 9711, 9711, 9733, 9734, 9737, 9737, 9742, 9743, 9756, 9756, 9758, 9758, 9792, 9792, 9794, 9794, 9824, 9825, 9827, 9829, 9831, 9834, 9836, 9837, 9839, 9839, 9886, 9887, 9919, 9919, 9926, 9933, 9935, 9939, 9941, 9953, 9955, 9955, 9960, 9961, 9963, 9969, 9972, 9972, 9974, 9977, 9979, 9980, 9982, 9983, 10045, 10045, 10102, 10111, 11094, 11097, 12872, 12879, 57344, 63743, 65024, 65039, 65533, 65533, 127232, 127242, 127248, 127277, 127280, 127337, 127344, 127373, 127375, 127376, 127387, 127404, 917760, 917999, 983040, 1048573, 1048576, 1114109];
var fullwidthMinimalCodePoint = 12288;
var fullwidthMaximumCodePoint = 65510;
var fullwidthRanges = [12288, 12288, 65281, 65376, 65504, 65510];
var wideMinimalCodePoint = 4352;
var wideMaximumCodePoint = 262141;
var wideRanges = [4352, 4447, 8986, 8987, 9001, 9002, 9193, 9196, 9200, 9200, 9203, 9203, 9725, 9726, 9748, 9749, 9776, 9783, 9800, 9811, 9855, 9855, 9866, 9871, 9875, 9875, 9889, 9889, 9898, 9899, 9917, 9918, 9924, 9925, 9934, 9934, 9940, 9940, 9962, 9962, 9970, 9971, 9973, 9973, 9978, 9978, 9981, 9981, 9989, 9989, 9994, 9995, 10024, 10024, 10060, 10060, 10062, 10062, 10067, 10069, 10071, 10071, 10133, 10135, 10160, 10160, 10175, 10175, 11035, 11036, 11088, 11088, 11093, 11093, 11904, 11929, 11931, 12019, 12032, 12245, 12272, 12287, 12289, 12350, 12353, 12438, 12441, 12543, 12549, 12591, 12593, 12686, 12688, 12773, 12783, 12830, 12832, 12871, 12880, 42124, 42128, 42182, 43360, 43388, 44032, 55203, 63744, 64255, 65040, 65049, 65072, 65106, 65108, 65126, 65128, 65131, 94176, 94180, 94192, 94198, 94208, 101589, 101631, 101662, 101760, 101874, 110576, 110579, 110581, 110587, 110589, 110590, 110592, 110882, 110898, 110898, 110928, 110930, 110933, 110933, 110948, 110951, 110960, 111355, 119552, 119638, 119648, 119670, 126980, 126980, 127183, 127183, 127374, 127374, 127377, 127386, 127488, 127490, 127504, 127547, 127552, 127560, 127568, 127569, 127584, 127589, 127744, 127776, 127789, 127797, 127799, 127868, 127870, 127891, 127904, 127946, 127951, 127955, 127968, 127984, 127988, 127988, 127992, 128062, 128064, 128064, 128066, 128252, 128255, 128317, 128331, 128334, 128336, 128359, 128378, 128378, 128405, 128406, 128420, 128420, 128507, 128591, 128640, 128709, 128716, 128716, 128720, 128722, 128725, 128728, 128732, 128735, 128747, 128748, 128756, 128764, 128992, 129003, 129008, 129008, 129292, 129338, 129340, 129349, 129351, 129535, 129648, 129660, 129664, 129674, 129678, 129734, 129736, 129736, 129741, 129756, 129759, 129770, 129775, 129784, 131072, 196605, 196608, 262141];

// node_modules/get-east-asian-width/utilities.js
var isInRange = (ranges, codePoint) => {
  let low = 0;
  let high = Math.floor(ranges.length / 2) - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const i4 = mid * 2;
    if (codePoint < ranges[i4]) {
      high = mid - 1;
    } else if (codePoint > ranges[i4 + 1]) {
      low = mid + 1;
    } else {
      return true;
    }
  }
  return false;
};

// node_modules/get-east-asian-width/lookup.js
var commonCjkCodePoint = 19968;
var [wideFastPathStart, wideFastPathEnd] = /* @__PURE__ */ findWideFastPathRange(wideRanges);
function findWideFastPathRange(ranges) {
  let fastPathStart = ranges[0];
  let fastPathEnd = ranges[1];
  for (let index = 0;index < ranges.length; index += 2) {
    const start = ranges[index];
    const end = ranges[index + 1];
    if (commonCjkCodePoint >= start && commonCjkCodePoint <= end) {
      return [start, end];
    }
    if (end - start > fastPathEnd - fastPathStart) {
      fastPathStart = start;
      fastPathEnd = end;
    }
  }
  return [fastPathStart, fastPathEnd];
}
var isAmbiguous = (codePoint) => {
  if (codePoint < ambiguousMinimalCodePoint || codePoint > ambiguousMaximumCodePoint) {
    return false;
  }
  return isInRange(ambiguousRanges, codePoint);
};
var isFullWidth2 = (codePoint) => {
  if (codePoint < fullwidthMinimalCodePoint || codePoint > fullwidthMaximumCodePoint) {
    return false;
  }
  return isInRange(fullwidthRanges, codePoint);
};
var isWide = (codePoint) => {
  if (codePoint >= wideFastPathStart && codePoint <= wideFastPathEnd) {
    return true;
  }
  if (codePoint < wideMinimalCodePoint || codePoint > wideMaximumCodePoint) {
    return false;
  }
  return isInRange(wideRanges, codePoint);
};

// node_modules/get-east-asian-width/index.js
function validate(codePoint) {
  if (!Number.isSafeInteger(codePoint)) {
    throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
  }
}
function eastAsianWidth(codePoint, { ambiguousAsWide = false } = {}) {
  validate(codePoint);
  if (isFullWidth2(codePoint) || isWide(codePoint) || ambiguousAsWide && isAmbiguous(codePoint)) {
    return 2;
  }
  return 1;
}

// node_modules/string-width/index.js
var segmenter = new Intl.Segmenter;
var zeroWidthClusterRegex = /^(?:\p{Default_Ignorable_Code_Point}|\p{Control}|\p{Format}|\p{Mark}|\p{Surrogate})+$/v;
var leadingNonPrintingRegex = /^[\p{Default_Ignorable_Code_Point}\p{Control}\p{Format}\p{Mark}\p{Surrogate}]+/v;
var rgiEmojiRegex = /^\p{RGI_Emoji}$/v;
var unqualifiedKeycapRegex = /^[\d#*]\u20E3$/;
var extendedPictographicRegex = /\p{Extended_Pictographic}/gu;
function isDoubleWidthNonRgiEmojiSequence(segment) {
  if (segment.length > 50) {
    return false;
  }
  if (unqualifiedKeycapRegex.test(segment)) {
    return true;
  }
  if (segment.includes("‍")) {
    const pictographics = segment.match(extendedPictographicRegex);
    return pictographics !== null && pictographics.length >= 2;
  }
  return false;
}
function baseVisible(segment) {
  return segment.replace(leadingNonPrintingRegex, "");
}
function isZeroWidthCluster(segment) {
  return zeroWidthClusterRegex.test(segment);
}
function isHangulLeadingJamo(codePoint) {
  return codePoint >= 4352 && codePoint <= 4447 || codePoint >= 43360 && codePoint <= 43388;
}
function isHangulVowelJamo(codePoint) {
  return codePoint >= 4448 && codePoint <= 4519 || codePoint >= 55216 && codePoint <= 55238;
}
function isHangulTrailingJamo(codePoint) {
  return codePoint >= 4520 && codePoint <= 4607 || codePoint >= 55243 && codePoint <= 55291;
}
function isHangulJamo(codePoint) {
  return isHangulLeadingJamo(codePoint) || isHangulVowelJamo(codePoint) || isHangulTrailingJamo(codePoint);
}
function hangulClusterWidth(visibleSegment, eastAsianWidthOptions) {
  const codePoints = [];
  for (const character of visibleSegment) {
    if (zeroWidthClusterRegex.test(character)) {
      continue;
    }
    codePoints.push(character.codePointAt(0));
  }
  if (codePoints.length === 0) {
    return;
  }
  let width = 0;
  for (let index = 0;index < codePoints.length; index++) {
    const codePoint = codePoints[index];
    if (!isHangulJamo(codePoint)) {
      if (width === 0) {
        return;
      }
      for (let remaining = index;remaining < codePoints.length; remaining++) {
        width += eastAsianWidth(codePoints[remaining], eastAsianWidthOptions);
      }
      return width;
    }
    if (isHangulLeadingJamo(codePoint) && isHangulVowelJamo(codePoints[index + 1])) {
      width += 2;
      index += isHangulTrailingJamo(codePoints[index + 2]) ? 2 : 1;
      continue;
    }
    width += eastAsianWidth(codePoint, eastAsianWidthOptions);
  }
  return width;
}
function trailingHalfwidthWidth(visibleSegment, eastAsianWidthOptions) {
  let extra = 0;
  let first = true;
  for (const character of visibleSegment) {
    if (first) {
      first = false;
      continue;
    }
    if (character >= "＀" && character <= "￯") {
      extra += eastAsianWidth(character.codePointAt(0), eastAsianWidthOptions);
    }
  }
  return extra;
}
function stringWidth(input, options2 = {}) {
  if (typeof input !== "string" || input.length === 0) {
    return 0;
  }
  const {
    ambiguousIsNarrow = true,
    countAnsiEscapeCodes = false
  } = options2;
  let string = input;
  if (!countAnsiEscapeCodes && (string.includes("\x1B") || string.includes(""))) {
    string = stripAnsi(string);
  }
  if (string.length === 0) {
    return 0;
  }
  if (/^[\u0020-\u007E]*$/.test(string)) {
    return string.length;
  }
  let width = 0;
  const eastAsianWidthOptions = { ambiguousAsWide: !ambiguousIsNarrow };
  for (const { segment } of segmenter.segment(string)) {
    if (isZeroWidthCluster(segment)) {
      continue;
    }
    if (rgiEmojiRegex.test(segment) || isDoubleWidthNonRgiEmojiSequence(segment)) {
      width += 2;
      continue;
    }
    const visibleSegment = baseVisible(segment);
    const hangulWidth = hangulClusterWidth(visibleSegment, eastAsianWidthOptions);
    if (hangulWidth !== undefined) {
      width += hangulWidth;
      continue;
    }
    const codePoint = visibleSegment.codePointAt(0);
    width += eastAsianWidth(codePoint, eastAsianWidthOptions);
    width += trailingHalfwidthWidth(visibleSegment, eastAsianWidthOptions);
  }
  return width;
}

// src/tools/string/truncate.ts
function truncateTextByDisplayWidth(sourceText, maxDisplayWidth) {
  const ellipsisText = "...";
  const ellipsisDisplayWidth = stringWidth(ellipsisText);
  const sourceTextMaxDisplayWidth = maxDisplayWidth - ellipsisDisplayWidth;
  const sourceTextCodePointList = Array.from(sourceText);
  let currentDisplayWidth = 0;
  const truncatedCodePointIndex = sourceTextCodePointList.findIndex((codePoint) => {
    currentDisplayWidth += stringWidth(codePoint);
    return currentDisplayWidth > sourceTextMaxDisplayWidth;
  });
  if (truncatedCodePointIndex === -1) {
    return sourceText;
  }
  return sourceTextCodePointList.slice(0, truncatedCodePointIndex).join("") + ellipsisText;
}
// src/features/skill/parser.ts
function parseSkillNameList(rawSkillNameText) {
  if (rawSkillNameText === undefined) {
    return [];
  }
  const parsedSkillNameCsvResult = rawSkillNameTextSchema.safeParse(rawSkillNameText);
  if (!parsedSkillNameCsvResult.success) {
    throw new AppError(AppErrorCode.SKILL_OPTION_INVALID_FORMAT_CODE, {
      param: { rawSkillNameText }
    });
  }
  return splitCsvString(rawSkillNameText);
}
// src/features/skill/remove.ts
import { resolve as resolve2 } from "node:path";
async function removeSkillListFromPlatformList(skillNameList) {
  const localPlatformList = await LocalPlatformService.getLocalPlatformList();
  await Promise.all(skillNameList.flatMap((skillName) => localPlatformList.map(async (platformItem) => removeSkillItemFromPlatformItem(skillName, platformItem))));
}
async function removeSkillItemFromPlatformItem(skillName, platformItem) {
  const targetSkillDirectoryPath = resolve2(platformItem.platformSkillDirectoryPath, skillName);
  try {
    await removeDirectory(targetSkillDirectoryPath);
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE, {
        param: {
          directoryPath: targetSkillDirectoryPath
        }
      });
    }
    throw error;
  }
}
// src/commands/add/command.ts
class AddCommand {
  commandName = "add";
  commandDescription = "添加技能。";
  commandOptionList = [
    {
      commandOptionFlag: "--skill <skills>",
      commandOptionDescription: "逗号分隔的技能列表。"
    }
  ];
  async promptAddSkillNameList() {
    const remoteSkillList = await RemoteSkillService.getRemoteSkillList();
    const HINT_MAX_DISPLAY_WIDTH = 80;
    const selectedSkillNameList = await multiselect({
      message: "要添加哪些技能？",
      options: remoteSkillList.map((skillItem) => {
        const truncatedSkillDescriptionHint = truncateTextByDisplayWidth(skillItem.skillDescription, HINT_MAX_DISPLAY_WIDTH);
        return {
          value: skillItem.skillName,
          label: skillItem.skillName,
          hint: truncatedSkillDescriptionHint
        };
      }),
      required: true
    });
    if (isCancel(selectedSkillNameList)) {
      cancel("已取消操作。");
      throw new AppError(AppErrorCode.PROMPT_CANCELLED_CODE);
    }
    return selectedSkillNameList;
  }
  async promptAddPlatformNameList() {
    const localPlatformList = await LocalPlatformService.getLocalPlatformList();
    const selectedPlatformNameList = await multiselect({
      message: "要安装到哪些平台？",
      options: localPlatformList.map((platformItem) => ({
        value: platformItem.platformName,
        label: platformItem.platformName
      })),
      required: true
    });
    if (isCancel(selectedPlatformNameList)) {
      cancel("已取消操作。");
      throw new AppError(AppErrorCode.PROMPT_CANCELLED_CODE);
    }
    return selectedPlatformNameList;
  }
  async execute(addCommandOption) {
    try {
      intro(import_picocolors.default.inverse(" mingto-skills "));
      await RemoteRepositoryService.initRemoteRepository();
      await Promise.all([
        RemoteSkillService.initRemoteSkill(),
        LocalPlatformService.initLocalPlatform()
      ]);
      const inputSkillNameList = parseSkillNameList(addCommandOption.rawSkillNameText);
      if (inputSkillNameList.length > 0) {
        await RemoteSkillService.validateSkillNameListExistInRemoteSkillList(inputSkillNameList);
      }
      let selectedSkillNameList = inputSkillNameList;
      if (inputSkillNameList.length === 0) {
        selectedSkillNameList = await this.promptAddSkillNameList();
      }
      const selectedPlatformNameList = await this.promptAddPlatformNameList();
      const selectedPlatformList = await buildPlatformListByPlatformNameList(selectedPlatformNameList);
      const selectedSkillList = await buildRemoteSkillListBySkillNameList(selectedSkillNameList);
      await addSkillListToPlatformList(selectedSkillList, selectedPlatformList);
      outro("添加成功！");
    } finally {
      await Promise.allSettled([
        RemoteSkillService.clearRemoteSkill(),
        RemoteRepositoryService.clearRemoteRepository(),
        LocalPlatformService.clearLocalPlatform()
      ]);
    }
  }
  register(program2) {
    const addCommand = program2.command(this.commandName).description(this.commandDescription);
    this.commandOptionList.forEach((commandOption) => {
      addCommand.option(commandOption.commandOptionFlag, commandOption.commandOptionDescription);
    });
    addCommand.action(async (rawAddCommandOption) => {
      const addCommandOption = {
        rawSkillNameText: rawAddCommandOption.skill
      };
      await this.execute(addCommandOption);
    });
  }
}
// src/commands/list/command.ts
var import_picocolors2 = __toESM(require_picocolors(), 1);

// src/features/display/error.ts
var ERROR_MESSAGE_MAX_DISPLAY_WIDTH = 80;
function renderErrorDisplay(title, message) {
  const truncatedMessage = truncateTextByDisplayWidth(message, ERROR_MESSAGE_MAX_DISPLAY_WIDTH);
  log.error(`${title} (${truncatedMessage})`);
}
// src/features/display/table.ts
function buildTableColumnMaxWidthList(tableColumnCount, tableRowList) {
  const tableColumnMaxWidthList = Array.from({ length: tableColumnCount }).fill(0);
  tableRowList.forEach((tableColumnList) => {
    tableColumnList.forEach((tableColumnItem, tableColumnIndex) => {
      const tableColumnDisplayWidth = stringWidth(tableColumnItem);
      if (tableColumnDisplayWidth > tableColumnMaxWidthList[tableColumnIndex]) {
        tableColumnMaxWidthList[tableColumnIndex] = tableColumnDisplayWidth;
      }
    });
  });
  return tableColumnMaxWidthList;
}
function formatTableColumnList(tableColumnList, tableColumnTotalWidthList) {
  return tableColumnList.map((tableColumnItem, tableColumnIndex) => {
    const currentDisplayWidth = stringWidth(tableColumnItem);
    if (currentDisplayWidth >= tableColumnTotalWidthList[tableColumnIndex]) {
      return tableColumnItem;
    }
    return tableColumnItem + " ".repeat(tableColumnTotalWidthList[tableColumnIndex] - currentDisplayWidth);
  }).join("");
}
function renderTableDisplay(tableTitle, tableRowList) {
  const COLUMN_GAP_WIDTH = 8;
  log.message("");
  if (tableRowList.length === 0) {
    note("暂无数据", tableTitle, { withGuide: false });
    return;
  }
  const tableColumnCount = tableRowList[0].length;
  const tableColumnMaxWidthList = buildTableColumnMaxWidthList(tableColumnCount, tableRowList);
  const columnTotalWidthList = tableColumnMaxWidthList.map((tableColumnMaxWidth, tableColumnIndex) => {
    if (tableColumnIndex === tableColumnCount - 1) {
      return tableColumnMaxWidth;
    }
    return tableColumnMaxWidth + COLUMN_GAP_WIDTH;
  });
  const formattedRowList = tableRowList.map((tableColumnList) => formatTableColumnList(tableColumnList, columnTotalWidthList));
  note(formattedRowList.join(`
`), tableTitle, { withGuide: false });
}
// src/commands/list/command.ts
class ListCommand {
  commandName = "list";
  commandDescription = "查看技能列表。";
  commandOptionList = [];
  async buildAddedSkillPlatformTableRowList() {
    const remoteSkillList = await RemoteSkillService.getRemoteSkillList();
    const localPlatformList = await LocalPlatformService.getLocalPlatformList();
    const addedSkillPlatformList = await buildAddedSkillPlatformList(remoteSkillList, localPlatformList);
    return addedSkillPlatformList.map(({ skillName, addedPlatformNameList }) => [
      skillName,
      addedPlatformNameList.join(", ")
    ]);
  }
  async execute(_listCommandOption) {
    try {
      intro(import_picocolors2.default.inverse(" mingto-skills "));
      await RemoteRepositoryService.initRemoteRepository();
      await Promise.all([
        RemoteSkillService.initRemoteSkill(),
        LocalPlatformService.initLocalPlatform()
      ]);
      const addedSkillPlatformTableRowList = await this.buildAddedSkillPlatformTableRowList();
      renderTableDisplay("已添加技能列表：", addedSkillPlatformTableRowList);
    } finally {
      await Promise.allSettled([
        RemoteSkillService.clearRemoteSkill(),
        RemoteRepositoryService.clearRemoteRepository(),
        LocalPlatformService.clearLocalPlatform()
      ]);
    }
  }
  register(program2) {
    const listCommand = program2.command(this.commandName).description(this.commandDescription);
    this.commandOptionList.forEach((commandOption) => {
      listCommand.option(commandOption.commandOptionFlag, commandOption.commandOptionDescription);
    });
    listCommand.action(async (_rawListCommandOption) => {
      const listCommandOption = {};
      await this.execute(listCommandOption);
    });
  }
}
// src/commands/remove/command.ts
var import_picocolors3 = __toESM(require_picocolors(), 1);
class RemoveCommand {
  commandName = "remove";
  commandDescription = "移除技能。";
  commandOptionList = [
    {
      commandOptionFlag: "--skill <skills>",
      commandOptionDescription: "逗号分隔的技能列表。"
    }
  ];
  async promptRemoveSkillNameList() {
    const remoteSkillList = await RemoteSkillService.getRemoteSkillList();
    const localPlatformList = await LocalPlatformService.getLocalPlatformList();
    const addedSkillPlatformList = await buildAddedSkillPlatformList(remoteSkillList, localPlatformList);
    const addedSkillList = await buildRemoteSkillListBySkillNameList(addedSkillPlatformList.map(({ skillName }) => skillName));
    const HINT_MAX_DISPLAY_WIDTH = 80;
    const selectedSkillNameList = await multiselect({
      message: "要移除哪些技能？",
      options: addedSkillList.map((skillItem) => {
        const truncatedSkillDescriptionHint = truncateTextByDisplayWidth(skillItem.skillDescription, HINT_MAX_DISPLAY_WIDTH);
        return {
          value: skillItem.skillName,
          label: skillItem.skillName,
          hint: truncatedSkillDescriptionHint
        };
      }),
      required: true
    });
    if (isCancel(selectedSkillNameList)) {
      cancel("已取消操作。");
      throw new AppError(AppErrorCode.PROMPT_CANCELLED_CODE);
    }
    return selectedSkillNameList;
  }
  async execute(removeCommandOption) {
    try {
      intro(import_picocolors3.default.inverse(" mingto-skills "));
      await RemoteRepositoryService.initRemoteRepository();
      await Promise.all([
        RemoteSkillService.initRemoteSkill(),
        LocalPlatformService.initLocalPlatform()
      ]);
      const inputSkillNameList = parseSkillNameList(removeCommandOption.rawSkillNameText);
      if (inputSkillNameList.length > 0) {
        await RemoteSkillService.validateSkillNameListExistInRemoteSkillList(inputSkillNameList);
      }
      let selectedSkillNameList = inputSkillNameList;
      if (inputSkillNameList.length === 0) {
        selectedSkillNameList = await this.promptRemoveSkillNameList();
      }
      await removeSkillListFromPlatformList(selectedSkillNameList);
      outro("移除成功！");
    } finally {
      await Promise.allSettled([
        RemoteSkillService.clearRemoteSkill(),
        RemoteRepositoryService.clearRemoteRepository(),
        LocalPlatformService.clearLocalPlatform()
      ]);
    }
  }
  register(program2) {
    const removeCommand = program2.command(this.commandName).description(this.commandDescription);
    this.commandOptionList.forEach((commandOption) => {
      removeCommand.option(commandOption.commandOptionFlag, commandOption.commandOptionDescription);
    });
    removeCommand.action(async (rawRemoveCommandOption) => {
      const removeCommandOption = {
        rawSkillNameText: rawRemoveCommandOption.skill
      };
      await this.execute(removeCommandOption);
    });
  }
}
// src/features/json/package.ts
import { readFile as readFile3 } from "node:fs/promises";
import { dirname, resolve as resolve3 } from "node:path";
import { fileURLToPath } from "node:url";

// src/schemas/json/package.ts
var packageJsonSchema = exports_external.object({
  bin: exports_external.record(exports_external.string()),
  description: exports_external.string().trim().min(1, "package.json 中缺少 description 配置。"),
  version: exports_external.string().trim().min(1, "package.json 中缺少 version 配置。")
}).passthrough();
// src/features/json/package.ts
async function loadPackageJson() {
  const packageJsonPath = resolve3(dirname(fileURLToPath(import.meta.url)), "..", "..", "package.json");
  try {
    const rawPackageJsonText = await readFile3(packageJsonPath, "utf8");
    return packageJsonSchema.parse(JSON.parse(rawPackageJsonText));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AppError(AppErrorCode.PACKAGE_CONFIG_JSON_INVALID_CODE);
    }
    if (error instanceof ZodError) {
      throw new AppError(AppErrorCode.PACKAGE_CONFIG_SCHEMA_INVALID_CODE);
    }
    if (error instanceof Error) {
      if ("code" in error && error.code === "ENOENT") {
        throw new AppError(AppErrorCode.PACKAGE_CONFIG_NOT_FOUND_CODE);
      }
    }
    throw error;
  }
}
// src/main.ts
var SILENT_EXIT_APP_ERROR_CODE_LIST = [
  AppErrorCode.COMMANDER_NORMAL_EXIT_CODE,
  AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE,
  AppErrorCode.PROMPT_CANCELLED_CODE
];
async function createProgram() {
  const packageJsonInfo = await loadPackageJson();
  const programNameList = Object.keys(packageJsonInfo.bin);
  if (programNameList.length === 0) {
    throw new AppError(AppErrorCode.PACKAGE_BIN_CONFIG_MISSING_CODE);
  }
  const program2 = new Command;
  program2.exitOverride();
  program2.configureOutput({
    outputError: () => {}
  });
  program2.name(programNameList[0]);
  program2.description(packageJsonInfo.description);
  program2.version(packageJsonInfo.version);
  new ListCommand().register(program2);
  new AddCommand().register(program2);
  new RemoveCommand().register(program2);
  return program2;
}
function isAppError(error) {
  return error instanceof AppError;
}
async function runCli() {
  try {
    const program2 = await createProgram();
    try {
      await program2.parseAsync(process2.argv);
    } catch (error) {
      if (error instanceof CommanderError) {
        buildAppErrorFromCommanderError(error);
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (isAppError(error)) {
        if (SILENT_EXIT_APP_ERROR_CODE_LIST.includes(error.appErrorCode)) {
          process2.exitCode = 0;
          return;
        }
        renderErrorDisplay(error.appErrorTitle, error.message);
        process2.exitCode = 1;
        return;
      }
    }
    const fallbackAppError = new AppError(AppErrorCode.UNEXPECTED_ERROR_CODE, {
      param: {
        detailMessage: `捕获到非 Error 异常，异常值类型为 ${typeof error}。`
      }
    });
    renderErrorDisplay(fallbackAppError.appErrorTitle, fallbackAppError.message);
    process2.exitCode = 1;
  }
}

// bin/cli.ts
runCli();
