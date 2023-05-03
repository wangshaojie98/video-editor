// useDraggable.ts
import { useCallback } from 'react'
const useDraggable = (onDrag: (newLeft: number) => void) => {
  const onMouseMove = useCallback(
    (event: MouseEvent, shiftX: number, slider: HTMLDivElement) => {
      const newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left
      onDrag(newLeft)
    },
    [onDrag]
  )

  const onMouseDown = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      thumb: HTMLDivElement,
      slider: HTMLDivElement
    ) => {
      event.preventDefault()

      const shiftX = event.clientX - thumb.getBoundingClientRect().left

      const onMouseMoveWrapper = (ev: MouseEvent) => {
        onMouseMove(ev, shiftX, slider)
      }

      const onMouseUp = () => {
        document.removeEventListener('mouseup', onMouseUp)
        document.removeEventListener('mousemove', onMouseMoveWrapper)
      }

      document.addEventListener('mousemove', onMouseMoveWrapper)
      document.addEventListener('mouseup', onMouseUp)
    },
    [onMouseMove]
  )

  return onMouseDown
}

export default useDraggable

// const onStartTimeMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//   const thumb = leftRef.current as unknown as HTMLDivElement
//   const slider = imageFrameRef.current as unknown as HTMLDivElement
//   event.preventDefault()

//   // 记录鼠标相对于元素的偏移量
//   const shiftX = event.clientX - thumb.getBoundingClientRect().left
//   // 因为拖动只会水平移动，所以不需要记录 shiftY

//   // 添加鼠标移动和释放事件监听器
//   document.addEventListener('mousemove', onMouseMove)
//   document.addEventListener('mouseup', onMouseUp)

//   // 当鼠标移动时
//   function onMouseMove(ev: MouseEvent) {
//     // 计算元素新的左偏移量
//     let newLeft = ev.clientX - shiftX - slider.getBoundingClientRect().left

//     // 如果元素已经超出了左边界，则将其锁定在边界上
//     if (newLeft < 0) {
//       newLeft = 0
//     }
//     // 如果元素已经超出了右边界，则将其锁定在边界上
//     const rightEdge = videoStore.totalImageFrameWidth - thumb.offsetWidth
//     if (newLeft > rightEdge) {
//       newLeft = rightEdge
//     }

//     // 设置元素的新位置
//     ;(leftRef.current as unknown as HTMLDivElement).style.left = `${newLeft}px`
//     videoStore.setLeftMaskWidth(newLeft)
//     videoStore.moveStartTime(newLeft)
//   }

//   // 当鼠标释放时
//   function onMouseUp() {
//     // 移除鼠标移动和释放事件监听器
//     document.removeEventListener('mouseup', onMouseUp)
//     document.removeEventListener('mousemove', onMouseMove)
//   }
// }

// const onEndTimeMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//   const thumb = rightRef.current as unknown as HTMLDivElement
//   const slider = imageFrameRef.current as unknown as HTMLDivElement
//   event.preventDefault()

//   // 记录鼠标相对于元素的偏移量
//   const shiftX = event.clientX - thumb.getBoundingClientRect().left
//   // 因为拖动只会水平移动，所以不需要记录 shiftY

//   // 添加鼠标移动和释放事件监听器
//   document.addEventListener('mousemove', onMouseMove)
//   document.addEventListener('mouseup', onMouseUp)

//   // 当鼠标移动时
//   function onMouseMove(ev: MouseEvent) {
//     console.log('ev: ', ev)
//     // 计算元素新的左偏移量
//     let newLeft = ev.clientX - shiftX - slider.getBoundingClientRect().left

//     // 如果元素已经超出了左边界，则将其锁定在边界上
//     if (newLeft < 0) {
//       newLeft = 0
//     }
//     // 如果元素已经超出了右边界，则将其锁定在边界上
//     const rightEdge = videoStore.totalImageFrameWidth - thumb.offsetWidth
//     if (newLeft > rightEdge) {
//       newLeft = rightEdge
//     }

//     // 设置元素的新位置
//     ;(rightRef.current as unknown as HTMLElement).style.left = `${newLeft}px`
//     videoStore.setVideoImageFrameWidth(newLeft)
//     videoStore.moveEndTime(newLeft + thumb.offsetWidth)
//   }

//   // 当鼠标释放时
//   function onMouseUp() {
//     // 移除鼠标移动和释放事件监听器
//     document.removeEventListener('mouseup', onMouseUp)
//     document.removeEventListener('mousemove', onMouseMove)
//   }
// }
