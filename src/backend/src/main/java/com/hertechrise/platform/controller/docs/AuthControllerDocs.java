package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.*;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.data.dto.response.TokenResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.br.CNPJ;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

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
            summary = "Verifica se um CPF já está cadastrado",
            description = "Recebe um CPF como parâmetro e verifica se ele já existe no banco de dados. " +
                    "Retorna 200 se o CPF não existir (disponível para cadastro) e 409 se já existir (não disponível).",
            parameters = @Parameter(name = "cpf", description = "CPF a ser verificado", required = true, example = "123.456.789-09"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "CPF não cadastrado (disponível)"),
                    @ApiResponse(responseCode = "409", description = "CPF já cadastrado")
            }
    )
    public ResponseEntity<Void> validateCpf(@RequestParam @NotBlank @CPF String cpf);

    @Operation(
            summary = "Verifica se um CNPJ já está cadastrado",
            description = "Recebe um CNPJ como parâmetro e verifica se ele já existe no banco de dados. " +
                    " Retorna 200 se o CNPJ não existir (disponível para cadastro) e 409 se já existir (não disponível).",
            parameters = @Parameter(name = "cnpj", description = "CNPJ a ser verificado", required = true, example = "12.345.678/0001-95"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "CNPJ não cadastrado (disponível)"),
                    @ApiResponse(responseCode = "409", description = "CNPJ já cadastrado")
            }
    )
    public ResponseEntity<Void> validateCnpj(@RequestParam @NotBlank @CNPJ String cnpj);


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
