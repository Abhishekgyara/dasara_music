declare module '@vladmandic/face-api' {
  export const nets: {
    tinyFaceDetector: {
      loadFromUri: (path: string) => Promise<void>;
    };
    faceExpressionNet: {
      loadFromUri: (path: string) => Promise<void>;
    };
    faceLandmark68Net: {
      loadFromUri: (path: string) => Promise<void>;
    };
  };
}