import React, { useState } from 'react';
import { 
  Search, Settings, Database, Rocket, Activity, ShieldAlert, 
  HelpCircle, Target, Calendar, MapPin, Users, Wrench, DollarSign,
  ChevronRight, AlertTriangle, CheckCircle2, XCircle, Clock, Zap, 
  Snowflake, ClipboardCheck, LayoutGrid
} from 'lucide-react';

const App = () => {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [filter, setFilter] = useState('All');

  const termsData = {
    // NÍVEL BÁSICO
    "UAT (User Acceptance Testing)": {
      level: "Básico",
      why: "Valida que requisitos de negócio foram traduzidos corretamente. Gera decisão go/no-go vinculante. Reduz risco de rejeição pós-produção.",
      what: "Teste funcional por usuários reais em ambiente staging que replica produção (dados sanitizados, mesmas integrações).",
      when: "3-4 semanas antes do go-live. Ocorre após SIT e antes do Cutover.",
      where: "Ambiente dedicado UAT (staging) com infraespelho de produção.",
      who: "5-10 business users (executores), BAs/POs (facilitadores), Steering Committee (decisores).",
      how: "Treino -> Execução de workflows -> Logging de defects -> Triage -> Sign-off formal.",
      howMuch: "Duração: 2-6 semanas. Custo: $40-100k+. ROI: Evita retrabalho de $100-500k.",
      risk: "Dados simplificados criam 'falsa confiança'. Use dados anonimizados de produção."
    },
    "Sandbox": {
      level: "Básico",
      why: "Desacopla inovação de riscos à produção. Permite experimentação e onboarding sem afetar dados reais.",
      what: "Ambiente isolado que replica produção (OS, middleware, DB). Tipos: Dev, Dev Pro, Partial e Full Sandbox.",
      when: "Criação na Semana 1. Refresh imediato antes do UAT.",
      where: "Cloud (AWS/Salesforce) ou on-prem replicado. Network isolada.",
      who: "Architects (owners), Devs/QA (users), Compliance (data masking).",
      how: "Clone via IaC -> Masking (GDPR) -> Customização -> Smoke Test.",
      howMuch: "$20-50k/ano. Setup: 2-4h (automatizado).",
      risk: "Não use para testes de performance se o hardware for tier inferior."
    },
    "Go-Live": {
      level: "Básico",
      why: "Evento de transição formal legado -> novo. Exige coordenação 24/7 para evitar perda de dados e outages.",
      what: "Janela de 24-72h: Cutover Técnico -> Lançamento Controlado -> Estabilização.",
      when: "Sexta-feira à noite até domingo (minimiza impacto).",
      where: "Ambiente de Produção e War Room dedicada.",
      who: "Cutover Lead, 15-30 consultores técnicos, Executivos (CFO/COO).",
      how: "Backup Legado -> Data Migration -> Smoke Tests -> Go/No-Go Decision.",
      howMuch: "$1-5M+ (incluindo Hypercare de 4-12 semanas).",
      risk: "Zero blockers em smoke tests é critério inegociável para prosseguir."
    },
    "Smoke Testing": {
      level: "Básico",
      why: "Gate rápido pós-deployment. Valida que o build NÃO quebrou funções críticas como login e transações core.",
      what: "Suite pequena (10-20 casos) e rápida (< 2h). Rejeita o build imediatamente se falhar.",
      when: "Imediatamente após deploy em staging/produção. Todo novo build.",
      where: "Staging ou Produção (com contas-teste isoladas).",
      who: "QA Engineers (manual ou automated) e QA Lead.",
      how: "Identificar críticas -> Script CI/CD -> Execução -> Fail build if any fail.",
      howMuch: "Setup: 4-8h. Execução: 30-120 min. Economiza $200-500/run.",
      risk: "Falha bloqueia o merge/deployment automático para evitar contaminação."
    },
    "Provisioning": {
      level: "Básico",
      why: "Automação de infraestrutura. Permite elasticidade, reduz erro humano e documenta infra como código (IaC).",
      what: "Alocação automatizada de recursos (VMs, storage, redes, DBs) via Terraform ou CloudFormation.",
      when: "On-demand (instântaneo ou via approval).",
      where: "Cloud (AWS, Azure, GCP).",
      who: "DevOps Engineers e Infrastructure Architects.",
      how: "IaC Definition -> Templating -> Automação CI/CD -> Validação pós-infra.",
      howMuch: "Setup: 2-4 semanas. Economia de 10-20h de trabalho manual por requisição.",
      risk: "Falta de governança em IaC pode gerar custos de cloud descontrolados."
    },

    // NÍVEL INTERMEDIÁRIO
    "Configuration": {
      level: "Intermediário",
      why: "Adaptar software a regras de negócio SEM alterar código. Mantém estabilidade em upgrades.",
      what: "Ajuste de flags, workflows e permissões via UI nativa do vendor.",
      when: "Fase de Build (Semanas 5-16). Implementação em dias.",
      where: "Admin Console do software.",
      who: "Functional Consultants.",
      how: "Ativar flags -> Criar workflows -> Definir campos obrigatórios.",
      howMuch: "5-10% do projeto. Baixo custo e alta estabilidade.",
      risk: "A 'Regra de Ouro' é 80% Configuration e 20% Customization."
    },
    "Customization": {
      level: "Intermediário",
      why: "Estender software para requisitos únicos. Essencial para diferenciais estratégicos proprietários.",
      what: "Modificação de código-fonte ou extensões programáticas (SDKs).",
      when: "Fase de Build (Semanas 5-16). Implementação em meses.",
      where: "Codebase e SDKs proprietários.",
      who: "Developers (ABAP, Apex, PL-SQL).",
      how: "Develop código -> Teste unitário -> Documentar -> Integrar CI/CD.",
      howMuch: "Adiciona 40-100% ao custo. Exige developers caros.",
      risk: "Quebra com upgrades; exige retest e refactoring constante."
    },
    "Data Migration": {
      level: "Intermediário",
      why: "Transferir dados preservando integridade e compliance. Risco crítico de dados órfãos.",
      what: "Extração, transformação e carga controlada (Assessment, Mapping, ETL, Validation).",
      when: "Planning (Sem 1-4), Execution (Final week pre-go-live).",
      where: "Source Legacy -> Staging Area -> Destination Production DB.",
      who: "Data Architect, ETL Devs, Business Owners.",
      how: "Assess -> Map Schemas -> ETL Scripts -> Full Load -> Reconcile.",
      howMuch: "8-50 semanas. Custo: $200k-$2M+. Team: 3-5 FTE.",
      risk: "Dados órfãos não detectados em UAT explodem na produção."
    },
    "ETL (Extract-Transform-Load)": {
      level: "Intermediário",
      why: "Automatizar movimento de dados. Elimina erro humano e documenta a linhagem do dado.",
      what: "Processo de extração (SQL/API), transformação (limpeza/conversão) e carga.",
      when: "Design (Sem 2-4), Build (Sem 5-12). Rodagem Batch ou Streaming.",
      where: "Cloud (AWS Glue) ou ferramentas como Talend e DataStage.",
      who: "ETL Architects e Data Engineers.",
      how: "Requirement -> ER mapping -> Code -> Unit Test -> Performance Tune.",
      howMuch: "Setup: 4-12 semanas. Licenciamento: $50-300k/ano.",
      risk: "Não confie em dados legacy; use data profiling automatizado."
    },
    "API Handshake": {
      level: "Intermediário",
      why: "Validar conectividade e segurança antes da integração full-scale. Detecta firewalls fechados cedo.",
      what: "Teste inicial: Autenticação, Autorização e Connectivity (HTTP 200).",
      when: "Semana antes da integração real. Diário no Hypercare.",
      where: "System A -> System B API Endpoints.",
      who: "Integration Devs e QA Engineers.",
      how: "Obter API Key -> Endpoint Discovery -> Test POST/GET -> Monitor.",
      howMuch: "Setup: 2-4h. Execução: 2-5 min. Custo negligível.",
      risk: "É o 'smoke test' das integrações; se falha, não teste lógica de negócio."
    },
    "Cutover": {
      level: "Intermediário",
      why: "Boundary formal legado -> novo. Estrutura o fim de semana do Go-Live com precisão cirúrgica.",
      what: "Plano detalhado: Technical Cutover (4-12h) -> Controlled Launch (12-48h).",
      when: "Planning (Sem 12-16), Rehearsal (2-4 semanas antes).",
      where: "Production Environment e War Room de escalonamento.",
      who: "Cutover Lead, Technical Teams, Decision-makers (CFO/COO).",
      how: "Task-by-task schedule -> Decision Triggers -> Communication Cadence.",
      howMuch: "$300-500k em tempo de consultoria especializada.",
      risk: "Parallel processing (rodar os dois sistemas) reduz risco, mas dobra o custo."
    },
    "Rollback": {
      level: "Intermediário",
      why: "Plano de contingência (Plano B). Reverter ao legado minimiza impacto financeiro de falhas críticas.",
      what: "Procedimento documentado: Backups, Bidirectional Sync e Transaction Journaling.",
      when: "Janela viável: Primeiras 48h (Cutover + Controlled Launch).",
      where: "Backup Location (Cloud/Off-site) e Production.",
      who: "DBAs, Infra e experts em sistema legado.",
      how: "Stop new system -> Restore legacy from backup -> Repoint users -> Validate.",
      howMuch: "$50-100k (planejamento e ensaio). Evita outages de dias.",
      risk: "Após 48h a estratégia muda para 'Fix Forward' (corrigir no sistema novo)."
    },
    "Technical Discovery": {
      level: "Intermediário",
      why: "Mapeamento completo do ambiente. Evita surpresas de escopo e rejeição de usuários.",
      what: "Inventário de legado, integrações e workshops de GAP Analysis.",
      when: "Semanas 1-4 (Início). Precede o Build.",
      where: "Sistemas Legados e Workshops com Stakeholders.",
      who: "BAs, Solution Architects e Power Users.",
      how: "Kickoff -> System walkthrough -> Gap Analysis -> Requirements Document.",
      howMuch: "4 semanas. Custo: $100-200k. Evita retrabalho massivo.",
      risk: "Skip discovery -> Surpresas tardias (muito caro e gera atrasos)."
    },
    "Parametrização Técnica": {
      level: "Intermediário",
      why: "Tuning do sistema sem redeployment. Permite ajustes rápidos de timeouts e logging.",
      what: "Ajuste de variáveis técnicas (Connection pool, batch sizes, logging levels).",
      when: "Configuration (Sem 8-12) e Tuning no Hypercare.",
      where: "Application Configs (YAML/JSON) e Admin Consoles.",
      who: "DevOps e Infrastructure Engineers.",
      how: "Baseline -> Identify needs -> Test in Staging -> Hot Reload in Prod.",
      howMuch: "Setup: 1-2 semanas. Custo negligível por mudança.",
      risk: "Deve ser documentada em runbook para o time de suporte on-call."
    },
    "SaaS Tenant": {
      level: "Intermediário",
      why: "Isolamento lógico de cliente. Permite escala SaaS com segurança e segregação de dados.",
      what: "Limite de cliente (dados, config, usuários). Modelos: Shared vs Separate DB.",
      when: "Fase de Design (Sem 4-8) e automação de onboarding.",
      where: "Database Layer (Schema/Cluster).",
      who: "Architects e DevOps Engineers.",
      how: "Implement context awareness -> Query filtering (tenant_id) -> Automation.",
      howMuch: "Setup: 4-12 semanas. Onboarding: 2-5 min (automatizado).",
      risk: "Falha de isolamento pode causar vazamento de dados entre clientes."
    },
    "Referential Integrity / Data Integrity": {
      level: "Intermediário",
      why: "Garantir consistência absoluta nos relacionamentos de dados. Crítico para evitar dados corrompidos.",
      what: "Garantias via FK constraints, cascading operations e validation rules (email, ranges).",
      when: "Design (Sem 4-8) e Validação pós-migração (T+24h).",
      where: "Database (Constraints/Triggers) e ETL Pipeline.",
      who: "Data Architects, Developers e DBAs.",
      how: "Define FKs -> Implement Application Validation -> Orphan Detection Queries.",
      howMuch: "Design/Impl: 3-5 semanas. Cost of failure: $500k-$5M.",
      risk: "Nunca desabilite constraints 'por performance'; indexe os campos FK em vez disso."
    },

    // NÍVEL AVANÇADO
    "Hypercare": {
      level: "Avançado",
      why: "Suporte intensivo 24/7. Reduz risco de rejeição e estabiliza sistema rapidamente. ROI: evita $500k em retrabalho.",
      what: "Período de 4-12 semanas pós go-live: monitoramento APM, floor-walking e Matrix of Firsts.",
      when: "Imediatamente pós go-live (T+24h até T+12 semanas).",
      where: "Onsite (client site) e War Room virtual dedicada.",
      who: "Hypercare Team (12-30 consultores) e Client Operations.",
      how: "Monitoring Setup -> Issue Response (SLA < 8h) -> Training -> Matrix of Firsts -> Handover.",
      howMuch: "$500k-$5M+ (Equipe de 12 consultants x $15k/week x 8 weeks = $1.44M).",
      risk: "Terminar antes de executar o último processo crítico (ex: fechamento de ano)."
    },
    "Regression Testing": {
      level: "Avançado",
      why: "Validar que novas mudanças não quebraram funções existentes. Essencial para CI/CD estável.",
      what: "Suite de 100s-1000s de testes cobrindo workflows completos e integrações.",
      when: "Após cada deployment, release ou bug fix. Frequência contínua.",
      where: "Ambientes de Staging/QA com dados representativos.",
      who: "Automation Engineers e QA Engineers.",
      how: "Design scenarios -> Develop scripts (Selenium/Cypress) -> Trigger automático post-deploy.",
      howMuch: "Setup: 4-8 semanas ($100-300k). Manutenção: 1-2 FTE.",
      risk: "Automatize 80% (workflows críticos) e deixe 20% para testes manuais exploratórios."
    },
    "Latency & Throughput": {
      level: "Avançado",
      why: "Métricas complementares de performance. Latência = UX (ms); Throughput = Capacidade (RPS).",
      what: "Latency (P50/P95/P99) e Throughput (Volume suportado).",
      when: "Load testing pré-go-live e monitoramento contínuo APM (Hypercare Sem 1-4).",
      where: "Aplicação (instrumentation), API Gateway e end-user browsers.",
      who: "Architects, Infra e DevOps.",
      how: "Load Test -> Deploy APM (Datadog/NewRelic) -> Tuning (Caching/DB Indexing).",
      howMuch: "Tooling: $500-5k/mês. Projeto: $50-200k.",
      risk: "Foque na P99 (pior caso); latência alta no percentil alto destrói a percepção de UX."
    },
    "Change Freeze": {
      level: "Avançado",
      why: "Congela mudanças não-críticas para evitar riscos e complexidade em janelas vitais (Go-Live/Hypercare).",
      what: "Moratorium comunicado: Nenhuma mudança de feature/config exceto hotfixes de bloqueio.",
      when: "2-4 semanas pré go-live até o final do Hypercare (T+12 weeks).",
      where: "Código (Source Control), Infra e Configurações.",
      who: "Release Manager e Technical Lead (Enforcers).",
      how: "Announce dates -> Lock source branches -> CAB approval para exceções críticas.",
      howMuch: "Custo de coordenação baixo. ROI: Evita atrasos de $100k-$1M+.",
      risk: "Freeze não é 'parada total'; é foco exclusivo em estabilidade e segurança."
    },
    "Matrix of Firsts": {
      level: "Avançado",
      why: "Rastreamento estruturado da 1ª execução de processos críticos. Resolve erros antes do 2º ciclo.",
      what: "Matriz documentando: Month-end close, Payroll, Audit e Reconciliação.",
      when: "Começa T+1 dia até o fim do último processo anual (Audit).",
      where: "Tracking em Jira ou Spreadsheet visível na War Room.",
      who: "Hypercare Lead e Process Owners (Finance/HR).",
      how: "Identify criticals -> Monitor execution -> Log issues -> RCA -> Fix -> Sign-off.",
      howMuch: "Administração simples (2-3h/semana). Valor: Reduz surpresas pós-hypercare.",
      risk: "Encontre o erro no 1º fechamento mensal durante o hypercare; não espere o 2º sem suporte."
    }
  };

  const phases = [
    { id: 1, title: "1. Technical Discovery", subtitle: "Mapeamento (Sem 1-4)", icon: <Search />, color: "bg-blue-500", terms: ["Technical Discovery", "SaaS Tenant", "API Handshake"] },
    { id: 2, title: "2. Build & Config", subtitle: "Construção (Sem 5-16)", icon: <Settings />, color: "bg-purple-500", terms: ["Configuration", "Customization", "Parametrização Técnica", "Provisioning", "Referential Integrity / Data Integrity"] },
    { id: 3, title: "3. Sandbox & Testing", subtitle: "Validação (Sem 17-20)", icon: <ShieldAlert />, color: "bg-yellow-500", terms: ["Sandbox", "UAT (User Acceptance Testing)", "Regression Testing"] },
    { id: 4, title: "4. Migration & ETL", subtitle: "Carga (Sem 20-21)", icon: <Database />, color: "bg-orange-500", terms: ["Data Migration", "ETL (Extract-Transform-Load)"] },
    { id: 5, title: "5. Cutover & Go-Live", subtitle: "Transição (Fim de Sem)", icon: <Rocket />, color: "bg-red-500", terms: ["Cutover", "Go-Live", "Smoke Testing", "Rollback", "Change Freeze"] },
    { id: 6, title: "6. Hypercare", subtitle: "Estabilização (Sem 22-35)", icon: <Activity />, color: "bg-green-500", terms: ["Hypercare", "Latency & Throughput", "Matrix of Firsts"] }
  ];

  const levelColors = {
    "Básico": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Intermediário": "bg-blue-100 text-blue-800 border-blue-200",
    "Avançado": "bg-purple-100 text-purple-800 border-purple-200"
  };

  const getIconForField = (field) => {
    switch (field) {
      case 'why': return <HelpCircle className="text-blue-600 shrink-0" size={24} />;
      case 'what': return <Target className="text-indigo-600 shrink-0" size={24} />;
      case 'when': return <Clock className="text-amber-600 shrink-0" size={24} />;
      case 'where': return <MapPin className="text-emerald-600 shrink-0" size={24} />;
      case 'who': return <Users className="text-violet-600 shrink-0" size={24} />;
      case 'how': return <Wrench className="text-slate-600 shrink-0" size={24} />;
      case 'howMuch': return <DollarSign className="text-rose-600 shrink-0" size={24} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900 pb-24">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-slate-800 rounded-lg text-white shadow-md"><LayoutGrid size={24} /></div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manual 5W2H Implantação (V2.0)</h1>
        </div>
        <p className="text-slate-500 max-w-2xl text-lg font-light italic">
          Rigor técnico MIT Sloan & Estratégia McKinsey aplicados ao roadmap Kartado.
        </p>
        
        <div className="flex flex-wrap gap-2 mt-6">
          {['All', 'Básico', 'Intermediário', 'Avançado'].map(l => (
            <button key={l} onClick={() => setFilter(l)} className={`px-5 py-2.5 rounded-full text-sm font-black transition-all duration-300 ${filter === l ? 'bg-slate-800 text-white shadow-xl scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm'}`}>{l === 'All' ? 'Ver Todos' : l}</button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {phases.map((phase) => {
          const visibleTerms = phase.terms.filter(t => filter === 'All' || termsData[t]?.level === filter);
          if (visibleTerms.length === 0) return null;

          return (
            <div key={phase.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className={`p-6 ${phase.color} text-white flex items-center gap-4`}>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform duration-500">{phase.icon}</div>
                <div>
                  <h2 className="font-black text-xl leading-tight uppercase tracking-tight">{phase.title}</h2>
                  <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em]">{phase.subtitle}</p>
                </div>
              </div>
              <div className="p-5 space-y-4 flex-1">
                {visibleTerms.map((termName, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedTerm({ name: termName, ...termsData[termName] })}
                    className="w-full text-left p-5 border border-slate-100 rounded-2xl bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-lg group/btn transition-all flex justify-between items-center"
                  >
                    <div>
                      <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase mb-2 inline-block border ${levelColors[termsData[termName].level]}`}>
                        {termsData[termName].level}
                      </span>
                      <h3 className="font-black text-slate-700 group-hover/btn:text-slate-900 tracking-tight text-sm uppercase">{termName}</h3>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-sm opacity-0 group-hover/btn:opacity-100 transition-opacity translate-x-2 group-hover/btn:translate-x-0 transition-transform">
                      <ChevronRight size={18} className="text-slate-800" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* 5W2H Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 z-50 overflow-y-auto pt-10 pb-10">
          <div className="bg-white rounded-[3rem] max-w-2xl w-full shadow-2xl my-auto animate-in fade-in zoom-in duration-500 overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="p-10 pb-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <div>
                <span className={`text-[10px] px-3 py-1.5 rounded-lg font-black uppercase mb-4 inline-block border ${levelColors[selectedTerm.level]}`}>
                  Status: {selectedTerm.level}
                </span>
                <h2 className="text-5xl font-black text-slate-800 tracking-tighter leading-[0.85] uppercase">{selectedTerm.name}</h2>
              </div>
              <button onClick={() => setSelectedTerm(null)} className="bg-slate-100 hover:bg-rose-500 hover:text-white p-3 rounded-2xl transition-all duration-300 text-slate-500 shadow-sm font-black">✕</button>
            </div>

            {/* 5W2H Grid */}
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'WHY (Por quê?)', key: 'why', bg: 'bg-blue-50/60', border: 'border-blue-100', text: 'text-blue-900' },
                { label: 'WHAT (O quê?)', key: 'what', bg: 'bg-indigo-50/60', border: 'border-indigo-100', text: 'text-indigo-900' },
                { label: 'WHEN (Quando?)', key: 'when', bg: 'bg-amber-50/60', border: 'border-amber-100', text: 'text-amber-900' },
                { label: 'WHERE (Onde?)', key: 'where', bg: 'bg-emerald-50/60', border: 'border-emerald-100', text: 'text-emerald-900' },
                { label: 'WHO (Quem?)', key: 'who', bg: 'bg-violet-50/60', border: 'border-violet-100', text: 'text-violet-900' },
                { label: 'HOW (Como?)', key: 'how', bg: 'bg-slate-100/50', border: 'border-slate-200', text: 'text-slate-900' }
              ].map((field) => (
                <div key={field.key} className={`flex gap-5 p-6 rounded-[2rem] ${field.bg} border ${field.border} hover:scale-[1.02] transition-transform duration-300`}>
                  {getIconForField(field.key)}
                  <div>
                    <h4 className={`text-[10px] font-black ${field.text} uppercase mb-2 tracking-[0.2em]`}>{field.label}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed font-bold tracking-tight">{selectedTerm[field.key]}</p>
                  </div>
                </div>
              ))}

              <div className="flex gap-5 p-7 rounded-[2rem] bg-rose-50 border border-rose-100 md:col-span-2 shadow-sm hover:scale-[1.01] transition-transform">
                <DollarSign className="text-rose-600 shrink-0" size={28} />
                <div>
                  <h4 className="text-[10px] font-black text-rose-900 uppercase mb-2 tracking-[0.2em]">HOW MUCH (Quanto?)</h4>
                  <p className="text-slate-700 text-base font-black tracking-tight leading-snug">{selectedTerm.howMuch}</p>
                </div>
              </div>

              {selectedTerm.risk && (
                <div className="flex gap-5 p-7 rounded-[2.5rem] bg-orange-100 border-2 border-orange-200 md:col-span-2 shadow-inner ring-8 ring-orange-50/30">
                  <AlertTriangle className="text-orange-600 shrink-0" size={32} />
                  <div>
                    <h4 className="text-[11px] font-black text-orange-950 uppercase mb-2 tracking-[0.3em]">RISCO CRÍTICO</h4>
                    <p className="text-orange-950 text-sm font-black leading-tight italic">{selectedTerm.risk}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 pt-6 bg-slate-50/80 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">Éverson Filipe • CSOO Elite Framework</p>
              </div>
              <button 
                onClick={() => setSelectedTerm(null)}
                className="w-full md:w-auto px-12 py-5 bg-slate-800 text-white rounded-[1.5rem] font-black text-xs hover:bg-slate-900 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em]"
              >
                CONFIRMAR LEITURA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Study Footer */}
      <footer className="max-w-6xl mx-auto mt-20 text-center border-t border-slate-200 pt-12 pb-20 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]"><CheckCircle2 size={18}/> Veracidade MIT</div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]"><Activity size={18}/> Lógica McKinsey</div>
          <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]"><XCircle size={18}/> Zero Alucinação</div>
        </div>
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.8em] mb-4">Base de Conhecimento Estratégica • 2025/2026</p>
        <div className="flex gap-4">
          <div className="px-3 py-1 bg-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-tighter">Neurodivergent Friendly</div>
          <div className="px-3 py-1 bg-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-tighter">High ROI Study</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
