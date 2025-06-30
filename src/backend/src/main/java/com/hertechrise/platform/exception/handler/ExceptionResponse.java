package com.hertechrise.platform.exception.handler;

import java.util.Date;

public record ExceptionResponse(Date timestamp, String message, String details) {
}
