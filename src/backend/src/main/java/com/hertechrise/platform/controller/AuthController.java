package com.hertechrise.platform.controller;


import com.hertechrise.platform.controller.docs.AuthControllerDocs;
import com.hertechrise.platform.data.dto.request.*;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.data.dto.response.TokenResponseDTO;
import com.hertechrise.platform.services.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.br.CNPJ;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController implements AuthControllerDocs {

    private final AuthService authService;

    @PostMapping("/register/professional")
    public ResponseEntity<TokenResponseDTO> registerProfessional(@RequestBody @Valid RegisterProfessionalRequestDTO request) {
        TokenResponseDTO tokenResponse = authService.registerProfessional(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header("Message", "Profissional cadastrado com sucesso!")
                .body(tokenResponse);
    }

    @PostMapping("/register/company")
    public ResponseEntity<TokenResponseDTO> registerCompany(@RequestBody @Valid RegisterCompanyRequestDTO request) {
        TokenResponseDTO tokenResponse = authService.registerCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header("Message", "Empresa cadastrada com sucesso!")
                .body(tokenResponse);
    }

    @GetMapping("/cpf")
    public ResponseEntity<Void> validateCpf(@RequestParam @NotBlank @CPF String cpf) {
        authService.checkCpfNotExists(cpf);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cnpj")
    public ResponseEntity<Void> validateCnpj(@RequestParam @NotBlank @CNPJ String cnpj) {
        authService.checkCnpjNotExists(cnpj);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody @Valid LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequestDTO request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new MessageResponseDTO("Pedido de redefinição de senha enviado com sucesso."));
    }

    @PostMapping("/confirmedResetPassword")
    public ResponseEntity<MessageResponseDTO> confirmResetPassword(@RequestBody @Valid ConfirmedResetPasswordRequestDTO dto) {
        authService.confirmResetPassword(dto);
        return ResponseEntity.ok(new MessageResponseDTO("Senha redefinida com sucesso."));
    }
}