package com.foodiedash.user.controller;

import com.foodiedash.user.dto.AddressDto;
import com.foodiedash.user.dto.UpdateUserDto;
import com.foodiedash.user.dto.UserDto;
import com.foodiedash.user.security.AuthenticatedUser;
import com.foodiedash.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile(@AuthenticationPrincipal AuthenticatedUser principal) {
        UserDto dto = userService.getOrCreateProfile(principal);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMyProfile(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @Valid @RequestBody UpdateUserDto updateDto) {
        UserDto updated = userService.updateProfile(principal.getFirebaseUid(), updateDto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/me/addresses")
    public ResponseEntity<List<AddressDto>> getMyAddresses(@AuthenticationPrincipal AuthenticatedUser principal) {
        List<AddressDto> addresses = userService.getUserAddresses(principal.getFirebaseUid());
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/me/addresses")
    public ResponseEntity<AddressDto> addAddress(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @Valid @RequestBody AddressDto addressDto) {
        AddressDto created = userService.addAddress(principal.getFirebaseUid(), addressDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/me/addresses/{addressId}")
    public ResponseEntity<AddressDto> updateAddress(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long addressId,
            @Valid @RequestBody AddressDto addressDto) {
        AddressDto updated = userService.updateAddress(principal.getFirebaseUid(), addressId, addressDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/me/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long addressId) {
        userService.deleteAddress(principal.getFirebaseUid(), addressId);
        return ResponseEntity.noContent().build();
    }
}
