# Deploy no Render

Este documento explica como fazer o deploy da aplicação Recicla Angola no Render.

## Pré-requisitos

1. Conta no [Render](https://render.com)
2. Repositório Git do projeto (GitHub, GitLab ou Bitbucket)
3. Base de dados PostgreSQL (pode ser criada no Render)

## Passos para Deploy

### 1. Configurar Base de Dados PostgreSQL

1. Acesse o dashboard do Render
2. Clique em "New +" e selecione "PostgreSQL"
3. Configure:
   - **Name**: `recicla-angola-db`
   - **Database**: `recicla_angola`
   - **User**: `recicla_user` (ou deixe o padrão)
   - **Region**: Escolha a região mais próxima
   - **Plan**: Free (para testes) ou Starter
4. Clique em "Create Database"
5. Após criação, copie a **Internal Database URL** (será usada depois)

### 2. Deploy da Aplicação Web

#### Opção A: Usando render.yaml (Recomendado)

1. No dashboard do Render, clique em "New +" e selecione "Blueprint"
2. Conecte seu repositório Git
3. O Render detectará automaticamente o arquivo `render.yaml`
4. Configure as variáveis de ambiente:
   - `DATABASE_URL`: Cole a Internal Database URL da sua base de dados
   - `SESSION_SECRET`: Será gerado automaticamente
   - `NODE_ENV`: production
5. Clique em "Apply"

#### Opção B: Deploy Manual

1. No dashboard do Render, clique em "New +" e selecione "Web Service"
2. Conecte seu repositório Git
3. Configure:
   - **Name**: `recicla-angola`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev`
   - **Plan**: Free (para testes) ou Starter
4. Em "Advanced", adicione as variáveis de ambiente:
   - `DATABASE_URL`: Cole a Internal Database URL
   - `SESSION_SECRET`: Gere uma string aleatória segura
   - `NODE_ENV`: production
5. Configure Health Check:
   - **Health Check Path**: `/api/health`
6. Clique em "Create Web Service"

### 3. Executar Migrações da Base de Dados

Após o deploy inicial:

1. Acesse o Shell do seu serviço web no Render
2. Execute: `npm run db:push`

Ou configure uma execução automática adicionando ao build command:
```
npm install && npm run db:push
```

### 4. Verificar Deploy

1. Acesse a URL fornecida pelo Render (ex: `https://recicla-angola.onrender.com`)
2. Verifique se o endpoint de health check está funcionando: `https://seu-app.onrender.com/api/health`
3. Teste o registro e login de utilizadores

## Sistema Keep-Alive

A aplicação já inclui um sistema automático de keep-alive que:

- **No servidor**: Faz ping a si mesmo a cada 14 minutos
- **No frontend**: Faz ping ao servidor a cada 10 minutos
- Impede que o serviço hiberne no plano Free do Render

### Como Funciona

O plano Free do Render hiberna serviços após 15 minutos de inatividade. Nosso sistema:

1. Mantém o servidor ativo com auto-ping
2. Usa o endpoint `/api/health` para verificações
3. Registra logs de cada ping bem-sucedido

## Variáveis de Ambiente Necessárias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://user:password@host/db` |
| `SESSION_SECRET` | Chave secreta para sessões | String aleatória de 32+ caracteres |
| `NODE_ENV` | Ambiente de execução | `production` |
| `PORT` | Porta do servidor (auto no Render) | `5000` |

## Troubleshooting

### Aplicação não inicia
- Verifique os logs no dashboard do Render
- Confirme que `DATABASE_URL` está correta
- Verifique se as migrações foram executadas

### Base de dados não conecta
- Use a **Internal Database URL**, não a External
- Confirme que a base de dados está na mesma região que o serviço

### Serviço hiberna mesmo com keep-alive
- Verifique os logs para confirmar que os pings estão sendo executados
- No plano Free, pode haver limitações. Considere upgrade para Starter

## Custo Estimado

- **Free Tier**:
  - Web Service: Grátis (com limitações)
  - PostgreSQL: Grátis (expira após 90 dias)
  - Hiberna após 15 min de inatividade

- **Starter**:
  - Web Service: ~$7/mês
  - PostgreSQL: ~$7/mês
  - Sem hibernação

## Próximos Passos

1. Configure um domínio customizado (opcional)
2. Configure SSL/HTTPS (automático no Render)
3. Configure backups da base de dados
4. Monitore o uso e performance
5. Configure alertas e notificações

## Suporte

- [Documentação do Render](https://render.com/docs)
- [Render Community](https://community.render.com/)
