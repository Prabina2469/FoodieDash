package com.foodiedash.notification.controller;

import com.foodiedash.notification.entity.Notification;
import com.foodiedash.notification.security.AuthenticatedUser;
import com.foodiedash.notification.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(@AuthenticationPrincipal AuthenticatedUser principal) {
        List<Notification> notifications = notificationService.getUserNotifications(principal.getFirebaseUid());
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long id) {
        Notification updated = notificationService.markAsRead(principal.getFirebaseUid(), id);
        return ResponseEntity.ok(updated);
    }
}
