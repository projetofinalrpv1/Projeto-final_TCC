// src/services/EmailService.ts
import nodemailer from 'nodemailer';

class EmailService {
 private transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // ← adiciona isso
  }
});
  async sendWelcomeEmail(name: string, email: string, password: string, role: string) {
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('GMAIL_PASS length:', process.env.GMAIL_APP_PASSWORD?.length);
    const roleLabel = role === 'GESTOR' ? 'Gestor' : 'Colaborador';

   
    try {
      await this.transporter.verify();
      console.log('✅ Conexão com Gmail verificada!');
      console.log('📧 Enviando para:', email);
      console.log('📧 Remetente:', process.env.GMAIL_USER);
    } catch (verifyError) {
      console.error('❌ Falha na verificação Gmail:', verifyError);
      throw verifyError;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6f2; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #aab193, #b9bea4); padding: 40px 30px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 28px; letter-spacing: 1px; }
          .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px; }
          .body { padding: 40px 30px; }
          .greeting { font-size: 18px; color: #2f3e2f; font-weight: 600; margin-bottom: 16px; }
          .message { font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 28px; }
          .credentials { background: #f4f6f2; border-radius: 12px; padding: 24px; margin-bottom: 28px; border-left: 4px solid #aab193; }
          .credentials h3 { margin: 0 0 16px; color: #2f3e2f; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
          .credential-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .credential-label { font-size: 13px; color: #888; }
          .credential-value { font-size: 14px; color: #2f3e2f; font-weight: 600; }
          .warning { background: #fff8e1; border-radius: 10px; padding: 16px; font-size: 13px; color: #856404; margin-bottom: 28px; }
          .btn { display: block; text-align: center; background: linear-gradient(135deg, #aab193, #b9bea4); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 0 auto 28px; width: fit-content; }
          .footer { background: #f4f6f2; padding: 20px 30px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ON THE JOB</h1>
            <p>Sistema de Gestão de Integração</p>
          </div>
          <div class="body">
            <p class="greeting">Bem-vindo(a), ${name}! 👋</p>
            <p class="message">
             Estamos muito felizes com a sua chegada! Você foi cadastrado(a) como <strong>${roleLabel}</strong> 
              no sistema <strong>ON THE JOB</strong>. Abaixo estão suas credenciais de acesso à plataforma.
            </p>

            <div class="credentials">
              <h3>🔑 Suas Credenciais de Acesso</h3>
              <div class="credential-row">
                <span class="credential-label">E-mail:</span>
                <span class="credential-value">${email}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">Senha provisória:</span>
                <span class="credential-value">${password}</span>
              </div>
            </div>

            <div class="warning">
              ⚠️ <strong>Importante:</strong> Esta é uma senha provisória. Recomendamos que você altere sua senha 
              no primeiro acesso em <strong>Configurações → Alterar senha</strong>.
            </div>

            <a href="http://localhost:5173" class="btn">Acessar o Sistema →</a>

            <p class="message" style="font-size: 13px; color: #888;">
              Se você não esperava receber este e-mail ou acredita que houve um engano, 
              entre em contato com o administrador do sistema.
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} ON THE JOB — Sistema de Gestão de Integração<br>
            Este é um e-mail automático, por favor não responda.
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"ON THE JOB" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: '🎉 Bem-vindo(a) ao ON THE JOB! Suas credenciais de acesso',
        html,
      });

      console.log(`✅ E-mail enviado! MessageId: ${info.messageId}`);
    } catch (sendError) {
      console.error('❌ Erro ao enviar e-mail:', sendError);
      throw sendError;
    }
  }
}

export const emailService = new EmailService();