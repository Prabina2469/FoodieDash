package com.foodiedash.fleet.security;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.config-path:}")
    private String configPath;

    @PostConstruct
    public void initFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        try {
            FirebaseOptions options;
            if (configPath != null && !configPath.isEmpty()) {
                FileInputStream serviceAccount = new FileInputStream(configPath);
                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
            } else {
                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
            }
            FirebaseApp.initializeApp(options);
            log.info("Firebase Application initialized successfully in fleet-service.");
        } catch (IOException e) {
            log.warn("Firebase credentials not configured. Mock/Dev auth mode will operate: {}", e.getMessage());
        }
    }
}
