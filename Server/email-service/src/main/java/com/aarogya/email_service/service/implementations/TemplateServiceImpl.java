package com.aarogya.email_service.service.implementations;

import com.aarogya.email_service.exceptions.TemplateProcessingException;
import com.aarogya.email_service.service.TemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateServiceImpl implements TemplateService {

    private final TemplateEngine templateEngine;

    @Override
    @Cacheable(value = "emailTemplates", key = "#templateName + '_' + #variables.hashCode()")
    public String processTemplate(String templateName, Map<String, Object> variables) {
        try {
            log.debug("Processing template: {} with variables: {}", templateName, variables.keySet());

            Context context = new Context();
            if (variables != null) {
                context.setVariables(variables);
            }

            context.setVariable("currentYear", java.time.Year.now().getValue());
            context.setVariable("companyName", "Aarogya Healthcare");
            context.setVariable("supportEmail", "support@aarogya.com");
            context.setVariable("websiteUrl", "https://aarogya.com");

            return templateEngine.process(templateName, context);

        } catch (Exception e) {
            log.error("Error processing template: {}", templateName, e);
            throw new TemplateProcessingException("Failed to process email template: " + templateName, e);
        }
    }
}
