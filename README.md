# QR Code Generator

A simple web-based QR code generator that creates QR codes from text or URLs.

## Features

- Generate QR codes from any text or URL
- Adjustable QR code size (100-1000 pixels)
- Download generated QR codes as PNG images
- Clean, responsive design
- Works on desktop and mobile devices

## Usage

1. Open `index.html` in your web browser
2. Enter text or URL in the text area
3. Adjust size if needed (default is 200px)
4. Click "Generate QR Code"
5. Click "Download QR Code" to save the image

## Files

- `index.html` - Main application
- `libs/qrcode-1.5.1-qrcode.min.js` - QR code generation library
- `qr-icon.svg` - App icon
- `src/qr-utils.js` - Shared utility functions (used by tests)

## Development & Testing

```bash
npm install
npm run test          # Unit tests
npm run test:integration  # Integration tests (Playwright)
npm run test:all      # Run all tests
```

## Pull Request Requirements

Tests must pass before merging. Configure branch protection in **Settings → Branches → Add rule** for `main`:
- Require status checks to pass: **Test / Unit & Integration Tests**
