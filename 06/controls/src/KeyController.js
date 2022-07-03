// key control 모듈 생성
export class KeyController {
  constructor() {
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      console.log(e.code + "누름");
      this.keys[e.code] = true;
    }); // 추가

    window.addEventListener("keyup", (e) => {
      console.log(e.code + "뗌");
      delete this.keys[e.code];
    }); // 화살표 키를 뗐을 때 제거
  }
}
