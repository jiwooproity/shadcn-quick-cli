# shadcn-simple-cli

This shadcn-simple-cli is a CLI interface library for using installations shadcn-ui components easily and simply.

![스크린샷 2024-08-04 오전 12 53 23](https://github.com/user-attachments/assets/be746bb1-d40a-4a8c-8304-5e678bf0aa65)

![스크린샷 2024-08-04 오전 12 55 10](https://github.com/user-attachments/assets/f6f4a3e8-658c-471c-b24b-63461493babc)

## Installation

You need to init shadcn-ui before installation shadcn-simple-cli [[shadcn-ui installation](https://ui.shadcn.com/docs/installation)]

| npm                        | yarn                          | global                     |
| -------------------------- | ----------------------------- | -------------------------- |
| npm i -D shadcn-simple-cli | yarn add -D shadcn-simple-cli | npm i -g shadcn-simple-cli |

## Options

| tag                        | description                                             |
| -------------------------- | ------------------------------------------------------- |
| -v, --version              | output the current version                              |
| -t, --target \<component\> | directly select to shadcn-ui component                  |
| -s, --select               | get component list for select                           |
| -o, --overwrite            | overwrite the existing component and download a new one |
| -h, --help                 | output all commands and guide                           |
| -d, --docs                 | link to shadcn/ui document                              |

## Usage

#### If you added library in project

```
npm i -D shadcn-simple-cli
npx shad -s
```

#### If you added global ( select or target )

```
npm i -g shadcn-simple-cli
shad -s
```

```
npm i -g shadcn-simple-cli
shad -t button
```

## Overwrite

Use overwrite option

```
shad -s -o
```

```
shad -t button -o
```

## Used Library

| package name     | source                                   |
| ---------------- | ---------------------------------------- |
| shadcn-ui        | https://github.com/shadcn-ui/ui          |
| @inquirer/select | https://github.com/SBoudrias/Inquirer.js |
| axios            | https://github.com/axios/axios           |
| cheerio          | https://github.com/cheeriojs/cheerio     |
| chalk            | https://github.com/chalk/chalk           |
| commander        | https://github.com/tj/commander.js       |
| dotenv           | https://github.com/motdotla/dotenv       |
