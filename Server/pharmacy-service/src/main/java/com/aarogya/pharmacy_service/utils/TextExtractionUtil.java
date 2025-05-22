package com.aarogya.pharmacy_service.utils;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

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
}
