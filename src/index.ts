#!/usr/bin/env node

const readline = require("readline");
const { stdin, stdout } = require("process");

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

rl.question("테스트 실행입니다.", () => {
  console.log("입력되었습니다.");
  rl.close();
  process.exit();
});
