# 📱 Lembretes PWA - Webapp de Lembretes Diários

Uma Progressive Web App (PWA) minimalista e profissional para criar e gerenciar lembretes diários com notificações.

## 🎯 Objetivos do Projeto

Criar uma webapp que permita:
- Criar lembretes com data/hora específica
- Enviar notificações diárias para tarefas
- Funcionar offline (armazenamento local)
- Ser instalável como PWA no dispositivo móvel
- Tracking de quantos dias consecutivos uma tarefa está sendo feita
- Design clean, minimalista e profissional

## ✨ Funcionalidades Implementadas

### Funcionalidades Base
- ✅ Estrutura inicial do projeto Expo/React Native Web
- ⏳ Interface para criar lembretes
- ⏳ Seleção de data/hora para lembretes
- ⏳ Armazenamento offline (AsyncStorage/LocalStorage)
- ⏳ Sistema de notificações
- ⏳ Configuração PWA (manifest.json, service worker)
- ⏳ Tracking de dias consecutivos

### Funcionalidades Avançadas (Futuras)
- ⏳ Categorização de lembretes
- ⏳ Lembretes recorrentes (diário, semanal, mensal)
- ⏳ Estatísticas e gráficos de progresso
- ⏳ Temas dark/light
- ⏳ Backup na nuvem
- ⏳ Compartilhamento de lembretes
- ⏳ Widgets para tela inicial

## 🛠 Stack Tecnológica

### Frontend
- **React Native Web** - Para compatibilidade web/mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Type safety
- **CSS Modules** - Estilização modular

### PWA & Armazenamento
- **Service Worker** - Cache e funcionamento offline
- **Web App Manifest** - Configuração PWA
- **AsyncStorage/LocalStorage** - Armazenamento local
- **IndexedDB** - Banco de dados local (futuro)

### Notificações
- **Web Push API** - Notificações web
- **Notification API** - Notificações do navegador

## 📁 Estrutura do Projeto

```
lembretes-pwa/
├── App.tsx                 # Componente principal
├── index.ts               # Entry point
├── package.json           # Dependências
├── tsconfig.json          # Configuração TypeScript
├── app.json              # Configuração Expo
├── assets/               # Imagens e ícones
│   ├── icon.png          # Ícone da app
│   ├── favicon.png       # Favicon
│   ├── splash-icon.png   # Splash screen
│   └── adaptive-icon.png # Ícone adaptativo
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── screens/          # Telas da aplicação
│   ├── services/         # Serviços (notificações, storage)
│   ├── utils/            # Utilitários
│   ├── types/            # Tipos TypeScript
│   └── styles/           # Estilos globais
├── public/               # Arquivos estáticos web
│   ├── manifest.json     # Web App Manifest
│   └── sw.js             # Service Worker
└── docs/                 # Documentação
```

## 🎨 Design System

### Paleta de Cores
- **Primary**: #6366F1 (Indigo)
- **Secondary**: #8B5CF6 (Purple)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Background**: #FAFAFA (Light Gray)
- **Surface**: #FFFFFF (White)
- **Text Primary**: #111827 (Dark Gray)
- **Text Secondary**: #6B7280 (Medium Gray)

### Tipografia
- **Font Family**: Inter, SF Pro Display
- **Headings**: 
  - H1: 32px, Bold
  - H2: 24px, SemiBold
  - H3: 20px, Medium
- **Body**: 16px, Regular
- **Caption**: 14px, Medium

### Espaçamento
- **Base**: 4px
- **Padding**: 8px, 16px, 24px, 32px
- **Margin**: 8px, 16px, 24px, 32px
- **Border Radius**: 8px, 12px, 16px

## 🔄 Fluxo de Desenvolvimento

### Fase 1: Base da Aplicação ✅
- [x] Setup inicial do projeto
- [x] Configuração TypeScript
- [x] Estrutura de pastas

### Fase 2: Interface Base (Em Andamento)
- [ ] Tela principal de lembretes
- [ ] Componente de criar lembrete
- [ ] Design system implementado
- [ ] Navegação entre telas

### Fase 3: Funcionalidades Core
- [ ] Sistema de armazenamento local
- [ ] CRUD de lembretes
- [ ] Seletor de data/hora
- [ ] Lista de lembretes

### Fase 4: Notificações
- [ ] Configuração de notificações web
- [ ] Agendamento de notificações
- [ ] Gerenciamento de permissões

### Fase 5: PWA
- [ ] Web App Manifest
- [ ] Service Worker
- [ ] Cache strategies
- [ ] Instalação como app

### Fase 6: Tracking e Analytics
- [ ] Sistema de contagem de dias
- [ ] Estatísticas de progresso
- [ ] Dashboard de insights

### Fase 7: Polimento
- [ ] Animações e transições
- [ ] Otimizações de performance
- [ ] Testes automatizados
- [ ] Deploy

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI

### Instalação
```bash
cd lembretes-pwa
npm install
```

### Desenvolvimento
```bash
# Web development
npm run web

# Mobile preview
npm start
```

### Build para Produção
```bash
# Web build
expo export --platform web

# APK (Android)
expo build:android

# IPA (iOS)
expo build:ios
```

## 📱 PWA Features

### Características PWA
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Offline First**: Funciona sem internet
- **Instalável**: Pode ser instalado como app nativo
- **Notificações Push**: Lembretes mesmo com app fechado
- **Seguro**: HTTPS obrigatório
- **Performance**: Carregamento rápido

### Web App Manifest
```json
{
  "name": "Lembretes PWA",
  "short_name": "Lembretes",
  "description": "App de lembretes diários",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#6366F1",
  "background_color": "#FAFAFA",
  "icons": [...]
}
```

## 🔧 Próximos Passos

### Imediatos (Esta Sessão)
1. **Implementar interface base**
   - Tela principal com lista de lembretes
   - Modal/tela para criar lembrete
   - Componentes base (Button, Input, Card)

2. **Sistema de armazenamento**
   - Setup AsyncStorage para React Native
   - Setup localStorage para Web
   - Tipagem dos dados

3. **CRUD básico**
   - Criar lembrete
   - Listar lembretes
   - Editar lembrete
   - Deletar lembrete

### Próxima Sessão
1. **Sistema de notificações**
   - Configurar Notification API
   - Agendar notificações
   - Gerenciar permissões

2. **Configuração PWA**
   - Web App Manifest
   - Service Worker básico
   - Cache strategies

3. **Tracking de dias**
   - Lógica de contagem
   - Interface de estatísticas

### Futuro
1. **Melhorias UX/UI**
2. **Testes automatizados**
3. **Deploy e CI/CD**
4. **Features avançadas**

## 📝 Notas de Desenvolvimento

### Decisões Técnicas
- **React Native Web**: Escolhido para compartilhar código entre mobile e web
- **Expo**: Facilita desenvolvimento e build
- **TypeScript**: Para type safety e melhor DX
- **AsyncStorage**: Para persistência offline

### Desafios Conhecidos
- Notificações web têm limitações em iOS
- PWA no iOS tem algumas restrições
- Service Workers precisam de HTTPS

### Recursos Úteis
- [Expo Documentation](https://docs.expo.dev/)
- [PWA Guidelines](https://web.dev/progressive-web-apps/)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

---

**Última atualização**: 2 de Setembro, 2025