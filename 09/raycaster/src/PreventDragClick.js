export class PreventDragClick {
  constructor(elem) {
    this.isMouseMovedOverPixels; // 내부 속성으로

    let clickStartX;
    let clickStartY;
    let clickStartTime;

    elem.addEventListener("mousedown", (e) => {
      clickStartX = e.clientX;
      clickStartY = e.clientY;

      clickStartTime = Date.now();
    });

    // * 마우스 클릭 떼었을 때
    elem.addEventListener("mouseup", (e) => {
      const distanceX = Math.abs(e.clientX - clickStartX);
      const distanceY = Math.abs(e.clientY - clickStartY);

      const elapsedTimeGap = Date.now() - clickStartTime;

      if (distanceX > 20 || distanceY > 20 || elapsedTimeGap > 1000) {
        this.isMouseMovedOverPixels = true;
      } else {
        this.isMouseMovedOverPixels = false;
      }
    });
  }
}
