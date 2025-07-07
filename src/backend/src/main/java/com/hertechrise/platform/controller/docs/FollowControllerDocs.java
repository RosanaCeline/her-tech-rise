package com.hertechrise.platform.controller.docs;

import com.hertechrise.platform.data.dto.request.FollowRequestDTO;
import com.hertechrise.platform.data.dto.request.UnfollowRequestDTO;
import com.hertechrise.platform.data.dto.response.FollowResponseDTO;
import com.hertechrise.platform.data.dto.response.MessageResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Seguir", description = "Endpoints para seguir usuários")
public interface FollowControllerDocs {

    @Operation(
            summary = "Seguir um usuário",
            description = "Permite que o usuário autenticado siga outro usuário.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json"
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Usuário seguido com sucesso",
                            content = @Content(schema = @Schema(implementation = FollowResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Requisição inválida"),
                    @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
            }
    )
    ResponseEntity<FollowResponseDTO> follow(FollowRequestDTO request);

    @Operation(
            summary = "Deixar de seguir um usuário",
            description = "Permite que o usuário autenticado deixe de seguir outro usuário.",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json"
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Unfollow realizado com sucesso",
                            content = @Content(schema = @Schema(implementation = MessageResponseDTO.class))),
                    @ApiResponse(responseCode = "404", description = "Relacionamento de follow não encontrado")
            }
    )
    ResponseEntity<MessageResponseDTO> unfollow(UnfollowRequestDTO request);

    @Operation(
            summary = "Listar quem o usuário segue",
            description = "Retorna todos os usuários que o usuário autenticado está seguindo.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Lista de seguidos retornada com sucesso",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = FollowResponseDTO.class)),
                                    examples = @ExampleObject(
                                            name = "Exemplo de lista de seguidores",
                                            value = """
                    [
                      {
                        "id": 1,
                        "followerId": 5,
                        "followingId": 10,
                        "followedAt": "2025-07-07T14:30:00"
                      },
                      {
                        "id": 2,
                        "followerId": 5,
                        "followingId": 15,
                        "followedAt": "2025-07-06T10:15:00"
                      }
                    ]
                    """
                                    )
                            )
                    )
            }
    )
    ResponseEntity<List<FollowResponseDTO>> listFollowing();

    @Operation(
            summary = "Listar seguidores de um usuário",
            description = "Retorna todos os usuários que seguem o usuário autenticado.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Lista de seguidores retornada com sucesso",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = FollowResponseDTO.class)),
                                    examples = @ExampleObject(
                                            name = "Exemplo de lista de seguidores",
                                            value = """
                    [
                      {
                        "id": 1,
                        "followerId": 7,
                        "followingId": 3,
                        "followedAt": "2025-07-07T14:30:00"
                      },
                      {
                        "id": 2,
                        "followerId": 9,
                        "followingId": 3,
                        "followedAt": "2025-07-06T10:15:00"
                      }
                    ]
                    """
                                    )
                            )
                    )
            }
    )
    ResponseEntity<List<FollowResponseDTO>> listFollowers();
}
