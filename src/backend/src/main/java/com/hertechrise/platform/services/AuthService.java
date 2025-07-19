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
import com.hertechrise.platform.services.event.UserCreatedEvent;
import com.hertechrise.platform.services.event.UserPasswordResetEvent;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProfessionalRepository professionalRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final TokenService tokenService;
    private final ResetPasswordTokenService resetTokenService;

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

        professionalRepository.save(professional);
        eventPublisher.publishEvent(new UserCreatedEvent(this, newUser));

        String token = tokenService.generateToken(
                newUser.getUsername(),
                newUser.getId(),
                newUser.getName().split(" ")[0],
                "login-auth-api",
                2
        );

        return new TokenResponseDTO(newUser.getName(), newUser.getId(), token, role.getName(), newUser.getProfilePic());
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

        String token = tokenService.generateToken(
                newUser.getUsername(),
                newUser.getId(),
                newUser.getName().split(" ")[0],
                "login-auth-api",
                2
        );

        return new TokenResponseDTO(newUser.getName(), newUser.getId(), token, role.getName(), newUser.getProfilePic());
    }

    public TokenResponseDTO login(LoginRequestDTO request) {
        User user = this.userRepository.findByEmail(request.email())
                .orElseThrow(UserNotFoundException::new);

        if (!user.isEnabled()) {
            throw new AccountDisabledException();
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            String token = tokenService.generateToken(
                    user.getEmail(),
                    user.getId(),
                    user.getName().split(" ")[0],
                    "login-auth-api",
                    2
            );

            return new TokenResponseDTO(user.getName(), user.getId(), token, user.getRole().getName(), user.getProfilePic());

        } catch (BadCredentialsException e) {
            throw new InvalidPasswordException();
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequestDTO body) {
        User user = userRepository.findByEmail(body.email())
                .orElseThrow(UserNotFoundException::new);

        String token = resetTokenService.generateResetToken(user.getEmail());

        eventPublisher.publishEvent(new UserPasswordResetEvent(this, user.getEmail(), token));
    }

    @Transactional
    public void confirmResetPassword(ConfirmedResetPasswordRequestDTO dto) {
        String email = resetTokenService.validateResetToken(dto.token());

        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);
    }
}
