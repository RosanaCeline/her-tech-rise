package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.CompanyProfileRequestDTO;
import com.hertechrise.platform.data.dto.response.CompanyProfileResponseDTO;
import com.hertechrise.platform.data.dto.response.MyCompanyProfileResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Perfil de Empresa", description = "Endpoints de perfil da empresa")
public interface CompanyProfileControllerDocs {

    @Operation(
            summary = "Obter perfil da empresa pelo ID",
            description = "Retorna o perfil completo da empresa, incluindo informações e postagens.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Perfil da empresa retornado com sucesso",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = CompanyProfileResponseDTO.class),
                                    examples = {
                                            @ExampleObject(
                                                    name = "Exemplo de resposta com 2 posts",
                                                    value = """
                            {
                              "id": 456,
                              "name": "TechRise Solutions",
                              "handle": "@techrise",
                              "externalLink": "https://www.techrise.com",
                              "email": "contato@techrise.com",
                              "phoneNumber": "(11) 98765-4321",
                              "city": "São Paulo",
                              "uf": "SP",
                              "followersCount": 2300,
                              "profilePic": "https://res.cloudinary.com/demo/image/upload/v123456/company_profile.jpg",
                              "companyType": "TECHNOLOGY",
                              "description": "Empresa focada em soluções inovadoras de tecnologia.",
                              "aboutUs": "Somos apaixonados por inovação e tecnologia para transformar negócios.",
                              "posts": [
                                {
                                  "id": 1,
                                  "authorId": 456,
                                  "content": "Lançamos nosso novo produto!",
                                  "createdAt": "2025-07-01T10:00:00",
                                  "communityId": 5,
                                  "media": [
                                    {
                                      "id": 100,
                                      "mediaType": "IMAGE",
                                      "url": "https://res.cloudinary.com/demo/image/upload/v123456/post1_img.jpg"
                                    }
                                  ]
                                },
                                {
                                  "id": 2,
                                  "authorId": 456,
                                  "content": "Estamos contratando desenvolvedores!",
                                  "createdAt": "2025-07-02T15:30:00",
                                  "communityId": 5,
                                  "media": []
                                }
                              ]
                            }
                            """
                                            )
                                    }
                            )
                    )
            }
    )
    ResponseEntity<CompanyProfileResponseDTO> getProfile(@PathVariable Long id);

    @Operation(
            summary = "Atualizar perfil empresa",
            description = "Atualiza os dados do perfil da empresa autenticada e retorna o perfil atualizado.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CompanyProfileRequestDTO.class)
                    )
            ),
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Perfil atualizado com sucesso.",
                            content = @Content(schema = @Schema(implementation = CompanyProfileResponseDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Dados inválidos (validação falhou)."
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Usuário não autenticado."
                    )
            }
    )
    ResponseEntity<CompanyProfileResponseDTO> updateMyProfile(@RequestBody CompanyProfileRequestDTO request);

    @Operation(
            summary = "Obter perfil da empresa autenticada",
            description = "Retorna os dados da empresa logada para preenchimento do formulário de edição.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Perfil retornado com sucesso",
                            content = @Content(schema = @Schema(implementation = MyCompanyProfileResponseDTO.class)))
            }
    )
    ResponseEntity<MyCompanyProfileResponseDTO> getMyProfile();
}