const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors()); // ✅ Enable CORS

// ✅ Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// ✅ File type filter: allow only image, pdf, and png files for both text and font uploads
const fileFilter = (req, file, cb) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, or PDF files are allowed.'), false); // Reject file
  }
};

// ✅ Set up Multer upload for images and text files
const upload = multer({ storage, fileFilter });
const textFileUpload = multer({ storage });

// ✅ File Upload Route for images (for font generation)
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded or invalid file type.');
    }

    console.log('File uploaded:', req.file.path);
    // Here, you would add the code to generate the font from the uploaded file.
    res.send('File uploaded successfully, font generation started.');
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ✅ New route to handle uploading text files (e.g., png, txt, or pdf)
app.post('/upload-text', textFileUpload.single('textFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No text file uploaded or invalid file type.');
    }

    console.log('Text file uploaded:', req.file.path);
    // Here, you would add the code to process the uploaded text file.
    res.send('Text file uploaded successfully');
  } catch (error) {
    console.error('Error processing text file upload:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ✅ Route to Download Template (for users to download template for handwriting)
app.get('/download-template', (req, res) => {
  const templatePath = path.join(__dirname, 'Template (1).pdf'); // Path to your template file

  if (!fs.existsSync(templatePath)) {
    return res.status(404).send('Template file not found.');
  }

  res.download(templatePath, 'Template.pdf', (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).send('Error downloading template');
    }
  });
});

// ✅ Route to Download Generated Font with the name 'generated_font.ttf'
app.get('/download-font', (req, res) => {
  const generatedFontPath = path.join(__dirname, 'generated_font.ttf'); // Path to your generated font file

  // Check if the generated font exists
  if (!fs.existsSync(generatedFontPath)) {
    return res.status(404).send('Generated font file not found.');
  }

  // Send the font file with the specified filename 'generated_font.ttf'
  res.download(generatedFontPath, 'generated_font.ttf', (err) => {
    if (err) {
      console.error('Error downloading font:', err);
      res.status(500).send('Error downloading font.');
    }
  });
});

// ✅ Start Server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
