# Remote Config

O Remote Config da aplicação fica no [Eitri Console](https://console.eitri.tech). Ele vem pré-preenchido com as configurações que o template usa. Este documento lista cada configuração lida pelo template, para que serve e onde é usada.

Algumas configurações não são lidas pelo código do template. Elas são consumidas pela lib [`eitri-shopping-wake-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-wake-shared) ou pela própria plataforma Eitri, e estão marcadas na coluna **Onde é usado**.

## `ecommerceProvider`

| Campo | Tipo | Descrição | Onde é usado |
| --- | --- | --- | --- |
| `ecommerceProvider` | string | Plataforma de e-commerce. Para este template: `"WAKE"` | Lib [`eitri-shopping-wake-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-wake-shared) (`Wake.tryAutoConfigure()`, chamado ao iniciar cada app) |

## `providerInfo`

Dados de conexão com a loja Wake.

| Campo | Obrigatório | Tipo | Default | Descrição | Onde é usado |
| --- | --- | --- | --- | --- | --- |
| `account` | Sim | string | — | Conta da loja na Wake. Também é usada como prefixo das chaves salvas no storage do dispositivo | Lib [`eitri-shopping-wake-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-wake-shared); o template lê o valor via `Wake.configs.account` (account, cart e home) |
| `host` | Sim | string (URL ou domínio) | `''` | URL da loja. Usada para montar o link de compartilhamento do produto | `pdp`: `components/Header/Header.jsx`, `views/Home.jsx` |
| `domain` | Não | string | valor de `host` | Domínio usado no link de compartilhamento do produto. Tem prioridade sobre `host` | `pdp`: `components/Header/Header.jsx` |
| `tcs_account` | Não | string | — | Conta de integração usada pela lib (o template não lê esse campo) | Lib [`eitri-shopping-wake-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-wake-shared) |
| `eitriContentCmsUrl` | Sim, para ter conteúdo no CMS | string (URL) | — | URL base da API do Eitri Content (CMS). O template acrescenta `?where[type][equals]=<tipo da página>` a essa URL, por isso ela não deve ter query string | `home`: `services/CmsService.js` |
| `eitriCmsHomeKey` | Sim, para ter conteúdo na Home | string | — | Tipo da página do CMS usada como Home | `home`: `services/CmsService.js` (`getCmsHome`) |
| `partnerByRegion` | Não | boolean | `false` | Liga o fluxo de seller por região: o app pede o CEP do cliente e associa o carrinho ao parceiro daquela região | `home`: `services/PartnerService.js` |

## `appConfigs`

Aparência e comportamento do app.

| Campo | Tipo | Default | Descrição | Onde é usado |
| --- | --- | --- | --- | --- |
| `headerLogo` | string (URL de imagem) | sem logo | Logo exibido no header da Home | `shared`: `components/Header/HeaderLogo.jsx` |
| `deleteAccountUrl` | string (URL) | botão oculto | Link externo para a exclusão de conta. Sem esse campo, o botão "Excluir conta" não aparece | `account`: `views/EditProfile.jsx` |
| `style.headerBackgroundColorToken` | string (token de cor do tema, ex.: `primary-900`) | `primary-900` | Cor de fundo do header. Se o token contém `primary`, a área do cliente usa a versão branca do logo | `account`: `components/Shared/HeaderTemplate/HeaderTemplate.jsx`; `pdp`: `views/ErrorNotFound.jsx` |
| `style.headerContentColorToken` | string (token de cor do tema) | `accent-100` | Cor do texto e dos ícones do header | `account`: `components/Shared/HeaderTemplate/HeaderTemplate.jsx`; `pdp`: `views/ErrorNotFound.jsx` |
| `storeStyle` | string | layout em coluna | Estilo de layout da PDP. Com o valor `magazine`, os atributos do produto são exibidos em linha | `pdp`: `views/Home.jsx` |

## `eitriConfig`

Configurações de navegação consumidas pela plataforma Eitri (o código do template não lê esses campos).

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `mainApp` | string | Slug do Eitri-App aberto ao iniciar o app |
| `renderFakeBottomBar` | boolean | Renderiza uma bottom bar simulada |
| `dynamicBottomBar` | object | Bottom bar do app: `layout` define a aparência e `eitriApps` define as abas, na ordem de exibição, com o app (`slug`) e os `initParams` de cada uma |

O formato completo do `dynamicBottomBar` (campos, defaults e requisitos dos ícones) está na [documentação oficial da DynamicBottomBar](https://cdn.83io.com.br/library/eitri-shopping-modules-doc/doc/latest/classes/_internal_.DynamicBottomBar.html).

No `shopping-wake-template-home`, o `route` dos `initParams` abre a rota indicada (ex.: `"Categories"`) e os demais campos são repassados a ela.

### Simulação local

No `eitri app start`, a bottom bar é simulada a partir de `bottom-tab-view-simulation` no [`app-config.yaml`](../app-config.yaml): `eitri-apps` define as abas e `layout` repete o formato do `dynamicBottomBar` (`layout.layout` para a aparência e `layout.eitriApps` para título e ícone). As abas de `layout.eitriApps` casam com as de `eitri-apps` pela posição, então mantenha as duas listas na mesma ordem.
