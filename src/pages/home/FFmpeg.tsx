import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash'
import { AbsoluteBox, Box, FlexBox } from '@/styled_components/base'
import VideoCanvas from './VideoCanvas'
import VideoURL from '/assets/videos/big_buck_bunny.mp4'
import Subtitles from './subtitles.json'
import VideoStore from './videoStore'

const FFmpeg = () => {
  const [videoStore] = useState(() => new VideoStore())
  const imageFrameRef = useRef(null)
  const rightRef = useRef(null)
  const leftRef = useRef(null)

  useEffect(() => {
    const video = document.createElement('video')
    video.src = VideoURL
    videoStore.getVideoDuration(video).then(duration => {
      videoStore.getFrameImageBy(duration, video)

      console.log({ current: imageFrameRef.current })
    })

    return () => {}
  }, [])

  const onStartTimeMove = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const thumb = leftRef.current as unknown as HTMLElement
    const slider = imageFrameRef.current as unknown as HTMLElement
    event.preventDefault()

    // 记录鼠标相对于元素的偏移量
    const shiftX = event.clientX - thumb.getBoundingClientRect().left
    // 因为拖动只会水平移动，所以不需要记录 shiftY

    // 添加鼠标移动和释放事件监听器
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    // 当鼠标移动时
    function onMouseMove(ev: MouseEvent) {
      // 计算元素新的左偏移量
      let newLeft = ev.clientX - shiftX - slider.getBoundingClientRect().left

      // 如果元素已经超出了左边界，则将其锁定在边界上
      if (newLeft < 0) {
        newLeft = 0
      }
      // 如果元素已经超出了右边界，则将其锁定在边界上
      const rightEdge = videoStore.totalImageFrameWidth - thumb.offsetWidth
      if (newLeft > rightEdge) {
        newLeft = rightEdge
      }

      // 设置元素的新位置
      ;(leftRef.current as unknown as HTMLElement).style.left = `${newLeft}px`
      videoStore.setLeftMaskWidth(newLeft)
      videoStore.moveStartTime(newLeft)
    }

    // 当鼠标释放时
    function onMouseUp() {
      // 移除鼠标移动和释放事件监听器
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }

  const onEndTimeMove = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const thumb = rightRef.current as unknown as HTMLElement
    const slider = imageFrameRef.current as unknown as HTMLElement
    event.preventDefault()

    // 记录鼠标相对于元素的偏移量
    const shiftX = event.clientX - thumb.getBoundingClientRect().left
    // 因为拖动只会水平移动，所以不需要记录 shiftY

    // 添加鼠标移动和释放事件监听器
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    // 当鼠标移动时
    function onMouseMove(ev: MouseEvent) {
      console.log('ev: ', ev)
      // 计算元素新的左偏移量
      let newLeft = ev.clientX - shiftX - slider.getBoundingClientRect().left

      // 如果元素已经超出了左边界，则将其锁定在边界上
      if (newLeft < 0) {
        newLeft = 0
      }
      // 如果元素已经超出了右边界，则将其锁定在边界上
      const rightEdge = videoStore.totalImageFrameWidth - thumb.offsetWidth
      if (newLeft > rightEdge) {
        newLeft = rightEdge
      }

      // 设置元素的新位置
      ;(rightRef.current as unknown as HTMLElement).style.left = `${newLeft}px`
      videoStore.setVideoImageFrameWidth(newLeft)
      videoStore.moveEndTime(newLeft + thumb.offsetWidth)
    }

    // 当鼠标释放时
    function onMouseUp() {
      // 移除鼠标移动和释放事件监听器
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }
  return (
    <Box>
      <main>
        <section>
          <VideoCanvas
            startTime={videoStore.startTime}
            src={VideoURL}
            subtitles={Subtitles as any}
            endTime={videoStore.endTime}
          />
          <ul>
            <li>时长：{_.ceil(videoStore.duration, 3)}</li>
            <li>开始时间：{videoStore.startTime}</li>
            <li>结束时间：{_.ceil(videoStore.endTime, 3)}</li>
          </ul>
        </section>
        <Box overflowX="auto">
          <FlexBox justifyContent={'flex-start'} ref={imageFrameRef} height="50px">
            <AbsoluteBox
              onMouseDown={onStartTimeMove}
              cursor="col-resize"
              onDragStart={() => false}
              ref={leftRef}
              zIndex={10}
              backgroundColor={'blue'}
              width={'10px'}
              height={'100%'}
            ></AbsoluteBox>
            <AbsoluteBox
              width={`${videoStore.leftMakWidth}px`}
              zIndex={2}
              overflowX="hidden"
              filter={'grayscale(1)'}
            >
              <FlexBox
                justifyContent="flex-start"
                width={`${videoStore.totalImageFrameWidth}px`}
                filter={'grayscale(1)'}
              >
                {videoStore.images.map((imageUrl, idx) => {
                  return (
                    <Box key={idx}>
                      <img src={imageUrl} width={'80px'}></img>
                    </Box>
                  )
                })}
              </FlexBox>
            </AbsoluteBox>
            <AbsoluteBox
              width={`${videoStore.videoImageFrameWidth}px`}
              zIndex={1}
              overflowX="hidden"
            >
              <FlexBox width={`${videoStore.totalImageFrameWidth}px`} justifyContent="flex-start">
                {videoStore.images.map((imageUrl, idx) => {
                  return (
                    <Box key={idx}>
                      <img src={imageUrl} width={'80px'}></img>
                    </Box>
                  )
                })}
              </FlexBox>
            </AbsoluteBox>
            <FlexBox
              width={`${videoStore.totalImageFrameWidth}px`}
              height={'100%'}
              filter={'grayscale(1)'}
            >
              {videoStore.images.map((imageUrl, idx) => {
                return (
                  <Box key={idx}>
                    <img src={imageUrl} width={`${videoStore.imageFrameWidth}px`}></img>
                  </Box>
                )
              })}
            </FlexBox>
            <AbsoluteBox
              left={`${videoStore.totalImageFrameWidth - 10}px`}
              cursor="col-resize"
              onMouseDown={onEndTimeMove}
              onDragStart={() => false}
              ref={rightRef}
              zIndex={10}
              backgroundColor={'blue'}
              width={'10px'}
              height={'100%'}
            ></AbsoluteBox>
          </FlexBox>
        </Box>
      </main>
    </Box>
  )
}

export default observer(FFmpeg)
