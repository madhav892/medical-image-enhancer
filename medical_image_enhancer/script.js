const imageUpload = document.getElementById('image-upload');
const originalImage = document.getElementById('original-image');
const enhancedImage = document.getElementById('enhanced-image');
const enhanceBtn = document.getElementById('enhance-btn');
const downloadBtn = document.getElementById('download-btn');
const originalPlaceholder = document.getElementById('original-placeholder');
const enhancedPlaceholder = document.getElementById('enhanced-placeholder');
const algorithmSelect = document.getElementById('algorithm-select');
const clipLimit = document.getElementById('clip-limit');
const tileSize = document.getElementById('tile-size');
const clipValue = document.getElementById('clip-value');
const tileValue = document.getElementById('tile-value');
const metricsSection = document.getElementById('metrics-section');
const claheParams = document.getElementById('clahe-params');

// API endpoint configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:5000' 
    : window.location.origin;

let uploadedImage = null;
let enhancedImageData = null;

// Initially disable buttons
enhanceBtn.disabled = true;
downloadBtn.disabled = true;

// Show/hide CLAHE parameters based on algorithm selection
algorithmSelect.addEventListener('change', () => {
    if (algorithmSelect.value === 'clahe') {
        claheParams.style.display = 'block';
    } else {
        claheParams.style.display = 'none';
    }
});

// Update slider values
clipLimit.addEventListener('input', () => {
    clipValue.textContent = clipLimit.value;
});

tileSize.addEventListener('input', () => {
    tileValue.textContent = tileSize.value;
});

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage = e.target.result;
            originalImage.src = uploadedImage;
            originalImage.style.display = 'block';
            originalPlaceholder.style.display = 'none';
            enhanceBtn.disabled = false;
            
            // Reset enhanced image
            enhancedImage.src = '';
            enhancedImage.style.display = 'none';
            enhancedImageData = null;
            downloadBtn.disabled = true;
            enhancedPlaceholder.style.display = 'block';
            enhancedPlaceholder.querySelector('p').textContent = 'Waiting for enhancement';
            enhancedPlaceholder.querySelector('.placeholder-icon').textContent = '○';
            
            // Hide metrics
            metricsSection.style.display = 'none';
            
            console.log('Image loaded successfully');
            
            // Smooth scroll to image display
            document.getElementById('image-display').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        };
        reader.readAsDataURL(file);
    }
});

function updateMetrics(metrics) {
    // Update contrast
    document.getElementById('contrast-original').textContent = metrics.contrast_original.toFixed(2);
    document.getElementById('contrast-enhanced').textContent = metrics.contrast_enhanced.toFixed(2);
    const contrastImprovement = document.getElementById('contrast-improvement');
    contrastImprovement.textContent = `${metrics.contrast_improvement > 0 ? '+' : ''}${metrics.contrast_improvement.toFixed(1)}% improvement`;
    contrastImprovement.className = 'metric-improvement ' + (metrics.contrast_improvement > 0 ? 'positive' : 'negative');
    
    // Update sharpness
    document.getElementById('sharpness-original').textContent = metrics.sharpness_original.toFixed(2);
    document.getElementById('sharpness-enhanced').textContent = metrics.sharpness_enhanced.toFixed(2);
    const sharpnessImprovement = document.getElementById('sharpness-improvement');
    sharpnessImprovement.textContent = `${metrics.sharpness_improvement > 0 ? '+' : ''}${metrics.sharpness_improvement.toFixed(1)}% improvement`;
    sharpnessImprovement.className = 'metric-improvement ' + (metrics.sharpness_improvement > 0 ? 'positive' : 'negative');
    
    // Update entropy
    document.getElementById('entropy-original').textContent = metrics.entropy_original.toFixed(2);
    document.getElementById('entropy-enhanced').textContent = metrics.entropy_enhanced.toFixed(2);
    const entropyImprovement = document.getElementById('entropy-improvement');
    entropyImprovement.textContent = `${metrics.entropy_improvement > 0 ? '+' : ''}${metrics.entropy_improvement.toFixed(1)}% improvement`;
    entropyImprovement.className = 'metric-improvement ' + (metrics.entropy_improvement > 0 ? 'positive' : 'negative');
    
    // Show metrics section
    metricsSection.style.display = 'block';
    
    // Scroll to metrics
    setTimeout(() => {
        metricsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
}

enhanceBtn.addEventListener('click', () => {
    console.log('Enhance button clicked');
    if (uploadedImage) {
        console.log('Sending image to backend...');
        enhanceBtn.disabled = true;
        
        // Update button text
        const btnText = enhanceBtn.querySelector('.btn-text');
        const btnIcon = enhanceBtn.querySelector('.btn-icon');
        btnText.textContent = 'Processing...';
        btnIcon.textContent = '◆';
        
        // Update enhanced placeholder
        enhancedPlaceholder.querySelector('p').textContent = 'Enhancing image...';
        enhancedPlaceholder.querySelector('.placeholder-icon').textContent = '◆';
        
        const requestData = {
            image: uploadedImage,
            algorithm: algorithmSelect.value,
            clipLimit: parseFloat(clipLimit.value),
            tileSize: parseInt(tileSize.value)
        };
        
        fetch(`${API_URL}/enhance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => {
            console.log('Response received:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Enhanced image received');
            enhancedImageData = data.enhanced_image;
            enhancedImage.src = enhancedImageData;
            enhancedImage.style.display = 'block';
            enhancedPlaceholder.style.display = 'none';
            downloadBtn.disabled = false;
            
            // Update metrics
            if (data.metrics) {
                updateMetrics(data.metrics);
            }
            
            // Reset button
            enhanceBtn.disabled = false;
            btnText.textContent = 'Enhance Image';
            btnIcon.textContent = '▶';
            
            // Show success message briefly
            const originalText = btnText.textContent;
            btnText.textContent = 'Enhancement Complete!';
            btnIcon.textContent = '✓';
            setTimeout(() => {
                btnText.textContent = originalText;
                btnIcon.textContent = '▶';
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error enhancing image: ' + error.message + '\n\nPlease make sure the Flask server is running.');
            
            // Reset button
            enhanceBtn.disabled = false;
            btnText.textContent = 'Enhance Image';
            btnIcon.textContent = '▶';
            
            // Update placeholder to show error
            enhancedPlaceholder.querySelector('p').textContent = 'Enhancement failed';
            enhancedPlaceholder.querySelector('.placeholder-icon').textContent = '✕';
        });
    } else {
        console.log('No image uploaded');
        alert('Please upload an image first');
    }
});

downloadBtn.addEventListener('click', () => {
    if (enhancedImageData) {
        const link = document.createElement('a');
        link.href = enhancedImageData;
        link.download = 'enhanced_medical_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('Image downloaded');
    }
});
