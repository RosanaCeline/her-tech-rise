package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.ProfessionalProfileRequestDTO;
import com.hertechrise.platform.data.dto.response.ProfessionalProfileResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@Tag(name = "Perfil de Profissional", description = "Endpoints de perfil do(a) profissional")
public interface ProfessionalProfileControllerDocs {

    @Operation(
            summary = "Obter perfil profissional por ID",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Perfil profissional encontrado com sucesso",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ProfessionalProfileResponseDTO.class),
                                    examples = {
                                            @ExampleObject(
                                                    name = "Exemplo 1",
                                                    value = """
                            {
                              "id": 123,
                              "name": "Ana Clara Silva",
                              "handle": "@anaclara",
                              "externalLink": "https://github.com/ana-dev",
                              "email": "ana.clara@email.com",
                              "phoneNumber": "(11) 91234-5678",
                              "city": "Campinas",
                              "uf": "SP",
                              "followersCount": 154,
                              "profilePic": "https://res.cloudinary.com/demo/image/upload/v123456/profile.jpg",
                              "technology": "Java | Spring Boot",
                              "biography": "Desenvolvedora backend com 5 anos de experiência em Java e AWS.",
                              "experiences": [
                                {
                                  "id": 1,
                                  "title": "Desenvolvedora Java",
                                  "company": "Empresa X",
                                  "modality": "Presencial",
                                  "startDate": "2019-01-01",
                                  "endDate": "2021-12-31",
                                  "isCurrent": false,
                                  "description": "Trabalhou com APIs REST."
                                },
                                {
                                  "id": 2,
                                  "title": "Engenheira de Software",
                                  "company": "Empresa Y",
                                  "modality": "Remoto",
                                  "startDate": "2022-01-01",
                                  "endDate": null,
                                  "isCurrent": true,
                                  "description": "Lidera equipe backend."
                                }
                              ],
                              "posts": [
                                {
                                  "id": 101,
                                  "authorId": 123,
                                  "content": "Postagem de exemplo",
                                  "createdAt": "2025-07-07T14:00:00",
                                  "communityId": 5,
                                  "media": []
                                },
                                {
                                  "id": 102,
                                  "authorId": 123,
                                  "content": "Outra postagem",
                                  "createdAt": "2025-07-06T10:30:00",
                                  "communityId": 5,
                                  "media": [
                                    {
                                      "id": 1,
                                      "mediaType": "IMAGE",
                                      "url": "https://example.com/image.jpg"
                                    }
                                  ]
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
    ResponseEntity<ProfessionalProfileResponseDTO> getProfile(@PathVariable Long id);

    @Operation(
            summary = "Atualizar perfil profissional",
            description = "Atualiza os dados do perfil do profissional autenticado e retorna o perfil atualizado.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Perfil atualizado com sucesso",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ProfessionalProfileResponseDTO.class),
                                    examples = @ExampleObject(value = """
                    {
                      "id": 123,
                      "name": "Ana Clara Silva",
                      "handle": "@anaclara",
                      "externalLink": "https://github.com/ana-dev",
                      "email": "ana.clara@email.com",
                      "phoneNumber": "(11) 91234-5678",
                      "city": "Campinas",
                      "uf": "SP",
                      "followersCount": 154,
                      "profilePic": "https://res.cloudinary.com/demo/image/upload/v123456/profile.jpg",
                      "technology": "Java | Spring Boot",
                      "biography": "Desenvolvedora backend com 5 anos de experiência em Java e AWS.",
                      "experiences": [
                        {
                          "id": 1,
                          "title": "Desenvolvedora Java",
                          "company": "Tech Solutions",
                          "modality": "Presencial",
                          "startDate": "2018-01-01",
                          "endDate": "2022-06-30",
                          "current": false,
                          "description": "Desenvolvimento de sistemas bancários."
                        },
                        {
                          "id": 2,
                          "title": "Engenheira de Software",
                          "company": "Innovatech",
                          "modality": "Remoto",
                          "startDate": "2022-07-01",
                          "endDate": null,
                          "current": true,
                          "description": "Liderança de projetos de backend em nuvem."
                        }
                      ],
                      "posts": [
                        {
                          "id": 10,
                          "authorId": 123,
                          "content": "Compartilhando meu último projeto em Spring Boot!",
                          "createdAt": "2025-07-01T14:30:00",
                          "communityId": 5,
                          "media": [
                            {
                              "id": 100,
                              "mediaType": "IMAGE",
                              "url": "https://res.cloudinary.com/demo/image/upload/v123456/project.png"
                            }
                          ]
                        },
                        {
                          "id": 11,
                          "authorId": 123,
                          "content": "Participando do evento de tecnologia XYZ.",
                          "createdAt": "2025-06-15T09:00:00",
                          "communityId": 8,
                          "media": []
                        }
                      ]
                    }
                    """)
                            )
                    )
            }
    )
    @PutMapping("/update")
    ResponseEntity<ProfessionalProfileResponseDTO> updateMyProfile(@RequestBody ProfessionalProfileRequestDTO request);

}
