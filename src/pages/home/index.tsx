/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { useEffect, useState } from 'react'
import { Box, FlexBox } from '@/styled_components/base'

import VideoUrl from '/assets/videos/big_buck_bunny.mp4'
console.log('VideoUrl: ', VideoUrl)

const Demo = () => {
  const [images, setImages] = useState<Array<string>>([])
  useEffect(() => {
    console.log('demo init')
  }, [])

  const getFrameImage = () => {
    const video = document.getElementById('my-video') as HTMLVideoElement
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    const context = canvas.getContext('2d')
    const scale = 0.5 // 图像缩放比例
    // const interval = 1000 * 10 // 时间间隔，单位：毫秒
    let currentTime = 0 // 当前时间点，单位：秒
    video.addEventListener('loadedmetadata', function () {
      canvas.width = video.videoWidth * scale
      canvas.height = video.videoHeight * scale
      const timer = setInterval(function () {
        video.currentTime = currentTime
        video.addEventListener(
          'seeked',
          function () {
            context?.drawImage(video, 0, 0, canvas.width, canvas.height)
            const img = canvas.toDataURL()

            setImages(it => [...it, img])
            currentTime += 10
            console.log('currentTime: ', currentTime)
            if (currentTime >= video.duration) {
              console.log('video.duration: ', video.duration)
              clearInterval(timer)
            }
          },
          { once: true }
        )
      }, 200)
    })
    video.load()
  }

  useEffect(() => {
    getFrameImage()
  }, [])
  return (
    <Box>
      <h1>主页</h1>
      <main>
        <section>
          <video width="320" height="240" controls id="my-video" style={{ display: 'none' }}>
            <source src={VideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </section>

        <section>
          <FlexBox flexWrap="wrap" justifyContent={'flex-start'}>
            {images.map((imageUrl, idx) => {
              return (
                <Box key={idx}>
                  <img src={imageUrl}></img>
                </Box>
              )
            })}
          </FlexBox>
        </section>
      </main>
    </Box>
  )
}

export default Demo
