import { Button } from 'antd'
import _ from 'lodash'
import React, { useRef, useEffect, useState } from 'react'

type VideoCanvasProps = {
  src: string
  subtitles: {
    startTime: number
    endTime: number
    text: string
  }[]
  startTime: number
  endTime: number
  aspectRatio?: number
}
const VideoCanvas = ({
  src,
  subtitles,
  endTime,
  startTime,
  aspectRatio = 16 / 9
}: VideoCanvasProps) => {
  console.log('subtitles: ', subtitles)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    const canvasElement = canvasRef.current
    if (!videoElement || !canvasElement) return

    const ctx = canvasElement.getContext('2d')
    const updateCanvasSize = () => {
      const width = canvasElement.clientWidth * devicePixelRatio
      const height = canvasElement.clientHeight * devicePixelRatio
      canvasElement.width = width
      canvasElement.height = height
      // 重新绘制视频帧
      ctx?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)
    }
    const drawVideoFrame = () => {
      if (videoElement.paused || videoElement.ended) return
      ctx?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)
      displaySubtitle()
      requestAnimationFrame(drawVideoFrame)
    }

    // 添加 resize 事件监听器
    const handleTimeUpdate = () => {
      if (videoElement.currentTime >= endTime) {
        videoElement.pause()
      } else {
        drawVideoFrame()
      }
    }

    updateCanvasSize() // 初始化时更新 Canvas 大小
    window.addEventListener('resize', updateCanvasSize)
    videoElement.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate)
      window.removeEventListener('resize', updateCanvasSize) // 移除 resize 事件监听器
    }
  }, [endTime])

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime
    }
    videoRef.current?.play()
    console.log('videoRef.current: ', videoRef.current)
    setIsPlaying(true)
  }

  const handlePause = () => {
    videoRef.current?.pause()
    setIsPlaying(false)
  }

  const handleContinue = () => {
    videoRef.current?.play()
    setIsPlaying(true)
  }

  const handleFirstFrame = async () => {
    const canvasElement = canvasRef.current
    const videoElement = videoRef.current

    if (!videoElement || !canvasElement) return
    // NOTE 为了解决上个load请求未完成情况，每次调用之前暂停视频，
    videoElement.pause()

    const ctx = canvasElement.getContext('2d')
    videoElement.addEventListener('loadedmetadata', () => {
      // 设置视频时间为 startTime
      videoElement.currentTime = startTime
    })

    videoElement.addEventListener('seeked', () => {
      console.log('seeked: ')
      // 将视频的当前帧绘制到 Canvas 上
      ctx?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)
      displaySubtitle()
    })

    videoElement.load()
  }

  useEffect(() => {
    _.throttle(handleFirstFrame, 200)()
  }, [src, startTime])

  const getSecondFromTimeString = (timeString: string | number) => {
    const milliseconds = Date.parse(`1970-01-01T${timeString}Z`)
    return _.ceil(milliseconds / 1000, 3)
  }
  const displaySubtitle = () => {
    console.log('displaySubtitle: ')
    const canvasElement = canvasRef.current
    const videoElement = videoRef.current

    if (!videoElement || !canvasElement) return

    const ctx = canvasElement.getContext('2d')
    const currentTime = videoElement.currentTime
    console.log('currentTime: ', currentTime)
    const currentSubtitle = subtitles.find(
      subtitle =>
        currentTime >= getSecondFromTimeString(subtitle.startTime) &&
        currentTime <= getSecondFromTimeString(subtitle.endTime)
    )
    console.log('currentSubtitle: ', currentSubtitle)

    if (currentSubtitle && ctx) {
      ctx.fillStyle = 'white'
      ctx.font = '16px Arial'
      ctx.fillText(currentSubtitle.text, 100, canvasElement.height - 50)
    }
  }

  return (
    <div>
      <video ref={videoRef} width="100%" style={{ display: 'none' }}>
        Your browser does not support the video tag.
        <source src={src} type="video/mp4" />
      </video>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: `calc(100vw / ${aspectRatio})`
        }}
      ></canvas>
      <div>
        <Button onClick={handlePlay}>play</Button>
        <Button onClick={handleContinue} disabled={isPlaying}>
          Continue
        </Button>
        <Button onClick={handlePause}>pause</Button>
      </div>
    </div>
  )
}

export default VideoCanvas
