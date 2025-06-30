package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.*;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import com.hertechrise.platform.data.dto.response.TokenResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

public interface AuthControllerDocs {

    @Operation(
            summary = "Cadastro de profissional",
            description = "Realiza o cadastro de um novo profissional e retorna um token de autenticação.",
            requestBody = @RequestBody(
                    description = "Dados do profissional a ser cadastrado",
                    required = true,
                    content = @Content(
                            examples = @ExampleObject(
                                    name = "Exemplo de Profissional",
                                    value = """
                                            {
                                              "name": "Maria Oliveira",
                                              "cpf": "123.456.789-09",
                                              "birthDate": "15/11/2000",
                                              "phoneNumber": "(11) 91234-5678",
                                              "cep": "12345-678",
                                              "city": "São Paulo",
                                              "street": "Rua das Flores",
                                              "neighborhood": "Centro",
                                              "email": "maria@exemplo.com",
                                              "password": "senhaSegura123"
                                            }
                                            """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Profissional cadastrado com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Requisição inválida ou Tipo de usuário inválido"),
                    @ApiResponse(responseCode = "409", description = "E-mail ou CPF já cadastrado")
            })
    ResponseEntity<TokenResponseDTO> registerProfessional(@Valid RegisterProfessionalRequestDTO request);

    @Operation(
            summary = "Cadastro de empresa",
            description = "Realiza o cadastro de uma nova empresa e retorna um token de autenticação.",
            requestBody = @RequestBody(
                    description = "Dados da empresa a ser cadastrada",
                    required = true,
                    content = @Content(
                            examples = @ExampleObject(
                                    name = "Exemplo de Empresa",
                                    value = """
                                            {
                                              "name": "Tech Corp",
                                              "cnpj": "12.345.678/0001-95",
                                              "companyType": "TECH",
                                              "phoneNumber": "(11) 91234-5678",
                                              "cep": "12345-678",
                                              "city": "São Paulo",
                                              "street": "Rua das Inovações",
                                              "neighborhood": "Centro",
                                              "email": "empresa@techcorp.com",
                                              "password": "senhaForte456"
                                            }
                                            """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Empresa cadastrada com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Requisição inválida ou Tipo de usuário inválido"),
                    @ApiResponse(responseCode = "409", description = "E-mail ou CNPJ já cadastrado")
            })
    ResponseEntity<TokenResponseDTO> registerCompany(@Valid RegisterCompanyRequestDTO request);

    @Operation(
            summary = "Login",
            description = "Autentica um usuário com e-mail e senha, retornando um token JWT.",
            requestBody = @RequestBody(
                    description = "Credenciais do usuário",
                    required = true,
                    content = @Content(
                            examples = @ExampleObject(
                                    name = "Exemplo de Login",
                                    value = """
                                            {
                                              "email": "usuario@exemplo.com",
                                              "password": "senha123"
                                            }
                                            """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
                    @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
            })
    ResponseEntity<TokenResponseDTO> login(@Valid LoginRequestDTO request);

    @Operation(
            summary = "Solicitar redefinição de senha",
            description = "Envia um e-mail com o link para redefinir a senha do usuário.",
            requestBody = @RequestBody(
                    description = "E-mail do usuário",
                    required = true,
                    content = @Content(
                            examples = @ExampleObject(
                                    name = "Exemplo de Redefinição",
                                    value = """
                                            {
                                              "email": "usuario@exemplo.com"
                                            }
                                            """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Pedido de redefinição enviado"),
                    @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
            })
    ResponseEntity<?> resetPassword(@Valid ResetPasswordRequestDTO body);

    @Operation(
            summary = "Confirmar nova senha",
            description = "Define uma nova senha usando o token de redefinição.",
            requestBody = @RequestBody(
                    description = "Token de redefinição e nova senha",
                    required = true,
                    content = @Content(
                            examples = @ExampleObject(
                                    name = "Exemplo de Confirmação de Redefinição",
                                    value = """
                                            {
                                              "token": "abc.def.ghi",
                                              "newPassword": "novaSenhaSegura"
                                            }
                                            """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Senha redefinida com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Token inválido ou expirado")
            })
    ResponseEntity<MessageResponseDTO> confirmResetPassword(@Valid ConfirmedResetPasswordRequestDTO dto);
}
