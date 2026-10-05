package com.foodiedash.notification.service;

import com.foodiedash.notification.entity.Notification;
import com.foodiedash.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NotificationService {
    List<Notification> getUserNotifications(String userId);
    Notification markAsRead(String userId, Long notificationId);
    Notification createNotification(String userId, String title, String message, String type);
}

@Service
@Transactional
class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public List<Notification> getUserNotifications(String userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (list.isEmpty()) {
            // Seed sample event notifications for user
            Notification n1 = notificationRepository.save(Notification.builder()
                    .userId(userId)
                    .title("Order Confirmed")
                    .message("Your order #FD-9042X at Trattoria Bella has been accepted.")
                    .type("ORDER_CONFIRMED")
                    .isRead(false)
                    .build());
            Notification n2 = notificationRepository.save(Notification.builder()
                    .userId(userId)
                    .title("Out for Delivery")
                    .message("Courier Carlos Gomez has picked up your food!")
                    .type("OUT_FOR_DELIVERY")
                    .isRead(false)
                    .build());
            return List.of(n1, n2);
        }
        return list;
    }

    @Override
    public Notification markAsRead(String userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to modify this notification");
        }

        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public Notification createNotification(String userId, String title, String message, String type) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }
}
