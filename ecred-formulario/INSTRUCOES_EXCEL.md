# Sistema de Exportação para Excel - E CRED

## Como Funciona

O formulário da E CRED agora possui um sistema automático de exportação de dados para Excel. Sempre que um usuário preenche e envia o formulário, os dados são preparados para exportação.

## Arquivos do Sistema

### 1. `process_form_data.py`
Script Python principal para gerenciar os dados do formulário e exportar para Excel.

**Funcionalidades:**
- ✅ Criar dados de exemplo para teste
- ✅ Visualizar dados existentes no Excel
- ✅ Adicionar dados manualmente
- ✅ Exportação automática com timestamp
- ✅ Preservação de dados existentes

### 2. `dados_formulario_ecred.xlsx`
Arquivo Excel que armazena todos os dados dos formulários enviados.

**Colunas do Excel:**
- **Data/Hora**: Timestamp de quando o formulário foi enviado
- **Serviço**: Tipo de serviço selecionado (INSS, SIAPE, CLT, etc.)
- **Nome**: Nome completo do solicitante
- **CPF**: CPF do solicitante
- **Idade**: Idade do solicitante
- **WhatsApp**: Número de WhatsApp para contato
- **Respostas_INSS_Representante**: Resposta específica do INSS
- **Respostas_CLT_Emprestimo**: Resposta específica do CLT
- **Respostas_Bolsa_App**: Resposta específica do Bolsa Família
- **Respostas_Bolsa_Emprestimo**: Resposta específica do Bolsa Família
- **Todas_Respostas_JSON**: Todas as respostas em formato JSON

## Como Usar

### Opção 1: Uso Automático (Recomendado)
1. O usuário preenche o formulário no site
2. Os dados são automaticamente preparados para exportação
3. Execute o script Python para processar os dados pendentes

### Opção 2: Uso Manual
1. Execute o script: `python3 process_form_data.py`
2. Escolha uma das opções:
   - **1**: Criar dados de exemplo (para teste)
   - **2**: Visualizar dados existentes
   - **3**: Adicionar dados manualmente
   - **4**: Sair

### Exemplo de Uso
```bash
cd ecred-formulario
python3 process_form_data.py
```

## Requisitos

### Python
- Python 3.6 ou superior
- Bibliotecas necessárias:
  ```bash
  pip install pandas openpyxl
  ```

### Estrutura de Dados
Os dados são organizados da seguinte forma:
```json
{
  "service": "Crédito para INSS",
  "nome": "João Silva Santos",
  "cpf": "123.456.789-01",
  "idade": "65",
  "whatsapp": "(11) 98765-4321",
  "questionAnswers": {
    "inssRepresentante": "nao"
  }
}
```

## Vantagens do Sistema

### ✅ Automático
- Exportação automática sempre que o formulário é enviado
- Não requer intervenção manual

### ✅ Organizado
- Dados estruturados em colunas específicas
- Timestamp para rastreamento temporal
- Preservação de dados históricos

### ✅ Flexível
- Suporte a todos os tipos de serviço
- Respostas específicas organizadas por categoria
- Backup completo em JSON

### ✅ Seguro
- Dados preservados mesmo com múltiplas execuções
- Validação de dados antes da exportação
- Tratamento de erros robusto

## Solução de Problemas

### Erro: "ModuleNotFoundError: No module named 'pandas'"
```bash
pip install pandas openpyxl
```

### Erro: "Permission denied"
- Verifique se tem permissão de escrita na pasta
- Execute como administrador se necessário

### Arquivo Excel corrompido
- Delete o arquivo `dados_formulario_ecred.xlsx`
- Execute o script novamente para criar um novo arquivo

## Backup e Segurança

### Recomendações:
1. **Backup regular**: Faça backup do arquivo Excel periodicamente
2. **Controle de acesso**: Mantenha o arquivo em local seguro
3. **Validação**: Verifique os dados regularmente usando a opção "Visualizar dados"

## Personalização

### Adicionar novas colunas:
1. Edite a função `add_form_data()` em `process_form_data.py`
2. Adicione as novas colunas no dicionário `row_data`
3. Execute o script para aplicar as mudanças

### Alterar formato de data:
Modifique a linha:
```python
'Data/Hora': datetime.now().strftime('%d/%m/%Y %H:%M:%S')
```

---

**Desenvolvido para E CRED** - Sistema de exportação automática de dados do formulário para Excel.

