import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash'
import { AbsoluteBox, Box, FlexBox } from '@/styled_components/base'
import VideoCanvas from './VideoCanvas'
import VideoURL from '/assets/videos/big_buck_bunny.mp4'
import Subtitles from './subtitles.json'
import VideoStore from './videoStore'
import useDraggable from './useDraggable'

const FFmpeg = () => {
  const [videoStore] = useState(() => new VideoStore())
  const imageFrameRef = useRef<FlexBox>(null)
  const rightRef = useRef(null)
  const leftRef = useRef<AbsoluteBox>(null)

  useEffect(() => {
    const video = document.createElement('video')
    video.src = VideoURL
    videoStore.getVideoDuration(video).then(duration => {
      videoStore.getFrameImageBy(duration, video)

      console.log({ current: imageFrameRef.current })
    })

    return () => {}
  }, [])

  const onStartTimeMove = useDraggable(
    useCallback(
      (newLeft: number) => {
        if (newLeft < 0) {
          newLeft = 0
        }
        const rightEdge =
          videoStore.totalImageFrameWidth -
          (leftRef.current as unknown as HTMLDivElement).offsetWidth
        if (newLeft > rightEdge) {
          newLeft = rightEdge
        }
        ;(leftRef.current as unknown as HTMLDivElement).style.left = `${newLeft}px`
        videoStore.setLeftMaskWidth(newLeft)
        videoStore.moveStartTime(newLeft)
      },
      [videoStore, leftRef]
    )
  )

  const onEndTimeMove = useDraggable(
    useCallback(
      (newLeft: number) => {
        const thumb = rightRef.current as unknown as HTMLDivElement

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
      },
      [videoStore, rightRef]
    )
  )

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
              onMouseDown={e => {
                onStartTimeMove(
                  e,
                  leftRef.current as unknown as HTMLDivElement,
                  imageFrameRef.current as unknown as HTMLDivElement
                )
              }}
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
              onMouseDown={e => {
                onEndTimeMove(
                  e,
                  rightRef.current as unknown as HTMLDivElement,
                  imageFrameRef.current as unknown as HTMLDivElement
                )
              }}
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
