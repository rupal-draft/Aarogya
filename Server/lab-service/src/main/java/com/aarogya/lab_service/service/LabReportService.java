package com.aarogya.lab_service.service;

import com.aarogya.lab_service.dto.request.LabReportRequestDto;
import com.aarogya.lab_service.dto.response.LabReportResponseDto;
import com.aarogya.lab_service.enums.ReportStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LabReportService {


    LabReportResponseDto generateReport(String orderId, LabReportRequestDto requestDto);


    LabReportResponseDto updateReportStatus(String reportId, ReportStatus status);


    Page<LabReportResponseDto> getPatientReports(String patientId, ReportStatus status, int page, int size);


    Page<LabReportResponseDto> getDoctorReports(String doctorId, ReportStatus status, int page, int size);


    LabReportResponseDto getReportDetails(String reportId);


    LabReportResponseDto getReportByOrderId(String orderId);


    List<LabReportResponseDto> getPendingReports();


    byte[] downloadReportPdf(String reportId);

    LabReportResponseDto addReportAttachment(String reportId, String attachmentUrl);
}
