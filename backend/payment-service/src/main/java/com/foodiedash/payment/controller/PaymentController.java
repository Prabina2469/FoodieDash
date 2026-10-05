package com.foodiedash.payment.controller;

import com.foodiedash.payment.dto.PaymentResponseDto;
import com.foodiedash.payment.dto.ProcessPaymentDto;
import com.foodiedash.payment.security.AuthenticatedUser;
import com.foodiedash.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponseDto>> getMyPayments(@AuthenticationPrincipal AuthenticatedUser principal) {
        List<PaymentResponseDto> payments = paymentService.getPayments(principal.getFirebaseUid());
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/process")
    public ResponseEntity<PaymentResponseDto> processPayment(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @Valid @RequestBody ProcessPaymentDto dto) {
        PaymentResponseDto response = paymentService.processPayment(principal.getFirebaseUid(), dto);
        return ResponseEntity.ok(response);
    }
}
