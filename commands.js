#!/usr/bin/env node
const { program } = require("commander");

const { login, deposit, transfer, logout } = require("./atm");

program.command("login <user>").action((user) => {
    login(user);
});
program.command("deposit <amount>").action((amount) => {
    deposit(amount);
});
program.command("transfer <user> <amount>").action((user, amount) => {
    transfer(user, amount);
});
program.command("logout").action(() => {
    logout();
});

program.parse(process.argv);
