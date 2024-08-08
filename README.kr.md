# shadcn-simple-cli

shadcn-simple-cli는 shadcn-ui 컴포넌트를 쉽고 간단하게 설치할 수 있도록 도와주는 CLI 라이브러리입니다.

![스크린샷 2024-08-04 오전 12 53 23](https://github.com/user-attachments/assets/be746bb1-d40a-4a8c-8304-5e678bf0aa65)

![스크린샷 2024-08-04 오전 12 55 10](https://github.com/user-attachments/assets/f6f4a3e8-658c-471c-b24b-63461493babc)

## 설치 방법

shadcn-simple-cli를 설치하기 전에 shadcn-ui 초기 설정이 필요합니다. [[shadcn-ui installation](https://ui.shadcn.com/docs/installation)]

| npm                        | yarn                          | global                     |
| -------------------------- | ----------------------------- | -------------------------- |
| npm i -D shadcn-simple-cli | yarn add -D shadcn-simple-cli | npm i -g shadcn-simple-cli |

## 옵션

| 태그                      | 설명                                           |
| ------------------------- | ---------------------------------------------- |
| -v, --version             | 버전 정보를 표시합니다.                        |
| -t, --target \<컴포넌트\> | 설치할 shadcn-ui 컴포넌트를 직접 선택합니다.   |
| -s, --select              | 선택할 컴포넌트 리스트를 제공합니다.           |
| -o, --overwrite           | 이미 존재하는 컴포넌트를 덮어씌울 수 있습니다. |
| -h, --help                | 모든 명령어 옵션과 가이드를 제공합니다.        |
| -d, --docs                | shadcn/ui 문서로 이동합니다.                   |

## 사용 방법

#### 프로젝트 안에 라이브러리를 추가하려면

```
npm i -D shadcn-simple-cli
```

```
npx shad -s
```

#### 글로벌로 설치한다면 ( 선택 혹은 직접입력 )

```
npm i -g shadcn-simple-cli
```

```
shad -s
```

```
shad -t button
```

## 덮어씌우기

덮어씌우기 옵션 사용

```
shad -s -o
```

```
shad -t button -o
```

## 사용된 라이브러리

| 패키지명           | 소스                                      |
| ---------------- | ---------------------------------------- |
| shadcn-ui        | https://github.com/shadcn-ui/ui          |
| @inquirer/select | https://github.com/SBoudrias/Inquirer.js |
| axios            | https://github.com/axios/axios           |
| cheerio          | https://github.com/cheeriojs/cheerio     |
| chalk            | https://github.com/chalk/chalk           |
| commander        | https://github.com/tj/commander.js       |
| dotenv           | https://github.com/motdotla/dotenv       |
