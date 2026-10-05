package com.foodiedash.user.service;

import com.foodiedash.user.dto.AddressDto;
import com.foodiedash.user.dto.UpdateUserDto;
import com.foodiedash.user.dto.UserDto;
import com.foodiedash.user.entity.Address;
import com.foodiedash.user.entity.Role;
import com.foodiedash.user.entity.User;
import com.foodiedash.user.entity.UserStatus;
import com.foodiedash.user.exception.ForbiddenException;
import com.foodiedash.user.exception.ResourceNotFoundException;
import com.foodiedash.user.repository.AddressRepository;
import com.foodiedash.user.repository.UserRepository;
import com.foodiedash.user.security.AuthenticatedUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public UserServiceImpl(UserRepository userRepository, AddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    public UserDto getOrCreateProfile(AuthenticatedUser principal) {
        User user = userRepository.findByFirebaseUid(principal.getFirebaseUid())
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .firebaseUid(principal.getFirebaseUid())
                            .email(principal.getEmail() != null ? principal.getEmail() : principal.getFirebaseUid() + "@foodiedash.io")
                            .name(principal.getEmail() != null ? principal.getEmail().split("@")[0] : "Customer")
                            .role(Role.CUSTOMER)
                            .status(UserStatus.ACTIVE)
                            .emailVerified(principal.isEmailVerified())
                            .build();
                    return userRepository.save(newUser);
                });

        return mapToUserDto(user);
    }

    @Override
    public UserDto updateProfile(String firebaseUid, UpdateUserDto dto) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        user.setName(dto.getName());
        if (dto.getPhoneNumber() != null) {
            user.setPhoneNumber(dto.getPhoneNumber());
        }

        User updated = userRepository.save(user);
        return mapToUserDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressDto> getUserAddresses(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        return addressRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToAddressDto)
                .collect(Collectors.toList());
    }

    @Override
    public AddressDto addAddress(String firebaseUid, AddressDto dto) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        Address address = Address.builder()
                .user(user)
                .label(dto.getLabel())
                .streetAddress(dto.getStreetAddress())
                .aptSuite(dto.getAptSuite())
                .city(dto.getCity())
                .state(dto.getState())
                .zipCode(dto.getZipCode())
                .isDefault(dto.isDefault())
                .build();

        Address saved = addressRepository.save(address);
        return mapToAddressDto(saved);
    }

    @Override
    public AddressDto updateAddress(String firebaseUid, Long addressId, AddressDto dto) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You are not authorized to modify this address");
        }

        address.setLabel(dto.getLabel());
        address.setStreetAddress(dto.getStreetAddress());
        address.setAptSuite(dto.getAptSuite());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setZipCode(dto.getZipCode());
        address.setDefault(dto.isDefault());

        Address saved = addressRepository.save(address);
        return mapToAddressDto(saved);
    }

    @Override
    public void deleteAddress(String firebaseUid, Long addressId) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You are not authorized to delete this address");
        }

        addressRepository.delete(address);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firebaseUid(user.getFirebaseUid())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .emailVerified(user.isEmailVerified())
                .status(user.getStatus())
                .addresses(user.getAddresses() != null ? user.getAddresses().stream().map(this::mapToAddressDto).collect(Collectors.toList()) : List.of())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private AddressDto mapToAddressDto(Address address) {
        return AddressDto.builder()
                .id(address.getId())
                .label(address.getLabel())
                .streetAddress(address.getStreetAddress())
                .aptSuite(address.getAptSuite())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .isDefault(address.isDefault())
                .build();
    }
}
