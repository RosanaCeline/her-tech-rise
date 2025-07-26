package com.hertechrise.platform.services;
import com.hertechrise.platform.config.DotenvInitializer;
import com.hertechrise.platform.config.EmailConfig;
import com.hertechrise.platform.mail.EmailSender;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("mailtrap")
@Transactional
@Rollback
@ContextConfiguration(initializers = DotenvInitializer.class)
class EmailServiceTest {

    //Testando envio de email personalizados com mailtrap servidor de teste SMTP

    @Autowired
    private EmailSender emailSender;

    @Autowired
    private EmailConfig emailConfigs;

    @DisplayName("Valida o envio de e-mail de cadastro para profissional")
    @Test
    void sendRegisterProfessionalEmailSuccess() {

        String destinatarioFicticioPro="professional@exemplo.com";
        emailService.sendRegisterProfessionalEmail(destinatarioFicticioPro);

    }

    @DisplayName("Valida o envio de e-mail de cadastro para empresa")
    @Test
    void sendRegisterCompanyEmailSuccess(){
        String destinatarioFicticioCom="company@exemplo.com";
        emailService.sendRegisterCompanyEmail(destinatarioFicticioCom);

    }
    @DisplayName("Valida o envio de e-mail de recuperação de senha")
    @Test
    void sendResetPasswordEmailSuccess(){
        String destinatario_ficticio="usuario@exemplo.com";
        String token="Token-fake";
        emailService.sendResetPasswordEmail(destinatario_ficticio,token);

    }
}