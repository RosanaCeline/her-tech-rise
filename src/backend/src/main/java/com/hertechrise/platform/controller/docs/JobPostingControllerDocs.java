package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.JobPostingRequestDTO;
import com.hertechrise.platform.data.dto.response.JobPostingResponseDTO;
import com.hertechrise.platform.data.dto.response.JobPostingSummaryResponseDTO;
import com.hertechrise.platform.data.dto.response.PublicJobPostingResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Tag(name = "Vagas", description = "Endpoints para gerenciamento e visualização de vagas de emprego")
public interface JobPostingControllerDocs {

    @Operation(
            summary = "Criar uma nova vaga",
            description = "Permite que uma empresa autenticada crie uma nova vaga.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = JobPostingRequestDTO.class)
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Vaga criada com sucesso",
                            content = @Content(schema = @Schema(implementation = JobPostingResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos no corpo da requisição"),
                    @ApiResponse(responseCode = "404", description = "Usuário autenticado não é uma empresa")
            }
    )
    ResponseEntity<JobPostingResponseDTO> create(@Valid @RequestBody JobPostingRequestDTO request);


    @Operation(
            summary = "Atualizar uma vaga existente",
            description = "Permite que uma empresa atualize uma vaga que ela criou.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = JobPostingRequestDTO.class)
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Vaga atualizada com sucesso",
                            content = @Content(schema = @Schema(implementation = JobPostingResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Requisição malformada ou dados inválidos"),
                    @ApiResponse(responseCode = "403", description = "Vaga não pertence à empresa logada"),
                    @ApiResponse(responseCode = "404", description = "Vaga não encontrada ou usuário não é uma empresa")
            }
    )
    ResponseEntity<JobPostingResponseDTO> update(@PathVariable Long id, @Valid @RequestBody JobPostingRequestDTO request);

    @Operation(
            summary = "Desativar vaga",
            description = "Desativa uma vaga existente para que ela não fique visível publicamente.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Vaga desativada com sucesso"),
                    @ApiResponse(responseCode = "403", description = "Vaga não pertence à empresa logada"),
                    @ApiResponse(responseCode = "404", description = "Vaga não encontrada ou usuário não é uma empresa")
            }
    )
    ResponseEntity<String> deactivateJobPosting(@PathVariable Long id);

    // ========== Público ==========

    @Operation(
            summary = "Listar vagas públicas ativas",
            description = "Retorna todas as vagas públicas que ainda estão ativas e não expiraram.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Lista de vagas públicas",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = JobPostingSummaryResponseDTO.class)),
                                    examples = @ExampleObject(
                                            name = "Exemplo de vagas públicas",
                                            value = """
                                            [
                                              {
                                                "id": 1,
                                                "title": "Desenvolvedora Backend",
                                                "companyName": "TechRise",
                                                "location": "São Paulo - SP",
                                                "jobLevel": "JUNIOR",
                                                "applicationDeadline": "2025-08-15",
                                                "isActive": true,
                                                "isExpired": false,
                                                "companyPic": "https://cdn.logo.com/company123.png",
                                                "companyId": 3
                                              }
                                            ]
                                            """
                                    )
                            )
                    )
            }
    )
    ResponseEntity<List<JobPostingSummaryResponseDTO>> getPublicJobPostings();

    @Operation(
            summary = "Buscar vaga pública por ID",
            description = "Busca detalhes de uma vaga pública específica pelo ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Detalhes da vaga pública",
                            content = @Content(schema = @Schema(implementation = JobPostingResponseDTO.class))),
                    @ApiResponse(responseCode = "404", description = "Vaga não encontrada ou não pública")
            }
    )
    ResponseEntity<PublicJobPostingResponseDTO> getPublicById(@PathVariable Long postId);

    @Operation(
            summary = "Listar vagas públicas de uma empresa",
            description = "Lista todas as vagas ativas e públicas de uma empresa específica.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de vagas da empresa",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = JobPostingSummaryResponseDTO.class))))
            }
    )
    ResponseEntity<List<JobPostingSummaryResponseDTO>> getPublicJobPostingsByCompany(@PathVariable Long companyId);

    // ========== Empresa logada ==========

    @Operation(
            summary = "Listar vagas da empresa autenticada",
            description = "Retorna todas as vagas (ativas e inativas) da empresa logada.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de vagas da empresa logada",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = JobPostingSummaryResponseDTO.class))))
            }
    )
    ResponseEntity<List<JobPostingSummaryResponseDTO>> getCompanyJobPostings();

    @Operation(
            summary = "Buscar vaga da empresa autenticada",
            description = "Retorna os detalhes de uma vaga da empresa logada pelo ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Detalhes da vaga",
                            content = @Content(schema = @Schema(implementation = JobPostingResponseDTO.class))),
                    @ApiResponse(responseCode = "404", description = "Vaga não encontrada")
            }
    )
    ResponseEntity<JobPostingResponseDTO> getCompanyById(@PathVariable Long postId);
}
