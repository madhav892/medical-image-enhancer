# Medical Image Enhancer - DIP Project

A professional web-based medical image enhancement tool using multiple digital image processing algorithms with real-time quality metrics.

## 🎯 Project Overview

This project implements **6 different enhancement algorithms** specifically designed for medical imaging applications (X-rays, CT scans, MRI). It provides quantitative metrics to measure improvement and allows users to dynamically select images and algorithms.

## 🔬 Implemented Algorithms

### 1. **CLAHE (Contrast Limited Adaptive Histogram Equalization)**
- **Concept**: Divides image into tiles and applies localized histogram equalization
- **Parameters**: Adjustable clip limit (1-5) and tile size (4×4 to 16×16)
- **Best for**: Medical images with varying local contrast
- **Formula**: Limits contrast amplification to prevent noise: `clip_limit = max_amplification`

### 2. **Standard Histogram Equalization**
- **Concept**: Spreads pixel intensities across full dynamic range
- **Formula**: `s = T(r) = (L-1) ∫p_r(w)dw` where L is number of gray levels
- **Best for**: Images with concentrated histogram distributions

### 3. **Unsharp Masking**
- **Concept**: Subtracts blurred version from original to enhance edges
- **Formula**: `f_enhanced = f + amount × (f - f_blurred)`
- **Best for**: Enhancing fine details and edges in medical scans

### 4. **Bilateral Filter + CLAHE**
- **Concept**: Edge-preserving smoothing followed by CLAHE
- **Formula**: `I_filtered(x) = Σ I(xi) × w_s × w_r`
- **Best for**: Noisy medical images requiring smoothing

### 5. **Morphological Enhancement**
- **Concept**: Top-hat transform to extract bright features
- **Formula**: `f_tophat = f - (f ∘ b)` where ∘ is morphological opening
- **Best for**: Highlighting specific anatomical structures

### 6. **Gamma Correction**
- **Concept**: Power-law transformation for brightness adjustment
- **Formula**: `s = c × r^γ` where γ controls brightness curve
- **Best for**: Over/underexposed medical images

## 📊 Quality Metrics

The system calculates **3 quantitative metrics**:

### 1. **Contrast (Standard Deviation)**
```
σ = √(Σ(x_i - μ)² / N)
```
Measures spread of pixel intensity values

### 2. **Sharpness (Laplacian Variance)**
```
Laplacian = ∇²f = ∂²f/∂x² + ∂²f/∂y²
```
Measures edge definition and detail clarity

### 3. **Entropy (Information Content)**
```
H = -Σ p(i) × log₂(p(i))
```
Measures information content and histogram distribution

## 🚀 Features

- ✅ **6 Enhancement Algorithms** with detailed descriptions
- ✅ **Dynamic Image Upload** from user's system
- ✅ **Real-time Quality Metrics** showing percentage improvements
- ✅ **Adjustable Parameters** for CLAHE (clip limit & tile size)
- ✅ **Side-by-side Comparison** of original vs enhanced
- ✅ **Download Enhanced Image** functionality
- ✅ **Professional Medical UI** with clean design
- ✅ **Responsive Design** works on all devices

## 💻 Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Modern responsive design with flexbox/grid
- Real-time DOM manipulation

**Backend:**
- Python 3.9+
- Flask (Web framework)
- OpenCV (Image processing)
- NumPy (Numerical operations)
- scikit-image (Advanced image processing)
- SciPy (Scientific computing)

## 📦 Installation & Setup

### Prerequisites
```bash
Python 3.9 or higher
pip (Python package manager)
```

### Step 1: Install Dependencies
```bash
cd medical_image_enhancer
pip install -r requirements.txt
```

### Step 2: Start the Flask Server
```bash
python app.py
```

Server will run at: `http://127.0.0.1:5000`

### Step 3: Open the Application
Open `index.html` in your web browser

## 📖 Usage Guide

1. **Upload Image**: Click "Choose Medical Image" and select an X-ray, CT, or MRI image
2. **Select Algorithm**: Choose from 6 enhancement algorithms
3. **Adjust Parameters** (for CLAHE): Fine-tune clip limit and tile size
4. **Enhance**: Click "Enhance Image" to process
5. **View Metrics**: See quantitative improvements in contrast, sharpness, entropy
6. **Download**: Save the enhanced image

## 🎓 Academic Concepts Demonstrated

### Digital Image Processing Concepts:
1. **Spatial Domain Processing** (point operations)
2. **Histogram Processing** (equalization, specification)
3. **Spatial Filtering** (blurring, sharpening)
4. **Morphological Operations** (opening, top-hat)
5. **Adaptive Processing** (CLAHE with tiling)
6. **Image Quality Assessment** (contrast, sharpness, entropy metrics)

### Advanced Topics:
- Contrast limiting to prevent noise amplification
- Bilinear interpolation at tile boundaries
- Edge-preserving filtering (bilateral)
- Multi-scale image analysis
- Quantitative image quality metrics

## 📊 Why This Project is Advanced

1. **Multiple Algorithms**: Not just CLAHE, but 6 different approaches
2. **Quantitative Metrics**: Numerical proof of enhancement (not just visual)
3. **Adjustable Parameters**: Real-time algorithm tuning
4. **Professional UI**: Production-ready interface
5. **Full Stack Implementation**: Frontend + Backend integration
6. **Medical Focus**: Specifically designed for diagnostic imaging
7. **Download Functionality**: Practical usability feature

## 🔍 Comparison with Basic Projects

| Feature | Basic Project | This Project |
|---------|--------------|--------------|
| Algorithms | 1 (CLAHE only) | **6 different algorithms** |
| Metrics | None | **3 quantitative metrics** |
| Parameters | Fixed | **Adjustable in real-time** |
| UI | Simple HTML | **Professional medical theme** |
| Download | No | **Yes, with proper filename** |
| Documentation | Minimal | **Complete with formulas** |

## 📁 Project Structure

```
medical_image_enhancer/
│
├── app.py                 # Flask backend with 6 algorithms
├── index.html            # Professional UI
├── style.css             # Medical-themed styling
├── script.js             # Frontend logic with metrics
├── requirements.txt      # Python dependencies
└── images/              # Sample medical images (optional)
```

## 🎯 For Faculty Evaluation

This project demonstrates:
- Deep understanding of image enhancement concepts
- Implementation of multiple algorithms with mathematical basis
- Quantitative evaluation of enhancement quality
- Full-stack development skills
- Professional presentation and documentation
- Practical application in medical domain

## 📚 References

1. Zuiderveld, K. (1994). "Contrast Limited Adaptive Histogram Equalization"
2. Pizer, S. M. et al. (1987). "Adaptive histogram equalization and its variations"
3. Gonzalez, R. C., & Woods, R. E. "Digital Image Processing" (4th Edition)
4. OpenCV Documentation: https://docs.opencv.org/

## 👨‍💻 Author

Digital Image Processing Course Project
Medical Image Enhancement System

## 📄 License

Educational Use - DIP Course Project

---

**Note**: This system is for educational purposes. For clinical use, additional validation and regulatory approval would be required.
