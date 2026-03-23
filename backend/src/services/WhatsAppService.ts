// src/services/WhatsAppService.ts
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { fileURLToPath } from 'url';
import path from 'path';
import qrcode from 'qrcode-terminal';

class WhatsAppService {
  public socket: ReturnType<typeof makeWASocket> | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private waitingForQR = false; 

  async connect() {
    try {
      const { version } = await fetchLatestBaileysVersion();
      console.log(`📱 Usando WhatsApp Web versão: ${version.join('.')}`);

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const authPath = path.resolve(__dirname, '../../whatsapp_auth');
      const { state, saveCreds } = await useMultiFileAuthState(authPath);

      this.socket = makeWASocket({
        version,
        auth: state,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        qrTimeout: 60000, // QR Code fica disponível por 60 segundos
      });

      this.socket.ev.on('creds.update', saveCreds);

      this.socket.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
          this.waitingForQR = true;
          this.reconnectAttempts = 0;
          console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('📱 ESCANEIE O QR CODE ABAIXO NO WHATSAPP:');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          qrcode.generate(qr, { small: true });
          console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('⏳ Aguardando scan... (60 segundos)');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          // Se estava aguardando QR e a conexão caiu, é timeout — reconecta imediatamente
          if (this.waitingForQR) {
            this.waitingForQR = false;
            console.log('⏰ QR Code expirado. Gerando novo QR Code...\n');
            setTimeout(() => this.connect(), 1000);
            return;
          }

          if (shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Reconectando... tentativa ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            setTimeout(() => this.connect(), 5000);
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('❌ Máximo de tentativas atingido. Reinicie o servidor.');
          } else {
            this.isConnected = false;
            console.log('WhatsApp desconectado (logout). Reinicie o servidor para reconectar.');
          }
        }

        if (connection === 'open') {
          this.isConnected = true;
          this.waitingForQR = false;
          this.reconnectAttempts = 0;
          console.log('\n✅ WhatsApp conectado com sucesso!\n');
        }
      });

    } catch (error) {
      console.error('Erro ao conectar WhatsApp:', error);
    }
  }

  async sendMessage(phone: string, message: string) {
  if (!this.socket || !this.isConnected) {
    throw new Error('WhatsApp não está conectado.');
  }

  // Remove caracteres especiais e garante formato correto
  const formattedPhone = phone.replace(/\D/g, '');
  const jid = `${formattedPhone}@s.whatsapp.net`;

  await this.socket.sendMessage(jid, { text: message });
  console.log(`✅ Mensagem enviada para ${phone}`);
}
   async sendToSelf(message: string) {
  if (!this.socket || !this.isConnected) {
    throw new Error('WhatsApp não está conectado.');
  }

  const me = this.socket.user?.id;
  if (!me) throw new Error('ID do usuário não disponível.');

  // Remove o :36 e mantém só o número@s.whatsapp.net
  const cleanJid = me.split(':')[0] + '@s.whatsapp.net';
  console.log('Enviando para JID limpo:', cleanJid);

  await this.socket.sendMessage(cleanJid, { text: message });
  console.log('✅ Mensagem enviada para si mesmo');
}
}

export const whatsappService = new WhatsAppService();