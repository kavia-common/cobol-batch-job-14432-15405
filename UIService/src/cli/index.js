#!/usr/bin/env node
/* eslint-disable no-console */
"use strict";

/**
 * CLI for UI Service to perform auth and account operations via API Gateway.
 * Usage examples:
 *  - node src/cli/index.js login --username alice --password secret
 *  - node src/cli/index.js balance
 *  - node src/cli/index.js credit --amount 10.5
 *  - node src/cli/index.js debit --amount 5
 *  - node src/cli/index.js audit-logs
 *  - node src/cli/index.js feedback --type feedback --message "Nice app"
 *  - node src/cli/index.js logout
 */

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

// simple token store in file system for CLI session
const fs = require("fs");
const path = require("path");
const TOKEN_FILE = path.resolve(__dirname, ".cli-token.json");

function getToken() {
  try {
    const raw = fs.readFileSync(TOKEN_FILE, "utf8");
    const data = JSON.parse(raw);
    return data?.token || "";
  } catch {
    return "";
  }
}

function saveToken(token) {
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token }), "utf8");
  } catch {
    // ignore
  }
}

function clearToken() {
  try {
    fs.unlinkSync(TOKEN_FILE);
  } catch {
    // ignore
  }
}

// Minimal fetch using node18 global fetch
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.example.com/api/v1";

async function request(path, options = {}) {
  const headers = options.headers ? new Headers(options.headers) : new Headers();
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  let body = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    body = await res.json().catch(() => null);
  } else {
    body = await res.text().catch(() => null);
  }
  if (!res.ok) {
    const err = new Error((body && body.error) || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

// PUBLIC_INTERFACE
async function run(argv) {
  /** This is a public function. Runs the CLI with parsed args. */
  const cmd = argv._[0];

  try {
    if (cmd === "login") {
      const { username, password } = argv;
      if (!username || !password) throw new Error("Username and password are required.");
      const res = await request("/login", { method: "POST", body: JSON.stringify({ username, password }) });
      saveToken(res.token);
      console.log(JSON.stringify({ status: "ok", token: res.token, expiresIn: res.expiresIn }, null, 2));
    } else if (cmd === "logout") {
      await request("/logout", { method: "POST" }).catch(() => undefined);
      clearToken();
      console.log(JSON.stringify({ status: "ok", message: "Logged out" }, null, 2));
    } else if (cmd === "balance") {
      const b = await request("/account/balance", { method: "GET" });
      console.log(JSON.stringify({ status: "ok", balance: b }, null, 2));
    } else if (cmd === "credit") {
      const amt = Number(argv.amount);
      if (!amt || isNaN(amt) || amt <= 0) throw new Error("Amount must be a positive number.");
      await request("/account/credit", { method: "POST", body: JSON.stringify({ amount: amt }) });
      console.log(JSON.stringify({ status: "ok", message: "Credited" }, null, 2));
    } else if (cmd === "debit") {
      const amt = Number(argv.amount);
      if (!amt || isNaN(amt) || amt <= 0) throw new Error("Amount must be a positive number.");
      await request("/account/debit", { method: "POST", body: JSON.stringify({ amount: amt }) });
      console.log(JSON.stringify({ status: "ok", message: "Debited" }, null, 2));
    } else if (cmd === "audit-logs") {
      const logs = await request("/admin/audit-logs", { method: "GET" });
      console.log(JSON.stringify({ status: "ok", logs }, null, 2));
    } else if (cmd === "feedback") {
      const type = argv.type || "feedback";
      const message = argv.message || "";
      if (!message || message.trim().length < 3) throw new Error("Feedback message must be at least 3 characters.");
      await request("/feedback", { method: "POST", body: JSON.stringify({ type, message }) });
      console.log(JSON.stringify({ status: "ok", message: "Submitted" }, null, 2));
    } else {
      yargs(hideBin(process.argv)).showHelp();
    }
  } catch (err) {
    const code = err.status || 1;
    console.error(JSON.stringify({ status: "error", code, error: err.message, details: err.body?.details || "" }, null, 2));
    process.exitCode = typeof code === "number" ? code : 1;
  }
}

if (require.main === module) {
  const parser = yargs(hideBin(process.argv))
    .scriptName("uiservice")
    .command("login", "Authenticate user", (y) => y.option("username", { type: "string", demandOption: true }).option("password", { type: "string", demandOption: true }))
    .command("logout", "Logout")
    .command("balance", "Get account balance")
    .command("credit", "Credit account", (y) => y.option("amount", { type: "number", demandOption: true }))
    .command("debit", "Debit account", (y) => y.option("amount", { type: "number", demandOption: true }))
    .command("audit-logs", "Get audit logs (admin only)")
    .command("feedback", "Submit feedback", (y) => y.option("type", { choices: ["feedback", "error"], default: "feedback" }).option("message", { type: "string", demandOption: true }))
    .demandCommand(1)
    .help();

  run(parser.parse());
}

module.exports = { run };
