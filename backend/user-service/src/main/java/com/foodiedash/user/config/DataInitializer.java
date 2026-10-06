package com.foodiedash.user.config;

import com.foodiedash.user.entity.Role;
import com.foodiedash.user.entity.User;
import com.foodiedash.user.entity.UserStatus;
import com.foodiedash.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        seedUserIfMissing("dev-admin-alex", "Alex Carter", "alex.carter@foodiedash.io", Role.ADMIN);
        seedUserIfMissing("dev-owner-1", "Mario Rossi", "mario.rossi@foodiedash.io", Role.RESTAURANT_OWNER);
        seedUserIfMissing("dev-driver-1", "David Chen", "david.chen@foodiedash.io", Role.DELIVERY_PARTNER);
        seedUserIfMissing("demo-customer-sarah", "Sarah Jenkins", "sarah.jenkins@foodiedash.io", Role.CUSTOMER);
    }

    private void seedUserIfMissing(String firebaseUid, String name, String email, Role role) {
        if (!userRepository.existsByFirebaseUid(firebaseUid)) {
            User user = User.builder()
                    .firebaseUid(firebaseUid)
                    .name(name)
                    .email(email)
                    .role(role)
                    .status(UserStatus.ACTIVE)
                    .emailVerified(true)
                    .build();
            userRepository.save(user);
            log.info("Seeded initial account: {} ({}) with authoritative role: {}", name, email, role);
        }
    }
}
