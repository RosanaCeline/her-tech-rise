package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.JobApplicationRequestDTO;
import com.hertechrise.platform.data.dto.response.CandidateApplicationDetailsResponseDTO;
import com.hertechrise.platform.data.dto.response.CandidateApplicationSummaryResponseDTO;
import com.hertechrise.platform.data.dto.response.ReceivedApplicationDetailsResponseDTO;
import com.hertechrise.platform.data.dto.response.ReceivedApplicationsByJobResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Tag(name = "Candidaturas", description = "Endpoints para aplicação e gestão de candidaturas")
public interface JobApplicationControllerDocs {

    @Operation(
            summary = "Aplicar para uma vaga",
            description = "Permite que um profissional autenticado se candidate a uma vaga com currículo, portfólio e GitHub.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(implementation = JobApplicationRequestDTO.class)
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Candidatura registrada com sucesso",
                            content = @Content(schema = @Schema(implementation = CandidateApplicationDetailsResponseDTO.class))),
                    @ApiResponse(responseCode = "404", description = "Profissional ou vaga não encontrados")
            }
    )
    ResponseEntity<CandidateApplicationDetailsResponseDTO> applyToJob(JobApplicationRequestDTO requestDTO);

    @Operation(
            summary = "Visualizar detalhes da própria candidatura",
            description = "Retorna os detalhes de uma candidatura feita pelo profissional autenticado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Detalhes da candidatura",
                            content = @Content(schema = @Schema(implementation = CandidateApplicationDetailsResponseDTO.class))),
                    @ApiResponse(responseCode = "403", description = "A candidatura não pertence ao usuário logado"),
                    @ApiResponse(responseCode = "404", description = "Candidatura não encontrada")
            }
    )
    ResponseEntity<CandidateApplicationDetailsResponseDTO> getMyApplicationDetails(@PathVariable Long applicationId);

    @Operation(
            summary = "Listar minhas candidaturas",
            description = "Retorna uma lista com todas as candidaturas feitas pelo profissional autenticado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de candidaturas",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = CandidateApplicationSummaryResponseDTO.class))))
            }
    )
    ResponseEntity<List<CandidateApplicationSummaryResponseDTO>> listMyApplications();

    @Operation(
            summary = "Visualizar detalhes de uma candidatura recebida",
            description = "Retorna os detalhes de uma candidatura recebida pela empresa autenticada.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Detalhes da candidatura recebida",
                            content = @Content(schema = @Schema(implementation = ReceivedApplicationDetailsResponseDTO.class))),
                    @ApiResponse(responseCode = "403", description = "A empresa logada não tem permissão"),
                    @ApiResponse(responseCode = "404", description = "Candidatura não encontrada")
            }
    )
    ResponseEntity<ReceivedApplicationDetailsResponseDTO> getReceivedApplicationDetails(@PathVariable Long applicationId);

    @Operation(
            summary = "Listar candidaturas recebidas por vaga",
            description = "Retorna todas as candidaturas enviadas para uma vaga específica criada pela empresa autenticada.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Candidaturas recebidas para a vaga",
                            content = @Content(schema = @Schema(implementation = ReceivedApplicationsByJobResponseDTO.class))),
                    @ApiResponse(responseCode = "403", description = "A empresa logada não tem permissão para acessar a vaga"),
                    @ApiResponse(responseCode = "404", description = "Vaga não encontrada")
            }
    )
    ResponseEntity<ReceivedApplicationsByJobResponseDTO> listReceivedApplicationsByJob(@PathVariable Long jobId);

    @Operation(
            summary = "Excluir candidatura",
            description = "Realiza a exclusão lógica de uma candidatura feita pelo profissional autenticado.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Candidatura excluída com sucesso"),
                    @ApiResponse(responseCode = "403", description = "O usuário logado não tem permissão para excluir essa candidatura"),
                    @ApiResponse(responseCode = "404", description = "Candidatura não encontrada")
            }
    )
    ResponseEntity<Void> deleteApplication(@PathVariable Long id);
}
