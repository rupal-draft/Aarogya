package com.aarogya.patient_management_service.seeders;

import com.aarogya.patient_management_service.model.HealthGoal;
import com.aarogya.patient_management_service.repository.HealthGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthGoalSeederService {

    private final HealthGoalRepository healthGoalRepository;

    private static final String PATIENT_ID = "68a80e1b0474d478779e5c6c";

    public List<HealthGoal> seedHealthGoals() {
        if (healthGoalRepository.count() > 0) {
            return healthGoalRepository.findAll(); // don’t reseed if already present
        }

        List<HealthGoal> goals = new ArrayList<>();

        goals.add(HealthGoal.builder()
                .patientId(PATIENT_ID)
                .goalType("Weight Management")
                .title("Lose Weight")
                .description("Reduce body weight from 80kg to 70kg in 6 months")
                .targetValue(BigDecimal.valueOf(70))
                .currentValue(BigDecimal.valueOf(80))
                .unit("kg")
                .targetDate(LocalDate.now().plusMonths(6))
                .status("ACTIVE")
                .priority("High")
                .notes("Include cardio, avoid junk food")
                .build());

        goals.add(HealthGoal.builder()
                .patientId(PATIENT_ID)
                .goalType("Fitness")
                .title("Run 5km daily")
                .description("Increase endurance to run 5 kilometers without stopping")
                .targetValue(BigDecimal.valueOf(5))
                .currentValue(BigDecimal.valueOf(1))
                .unit("km")
                .targetDate(LocalDate.now().plusMonths(3))
                .status("ACTIVE")
                .priority("Medium")
                .notes("Start with 1km, add 0.5km every 2 weeks")
                .build());

        goals.add(HealthGoal.builder()
                .patientId(PATIENT_ID)
                .goalType("Blood Pressure Control")
                .title("Maintain Normal BP")
                .description("Keep blood pressure under 120/80 mmHg")
                .targetValue(BigDecimal.valueOf(120))
                .currentValue(BigDecimal.valueOf(135))
                .unit("mmHg systolic")
                .targetDate(LocalDate.now().plusMonths(4))
                .status("ACTIVE")
                .priority("High")
                .notes("Reduce salt intake, monitor daily")
                .build());

        goals.add(HealthGoal.builder()
                .patientId(PATIENT_ID)
                .goalType("Cholesterol Management")
                .title("Lower LDL Cholesterol")
                .description("Reduce LDL cholesterol below 100 mg/dL")
                .targetValue(BigDecimal.valueOf(100))
                .currentValue(BigDecimal.valueOf(140))
                .unit("mg/dL")
                .targetDate(LocalDate.now().plusMonths(5))
                .status("ACTIVE")
                .priority("High")
                .notes("Increase fiber intake, reduce fried foods")
                .build());

        goals.add(HealthGoal.builder()
                .patientId(PATIENT_ID)
                .goalType("Diet")
                .title("Daily Fruit Intake")
                .description("Eat at least 3 servings of fruits daily")
                .targetValue(BigDecimal.valueOf(3))
                .currentValue(BigDecimal.valueOf(1))
                .unit("servings/day")
                .targetDate(LocalDate.now().plusMonths(2))
                .status("ACTIVE")
                .priority("Medium")
                .notes("Include apples, bananas, and oranges")
                .build());

        goals.add(HealthGoal.builder()
                .patientId(PATIENT_ID)
                .goalType("Sleep")
                .title("Improve Sleep Duration")
                .description("Increase sleep duration to 8 hours per night")
                .targetValue(BigDecimal.valueOf(8))
                .currentValue(BigDecimal.valueOf(5))
                .unit("hours/night")
                .targetDate(LocalDate.now().plusMonths(2))
                .status("ACTIVE")
                .priority("High")
                .notes("Avoid late-night screen time")
                .build());

        goals.add(HealthGoal.builder()
                .patientId(PATIENT_ID)
                .goalType("Stress Management")
                .title("Daily Meditation")
                .description("Practice at least 20 minutes of meditation daily")
                .targetValue(BigDecimal.valueOf(20))
                .currentValue(BigDecimal.valueOf(5))
                .unit("minutes/day")
                .targetDate(LocalDate.now().plusMonths(1))
                .status("ACTIVE")
                .priority("Medium")
                .notes("Start with guided meditation apps")
                .build());

        goals.add(HealthGoal.builder()
                .patientId(PATIENT_ID)
                .goalType("Hydration")
                .title("Increase Water Intake")
                .description("Drink at least 3 liters of water daily")
                .targetValue(BigDecimal.valueOf(3))
                .currentValue(BigDecimal.valueOf(1.5))
                .unit("liters/day")
                .targetDate(LocalDate.now().plusMonths(1))
                .status("ACTIVE")
                .priority("Low")
                .notes("Carry a water bottle at work")
                .build());

        return healthGoalRepository.saveAll(goals);
    }
}

