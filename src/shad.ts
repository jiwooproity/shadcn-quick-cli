import axios from "axios";
import chalk from "chalk";
import select from "@inquirer/select";
import { readdirSync, readFileSync } from "fs";
import { exec } from "child_process";
import { load } from "cheerio";

export type ProcessArgv = {
  help: boolean;
  overwrite: boolean;
  target?: string;
  select: boolean;
  docs: boolean;
};

interface ChoiceItem {
  name: string;
  value: string;
}

const QUESTION = {
  COMPONENT: "What would you like to add in project",
  OVERWRITE: "Would you like to overwrite?",
};

export const readdir = (path: string) => {
  return readdirSync(path);
};

export const chrowingHTML = async () => {
  return await axios.get("https://ui.shadcn.com/docs/components/accordion");
};

export const getComponents = async (): Promise<string[]> => {
  const html = await chrowingHTML();
  const $ = load(html?.data);
  const $menu = $(".pb-4");
  const $children = $menu[1].children;
  const $items = $($children).find(".group");
  return $items.map((_, item) => $(item).text()).get();
};

export const isNeedOverwriting = async (componentName: string) => {
  const configFile = readFileSync("./components.json").toString();
  const configPath = await JSON.parse(configFile);
  const filePath = `./${configPath.aliases.components}/ui`;
  const fileNames = readdirSync(filePath).map((file) => file.split("."));
  return fileNames.map((file) => file[0]).includes(componentName);
};

export const log = ({ color, msg }: { color: "white" | "green"; msg: string }) => {
  console.log(chalk[color](msg));
};

export const output = (_: any, stdout: string, stderr: string) => {
  log({ color: "white", msg: stdout });
  log({ color: "green", msg: stderr });
};

export class CreateChoice {
  constructor(private items: string[]) {
    this.items = items;
  }

  private convertValue(item: string) {
    return item.toLowerCase().replace(" ", "-");
  }

  private async createSelect<T>(message: string, choices: ChoiceItem[]): Promise<T | string> {
    return (await select({ message, choices })) as T;
  }

  private createItems(): ChoiceItem[] {
    return this.items.map((item) => ({ name: item, value: this.convertValue(item) }));
  }

  public async get<T>(type: string): Promise<T | string> {
    const answer = await this.createSelect<T>(type, this.createItems());
    return answer;
  }
}

export class ShadcnCLI {
  private options: string;
  private manage: string;
  private answer: string;
  private overwriteTrigger: boolean;

  constructor(public argv: ProcessArgv) {
    this.argv = argv;
    this.options = "";
    this.manage = "";
    this.answer = "";
    this.overwriteTrigger = false;
    this.init();
  }

  private setOptions() {
    if (this.argv.overwrite) {
      this.options += "--overwrite";
    }
  }

  async question() {
    if (this.argv.select) {
      const choices = new CreateChoice(await getComponents());
      this.answer = await choices.get(QUESTION.COMPONENT);
    }

    if (!this.argv.select && this.argv.target) {
      this.answer = this.argv.target;
    }

    this.overwriteTrigger = await isNeedOverwriting(this.answer);
  }

  private setPackageName() {
    const files = readdir("./");

    if (files.includes("package-lock.json")) {
      this.manage = "npx";
    } else if (files.includes("yarn.lock")) {
      this.manage = "yarn add";
    } else if (files.includes(".yarn")) {
      this.manage = "yarn dlx";
    }
  }

  async execute() {
    if (!this.argv.overwrite && this.overwriteTrigger) {
      const choices = new CreateChoice(["Yes", "No"]);
      const agree = await choices.get<"yes" | "no">(QUESTION.OVERWRITE);

      switch (agree) {
        case "yes":
          this.options += "--overwrite";
          break;
        case "no":
          process.exit();
        default:
          break;
      }
    }

    const cli = `${this.manage} shadcn-ui@latest add ${this.answer} ${this.options}`;
    log({ color: "green", msg: cli });
    exec(cli, output);
  }

  async init() {
    this.setOptions();
    this.setPackageName();
  }
}

export const start = async (argv: ProcessArgv) => {
  const CLI = new ShadcnCLI(argv);

  try {
    await CLI.question().then(() => CLI.execute());
  } catch (e) {
    console.error("Canceled");
  }
};
