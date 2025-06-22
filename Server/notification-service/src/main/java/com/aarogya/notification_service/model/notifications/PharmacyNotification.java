package com.aarogya.notification_service.model.notifications;

import com.aarogya.notification_service.model.BaseNotification;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Document(collection = "pharmacy_notifications")
public class PharmacyNotification extends BaseNotification {
    @Indexed
    private String orderId;

    private BigDecimal totalAmount;
    private String orderStatus;
    private LocalDateTime orderDate;
    private List<OrderItemData> orderItems;

    @Data
    public static class OrderItemData {
        private String medicineId;
        private String medicineName;
        private String medicineImage;
        private Integer quantity;
        private BigDecimal price;
    }
}
