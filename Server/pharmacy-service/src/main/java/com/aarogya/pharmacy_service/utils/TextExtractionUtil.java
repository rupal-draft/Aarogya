package com.aarogya.pharmacy_service.utils;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Component
public class TextExtractionUtil {

    public String extractTextFromFile(MultipartFile file) throws IOException {
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        if (contentType == null) {
            throw new IllegalArgumentException("File type not recognized");
        }

        if (contentType.equals("application/pdf")) {
            return extractTextFromPdf(file.getInputStream());
        } else if (contentType.equals("text/plain") ||
                (originalFilename != null && originalFilename.endsWith(".txt"))) {
            return new String(file.getBytes(), StandardCharsets.UTF_8);
        } else if (contentType.equals("image/jpeg") || contentType.equals("image/png") ||
                (originalFilename != null && (originalFilename.endsWith(".jpg") || originalFilename.endsWith(".jpeg") || originalFilename.endsWith(".png")))) {
            return extractTextFromImage(file);
        } else {
            throw new UnsupportedOperationException("Unsupported file type: " + contentType);
        }
    }

    private String extractTextFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromImage(MultipartFile file) throws IOException {
        BufferedImage image = ImageIO.read(file.getInputStream());

        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath("C:\\Users\\ASUS\\Documents\\Aarogya\\Server\\pharmacy-service\\tessdata");
        tesseract.setLanguage("eng");

        try {
            return tesseract.doOCR(image);
        } catch (TesseractException e) {
            throw new IOException("Error during OCR processing", e);
        }
    }
}
