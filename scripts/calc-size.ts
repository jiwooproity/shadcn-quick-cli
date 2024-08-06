import { exec } from "child_process";
import { readdirSync, stat, Stats } from "fs";

class NowDate {
  private date: string;

  constructor() {
    this.date = this.convert(new Date());
  }

  convert(date: Date) {
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDay()}`;
  }

  get() {
    return this.date;
  }
}

const calcSize = (size: number) => {
  const text = ["bytes", "kB", "MB"];
  const e = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, e)).toFixed(2) + " " + text[e];
};

const getStats = async (path: string): Promise<Stats> => {
  return new Promise((resolve) => stat(path, (_, stats) => resolve(stats)));
};

const getFileSize = async (path: string) => {
  const files = readdirSync(path);
  const filesInfo = await Promise.all(files.map((file) => getStats(`${path}/${file}`)));
  const sizes = filesInfo.map((file) => file.size);
  return calcSize(sizes.reduce((prev, curr) => prev + curr, 0));
};

(async () => {
  const size = await getFileSize("./build");
  exec(`echo "${new NowDate().get()}: ${size} " >> ./logs/size-log.txt`);
})();
