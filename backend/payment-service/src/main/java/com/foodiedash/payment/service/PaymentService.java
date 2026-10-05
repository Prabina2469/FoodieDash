package com.foodiedash.payment.service;

import com.foodiedash.payment.dto.PaymentResponseDto;
import com.foodiedash.payment.dto.ProcessPaymentDto;
import java.util.List;

public interface PaymentService {
    List<PaymentResponseDto> getPayments(String userId);
    PaymentResponseDto processPayment(String userId, ProcessPaymentDto dto);
}
