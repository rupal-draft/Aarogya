package com.aarogya.pharmacy_service.config;

import com.aarogya.pharmacy_service.documents.Medicine;
import com.aarogya.pharmacy_service.repository.MedicineRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
@Slf4j
public class MedicineSeeder {

    @Bean
    CommandLineRunner seedMedicines(MedicineRepository medicineRepository) {
        log.info("Seeding medicines into the database!");
        return args -> {
            if (medicineRepository.count() == 0) {
                List<Medicine> medicines = List.of(
                        Medicine.builder()
                                .name("Paracetamol")
                                .manufacturer("Cipla")
                                .price(BigDecimal.valueOf(25.50))
                                .stockQuantity(100)
                                .category("Pain Reliever")
                                .prescriptionRequired(false)
                                .description("Used to reduce fever and relieve mild to moderate pain.")
                                .manufacturingDate(LocalDateTime.now().minusMonths(3))
                                .expiryDate(LocalDateTime.now().plusYears(2))
                                .activeIngredients(List.of("Paracetamol 500mg"))
                                .sideEffects(List.of("Nausea", "Allergic reaction"))
                                .dosageInstructions("Take 1 tablet every 6 hours as needed.")
                                .images(List.of("https://cpimg.tistatic.com/6609728/b/1/paracetamol-tablet.jpeg","https://lirp.cdn-website.com/69c0b277/dms3rep/multi/opt/Paracetamol+Dolo-650+Uses-+Side+Effects-+Composition+and+Price-1920w.jpg"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build(),

                        Medicine.builder()
                                .name("Amoxicillin")
                                .manufacturer("Sun Pharma")
                                .price(BigDecimal.valueOf(75.00))
                                .stockQuantity(50)
                                .category("Antibiotic")
                                .prescriptionRequired(true)
                                .description("Used to treat bacterial infections.")
                                .manufacturingDate(LocalDateTime.now().minusMonths(6))
                                .expiryDate(LocalDateTime.now().plusYears(1))
                                .activeIngredients(List.of("Amoxicillin 250mg"))
                                .sideEffects(List.of("Diarrhea", "Skin rash"))
                                .dosageInstructions("Take 1 capsule every 8 hours for 7 days.")
                                .images(List.of("https://irp.cdn-website.com/69c0b277/dms3rep/multi/Amoxicillin+-+Uses-+Side+Effects-+Composition-+Indications+and+Price.jpg","https://www.scabpharmacy.com/wp-content/uploads/2024/10/Amoxicillin-500mg-caps-3-scaled.jpg"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build(),

                        Medicine.builder()
                                .name("Cetirizine")
                                .manufacturer("Dr. Reddy's")
                                .price(BigDecimal.valueOf(18.75))
                                .stockQuantity(200)
                                .category("Antihistamine")
                                .prescriptionRequired(false)
                                .description("Used for relief from allergies and hay fever.")
                                .manufacturingDate(LocalDateTime.now().minusMonths(2))
                                .expiryDate(LocalDateTime.now().plusYears(2))
                                .activeIngredients(List.of("Cetirizine 10mg"))
                                .sideEffects(List.of("Drowsiness", "Dry mouth"))
                                .dosageInstructions("Take 1 tablet daily before bedtime.")
                                .images(List.of("https://cdn.foxpharma.co.uk/wp-content/uploads/2024/09/Cetirizine-10mg.jpg","https://thehealthpharmacy.co.uk/wp-content/uploads/2024/02/cetirizine.jpg"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build(),

                        Medicine.builder()
                                .name("Metformin")
                                .manufacturer("Torrent Pharma")
                                .price(BigDecimal.valueOf(50.00))
                                .stockQuantity(150)
                                .category("Anti-diabetic")
                                .prescriptionRequired(true)
                                .description("Helps control high blood sugar in type 2 diabetes.")
                                .manufacturingDate(LocalDateTime.now().minusMonths(4))
                                .expiryDate(LocalDateTime.now().plusYears(1))
                                .activeIngredients(List.of("Metformin Hydrochloride 500mg"))
                                .sideEffects(List.of("Nausea", "Stomach upset"))
                                .dosageInstructions("Take 1 tablet twice daily with meals.")
                                .images(List.of("https://images.ctfassets.net/4w8qvp17lo47/36aCkc13mwOuumQ2seygc4/e2e002b451a77e75e6fd98857df4b9eb/pregnancy-metformin-is-it-safe_thumb.jpg"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build(),

                        Medicine.builder()
                                .name("Ibuprofen")
                                .manufacturer("Abbott")
                                .price(BigDecimal.valueOf(40.00))
                                .stockQuantity(120)
                                .category("NSAID")
                                .prescriptionRequired(false)
                                .description("Used to reduce inflammation, pain, and fever.")
                                .manufacturingDate(LocalDateTime.now().minusMonths(5))
                                .expiryDate(LocalDateTime.now().plusYears(1))
                                .activeIngredients(List.of("Ibuprofen 400mg"))
                                .sideEffects(List.of("Heartburn", "Stomach pain"))
                                .dosageInstructions("Take 1 tablet every 8 hours as needed.")
                                .images(List.of("https://5.imimg.com/data5/SELLER/Default/2022/9/DK/OL/PC/6548604/ibuprofen-paracetamol-tablet.jpg"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build(),

                        Medicine.builder()
                                .name("Omeprazole")
                                .manufacturer("Zydus Cadila")
                                .price(BigDecimal.valueOf(60.00))
                                .stockQuantity(80)
                                .category("Proton Pump Inhibitor")
                                .prescriptionRequired(true)
                                .description("Used to treat acid reflux and ulcers.")
                                .manufacturingDate(LocalDateTime.now().minusMonths(1))
                                .expiryDate(LocalDateTime.now().plusYears(2))
                                .activeIngredients(List.of("Omeprazole 20mg"))
                                .sideEffects(List.of("Headache", "Abdominal pain"))
                                .dosageInstructions("Take 1 capsule daily before breakfast.")
                                .images(List.of("https://www.adegenpharma.com/wp-content/uploads/2023/02/OMILESS-20-CAPSULE.jpg"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build(),

                        Medicine.builder()
                                .name("Aspirin")
                                .manufacturer("Bayer")
                                .price(BigDecimal.valueOf(15.00))
                                .stockQuantity(300)
                                .category("Analgesic")
                                .prescriptionRequired(false)
                                .description("Used for pain relief and heart health.")
                                .manufacturingDate(LocalDateTime.now().minusMonths(2))
                                .expiryDate(LocalDateTime.now().plusYears(3))
                                .activeIngredients(List.of("Aspirin 75mg"))
                                .sideEffects(List.of("Stomach irritation", "Bleeding"))
                                .dosageInstructions("Take 1 tablet daily after meals.")
                                .images(List.of("https://5.imimg.com/data5/WHATSAPP/Default/2024/6/425023509/HG/KK/BG/114560182/new-product-500x500.jpeg"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build(),

                        Medicine.builder()
                                .name("Azithromycin")
                                .manufacturer("Lupin Pharma")
                                .price(BigDecimal.valueOf(120.00))
                                .stockQuantity(60)
                                .category("Antibiotic")
                                .prescriptionRequired(true)
                                .description("Used for respiratory and skin infections.")
                                .manufacturingDate(LocalDateTime.now().minusMonths(3))
                                .expiryDate(LocalDateTime.now().plusYears(1))
                                .activeIngredients(List.of("Azithromycin 500mg"))
                                .sideEffects(List.of("Diarrhea", "Abdominal pain"))
                                .dosageInstructions("Take 1 tablet daily for 3 days.")
                                .images(List.of("https://www.biofieldpharma.com/wp-content/uploads/2023/06/BIOFIELD-OZISET-500-TAB-1-scaled.jpg"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build(),

                        Medicine.builder()
                                .name("Atorvastatin")
                                .manufacturer("Cipla")
                                .price(BigDecimal.valueOf(90.00))
                                .stockQuantity(70)
                                .category("Cholesterol-Lowering")
                                .prescriptionRequired(true)
                                .description("Helps lower bad cholesterol (LDL).")
                                .manufacturingDate(LocalDateTime.now().minusMonths(7))
                                .expiryDate(LocalDateTime.now().plusYears(2))
                                .activeIngredients(List.of("Atorvastatin 10mg"))
                                .sideEffects(List.of("Muscle pain", "Liver issues"))
                                .dosageInstructions("Take 1 tablet daily at night.")
                                .images(List.of("https://www.biofieldpharma.com/wp-content/uploads/2024/12/BIOFIELD-ETORCUT-1-scaled.jpg"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build(),

                        Medicine.builder()
                                .name("Diclofenac")
                                .manufacturer("Alkem Labs")
                                .price(BigDecimal.valueOf(35.00))
                                .stockQuantity(110)
                                .category("NSAID")
                                .prescriptionRequired(true)
                                .description("Used for joint and muscle pain relief.")
                                .manufacturingDate(LocalDateTime.now().minusMonths(2))
                                .expiryDate(LocalDateTime.now().plusYears(1))
                                .activeIngredients(List.of("Diclofenac Sodium 50mg"))
                                .sideEffects(List.of("Stomach upset", "Dizziness"))
                                .dosageInstructions("Take 1 tablet twice daily after meals.")
                                .images(List.of("https://wonneinternational.com/wp-content/uploads/2022/10/Dicovan-Aqua.jpeg"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build()
                );

                medicineRepository.saveAll(medicines);
                log.info("✅ Seeded 10 medicines into the database.");
            } else {
                log.info("⚡ Medicines already exist. Skipping seeding.");
            }
        };
    }
}
