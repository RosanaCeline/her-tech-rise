package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.response.MainListingResponseDTO;
import com.hertechrise.platform.data.dto.response.PagedResponseDTO;
import com.hertechrise.platform.data.dto.response.UserSummaryResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;

@Tag(name = "Listagem de Usuários", description = "Endpoints para listagem de profissionais e empresas")
public interface ListingControllerDocs {

    @Operation(
            summary = "Listagem principal (profissionais + empresas)",
            description = """
                Retorna até 6 profissionais e 6 empresas ordenados por nome.

                Regras de busca:
                - Sem parâmetro `q`: mostra os 6 primeiros de cada tipo (profissionais e empresas).
                - Com `q`: filtra por `name ILIKE %q%` ou `username ILIKE %q%` dentro do tipo.
                - Resultado não paginado, apenas listas fixas.
                - **O usuário autenticado (logado) não é incluído nos resultados.**
                """,
            parameters = {
                    @Parameter(name = "q", description = "Termo de busca (opcional)", example = "ana")
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Listagem combinada retornada com sucesso",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = MainListingResponseDTO.class)
                            )
                    )
            }
    )
    MainListingResponseDTO getMain(String q);

    @Operation(
            summary = "Listar profissionais com paginação",
            description = """
                Retorna uma página de profissionais filtrados e ordenados por nome.
            
                Regras de busca:
                - Busca opcional por `name ILIKE %q%` ou `username ILIKE %q%` dentro do tipo profissional.
                - Paginação e ordenação independentes (frontend mantém página, tamanho e ordenação).
                - Endpoint separado do de empresas, cada um tem sua própria paginação.
                - **O usuário autenticado (logado) não é incluído nos resultados.**
            
                Exemplo de uso:
                `{{baseUrl}}/api/listing/professionals?q=thalyta&page=0&size=20&sort=name,asc`
                """,
            parameters = {
                    @Parameter(name = "q", description = "Termo de busca (opcional)", example = "joana"),
                    @Parameter(name = "page", description = "Número da página (começa em 0)", example = "0"),
                    @Parameter(name = "size", description = "Tamanho da página", example = "20"),
                    @Parameter(name = "sort", description = "Campo para ordenação", example = "name,asc")
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200", description = "Lista paginada de profissionais retornada com sucesso",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PagedResponseDTO.class)
                            )
                    )
            }
    )
    PagedResponseDTO<UserSummaryResponseDTO> professionals(String q, Pageable page);

    @Operation(
            summary = "Listar empresas com paginação",
            description = """
                Retorna uma página de empresas filtradas e ordenadas por nome.

                Regras de busca:
                - Busca opcional por `name ILIKE %q%` ou `username ILIKE %q%` dentro do tipo empresa.
                - Paginação e ordenação independentes (frontend mantém página, tamanho e ordenação).
                - Endpoint separado do de profissionais, cada um tem sua própria paginação.
                - **O usuário autenticado (logado) não é incluído nos resultados.**
                
                Exemplo de uso:
                `{{baseUrl}}/api/listing/companies?q=tech&page=0&size=20&sort=name,asc`
                """,
            parameters = {
                    @Parameter(name = "q", description = "Termo de busca (opcional)", example = "tech"),
                    @Parameter(name = "page", description = "Número da página (começa em 0)", example = "0"),
                    @Parameter(name = "size", description = "Tamanho da página", example = "20"),
                    @Parameter(name = "sort", description = "Campo para ordenação, ex: 'name,asc'", example = "name,asc")
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200", description = "Lista paginada de empresas retornada com sucesso",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PagedResponseDTO.class)
                            )
                    )
            }
    )
    PagedResponseDTO<UserSummaryResponseDTO> companies(String q, Pageable page);
}
