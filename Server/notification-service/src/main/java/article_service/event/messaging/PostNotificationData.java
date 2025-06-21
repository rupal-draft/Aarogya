package article_service.event.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostNotificationData {
    private String id;
    private String title;
    private String imageUrl;
    private LocalDateTime createdAt;
    private String category;
    private String postedBy;
    private String postedByImage;
}
