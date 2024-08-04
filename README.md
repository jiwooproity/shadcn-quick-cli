# shadcn-quick-cli

This shadcn-quick-cli is a CLI interface library for using installations shadcn-ui components easily and simply.

![스크린샷 2024-08-04 오전 12 53 23](https://github.com/user-attachments/assets/be746bb1-d40a-4a8c-8304-5e678bf0aa65)

![스크린샷 2024-08-04 오전 12 55 10](https://github.com/user-attachments/assets/f6f4a3e8-658c-471c-b24b-63461493babc)

## Installation

| npm                       | yarn                         |
| ------------------------- | ---------------------------- |
| npm i -D shadcn-quick-cli | yarn add -D shadcn-quick-cli |

## Options

| tag                        | description                                             |
| -------------------------- | ------------------------------------------------------- |
| -v, --version              | output the current version                              |
| -t, --target \<component\> | directly select to shadcn-ui component                  |
| -s, --select               | get component list for select                           |
| -o, --overwrite            | overwrite the existing component and download a new one |
| -h, --help                 | output all commands and guide                           |

## Usage

#### If you added library in project

```
npm i -D shadcn-quick-cli
npx shad -s
```

#### If you added global ( select or target )

```
npm i -g shadcn-quick-cli
shad -s
```

```
npm i -g shadcn-quick-cli
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
