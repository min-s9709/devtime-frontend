// Next는 *.module.css만 앰비언트 선언하고 일반 *.css는 선언하지 않는다.
// 그래서 globals.css 같은 부수 효과 전용 임포트가 최신 TypeScript에서
// TS2882로 잡힌다. 이 프로젝트는 Tailwind만 쓰고 CSS 모듈을 쓰지 않으므로
// 넓은 패턴으로 선언해도 충돌하지 않는다.
declare module "*.css";
