declare module '@mediapipe/face_detection' {
  export class FaceDetection {
    constructor(options: { locateFile: (file: string) => string });
  }
}

declare module '@mediapipe/camera_utils' {
  export class Camera {
    constructor(options: any);
  }
}