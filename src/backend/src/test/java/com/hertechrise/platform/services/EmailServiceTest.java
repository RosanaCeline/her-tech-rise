package com.hertechrise.platform.services;
import com.hertechrise.platform.config.EmailConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
@SpringBootTest
@ActiveProfiles("mailtrap")
class EmailServiceTest {

    //Testando envio de email personalizados com mailtrap servidor de teste SMTP

    @Autowired
    private EmailService emailService;

    @DisplayName("Valida o envio de e-mail de cadastro para profissional")
    @Test
    void sendRegisterProfessionalEmailSucess() {

        String destinatarioFicticioPro="professional@exemplo.com";
        emailService.sendRegisterProfessionalEmail(destinatarioFicticioPro);
    }

    @DisplayName("Valida o envio de e-mail de cadastro para empresa")
    @Test
    void sendRegisterCompanyEmailSucess(){
        String destinatarioFicticioCom="company@exemplo.com";
        emailService.sendRegisterCompanyEmail(destinatarioFicticioCom);

    }
    @DisplayName("Valida o envio de e-mail de recuperação de senha")
    @Test
    void sendResetPasswordEmailSucess(){
        String destinatario_ficticio="usuario@exemplo.com";
        String token="Token-fake";
        emailService.sendResetPasswordEmail(destinatario_ficticio,token);

    }
}