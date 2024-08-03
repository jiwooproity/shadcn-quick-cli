#!/usr/bin/env node

import { program } from "commander";
import { config } from "dotenv";

import { start } from "./shad";

config();

program
  .version(`${process.env.VERSION}`, "-v, --version", "output the current version")
  .option("-o, --overwrite", "overwrite the existing component and download a new one")
  .option("-h, --help", "output all commands and guide")
  .action((options) => start(options.overwrite));

program.parse(process.argv);
