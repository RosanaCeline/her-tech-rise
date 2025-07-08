package com.hertechrise.platform.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenData {
    private String email;
    private Long id;
    private String name;

}
