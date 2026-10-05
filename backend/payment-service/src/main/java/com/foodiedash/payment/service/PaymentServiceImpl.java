package com.foodiedash.payment.service;

import com.foodiedash.payment.dto.PaymentResponseDto;
import com.foodiedash.payment.dto.ProcessPaymentDto;
import com.foodiedash.payment.entity.Payment;
import com.foodiedash.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public List<PaymentResponseDto> getPayments(String userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponseDto processPayment(String userId, ProcessPaymentDto dto) {
        String status = (dto.getAmount() != null && dto.getAmount().doubleValue() > 0) ? "SUCCESS" : "FAILED";

        Payment payment = Payment.builder()
                .orderId(dto.getOrderId())
                .userId(userId)
                .amount(dto.getAmount())
                .status(status)
                .paymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "Credit Card")
                .build();

        Payment saved = paymentRepository.save(payment);
        return mapToResponseDto(saved);
    }

    private PaymentResponseDto mapToResponseDto(Payment payment) {
        return PaymentResponseDto.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
