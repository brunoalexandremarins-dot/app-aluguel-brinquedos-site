"use client"

import { useState, useEffect } from 'react'
import { Calendar, Package, Users, FileText, BarChart3, Settings, Plus, Search, Filter, Share, Eye, Edit, Trash2, DollarSign, TrendingUp, Clock, MapPin, Phone, Mail, Download, Send, Image, Video, Percent, FileDown, MessageCircle, X, Upload } from 'lucide-react'

// Tipos de dados
interface Brinquedo {
  id: string
  nome: string
  categoria: string
  preco: number
  descricao: string
  especificacoes: string
  fotos: string[]
  videos: string[]
  totalAlugueis: number
  rendimentoTotal: number
  disponivel: boolean
}

interface Cliente {
  id: string
  nome: string
  telefone: string
  email?: string
  rg?: string
  cpf?: string
  endereco?: string
  enderecoEvento?: string
}

interface Evento {
  id: string
  clienteId: string
  brinquedos: { id: string; quantidade: number }[]
  dataEvento: string
  horaInicio: string
  horaFim: string
  endereco: string
  valorTotal: number
  status: 'agendado' | 'em-andamento' | 'concluido' | 'cancelado'
}

interface Orcamento {
  id: string
  clienteId: string
  brinquedos: { id: string; quantidade: number; preco: number }[]
  dataEvento: string
  horaInicio: string
  horaFim: string
  endereco: string
  valorTotal: number
  desconto: number
  valorComDesconto: number
  status: 'pendente' | 'aprovado' | 'rejeitado'
  dataVencimento: string
  observacoes?: string
}

interface Contrato {
  id: string
  orcamentoId: string
  clienteId: string
  dataContrato: string
  termos: string
  status: 'ativo' | 'concluido' | 'cancelado'
}

interface ConfiguracaoEmpresa {
  nome: string
  logo: string
  telefone: string
  email: string
  endereco: string
  cnpj: string
  termosContrato: string
}

