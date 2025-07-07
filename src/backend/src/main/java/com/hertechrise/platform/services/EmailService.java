package com.hertechrise.platform.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hertechrise.platform.config.EmailConfig;
import com.hertechrise.platform.mail.EmailSender;
import com.hertechrise.platform.mail.EmailTemplateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired
    private EmailSender emailSender;

    @Autowired
    private EmailConfig emailConfigs;

    String filePath = "src/main/resources/templates/emailTemplate.html";

    public void sendRegisterProfessionalEmail(String to) {;
        String subject = "Cadastro realizado - Her Tech Rise";

        String emailContent = String.format("""
            Olá,<br><br>
            
            Seja bem-vindo(a) à <strong>Her Tech Rise</strong>!<br><br>
        
            Seu cadastro foi realizado com sucesso e agora você faz parte de uma rede que valoriza e impulsiona mulheres
            na tecnologia.<br><br>
        
            A partir de agora, você poderá explorar vagas, acessar cursos, criar conexões e compartilhar sua jornada profissional
            em nossas comunidades.<br><br>
        
            Se tiver dúvidas ou precisar de ajuda, conte com a gente!<br><br>
        
            Obrigada por fazer parte desse movimento 💜<br><br>
        
            — Equipe Her Tech Rise
            """);

        String body = EmailTemplateUtil.loadTemplate(filePath, emailContent);

        emailSender
                .to(to)
                .withSubject(subject)
                .withMessage(body)
                .send(emailConfigs);
    }

    public void sendRegisterCompanyEmail(String to) {;
        String subject = "Cadastro realizado - Her Tech Rise";

        String emailContent = String.format("""
           Olá,<br><br>
           
           Seja bem-vinda à <strong>Her Tech Rise</strong>!<br><br>
           
           O cadastro da sua empresa foi realizado com sucesso. Agora vocês fazem parte de uma rede comprometida em 
           promover diversidade, inclusão e oportunidades reais para mulheres na tecnologia.<br><br>
                
           A partir de agora, sua equipe poderá divulgar vagas, disponibilizar cursos e conectar-se com profissionais 
           qualificadas e contribuir ativamente para uma tecnologia mais plural.<br><br>
                
           Em caso de dúvidas ou suporte, nossa equipe está à disposição.<br><br>
                
           Obrigada por fazer parte dessa transformação 💜<br><br>
                
           — Equipe Her Tech Rise
           """);

        String body = EmailTemplateUtil.loadTemplate(filePath, emailContent);

        emailSender
                .to(to)
                .withSubject(subject)
                .withMessage(body)
                .send(emailConfigs);
    }

    public void sendResetPasswordEmail(String to, String token) {
        String baseUrl = "http://localhost:3000/redefinirnovasenha";
        String resetLink = baseUrl + "?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
        String subject = "Pedido de Redefinição de Senha - Her Tech Rise";

        String emailContent = String.format("""
        Olá,<br><br>
        Recebemos uma solicitação para redefinir a senha da sua conta no Her Tech Rise.<br>
        Para continuar, clique no botão abaixo:<br><br>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
            <tr>
                <td align="center" bgcolor="#6c2cbf" style="border-radius: 6px;">
                <a href="%s" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px;">
                Redefinir Senha
                </a>
                </td>
            </tr>
        </table>
        <br>
        <strong>Se você não solicitou a redefinição de senha, pode ignorar este e-mail com segurança — sua senha permanecerá a mesma.</strong><br><br>
        Este link de redefinição é válido por <strong>30 minutos</strong>.<br>
        Depois disso, será necessário solicitar uma nova redefinição.<br><br>
        Obrigado por usar a Her Tech Rise! 💜<br>
        — Equipe Her Tech Rise
        """, resetLink);
        String body = EmailTemplateUtil.loadTemplate(filePath, emailContent);

        emailSender
                .to(to)
                .withSubject(subject)
                .withMessage(body)
                .send(emailConfigs);
    }
}
