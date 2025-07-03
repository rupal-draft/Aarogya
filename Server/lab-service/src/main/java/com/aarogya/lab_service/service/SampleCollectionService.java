package com.aarogya.lab_service.service;

import com.aarogya.lab_service.dto.request.SampleCollectionRequestDto;
import com.aarogya.lab_service.dto.response.SampleCollectionResponseDto;
import com.aarogya.lab_service.enums.CollectionStatus;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

public interface SampleCollectionService {


    SampleCollectionResponseDto scheduleSampleCollection(SampleCollectionRequestDto requestDto);


    SampleCollectionResponseDto scheduleSampleCollection(String orderId, LocalDateTime scheduledTime);


    SampleCollectionResponseDto updateCollectionStatus(String collectionId, CollectionStatus status, String notes);


    Page<SampleCollectionResponseDto> getTechnicianCollections(String technicianId, CollectionStatus status, int page, int size);


    List<SampleCollectionResponseDto> getTodayCollections();


    List<SampleCollectionResponseDto> getOverdueCollections();


    SampleCollectionResponseDto addSamplesToCollection(String collectionId, List<SampleCollectionRequestDto.SampleInfoDto> samples);


    SampleCollectionResponseDto updateSampleDetails(String collectionId, String sampleBarcode, SampleCollectionRequestDto.SampleInfoDto sampleDto);


    SampleCollectionResponseDto markSampleCollected(String collectionId, String sampleBarcode, String condition);


    byte[] generateCollectionLabels(String collectionId);
}
