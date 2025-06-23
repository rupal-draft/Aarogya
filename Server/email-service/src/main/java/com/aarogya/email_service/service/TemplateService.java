package com.aarogya.email_service.service;

import java.util.Map;

public interface TemplateService {

    String processTemplate(String templateName, Map<String, Object> variables);

}
