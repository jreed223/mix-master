"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/config/index.ts
var config_exports = {};
__export(config_exports, {
  buildPagesASSETSBinding: () => buildPagesASSETSBinding,
  defineWorkersConfig: () => defineWorkersConfig,
  defineWorkersProject: () => defineWorkersProject,
  readD1Migrations: () => readD1Migrations
});
module.exports = __toCommonJS(config_exports);
var import_node_assert = __toESM(require("node:assert"));
var import_node_crypto = __toESM(require("node:crypto"));
var import_promises = __toESM(require("node:fs/promises"));
var import_node_path2 = __toESM(require("node:path"));
var import_node_worker_threads = require("node:worker_threads");

// src/config/d1.ts
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
async function readD1Migrations(migrationsPath) {
  if (typeof migrationsPath !== "string") {
    throw new TypeError(
      "Failed to execute 'readD1Migrations': parameter 1 is not of type 'string'."
    );
  }
  const { unstable_splitSqlQuery } = await import("wrangler");
  const names = import_node_fs.default.readdirSync(migrationsPath).filter((name) => name.endsWith(".sql"));
  names.sort((a, b) => {
    const aNumber = parseInt(a.split("_")[0]);
    const bNumber = parseInt(b.split("_")[0]);
    return aNumber - bNumber;
  });
  return names.map((name) => {
    const migrationPath = import_node_path.default.join(migrationsPath, name);
    const migration = import_node_fs.default.readFileSync(migrationPath, "utf8");
    const queries = unstable_splitSqlQuery(migration);
    return { name, queries };
  });
}

// src/config/pages.ts
async function buildPagesASSETSBinding(assetsPath) {
  if (typeof assetsPath !== "string") {
    throw new TypeError(
      "Failed to execute 'buildPagesASSETSBinding': parameter 1 is not of type 'string'."
    );
  }
  const { unstable_generateASSETSBinding } = await import("wrangler");
  const log = {
    ...console,
    debugWithSanitization: console.debug,
    loggerLevel: "info",
    columns: process.stdout.columns
  };
  return unstable_generateASSETSBinding({ log, directory: assetsPath });
}

// src/config/index.ts
var cloudflareTestPath = import_node_path2.default.resolve(
  __dirname,
  "../worker/lib/cloudflare/test.mjs"
);
var channel;
globalThis.structuredClone ??= function(value, options) {
  channel ??= new import_node_worker_threads.MessageChannel();
  channel.port1.unref();
  channel.port2.unref();
  channel.port1.postMessage(value, options?.transfer);
  const message = (0, import_node_worker_threads.receiveMessageOnPort)(channel.port2);
  (0, import_node_assert.default)(message !== void 0);
  return message.message;
};
function mapAnyConfigExport(f, config) {
  if (typeof config === "function") {
    return (env) => {
      const t = config(env);
      if (t instanceof Promise) {
        return t.then(f);
      } else {
        return f(t);
      }
    };
  } else if (config instanceof Promise) {
    return config.then(f);
  } else {
    return f(config);
  }
}
function ensureArrayIncludes(array, items) {
  for (const item of items) {
    if (!array.includes(item)) {
      array.push(item);
    }
  }
}
function ensureArrayExcludes(array, items) {
  for (let i = 0; i < array.length; i++) {
    if (items.includes(array[i])) {
      array.splice(i, 1);
      i--;
    }
  }
}
var requiredConditions = ["workerd", "worker", "browser"];
var requiredMainFields = ["browser", "module", "jsnext:main", "jsnext"];
function createConfigPlugin() {
  const uuid = import_node_crypto.default.randomUUID();
  let main;
  return {
    name: "@cloudflare/vitest-pool-workers:config",
    api: {
      setMain(newMain) {
        main = newMain;
      }
    },
    // Run after `vitest:project` plugin:
    // https://github.com/vitest-dev/vitest/blob/v2.1.1/packages/vitest/src/node/plugins/workspace.ts#L34
    config(config) {
      config.resolve ??= {};
      config.resolve.conditions ??= [];
      config.resolve.mainFields ??= [];
      config.ssr ??= {};
      config.test ??= {};
      ensureArrayExcludes(config.resolve.conditions, ["node"]);
      ensureArrayIncludes(config.resolve.conditions, requiredConditions);
      ensureArrayIncludes(config.resolve.mainFields, requiredMainFields);
      config.ssr.target = "webworker";
      config.test.pool ??= "@cloudflare/vitest-pool-workers";
    },
    resolveId(id) {
      if (id === "cloudflare:test") {
        return `\0cloudflare:test-${uuid}`;
      }
    },
    async load(id) {
      if (id === `\0cloudflare:test-${uuid}`) {
        let contents = await import_promises.default.readFile(cloudflareTestPath, "utf8");
        if (main !== void 0) {
          contents += `import ${JSON.stringify(main)};`;
        }
        return contents;
      }
    }
  };
}
function ensureWorkersConfig(config) {
  config.plugins ??= [];
  config.plugins.push(createConfigPlugin());
  return config;
}
function defineWorkersConfig(config) {
  if (typeof config === "function") {
    return mapAnyConfigExport(ensureWorkersConfig, config);
  } else if (config instanceof Promise) {
    return mapAnyConfigExport(ensureWorkersConfig, config);
  }
  return mapAnyConfigExport(ensureWorkersConfig, config);
}
function defineWorkersProject(config) {
  if (typeof config === "function") {
    return mapAnyConfigExport(ensureWorkersConfig, config);
  } else if (config instanceof Promise) {
    return mapAnyConfigExport(ensureWorkersConfig, config);
  }
  return mapAnyConfigExport(ensureWorkersConfig, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildPagesASSETSBinding,
  defineWorkersConfig,
  defineWorkersProject,
  readD1Migrations
});
//# sourceMappingURL=index.cjs.map
