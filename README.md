# 🧩 typescript-module

TypeScript를 사용한 모듈을 쉽게 만들기 위한 템플릿 레포지토리.  

- Bot App: [`메신저봇R`](https://github.com/MessengerBotTeam/msgbot-old-release/releases/tag/0.7.36a) (0.7.36a 버전 이상)
- CI/CD: [`GitHub Actions`](https://github.com/features/actions)
- Module Bundler: [`Rollup`](https://rollupjs.org/)
- Test: [`Vitest`](https://vitest.dev/)
- Execute: [`TSX`](https://tsx.is/)
- Runtime: [`Node.js`](https://nodejs.org/en)

## 📜 features
- `npm run build:all-in-one`: `src` 폴더의 모든 소스를 하나의 `.js`, `.d.ts` 파일로 만들어 `dist/all`에 빌드
- `npm run build:no-all-in-one`: `src` 폴더의 각 파일들을 파일 구조를 유지한 채 `.js`, `.d.ts` 파일로 변환해 `dist/preserve`에 빌드
- `package.json`에 `version` 키가 변경된 채로 푸쉬하면 자동으로 해당 버전으로 릴리즈 생성. (`v1.0.0-alpha` 처럼 쓰면 prerelease로 설정됨)

> [!NOTE]
> `package.json` 에서 `directories` 키를 수정하여 빌드 타겟 변경 가능

## ✅ prepare
1. 레포지토리 설정에서 `GitHub Actions` 가 적절한 권한을 가지고 있는지 확인하세요.
    - `Settings > Actions > General` 로 이동합니다.
    - `Workflow permissions` 에서 `Read and write permissions` 를 선택하고 저장합니다.
2. `package.json` 파일을 열어 `name`, `version`, `description`, `author`, `license` 등의 필드를 적절히 수정합니다.
3. `npm install` 명령어를 실행하여 의존성 패키지를 설치합니다.
