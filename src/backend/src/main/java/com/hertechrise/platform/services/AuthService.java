package com.hertechrise.platform.services;
import com.hertechrise.platform.data.dto.request.*;
import com.hertechrise.platform.data.dto.response.TokenResponseDTO;
import com.hertechrise.platform.exception.*;
import com.hertechrise.platform.model.*;
import com.hertechrise.platform.repository.CompanyRepository;
import com.hertechrise.platform.repository.ProfessionalRepository;
import com.hertechrise.platform.repository.RoleRepository;
import com.hertechrise.platform.repository.UserRepository;
import com.hertechrise.platform.security.jwt.ResetPasswordTokenService;
import com.hertechrise.platform.security.jwt.TokenService;
import com.hertechrise.platform.security.ratelimit.RateLimiter;
import com.hertechrise.platform.services.event.UserCreatedEvent;
import com.hertechrise.platform.services.event.UserPasswordResetEvent;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProfessionalRepository professionalRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final UserService userService;
    private final TokenService tokenService;
    private final ResetPasswordTokenService resetTokenService;
    private final RateLimiter rateLimiter;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final int MAX_LOGIN_FAILURES = 5;
    private static final Duration LOGIN_FAILURE_WINDOW = Duration.ofMinutes(15);
    private static final int MAX_RESET_EMAILS = 3;
    private static final Duration RESET_EMAIL_WINDOW = Duration.ofHours(1);

    private volatile String dummyPasswordHash;

    @Transactional
    public TokenResponseDTO registerProfessional(RegisterProfessionalRequestDTO request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new EmailAlreadyRegisteredException();
        }

        if (professionalRepository.findByCpf(request.cpf()).isPresent()) {
            throw new CpfAlreadyRegisteredException();
        }

        User newUser = new User();
        newUser.setName(request.name());
        newUser.setEmail(request.email());
        newUser.setPassword(passwordEncoder.encode(request.password()));
        newUser.setPhoneNumber(request.phoneNumber());
        newUser.setStreet(request.street());
        newUser.setNeighborhood(request.neighborhood());
        newUser.setCity(request.city());
        newUser.setCep(request.cep());
        newUser.setUf(request.uf());
        newUser.setExternalLink("");
        newUser.setType(UserType.PROFESSIONAL);

        String generatedUsername = userService.generateUniqueUserHandle(request.name());
        newUser.setHandle(generatedUsername);
        newUser.setProfilePic("https://res.cloudinary.com/dl63ih00u/image/upload/v1752625413/default_profile_professional_yij7n0.png");

        Role role = roleRepository.findByName("PROFESSIONAL")
                .orElseThrow(InvalidUserTypeException::new);
        newUser.setRole(role);

        userRepository.save(newUser);

        Professional professional = new Professional();
        professional.setUser(newUser);
        professional.setCpf(request.cpf());
        professional.setBirthDate(request.birthDate());
        professional.setTechnology("");
        professional.setBiography("");
        professional.setGender(request.gender());
        professional.setConsentGenderSharing(request.consentGenderSharing());

        professionalRepository.save(professional);
        eventPublisher.publishEvent(new UserCreatedEvent(this, newUser));

        String token = tokenService.generateLoginToken(newUser, false);

        ProfessionalGender gender;

        if (Boolean.TRUE.equals(professional.getConsentGenderSharing())) {
            gender = professional.getGender();
        } else {
            gender = null;
        }

        return new TokenResponseDTO(newUser.getName(), newUser.getId(), token, role.getName(), newUser.getProfilePic(), gender, professional.getConsentGenderSharing());
    }

    @Transactional
    public TokenResponseDTO registerCompany(RegisterCompanyRequestDTO request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new EmailAlreadyRegisteredException();
        }

        if (companyRepository.findByCnpj(request.cnpj()).isPresent()) {
            throw new CnpjAlreadyRegisteredException();
        }

        User newUser = new User();
        newUser.setName(request.name());
        newUser.setEmail(request.email());
        newUser.setPassword(passwordEncoder.encode(request.password()));
        newUser.setPhoneNumber(request.phoneNumber());
        newUser.setStreet(request.street());
        newUser.setNeighborhood(request.neighborhood());
        newUser.setCity(request.city());
        newUser.setCep(request.cep());
        newUser.setUf(request.uf());
        newUser.setExternalLink("");
        newUser.setType(UserType.COMPANY);

        String generatedUsername = userService.generateUniqueUserHandle(request.name());
        newUser.setHandle(generatedUsername);
        newUser.setProfilePic("https://res.cloudinary.com/dl63ih00u/image/upload/v1752625413/default_profile_company_qizndf.png");

        Role role = roleRepository.findByName("COMPANY")
                .orElseThrow(InvalidUserTypeException::new);
        newUser.setRole(role);

        userRepository.save(newUser);

        Company company = new Company();
        company.setUser(newUser);
        company.setCnpj(request.cnpj());
        company.setCompanyType(request.companyType());
        company.setDescription("");
        company.setAboutUs("");

        companyRepository.save(company);
        eventPublisher.publishEvent(new UserCreatedEvent(this, newUser));

        String token = tokenService.generateLoginToken(newUser, false);

        return new TokenResponseDTO(newUser.getName(), newUser.getId(), token, role.getName(), newUser.getProfilePic(), null, null);
    }

    public void checkCpfNotExists(String cpf) {
        if (professionalRepository.findByCpf(cpf).isPresent()) {
            throw new CpfAlreadyRegisteredException();

        }
    }

    public void checkCnpjNotExists(String cnpj) {
        if (companyRepository.findByCnpj(cnpj).isPresent()) {
            throw new CnpjAlreadyRegisteredException();
        }
    }

    public TokenResponseDTO login(LoginRequestDTO request) {
        String attemptsKey = "login:" + request.email().trim().toLowerCase();
        if (rateLimiter.isBlocked(attemptsKey, MAX_LOGIN_FAILURES)) {
            throw new TooManyRequestsException("Muitas tentativas de login. Aguarde 15 minutos ou redefina sua senha.");
        }

        Optional<User> optionalUser = userRepository.findByEmail(request.email());

        String hash = optionalUser.map(User::getPassword).orElseGet(this::dummyHash);
        boolean passwordMatches = passwordEncoder.matches(request.password(), hash);

        if (optionalUser.isEmpty() || !passwordMatches) {
            rateLimiter.tryAcquire(attemptsKey, MAX_LOGIN_FAILURES, LOGIN_FAILURE_WINDOW);
            throw new InvalidCredentialsException();
        }

        User user = optionalUser.get();
        if (!user.isEnabled()) {
            throw new AccountDisabledException();
        }
        rateLimiter.reset(attemptsKey);

        String token = tokenService.generateLoginToken(user, Boolean.TRUE.equals(request.rememberMe()));

        ProfessionalGender gender;
        Boolean consentGenderSharing;

        if (user.isProfessional()) {
            Optional<Professional> optionalProfessional = professionalRepository.findById(user.getId());
            if (optionalProfessional.isPresent()) {
                Professional professional = optionalProfessional.get();
                if (Boolean.TRUE.equals(professional.getConsentGenderSharing())) {
                    gender = professional.getGender();
                } else {
                    gender = null;
                }
                consentGenderSharing = professional.getConsentGenderSharing();
            } else {
                gender = null;
                consentGenderSharing = null;
            }
        } else {
            gender = null;
            consentGenderSharing = null;
        }

        return new TokenResponseDTO(user.getName(), user.getId(), token, user.getRole().getName(), user.getProfilePic(), gender, consentGenderSharing);
    }

    @Transactional(readOnly = true)
    public void resetPassword(ResetPasswordRequestDTO body) {
        String email = body.email().trim();
        if (!rateLimiter.tryAcquire("reset:" + email.toLowerCase(), MAX_RESET_EMAILS, RESET_EMAIL_WINDOW)) {
            logger.warn("Limite de e-mails de redefinição atingido para um endereço");
            return;
        }

        userRepository.findByEmail(email)
                .filter(User::isEnabled)
                .ifPresent(user -> {
                    String token = resetTokenService.generateResetToken(user);
                    eventPublisher.publishEvent(new UserPasswordResetEvent(this, user.getEmail(), token));
                });
    }

    @Transactional
    public void confirmResetPassword(ConfirmedResetPasswordRequestDTO dto) {
        var tokenData = resetTokenService.validateResetToken(dto.token());

        User user = userRepository.findByEmail(tokenData.email())
                .filter(User::isEnabled)
                .filter(u -> resetTokenService.matchesCurrentPassword(tokenData, u))
                .orElseThrow(InvalidResetTokenException::new);

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);
        rateLimiter.reset("login:" + user.getEmail().toLowerCase());
    }

    private String dummyHash() {
        if (dummyPasswordHash == null) {
            dummyPasswordHash = passwordEncoder.encode(UUID.randomUUID().toString());
        }
        return dummyPasswordHash;
    }
}
