import { makeAutoObservable, runInAction } from 'mobx'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

class VideoStore {
  images: Array<string> = []
  isFFmpegLoaded = false
  ffmpeg = createFFmpeg({ log: false })
  duration = 0

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  async loadFFmpeg() {
    await this.ffmpeg.load()
    runInAction(() => {
      this.isFFmpegLoaded = true
    })
  }

  exitFFmpeg() {
    this.ffmpeg.exit()
  }

  async getVideoDuration(video: HTMLVideoElement) {
    const res = await new Promise<number>(resolve => {
      video.onloadedmetadata = () => {
        resolve(video.duration)
      }
    })

    return res
  }

  fileExists(filename: string) {
    try {
      const files = this.ffmpeg.FS('readdir', '/')
      return files.includes(filename)
    } catch (error) {
      console.error('Error reading directory:', error)
      return false
    }
  }

  async getFrameImage(duration: number, videoURL: string) {
    console.log('duration: ', duration)
    const scale = 0.5 // 图像缩放比例
    const interval = 10 // 时间间隔，单位：秒

    const ffmpeg = this.ffmpeg
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoURL))

    let currentTime = 0 // 当前时间点，单位：秒
    const res: Array<string> = []
    while (currentTime < duration) {
      const outputFilename = `output_${currentTime}.jpg`
      await ffmpeg.run(
        '-ss',
        currentTime.toString(),
        '-i',
        'input.mp4',
        '-vf',
        `scale=iw*${scale}:ih*${scale}`,
        '-frames:v',
        '1',
        outputFilename
      )

      if (this.fileExists(outputFilename)) {
        const data = ffmpeg.FS('readFile', outputFilename)
        const imageUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'image/jpeg' }))
        res.push(imageUrl)

        // 删除临时输出文件
        ffmpeg.FS('unlink', outputFilename)
      }

      currentTime += interval
    }

    runInAction(() => {
      this.images = res
    })
  }
}

export default VideoStore
