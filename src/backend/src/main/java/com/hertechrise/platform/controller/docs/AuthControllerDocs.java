package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.*;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.data.dto.response.TokenResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@Tag(name = "Autenticação", description = "Endpoints para autenticação de usuários")
public interface AuthControllerDocs {

    @Operation(
            summary = "Cadastro de profissional",
            description = "Realiza o cadastro de um novo profissional e retorna um token de autenticação.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json"
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Profissional cadastrado com sucesso",
                            content = @Content(schema = @Schema(implementation = TokenResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Requisição inválida"),
                    @ApiResponse(responseCode = "409", description = "E-mail ou CPF já cadastrado")
            }
    )
    ResponseEntity<TokenResponseDTO> registerProfessional(@Valid RegisterProfessionalRequestDTO request);

    @Operation(
            summary = "Cadastro de empresa",
            description = "Realiza o cadastro de uma nova empresa e retorna um token de autenticação.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json"
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Empresa cadastrada com sucesso",
                            content = @Content(schema = @Schema(implementation = TokenResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Requisição inválida"),
                    @ApiResponse(responseCode = "409", description = "E-mail ou CNPJ já cadastrado")
            }
    )
    ResponseEntity<TokenResponseDTO> registerCompany(@Valid RegisterCompanyRequestDTO request);

    @Operation(
            summary = "Login",
            description = "Autentica um usuário com e-mail e senha, retornando um token JWT.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json"
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login realizado com sucesso",
                            content = @Content(schema = @Schema(implementation = TokenResponseDTO.class))),
                    @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
            }
    )
    ResponseEntity<TokenResponseDTO> login(@Valid LoginRequestDTO request);

    @Operation(
            summary = "Solicitar redefinição de senha",
            description = "Envia um e-mail com o link para redefinir a senha do usuário.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json"
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Pedido de redefinição enviado"),
                    @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
            }
    )
    ResponseEntity<?> resetPassword(@Valid ResetPasswordRequestDTO body);

    @Operation(
            summary = "Confirmar nova senha",
            description = "Define uma nova senha usando o token de redefinição.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json"
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Senha redefinida com sucesso",
                            content = @Content(schema = @Schema(implementation = MessageResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Token inválido ou expirado")
            }
    )
    ResponseEntity<MessageResponseDTO> confirmResetPassword(@Valid ConfirmedResetPasswordRequestDTO dto);
}
