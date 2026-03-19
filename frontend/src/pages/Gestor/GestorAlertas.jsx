// src/pages/Gestor/GestorAlertas.jsx
// Componente de alertas de 30 dias para usar dentro da aba Gestor

export function GestorAlertas({ equipe }) {
  const hoje = new Date();

  const alertas = equipe.filter(membro => {
    if (!membro.createdAt) return false;
    const admissao = new Date(membro.createdAt);
    const dias = Math.floor((hoje - admissao) / (1000 * 60 * 60 * 24));
    return dias >= 25 && dias <= 35;
  }).map(membro => {
    const dias = Math.floor((hoje - new Date(membro.createdAt)) / (1000 * 60 * 60 * 24));
    return { ...membro, dias };
  });

  if (alertas.length === 0) return null;

  return (
    <div style={{
      width: '100%',
      background: 'var(--cor-fundo)',
      border: '1px solid #ffb300',
      borderRadius: 16,
      padding: '20px 28px',
      marginBottom: 10,
    }}>
      <h3 style={{
        color: '#ffb300',
        margin: '0 0 16px 0',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        ⚠️ Lembretes de Acompanhamento — 30 dias
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {alertas.map(membro => (
          <div key={membro.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: 10,
            background: 'var(--cor-fundo-sutil)',
            borderLeft: '4px solid #ffb300',
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--cor-texto)', fontSize: '0.95rem' }}>
                {membro.name}
              </p>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--cor-texto)', opacity: 0.65 }}>
                {membro.dias === 30
                  ? '🎯 Completou 30 dias hoje — envie o lembrete!'
                  : membro.dias < 30
                  ? `📅 Completa 30 dias em ${30 - membro.dias} dia(s)`
                  : `⏰ Está há ${membro.dias} dias — verifique o treinamento`}
              </p>
            </div>
            <span style={{
              background: '#ffb300',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: '0.8rem',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}>
              {membro.dias} dias
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}