export default function InquedosAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [brinquedos, setBrinquedos] = useState<Brinquedo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [configuracao, setConfiguracao] = useState<ConfiguracaoEmpresa>({
    nome: 'Inquedos - Aluguel de Brinquedos',
    logo: '',
    telefone: '(11) 99999-9999',
    email: 'contato@inquedos.com.br',
    endereco: 'Rua das Festas, 123 - São Paulo/SP',
    cnpj: '12.345.678/0001-90',
    termosContrato: `CONTRATO DE LOCAÇÃO DE BRINQUEDOS

1. DO OBJETO
O presente contrato tem por objeto a locação dos brinquedos descritos no orçamento anexo.

2. DO PRAZO
A locação será pelo período especificado no orçamento, incluindo montagem e desmontagem.

3. DO VALOR
O valor total da locação é o especificado no orçamento, devendo ser pago conforme condições acordadas.

4. DAS RESPONSABILIDADES
O locatário se responsabiliza pela integridade dos brinquedos durante o período de locação.

5. DAS CONDIÇÕES GERAIS
- Os brinquedos devem ser utilizados conforme orientações de segurança
- Danos ou perdas serão cobrados conforme tabela de valores
- O cancelamento deve ser comunicado com 48h de antecedência

Local e Data: ________________

_________________________        _________________________
      Locador                           Locatário`
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Estados para modais
  const [showBrinquedoModal, setShowBrinquedoModal] = useState(false)
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [showOrcamentoModal, setShowOrcamentoModal] = useState(false)
  const [showContratoModal, setShowContratoModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [selectedBrinquedoMedia, setSelectedBrinquedoMedia] = useState<Brinquedo | null>(null)

  // Carregar dados do localStorage
  useEffect(() => {
    const savedBrinquedos = localStorage.getItem('inquedos-brinquedos')
    const savedClientes = localStorage.getItem('inquedos-clientes')
    const savedEventos = localStorage.getItem('inquedos-eventos')
    const savedOrcamentos = localStorage.getItem('inquedos-orcamentos')
    const savedContratos = localStorage.getItem('inquedos-contratos')
    const savedConfiguracao = localStorage.getItem('inquedos-configuracao')

    if (savedBrinquedos) setBrinquedos(JSON.parse(savedBrinquedos))
    if (savedClientes) setClientes(JSON.parse(savedClientes))
    if (savedEventos) setEventos(JSON.parse(savedEventos))
    if (savedOrcamentos) setOrcamentos(JSON.parse(savedOrcamentos))
    if (savedContratos) setContratos(JSON.parse(savedContratos))
    if (savedConfiguracao) setConfiguracao(JSON.parse(savedConfiguracao))
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('inquedos-brinquedos', JSON.stringify(brinquedos))
  }, [brinquedos])

  useEffect(() => {
    localStorage.setItem('inquedos-clientes', JSON.stringify(clientes))
  }, [clientes])

  useEffect(() => {
    localStorage.setItem('inquedos-eventos', JSON.stringify(eventos))
  }, [eventos])

  useEffect(() => {
    localStorage.setItem('inquedos-orcamentos', JSON.stringify(orcamentos))
  }, [orcamentos])

  useEffect(() => {
    localStorage.setItem('inquedos-contratos', JSON.stringify(contratos))
  }, [contratos])

  useEffect(() => {
    localStorage.setItem('inquedos-configuracao', JSON.stringify(configuracao))
  }, [configuracao])

  // Funções auxiliares
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatTime = (time: string) => {
    return time
  }

  const shareWhatsApp = (brinquedo: Brinquedo) => {
    const message = `🎪 *${brinquedo.nome}* 🎪

💰 *Valor:* ${formatCurrency(brinquedo.preco)}
📝 *Descrição:* ${brinquedo.descricao}

🎯 *Especificações:*
${brinquedo.especificacoes}

📞 Entre em contato para agendar!
${configuracao.telefone}

${configuracao.nome}`

    // Criar URL do WhatsApp com número específico se disponível
    const phoneNumber = configuracao.telefone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const downloadOrcamento = (orcamento: Orcamento) => {
    const cliente = clientes.find(c => c.id === orcamento.clienteId)
    if (!cliente) return

    const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Orçamento - ${configuracao.nome}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { max-width: 200px; margin-bottom: 10px; }
        .company-name { font-size: 24px; font-weight: bold; color: #007bff; margin: 10px 0; }
        .company-info { font-size: 14px; color: #666; }
        .section { margin: 20px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #007bff; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .info-item { margin-bottom: 10px; }
        .info-label { font-weight: bold; color: #555; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background-color: #f8f9fa; font-weight: bold; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-line { margin: 5px 0; }
        .total-final { font-size: 20px; font-weight: bold; color: #007bff; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        .discount { color: #28a745; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        ${configuracao.logo ? `<img src="${configuracao.logo}" alt="Logo" class="logo">` : ''}
        <div class="company-name">${configuracao.nome}</div>
        <div class="company-info">
            ${configuracao.endereco}<br>
            Tel: ${configuracao.telefone} | Email: ${configuracao.email}<br>
            CNPJ: ${configuracao.cnpj}
        </div>
    </div>

    <div class="section">
        <div class="section-title">ORÇAMENTO Nº ${orcamento.id}</div>
        
        <div class="info-grid">
            <div>
                <div class="info-item">
                    <span class="info-label">Cliente:</span> ${cliente.nome}
                </div>
                <div class="info-item">
                    <span class="info-label">Telefone:</span> ${cliente.telefone}
                </div>
                ${cliente.email ? `<div class="info-item"><span class="info-label">Email:</span> ${cliente.email}</div>` : ''}
                ${cliente.cpf ? `<div class="info-item"><span class="info-label">CPF:</span> ${cliente.cpf}</div>` : ''}
                ${cliente.rg ? `<div class="info-item"><span class="info-label">RG:</span> ${cliente.rg}</div>` : ''}
            </div>
            <div>
                <div class="info-item">
                    <span class="info-label">Data do Evento:</span> ${formatDate(orcamento.dataEvento)}
                </div>
                <div class="info-item">
                    <span class="info-label">Horário:</span> ${orcamento.horaInicio} às ${orcamento.horaFim}
                </div>
                <div class="info-item">
                    <span class="info-label">Local:</span> ${orcamento.endereco}
                </div>
                <div class="info-item">
                    <span class="info-label">Validade:</span> ${formatDate(orcamento.dataVencimento)}
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">ITENS DO ORÇAMENTO</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Brinquedo</th>
                    <th>Quantidade</th>
                    <th>Valor Unitário</th>
                    <th>Valor Total</th>
                </tr>
            </thead>
            <tbody>
                ${orcamento.brinquedos.map(b => {
                  const brinquedo = brinquedos.find(br => br.id === b.id)
                  return `
                    <tr>
                        <td>${brinquedo?.nome || 'Brinquedo não encontrado'}</td>
                        <td>${b.quantidade}</td>
                        <td>${formatCurrency(b.preco)}</td>
                        <td>${formatCurrency(b.preco * b.quantidade)}</td>
                    </tr>
                  `
                }).join('')}
            </tbody>
        </table>
    </div>

    <div class="total-section">
        <div class="total-line">Subtotal: ${formatCurrency(orcamento.valorTotal)}</div>
        ${orcamento.desconto > 0 ? `<div class="total-line discount">Desconto (${orcamento.desconto}%): -${formatCurrency(orcamento.valorTotal * (orcamento.desconto / 100))}</div>` : ''}
        <div class="total-line total-final">TOTAL: ${formatCurrency(orcamento.valorComDesconto)}</div>
    </div>

    ${orcamento.observacoes ? `
    <div class="section">
        <div class="section-title">OBSERVAÇÕES</div>
        <p>${orcamento.observacoes}</p>
    </div>
    ` : ''}

    <div class="footer">
        <p>Este orçamento é válido até ${formatDate(orcamento.dataVencimento)}</p>
        <p>Para confirmar o agendamento, entre em contato conosco.</p>
        <p>${configuracao.nome} - ${configuracao.telefone}</p>
    </div>
</body>
</html>
    `

    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Orcamento_${orcamento.id}_${cliente.nome.replace(/\s+/g, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const enviarOrcamentoWhatsApp = (orcamento: Orcamento) => {
    const cliente = clientes.find(c => c.id === orcamento.clienteId)
    if (!cliente) return

    const message = `🎪 *ORÇAMENTO - ${configuracao.nome}* 🎪

👤 *Cliente:* ${cliente.nome}
📅 *Data do Evento:* ${formatDate(orcamento.dataEvento)}
⏰ *Horário:* ${orcamento.horaInicio} às ${orcamento.horaFim}
📍 *Local:* ${orcamento.endereco}

🎯 *BRINQUEDOS:*
${orcamento.brinquedos.map(b => {
  const brinquedo = brinquedos.find(br => br.id === b.id)
  return `• ${brinquedo?.nome} (${b.quantidade}x) - ${formatCurrency(b.preco * b.quantidade)}`
}).join('\n')}

💰 *VALORES:*
Subtotal: ${formatCurrency(orcamento.valorTotal)}
${orcamento.desconto > 0 ? `Desconto (${orcamento.desconto}%): -${formatCurrency(orcamento.valorTotal * (orcamento.desconto / 100))}` : ''}
*TOTAL: ${formatCurrency(orcamento.valorComDesconto)}*

📋 *Validade:* ${formatDate(orcamento.dataVencimento)}

${orcamento.observacoes ? `📝 *Observações:* ${orcamento.observacoes}` : ''}

📞 Para confirmar, entre em contato: ${configuracao.telefone}`

    const phoneNumber = cliente.telefone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const gerarContrato = (orcamento: Orcamento) => {
    const cliente = clientes.find(c => c.id === orcamento.clienteId)
    if (!cliente) return

    const novoContrato: Contrato = {
      id: Date.now().toString(),
      orcamentoId: orcamento.id,
      clienteId: orcamento.clienteId,
      dataContrato: new Date().toISOString().split('T')[0],
      termos: configuracao.termosContrato,
      status: 'ativo'
    }

    setContratos(prev => [...prev, novoContrato])
    
    // Baixar contrato
    downloadContrato(novoContrato, orcamento, cliente)
  }

  const downloadContrato = (contrato: Contrato, orcamento: Orcamento, cliente: Cliente) => {
    const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Contrato - ${configuracao.nome}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { max-width: 200px; margin-bottom: 10px; }
        .company-name { font-size: 24px; font-weight: bold; color: #007bff; margin: 10px 0; }
        .contract-title { font-size: 20px; font-weight: bold; text-align: center; margin: 30px 0; }
        .section { margin: 20px 0; }
        .section-title { font-size: 16px; font-weight: bold; color: #007bff; margin: 20px 0 10px 0; }
        .contract-info { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .signature-section { margin-top: 60px; display: flex; justify-content: space-between; }
        .signature-box { text-align: center; width: 45%; }
        .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 10px; }
        .terms { white-space: pre-line; text-align: justify; }
    </style>
</head>
<body>
    <div class="header">
        ${configuracao.logo ? `<img src="${configuracao.logo}" alt="Logo" class="logo">` : ''}
        <div class="company-name">${configuracao.nome}</div>
    </div>

    <div class="contract-title">CONTRATO DE LOCAÇÃO DE BRINQUEDOS Nº ${contrato.id}</div>

    <div class="contract-info">
        <strong>LOCADOR:</strong> ${configuracao.nome}<br>
        <strong>CNPJ:</strong> ${configuracao.cnpj}<br>
        <strong>Endereço:</strong> ${configuracao.endereco}<br>
        <strong>Telefone:</strong> ${configuracao.telefone}<br><br>

        <strong>LOCATÁRIO:</strong> ${cliente.nome}<br>
        <strong>Telefone:</strong> ${cliente.telefone}<br>
        ${cliente.cpf ? `<strong>CPF:</strong> ${cliente.cpf}<br>` : ''}
        ${cliente.rg ? `<strong>RG:</strong> ${cliente.rg}<br>` : ''}
        ${cliente.endereco ? `<strong>Endereço:</strong> ${cliente.endereco}<br>` : ''}<br>

        <strong>DATA DO EVENTO:</strong> ${formatDate(orcamento.dataEvento)}<br>
        <strong>HORÁRIO:</strong> ${orcamento.horaInicio} às ${orcamento.horaFim}<br>
        <strong>LOCAL:</strong> ${orcamento.endereco}<br>
        <strong>VALOR TOTAL:</strong> ${formatCurrency(orcamento.valorComDesconto)}
    </div>

    <div class="section">
        <div class="section-title">BRINQUEDOS LOCADOS:</div>
        ${orcamento.brinquedos.map(b => {
          const brinquedo = brinquedos.find(br => br.id === b.id)
          return `• ${brinquedo?.nome} (Quantidade: ${b.quantidade}) - ${formatCurrency(b.preco * b.quantidade)}`
        }).join('<br>')}
    </div>

    <div class="terms">${contrato.termos}</div>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line">
                <strong>${configuracao.nome}</strong><br>
                LOCADOR
            </div>
        </div>
        <div class="signature-box">
            <div class="signature-line">
                <strong>${cliente.nome}</strong><br>
                LOCATÁRIO
            </div>
        </div>
    </div>
</body>
</html>
    `

    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Contrato_${contrato.id}_${cliente.nome.replace(/\s+/g, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    const totalBrinquedos = brinquedos.length
    const totalClientes = clientes.length
    const eventosDoMes = eventos.filter(evento => {
      const dataEvento = new Date(evento.dataEvento)
      return dataEvento.getMonth() === selectedMonth && dataEvento.getFullYear() === selectedYear
    })
    const rendimentoMensal = eventosDoMes.reduce((total, evento) => total + evento.valorTotal, 0)
    const rendimentoAnual = eventos.filter(evento => {
      const dataEvento = new Date(evento.dataEvento)
      return dataEvento.getFullYear() === selectedYear
    }).reduce((total, evento) => total + evento.valorTotal, 0)

    return {
      totalBrinquedos,
      totalClientes,
      eventosMes: eventosDoMes.length,
      rendimentoMensal,
      rendimentoAnual
    }
  }

  const stats = calcularEstatisticas()

  // Componente Dashboard
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex gap-2">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {Array.from({length: 12}, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleDateString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {Array.from({length: 5}, (_, i) => (
              <option key={i} value={new Date().getFullYear() - 2 + i}>
                {new Date().getFullYear() - 2 + i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Brinquedos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBrinquedos}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClientes}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div>
            <p className="text-sm font-medium text-gray-600">Eventos Este Mês</p>
            <p className="text-2xl font-bold text-gray-900">{stats.eventosMes}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div>
            <p className="text-sm font-medium text-gray-600">Rendimento Mensal</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.rendimentoMensal)}</p>
          </div>
        </div>
      </div>

      {/* Rendimento Anual */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Rendimento Anual {selectedYear}</h3>
        <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.rendimentoAnual)}</div>
      </div>

      {/* Top Brinquedos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Brinquedos Mais Alugados</h3>
        <div className="space-y-3">
          {brinquedos
            .sort((a, b) => b.totalAlugueis - a.totalAlugueis)
            .slice(0, 5)
            .map((brinquedo) => (
              <div key={brinquedo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{brinquedo.nome}</p>
                  <p className="text-sm text-gray-600">{brinquedo.totalAlugueis} aluguéis</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(brinquedo.rendimentoTotal)}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  // Componente Catálogo
  const Catalogo = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Catálogo de Brinquedos</h2>
        <button
          onClick={() => {
            setEditingItem(null)
            setShowBrinquedoModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Brinquedo
        </button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar brinquedos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Lista de Brinquedos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brinquedos
          .filter(brinquedo => 
            brinquedo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            brinquedo.categoria.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((brinquedo) => (
            <div key={brinquedo.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                {brinquedo.fotos.length > 0 ? (
                  <img 
                    src={brinquedo.fotos[0]} 
                    alt={brinquedo.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-16 w-16 text-blue-600" />
                )}
                {(brinquedo.fotos.length > 0 || brinquedo.videos.length > 0) && (
                  <button
                    onClick={() => {
                      setSelectedBrinquedoMedia(brinquedo)
                      setShowMediaModal(true)
                    }}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{brinquedo.nome}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    brinquedo.disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {brinquedo.disponivel ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{brinquedo.categoria}</p>
                <p className="text-lg font-bold text-green-600 mb-3">{formatCurrency(brinquedo.preco)}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{brinquedo.totalAlugueis} aluguéis</span>
                  <span>{formatCurrency(brinquedo.rendimentoTotal)}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => shareWhatsApp(brinquedo)}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(brinquedo)
                      setShowBrinquedoModal(true)
                    }}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )

  // Componente Clientes
  const Clientes = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
        <button
          onClick={() => {
            setEditingItem(null)
            setShowClienteModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </button>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{cliente.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cliente.telefone}</div>
                    {cliente.email && <div className="text-sm text-gray-500">{cliente.email}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cliente.cpf || cliente.rg || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingItem(cliente)
                        setShowClienteModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Componente Agenda
  const Agenda = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Agenda</h2>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-4">
        {eventos
          .sort((a, b) => new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime())
          .map((evento) => {
            const cliente = clientes.find(c => c.id === evento.clienteId)
            return (
              <div key={evento.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{cliente?.nome}</h3>
                    <p className="text-sm text-gray-600">{formatDate(evento.dataEvento)} - {evento.horaInicio} às {evento.horaFim}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    evento.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                    evento.status === 'em-andamento' ? 'bg-yellow-100 text-yellow-800' :
                    evento.status === 'concluido' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {evento.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  {evento.endereco}
                </div>
                
                <div className="text-lg font-bold text-green-600 mb-3">
                  {formatCurrency(evento.valorTotal)}
                </div>
                
                <div className="text-sm text-gray-600">
                  <strong>Brinquedos:</strong> {evento.brinquedos.map(b => {
                    const brinquedo = brinquedos.find(br => br.id === b.id)
                    return `${brinquedo?.nome} (${b.quantidade}x)`
                  }).join(', ')}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )

  // Componente Orçamentos
  const Orcamentos = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orçamentos</h2>
        <button
          onClick={() => {
            setEditingItem(null)
            setShowOrcamentoModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </button>
      </div>

      {/* Lista de Orçamentos */}
      <div className="space-y-4">
        {orcamentos.map((orcamento) => {
          const cliente = clientes.find(c => c.id === orcamento.clienteId)
          return (
            <div key={orcamento.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{cliente?.nome}</h3>
                  <p className="text-sm text-gray-600">Evento: {formatDate(orcamento.dataEvento)} - {orcamento.horaInicio} às {orcamento.horaFim}</p>
                  <p className="text-sm text-gray-600">Vence: {formatDate(orcamento.dataVencimento)}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    orcamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                    orcamento.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {orcamento.status}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadOrcamento(orcamento)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Baixar
                    </button>
                    
                    <button
                      onClick={() => enviarOrcamentoWhatsApp(orcamento)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                    >
                      <MessageCircle className="h-3 w-3" />
                      Enviar
                    </button>
                    
                    {orcamento.status === 'pendente' && (
                      <button
                        onClick={() => {
                          // Aprovar orçamento e criar evento
                          const novoEvento: Evento = {
                            id: Date.now().toString(),
                            clienteId: orcamento.clienteId,
                            brinquedos: orcamento.brinquedos.map(b => ({ id: b.id, quantidade: b.quantidade })),
                            dataEvento: orcamento.dataEvento,
                            horaInicio: orcamento.horaInicio,
                            horaFim: orcamento.horaFim,
                            endereco: orcamento.endereco,
                            valorTotal: orcamento.valorComDesconto,
                            status: 'agendado'
                          }
                          
                          setEventos(prev => [...prev, novoEvento])
                          setOrcamentos(prev => prev.map(o => 
                            o.id === orcamento.id ? { ...o, status: 'aprovado' as const } : o
                          ))
                          
                          // Atualizar estatísticas dos brinquedos
                          setBrinquedos(prev => prev.map(b => {
                            const brinquedoOrcamento = orcamento.brinquedos.find(bo => bo.id === b.id)
                            if (brinquedoOrcamento) {
                              return {
                                ...b,
                                totalAlugueis: b.totalAlugueis + brinquedoOrcamento.quantidade,
                                rendimentoTotal: b.rendimentoTotal + (brinquedoOrcamento.preco * brinquedoOrcamento.quantidade)
                              }
                            }
                            return b
                          }))
                          
                          // Gerar contrato automaticamente
                          gerarContrato(orcamento)
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Aprovar
                      </button>
                    )}
                    
                    {orcamento.status === 'aprovado' && (
                      <button
                        onClick={() => gerarContrato(orcamento)}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        Contrato
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-lg font-bold text-green-600 mb-3">
                {orcamento.desconto > 0 ? (
                  <div>
                    <span className="text-sm text-gray-500 line-through">{formatCurrency(orcamento.valorTotal)}</span>
                    <span className="ml-2">{formatCurrency(orcamento.valorComDesconto)}</span>
                    <span className="text-sm text-green-600 ml-2">({orcamento.desconto}% off)</span>
                  </div>
                ) : (
                  formatCurrency(orcamento.valorComDesconto)
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Brinquedos:</strong> {orcamento.brinquedos.map(b => {
                  const brinquedo = brinquedos.find(br => br.id === b.id)
                  return `${brinquedo?.nome} (${b.quantidade}x - ${formatCurrency(b.preco)})`
                }).join(', ')}
              </div>
              
              {orcamento.observacoes && (
                <div className="text-sm text-gray-600 mt-2">
                  <strong>Observações:</strong> {orcamento.observacoes}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  // Componente Contratos
  const Contratos = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Contratos</h2>
        <button
          onClick={() => setShowConfigModal(true)}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Configurar Termos
        </button>
      </div>

      {/* Lista de Contratos */}
      <div className="space-y-4">
        {contratos.map((contrato) => {
          const cliente = clientes.find(c => c.id === contrato.clienteId)
          const orcamento = orcamentos.find(o => o.id === contrato.orcamentoId)
          return (
            <div key={contrato.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Contrato #{contrato.id}</h3>
                  <p className="text-sm text-gray-600">Cliente: {cliente?.nome}</p>
                  <p className="text-sm text-gray-600">Data: {formatDate(contrato.dataContrato)}</p>
                  {orcamento && (
                    <p className="text-sm text-gray-600">Evento: {formatDate(orcamento.dataEvento)}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    contrato.status === 'ativo' ? 'bg-green-100 text-green-800' :
                    contrato.status === 'concluido' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {contrato.status}
                  </span>
                  
                  <button
                    onClick={() => {
                      if (orcamento && cliente) {
                        downloadContrato(contrato, orcamento, cliente)
                      }
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Baixar
                  </button>
                </div>
              </div>
              
              {orcamento && (
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(orcamento.valorComDesconto)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  // Modal de Mídia
  const MediaModal = () => {
    if (!showMediaModal || !selectedBrinquedoMedia) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedBrinquedoMedia.nome} - Mídia</h3>
              <button
                onClick={() => {
                  setShowMediaModal(false)
                  setSelectedBrinquedoMedia(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Fotos */}
            {selectedBrinquedoMedia.fotos.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Fotos ({selectedBrinquedoMedia.fotos.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedBrinquedoMedia.fotos.map((foto, index) => (
                    <img
                      key={index}
                      src={foto}
                      alt={`${selectedBrinquedoMedia.nome} - Foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Vídeos */}
            {selectedBrinquedoMedia.videos.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Vídeos ({selectedBrinquedoMedia.videos.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBrinquedoMedia.videos.map((video, index) => (
                    <video
                      key={index}
                      src={video}
                      controls
                      className="w-full h-48 rounded-lg border"
                    >
                      Seu navegador não suporta vídeos.
                    </video>
                  ))}
                </div>
              </div>
            )}
            
            {selectedBrinquedoMedia.fotos.length === 0 && selectedBrinquedoMedia.videos.length === 0 && (
              <p className="text-gray-500 text-center py-8">Nenhuma mídia adicionada ainda.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Modal Brinquedo
  const BrinquedoModal = () => {
    const [formData, setFormData] = useState({
      nome: editingItem?.nome || '',
      categoria: editingItem?.categoria || '',
      preco: editingItem?.preco || 0,
      descricao: editingItem?.descricao || '',
      especificacoes: editingItem?.especificacoes || '',
      disponivel: editingItem?.disponivel ?? true,
      fotos: editingItem?.fotos || [],
      videos: editingItem?.videos || []
    })

    const [novaFoto, setNovaFoto] = useState('')
    const [novoVideo, setNovoVideo] = useState('')

    const adicionarFoto = () => {
      if (novaFoto.trim()) {
        setFormData(prev => ({
          ...prev,
          fotos: [...prev.fotos, novaFoto.trim()]
        }))
        setNovaFoto('')
      }
    }

    const adicionarVideo = () => {
      if (novoVideo.trim()) {
        setFormData(prev => ({
          ...prev,
          videos: [...prev.videos, novoVideo.trim()]
        }))
        setNovoVideo('')
      }
    }

    const removerFoto = (index: number) => {
      setFormData(prev => ({
        ...prev,
        fotos: prev.fotos.filter((_, i) => i !== index)
      }))
    }

    const removerVideo = (index: number) => {
      setFormData(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }))
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      if (editingItem) {
        setBrinquedos(prev => prev.map(b => 
          b.id === editingItem.id ? { ...b, ...formData } : b
        ))
      } else {
        const novoBrinquedo: Brinquedo = {
          id: Date.now().toString(),
          ...formData,
          totalAlugueis: 0,
          rendimentoTotal: 0
        }
        setBrinquedos(prev => [...prev, novoBrinquedo])
      }
      
      setShowBrinquedoModal(false)
      setEditingItem(null)
    }

    if (!showBrinquedoModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar Brinquedo' : 'Novo Brinquedo'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <input
                    type="text"
                    required
                    value={formData.categoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData(prev => ({ ...prev, preco: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especificações</label>
                <textarea
                  required
                  value={formData.especificacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, especificacoes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              {/* Seção de Fotos */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Fotos
                </h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    placeholder="URL da foto"
                    value={novaFoto}
                    onChange={(e) => setNovaFoto(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={adicionarFoto}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {formData.fotos.map((foto, index) => (
                    <div key={index} className="relative">
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removerFoto(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Seção de Vídeos */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Vídeos
                </h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    placeholder="URL do vídeo"
                    value={novoVideo}
                    onChange={(e) => setNovoVideo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={adicionarVideo}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Video className="h-4 w-4 text-gray-500" />
                      <span className="flex-1 text-sm truncate">{video}</span>
                      <button
                        type="button"
                        onClick={() => removerVideo(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="disponivel"
                  checked={formData.disponivel}
                  onChange={(e) => setFormData(prev => ({ ...prev, disponivel: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="disponivel" className="text-sm font-medium text-gray-700">
                  Disponível para aluguel
                </label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBrinquedoModal(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Modal Cliente
  const ClienteModal = () => {
    const [formData, setFormData] = useState({
      nome: editingItem?.nome || '',
      telefone: editingItem?.telefone || '',
      email: editingItem?.email || '',
      rg: editingItem?.rg || '',
      cpf: editingItem?.cpf || '',
      endereco: editingItem?.endereco || '',
      enderecoEvento: editingItem?.enderecoEvento || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      if (editingItem) {
        setClientes(prev => prev.map(c => 
          c.id === editingItem.id ? { ...c, ...formData } : c
        ))
      } else {
        const novoCliente: Cliente = {
          id: Date.now().toString(),
          ...formData
        }
        setClientes(prev => [...prev, novoCliente])
      }
      
      setShowClienteModal(false)
      setEditingItem(null)
    }

    if (!showClienteModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                <input
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                  <input
                    type="text"
                    value={formData.rg}
                    onChange={(e) => setFormData(prev => ({ ...prev, rg: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço do Evento</label>
                <input
                  type="text"
                  value={formData.enderecoEvento}
                  onChange={(e) => setFormData(prev => ({ ...prev, enderecoEvento: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowClienteModal(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Modal Orçamento
  const OrcamentoModal = () => {
    const [formData, setFormData] = useState({
      clienteId: editingItem?.clienteId || '',
      dataEvento: editingItem?.dataEvento || '',
      horaInicio: editingItem?.horaInicio || '08:00',
      horaFim: editingItem?.horaFim || '18:00',
      endereco: editingItem?.endereco || '',
      dataVencimento: editingItem?.dataVencimento || '',
      desconto: editingItem?.desconto || 0,
      observacoes: editingItem?.observacoes || '',
      brinquedos: editingItem?.brinquedos || []
    })

    const [selectedBrinquedo, setSelectedBrinquedo] = useState('')
    const [quantidade, setQuantidade] = useState(1)

    const adicionarBrinquedo = () => {
      if (!selectedBrinquedo) return
      
      const brinquedo = brinquedos.find(b => b.id === selectedBrinquedo)
      if (!brinquedo) return

      const novoBrinquedo = {
        id: brinquedo.id,
        quantidade,
        preco: brinquedo.preco
      }

      setFormData(prev => ({
        ...prev,
        brinquedos: [...prev.brinquedos, novoBrinquedo]
      }))

      setSelectedBrinquedo('')
      setQuantidade(1)
    }

    const removerBrinquedo = (index: number) => {
      setFormData(prev => ({
        ...prev,
        brinquedos: prev.brinquedos.filter((_, i) => i !== index)
      }))
    }

    const valorTotal = formData.brinquedos.reduce((total, b) => total + (b.preco * b.quantidade), 0)
    const valorDesconto = valorTotal * (formData.desconto / 100)
    const valorComDesconto = valorTotal - valorDesconto

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      if (editingItem) {
        setOrcamentos(prev => prev.map(o => 
          o.id === editingItem.id ? { 
            ...o, 
            ...formData, 
            valorTotal,
            valorComDesconto 
          } : o
        ))
      } else {
        const novoOrcamento: Orcamento = {
          id: Date.now().toString(),
          ...formData,
          valorTotal,
          valorComDesconto,
          status: 'pendente'
        }
        setOrcamentos(prev => [...prev, novoOrcamento])
      }
      
      setShowOrcamentoModal(false)
      setEditingItem(null)
    }

    if (!showOrcamentoModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select
                  required
                  value={formData.clienteId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clienteId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data do Evento *</label>
                  <input
                    type="date"
                    required
                    value={formData.dataEvento}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataEvento: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vencimento *</label>
                  <input
                    type="date"
                    required
                    value={formData.dataVencimento}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataVencimento: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Início *</label>
                  <input
                    type="time"
                    required
                    value={formData.horaInicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fim *</label>
                  <input
                    type="time"
                    required
                    value={formData.horaFim}
                    onChange={(e) => setFormData(prev => ({ ...prev, horaFim: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço do Evento *</label>
                <input
                  type="text"
                  required
                  value={formData.endereco}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.desconto}
                  onChange={(e) => setFormData(prev => ({ ...prev, desconto: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              {/* Adicionar Brinquedos */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Brinquedos</h4>
                <div className="flex gap-2 mb-3">
                  <select
                    value={selectedBrinquedo}
                    onChange={(e) => setSelectedBrinquedo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um brinquedo</option>
                    {brinquedos.filter(b => b.disponivel).map(brinquedo => (
                      <option key={brinquedo.id} value={brinquedo.id}>
                        {brinquedo.nome} - {formatCurrency(brinquedo.preco)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={adicionarBrinquedo}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Lista de Brinquedos Selecionados */}
                <div className="space-y-2">
                  {formData.brinquedos.map((b, index) => {
                    const brinquedo = brinquedos.find(br => br.id === b.id)
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{brinquedo?.nome}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            {b.quantidade}x {formatCurrency(b.preco)} = {formatCurrency(b.preco * b.quantidade)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removerBrinquedo(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
                
                {formData.brinquedos.length > 0 && (
                  <div className="mt-3 text-right space-y-1">
                    <div className="text-sm text-gray-600">
                      Subtotal: {formatCurrency(valorTotal)}
                    </div>
                    {formData.desconto > 0 && (
                      <div className="text-sm text-green-600">
                        Desconto ({formData.desconto}%): -{formatCurrency(valorDesconto)}
                      </div>
                    )}
                    <div className="text-lg font-bold text-green-600">
                      Total: {formatCurrency(valorComDesconto)}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowOrcamentoModal(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Modal de Configuração
  const ConfigModal = () => {
    const [formData, setFormData] = useState(configuracao)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setConfiguracao(formData)
      setShowConfigModal(false)
    }

    if (!showConfigModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Configurações da Empresa</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo (URL)</label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  required
                  value={formData.endereco}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input
                  type="text"
                  required
                  value={formData.cnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Termos do Contrato</label>
                <textarea
                  required
                  value={formData.termosContrato}
                  onChange={(e) => setFormData(prev => ({ ...prev, termosContrato: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={10}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">{configuracao.nome}</h1>
            </div>
            <button
              onClick={() => setShowConfigModal(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm border p-4">
              <div className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'catalogo', label: 'Catálogo', icon: Package },
                  { id: 'clientes', label: 'Clientes', icon: Users },
                  { id: 'orcamentos', label: 'Orçamentos', icon: FileText },
                  { id: 'agenda', label: 'Agenda', icon: Calendar },
                  { id: 'contratos', label: 'Contratos', icon: FileDown }
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'catalogo' && <Catalogo />}
            {activeTab === 'clientes' && <Clientes />}
            {activeTab === 'orcamentos' && <Orcamentos />}
            {activeTab === 'agenda' && <Agenda />}
            {activeTab === 'contratos' && <Contratos />}
          </div>
        </div>
      </div>

      {/* Modais */}
      <BrinquedoModal />
      <ClienteModal />
      <OrcamentoModal />
      <ConfigModal />
      <MediaModal />
    </div>
  )
}