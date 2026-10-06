package com.foodiedash.user.service;

import com.foodiedash.user.dto.AddressDto;
import com.foodiedash.user.dto.UpdateUserDto;
import com.foodiedash.user.dto.UserDto;
import com.foodiedash.user.security.AuthenticatedUser;
import java.util.List;

public interface UserService {
    UserDto getOrCreateProfile(AuthenticatedUser principal);
    UserDto updateProfile(String firebaseUid, UpdateUserDto dto);
    List<AddressDto> getUserAddresses(String firebaseUid);
    AddressDto addAddress(String firebaseUid, AddressDto dto);
    AddressDto updateAddress(String firebaseUid, Long addressId, AddressDto dto);
    void deleteAddress(String firebaseUid, Long addressId);
    List<UserDto> getAllUsers();
}
