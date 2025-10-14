package com.aarogya.article_service.seeder;

import com.aarogya.article_service.document.ArticleComments;
import com.aarogya.article_service.document.ArticleLikes;
import com.aarogya.article_service.document.Articles;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ArticlesSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    private static final String DOCTOR_ID = "68eea17f83aa7469053351d5";
    private static final List<String> PATIENT_IDS = List.of(
            "68ee9fe183aa7469053351d1",
            "68eea0c583aa7469053351d2",
            "68eea0d183aa7469053351d3",
            "68eea0d983aa7469053351d4"
    );

    @Override
    public void run(String... args) {
        if (mongoTemplate.count(new Query(), Articles.class) > 0) {
            return;
        }

        List<Articles> articles = List.of(
                Articles.builder()
                        .doctorId(DOCTOR_ID)
                        .title("The Importance of Regular Health Checkups")
                        .content("""
                        Routine health checkups are one of the most effective ways to stay on top of your overall well-being.\s
                        These checkups allow doctors to identify potential health issues before they develop into more serious conditions.\s
                        Early detection often leads to easier and less costly treatments, and in many cases, it can prevent the onset of chronic diseases altogether.

                        Preventive care is not only about detecting illnesses but also about monitoring key health indicators such as blood pressure, cholesterol,\s
                        and blood sugar levels. By tracking these regularly, healthcare providers can recommend lifestyle adjustments or medications when needed.\s
                        This proactive approach reduces the risk of heart disease, diabetes, and other long-term conditions.

                        In addition to physical health, checkups are a chance to discuss mental health, stress levels, sleep patterns, and overall lifestyle.\s
                        Prioritizing regular health checkups empowers individuals to take control of their health and build long-term habits that lead to a better quality of life.
                       \s""")
                        .posterUrl("https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg")
                        .imageUrl("https://images.pexels.com/photos/221210/pexels-photo-221210.jpeg")
                        .category("Health Awareness")
                        .userType("doctor")
                        .tags(List.of("checkup", "prevention", "health"))
                        .views(120)
                        .build(),

                Articles.builder()
                        .doctorId(DOCTOR_ID)
                        .title("Managing Diabetes Effectively")
                        .content("""
                        Diabetes management is a lifelong commitment that involves careful balance between diet, exercise, medication, and regular monitoring.\s
                        One of the most important steps is maintaining stable blood sugar levels, as fluctuations can lead to both immediate and long-term complications.\s
                        Eating meals at consistent times, avoiding processed sugars, and focusing on whole foods help achieve stability.

                        Exercise plays a critical role by improving insulin sensitivity, reducing weight, and enhancing cardiovascular health.\s
                        Even simple daily activities like walking after meals can make a significant difference in controlling blood glucose.\s
                        Coupled with medication adherence, these habits can greatly improve the quality of life for people living with diabetes.

                        Emotional well-being also cannot be overlooked. Many individuals struggle with the mental burden of managing a chronic condition.\s
                        Support groups, counseling, and stress management techniques are essential components of a comprehensive diabetes care plan.
                       \s""")
                        .posterUrl("https://images.pexels.com/photos/6823763/pexels-photo-6823763.jpeg")
                        .imageUrl("https://images.pexels.com/photos/6941884/pexels-photo-6941884.jpeg")
                        .category("Diabetes")
                        .userType("doctor")
                        .tags(List.of("diabetes", "nutrition", "exercise"))
                        .views(98)
                        .build(),

                Articles.builder()
                        .doctorId(DOCTOR_ID)
                        .title("Mental Health Matters")
                        .content("""
                        Mental health is just as vital as physical health, yet it is often neglected.\s
                        Anxiety, depression, and stress-related disorders affect millions of people globally, and their impact can ripple into physical health, relationships, and professional life.\s
                        Addressing mental well-being requires awareness, early intervention, and compassionate support systems.

                        Regular counseling or therapy provides individuals with tools to manage stress, process trauma, and develop resilience.\s
                        Mindfulness practices, meditation, and breathing exercises can also help restore balance in day-to-day life.\s
                        Prioritizing adequate sleep, proper nutrition, and regular exercise further strengthens mental health.

                        Communities and workplaces have a responsibility to destigmatize mental health conversations.\s
                        By creating safe environments where people can seek help without fear of judgment, society can reduce suffering and foster stronger, healthier connections.
                       \s""")
                        .posterUrl("https://images.pexels.com/photos/2440530/pexels-photo-2440530.jpeg")
                        .imageUrl("https://images.pexels.com/photos/289998/pexels-photo-289998.jpeg")
                        .category("Mental Health")
                        .userType("doctor")
                        .tags(List.of("mental health", "stress", "therapy"))
                        .views(150)
                        .build(),

                Articles.builder()
                        .doctorId(DOCTOR_ID)
                        .title("Nutrition Tips for a Healthy Lifestyle")
                        .content("""
                        Good nutrition is the foundation of a healthy body and mind.\s
                        A balanced diet provides essential nutrients that fuel energy, repair tissues, and strengthen the immune system.\s
                        Incorporating colorful fruits, leafy vegetables, lean proteins, and whole grains ensures the body receives a wide range of vitamins and minerals.

                        Portion control is equally important, as overeating—even healthy foods—can lead to weight gain and digestive issues.\s
                        Reducing sugary drinks and processed foods minimizes the risk of obesity, diabetes, and heart disease.\s
                        Instead, focusing on hydration and natural sources of nutrients keeps the body functioning optimally.

                        Small, sustainable changes—like replacing fried snacks with nuts, or sugary sodas with water—add up over time.\s
                        Combined with mindful eating practices, nutrition becomes a lifelong tool for disease prevention and vitality.
                       \s""")
                        .posterUrl("https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg")
                        .imageUrl("https://images.pexels.com/photos/1660027/pexels-photo-1660027.jpeg")
                        .category("Nutrition")
                        .userType("doctor")
                        .tags(List.of("nutrition", "diet", "healthy eating"))
                        .views(87)
                        .build(),

                Articles.builder()
                        .doctorId(DOCTOR_ID)
                        .title("The Role of Exercise in Preventing Diseases")
                        .content("""
                        Exercise is one of the most powerful tools for preventing chronic diseases.\s
                        Regular physical activity strengthens the heart, improves circulation, and enhances lung function.\s
                        It reduces the risk of conditions like obesity, diabetes, high blood pressure, and certain cancers.

                        Beyond physical health, exercise also improves mood by boosting endorphin levels and reducing stress hormones.\s
                        Whether it’s brisk walking, swimming, cycling, or yoga, consistent movement builds resilience against both physical and mental illnesses.\s
                        The key is consistency—small, daily efforts make a bigger impact than occasional intense workouts.

                        In today’s sedentary lifestyle, finding opportunities to stay active—such as taking stairs instead of elevators, standing during work breaks, or\s
                        scheduling evening walks—can dramatically improve long-term health outcomes. Exercise should not be viewed as a chore but as an investment in longevity and quality of life.
                       \s""")
                        .posterUrl("https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg")
                        .imageUrl("https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg")
                        .category("Fitness")
                        .userType("doctor")
                        .tags(List.of("exercise", "fitness", "health"))
                        .views(200)
                        .build()
        );


        mongoTemplate.insertAll(articles);

        // ---- Fetch saved articles for linking likes/comments ----
        List<Articles> savedArticles = mongoTemplate.findAll(Articles.class);

        List<ArticleLikes> likes = new ArrayList<>();
        List<ArticleComments> comments = new ArrayList<>();

        for (Articles article : savedArticles) {
            for (String patientId : PATIENT_IDS) {
                likes.add(ArticleLikes.builder()
                        .articleId(article.getId())
                        .userId(patientId)
                        .userType("patient")
                        .build());

                comments.add(ArticleComments.builder()
                        .articleId(article.getId())
                        .userId(patientId)
                        .userType("patient")
                        .comment("Very helpful article, thank you doctor!")
                        .build());
            }

            // Doctor also likes his own article
            likes.add(ArticleLikes.builder()
                    .articleId(article.getId())
                    .userId(DOCTOR_ID)
                    .userType("doctor")
                    .build());

            comments.add(ArticleComments.builder()
                    .articleId(article.getId())
                    .userId(DOCTOR_ID)
                    .userType("doctor")
                    .comment("Glad to share this information with my patients.")
                    .build());
        }

        mongoTemplate.insertAll(likes);
        mongoTemplate.insertAll(comments);
    }
}
