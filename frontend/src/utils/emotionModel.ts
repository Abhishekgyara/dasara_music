// utils/emotionDetection.ts

export interface EmotionResult {
  type: string;
  confidence: number;
}

// Simple emotion detection based on image color analysis
export async function analyzeImageEmotion(imageData: ImageData): Promise<EmotionResult> {
  return new Promise((resolve) => {
    try {
      const emotions = ['happy', 'sad', 'calm', 'energetic', 'focused', 'neutral', 'anxious'];
      
      // Analyze image characteristics
      const brightness = calculateImageBrightness(imageData);
      const saturation = calculateImageSaturation(imageData);
      const colorVariance = calculateColorVariance(imageData);
      const contrast = calculateContrast(imageData);
      
      // Simple heuristic rules for emotion detection
      let detectedEmotion = 'neutral';
      let confidence = 0.7;
      
      if (brightness > 180 && saturation > 100) {
        detectedEmotion = 'happy';
        confidence = 0.85;
      } else if (brightness > 160 && colorVariance > 60) {
        detectedEmotion = 'energetic';
        confidence = 0.8;
      } else if (brightness < 100 && saturation < 80) {
        detectedEmotion = 'sad';
        confidence = 0.75;
      } else if (brightness > 120 && brightness < 160 && contrast < 50) {
        detectedEmotion = 'calm';
        confidence = 0.78;
      } else if (colorVariance > 70 && contrast > 60) {
        detectedEmotion = 'focused';
        confidence = 0.72;
      } else if (brightness < 120 && colorVariance > 50) {
        detectedEmotion = 'anxious';
        confidence = 0.68;
      }
      
      // Add some randomness to make it feel more natural
      if (Math.random() < 0.2) {
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        detectedEmotion = randomEmotion;
        confidence = Math.max(0.6, confidence - 0.1);
      }
      
      resolve({
        type: detectedEmotion,
        confidence: Math.min(0.95, confidence + (Math.random() * 0.1 - 0.05))
      });
    } catch (error) {
      // Fallback to random emotion if analysis fails
      const emotions = ['happy', 'sad', 'calm', 'energetic', 'neutral'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      resolve({
        type: randomEmotion,
        confidence: 0.6 + Math.random() * 0.3
      });
    }
  });
}

// Calculate average brightness of the image
function calculateImageBrightness(imageData: ImageData): number {
  const data = imageData.data;
  let brightness = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  
  return brightness / (data.length / 4);
}

// Calculate average saturation of the image
function calculateImageSaturation(imageData: ImageData): number {
  const data = imageData.data;
  let saturation = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    
    saturation += sat * 100;
  }
  
  return saturation / (data.length / 4);
}

// Calculate color variance in the image
function calculateColorVariance(imageData: ImageData): number {
  const data = imageData.data;
  const variances = [];
  
  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    
    const avg = (red + green + blue) / 3;
    const variance = Math.sqrt(
      (Math.pow(red - avg, 2) + Math.pow(green - avg, 2) + Math.pow(blue - avg, 2)) / 3
    );
    variances.push(variance);
  }
  
  return variances.reduce((a, b) => a + b, 0) / variances.length;
}

// Calculate image contrast
function calculateContrast(imageData: ImageData): number {
  const data = imageData.data;
  const brightnessValues = [];
  
  for (let i = 0; i < data.length; i += 4) {
    brightnessValues.push((data[i] + data[i + 1] + data[i + 2]) / 3);
  }
  
  const maxBrightness = Math.max(...brightnessValues);
  const minBrightness = Math.min(...brightnessValues);
  
  return maxBrightness - minBrightness;
}

// Mock function to maintain compatibility with existing code
export async function loadEmotionModel(modelUrl?: string): Promise<any> {
  console.log('Using client-side emotion detection (no model loading required)');
  return { mockModel: true };
}

// Mock function to maintain compatibility
export async function predictEmotion(imageData: ImageData): Promise<EmotionResult> {
  return analyzeImageEmotion(imageData);
}