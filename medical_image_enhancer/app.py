from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

def calculate_metrics(original, enhanced):
    """Calculate image quality metrics"""
    # Calculate contrast (standard deviation)
    original_contrast = np.std(original)
    enhanced_contrast = np.std(enhanced)
    
    # Calculate sharpness (Laplacian variance)
    original_sharpness = cv2.Laplacian(original, cv2.CV_64F).var()
    enhanced_sharpness = cv2.Laplacian(enhanced, cv2.CV_64F).var()
    
    # Calculate entropy (information content)
    hist_original, _ = np.histogram(original, bins=256, range=(0, 256))
    hist_enhanced, _ = np.histogram(enhanced, bins=256, range=(0, 256))
    
    hist_original = hist_original[hist_original > 0] / hist_original.sum()
    hist_enhanced = hist_enhanced[hist_enhanced > 0] / hist_enhanced.sum()
    
    original_entropy = -np.sum(hist_original * np.log2(hist_original))
    enhanced_entropy = -np.sum(hist_enhanced * np.log2(hist_enhanced))
    
    return {
        'contrast_original': float(original_contrast),
        'contrast_enhanced': float(enhanced_contrast),
        'contrast_improvement': float((enhanced_contrast - original_contrast) / original_contrast * 100),
        'sharpness_original': float(original_sharpness),
        'sharpness_enhanced': float(enhanced_sharpness),
        'sharpness_improvement': float((enhanced_sharpness - original_sharpness) / original_sharpness * 100),
        'entropy_original': float(original_entropy),
        'entropy_enhanced': float(enhanced_entropy),
        'entropy_improvement': float((enhanced_entropy - original_entropy) / original_entropy * 100)
    }

def enhance_clahe(gray_image, clip_limit=2.0, tile_size=8):
    """CLAHE - Contrast Limited Adaptive Histogram Equalization"""
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(tile_size, tile_size))
    return clahe.apply(gray_image)

def enhance_histogram_equalization(gray_image):
    """Standard Histogram Equalization"""
    return cv2.equalizeHist(gray_image)

def enhance_unsharp_mask(gray_image, amount=1.5, radius=1.0):
    """Unsharp Masking for edge enhancement"""
    blurred = cv2.GaussianBlur(gray_image, (0, 0), radius)
    unsharp = cv2.addWeighted(gray_image, 1.0 + amount, blurred, -amount, 0)
    return np.clip(unsharp, 0, 255).astype(np.uint8)

def enhance_adaptive_threshold(gray_image):
    """Adaptive Thresholding with Gaussian"""
    # First enhance contrast
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray_image)
    return enhanced

def enhance_bilateral_filter(gray_image, d=9, sigma_color=75, sigma_space=75):
    """Bilateral Filter - preserves edges while smoothing"""
    filtered = cv2.bilateralFilter(gray_image, d, sigma_color, sigma_space)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    return clahe.apply(filtered)

def enhance_morphological(gray_image):
    """Morphological operations for enhancement"""
    # Top-hat transform to enhance bright features
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    tophat = cv2.morphologyEx(gray_image, cv2.MORPH_TOPHAT, kernel)
    enhanced = cv2.add(gray_image, tophat)
    
    # Apply CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    return clahe.apply(enhanced)

def enhance_gamma_correction(gray_image, gamma=1.5):
    """Gamma Correction"""
    inv_gamma = 1.0 / gamma
    table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in range(256)]).astype("uint8")
    return cv2.LUT(gray_image, table)

@app.route('/enhance', methods=['POST'])
def enhance_image():
    try:
        data = request.json
        image_data = data['image']
        algorithm = data.get('algorithm', 'clahe')
        clip_limit = float(data.get('clipLimit', 2.0))
        tile_size = int(data.get('tileSize', 8))
        
        # Decode the base64 image
        header, encoded = image_data.split(",", 1)
        binary_data = base64.b64decode(encoded)
        
        # Convert to an image that OpenCV can use
        image = Image.open(io.BytesIO(binary_data))
        image_np = np.array(image)
        
        # Handle different image formats
        if len(image_np.shape) == 2:
            gray_image = image_np
        elif image_np.shape[2] == 4:
            image_np = cv2.cvtColor(image_np, cv2.COLOR_RGBA2RGB)
            gray_image = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        elif image_np.shape[2] == 3:
            gray_image = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        else:
            return jsonify({'error': 'Unsupported image format'}), 400
        
        # Apply selected enhancement algorithm
        if algorithm == 'clahe':
            enhanced_image = enhance_clahe(gray_image, clip_limit, tile_size)
        elif algorithm == 'histogram':
            enhanced_image = enhance_histogram_equalization(gray_image)
        elif algorithm == 'unsharp':
            enhanced_image = enhance_unsharp_mask(gray_image)
        elif algorithm == 'bilateral':
            enhanced_image = enhance_bilateral_filter(gray_image)
        elif algorithm == 'morphological':
            enhanced_image = enhance_morphological(gray_image)
        elif algorithm == 'gamma':
            enhanced_image = enhance_gamma_correction(gray_image)
        else:
            enhanced_image = enhance_clahe(gray_image, clip_limit, tile_size)
        
        # Calculate metrics
        metrics = calculate_metrics(gray_image, enhanced_image)
        
        # Convert back to a format that can be sent in the response
        enhanced_image_pil = Image.fromarray(enhanced_image)
        buff = io.BytesIO()
        enhanced_image_pil.save(buff, format="PNG")
        enhanced_image_b64 = base64.b64encode(buff.getvalue()).decode("utf-8")
        
        print(f"Image enhanced successfully using {algorithm}")
        return jsonify({
            'enhanced_image': 'data:image/png;base64,' + enhanced_image_b64,
            'metrics': metrics,
            'algorithm': algorithm
        })
    
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)