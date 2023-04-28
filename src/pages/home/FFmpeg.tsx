import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Box, FlexBox } from '@/styled_components/base'
import VideoUrl from '/assets/videos/big_buck_bunny.mp4'
import VideoStore from './videoStore'

const FFmpeg = () => {
  const [videoStore] = useState(() => new VideoStore())

  useEffect(() => {
    videoStore.loadFFmpeg().then(() => {
      const video = document.createElement('video')
      video.src = VideoUrl
      videoStore.getVideoDuration(video).then(duration => {
        console.log('duration: ', duration)
        videoStore.getFrameImage(duration, VideoUrl)
      })
    })

    return () => {
      videoStore.exitFFmpeg()
    }
  }, [])

  return (
    <Box>
      <h1>主页</h1>
      <main>
        <section>
          <FlexBox flexWrap="wrap" justifyContent={'flex-start'}>
            {videoStore.images.map((imageUrl, idx) => {
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

export default observer(FFmpeg)
