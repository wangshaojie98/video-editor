import { makeAutoObservable, runInAction } from 'mobx'
import _ from 'lodash'

class VideoStore {
  images: Array<string> = []
  duration = 0
  startTime = 0
  endTime = 0
  curTime = 0
  imageFrameInterval = 2
  imageFrameWidth = 80
  totalImageFrameWidth = 0
  videoImageFrameWidth = 0
  leftMakWidth = 0
  second2Px = 0

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  async getVideoDuration(video: HTMLVideoElement) {
    const res = await new Promise<number>(resolve => {
      video.onloadedmetadata = () => {
        resolve(video.duration)
      }
    })

    return res
  }

  async getFrameImageBy(duration: number, video: HTMLVideoElement) {
    const scale = 0.5 // 图像缩放比例
    const interval = this.imageFrameInterval // 时间间隔，单位：秒

    let currentTime = 0 // 当前时间点，单位：秒
    const res: Array<string> = []

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    while (currentTime < duration) {
      // 设置视频的当前时间
      video.currentTime = currentTime

      // 等待视频帧就绪
      await new Promise<void>(resolve => {
        video.onseeked = () => {
          resolve()
        }
      })

      // 根据缩放比例调整 canvas 大小
      canvas.width = video.videoWidth * scale
      canvas.height = video.videoHeight * scale

      // 在 canvas 上绘制视频帧
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 从 canvas 导出图片
      const imageUrl = canvas.toDataURL('image/jpeg')
      res.push(imageUrl)

      currentTime += interval
    }

    runInAction(() => {
      this.images = res
      console.log(this.images.length)
      this.totalImageFrameWidth = this.imageFrameWidth * this.images.length
      this.videoImageFrameWidth = this.totalImageFrameWidth
      this.duration = duration
      this.endTime = this.duration
      this.second2Px = this.duration / this.totalImageFrameWidth
    })
  }

  setVideoImageFrameWidth(width: number) {
    this.videoImageFrameWidth = width
  }

  setLeftMaskWidth(width: number) {
    this.leftMakWidth = width
  }

  play(video: HTMLVideoElement) {
    video.currentTime = this.curTime
    video.play()
  }

  moveStartTime(px: number) {
    this.startTime = _.ceil(this.second2Px * px, 3)
  }

  moveEndTime(px: number) {
    this.endTime = _.ceil(this.second2Px * px, 3)
  }
}

export default VideoStore
