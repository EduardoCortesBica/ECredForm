#!/usr/bin/env python3
"""
Script para processar dados do formulário E CRED e exportar para Excel
Uso: python process_form_data.py
"""

import pandas as pd
import json
import os
from datetime import datetime

class FormDataProcessor:
    def __init__(self, excel_file='dados_formulario_ecred.xlsx'):
        self.excel_file = excel_file
        self.temp_data_file = 'temp_form_data.json'
    
    def add_form_data(self, data):
        """
        Adiciona dados do formulário ao arquivo Excel
        """
        # Preparar os dados para o DataFrame
        row_data = {
            'Data/Hora': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
            'Serviço': data.get('service', ''),
            'Nome': data.get('nome', ''),
            'CPF': data.get('cpf', ''),
            'Idade': data.get('idade', ''),
            'WhatsApp': data.get('whatsapp', ''),
            'Respostas_INSS_Representante': data.get('questionAnswers', {}).get('inssRepresentante', ''),
            'Respostas_CLT_Emprestimo': data.get('questionAnswers', {}).get('cltEmprestimo', ''),
            'Respostas_Bolsa_App': data.get('questionAnswers', {}).get('bolsaApp', ''),
            'Respostas_Bolsa_Emprestimo': data.get('questionAnswers', {}).get('bolsaEmprestimo', ''),
            'Todas_Respostas_JSON': json.dumps(data.get('questionAnswers', {}), ensure_ascii=False)
        }
        
        # Verificar se o arquivo já existe
        if os.path.exists(self.excel_file):
            try:
                # Ler o arquivo existente
                df_existing = pd.read_excel(self.excel_file)
                # Adicionar nova linha
                df_new = pd.DataFrame([row_data])
                df_combined = pd.concat([df_existing, df_new], ignore_index=True)
            except Exception as e:
                print(f"Erro ao ler arquivo existente: {e}")
                # Se houver erro, criar novo DataFrame
                df_combined = pd.DataFrame([row_data])
        else:
            # Criar novo DataFrame
            df_combined = pd.DataFrame([row_data])
        
        # Salvar no arquivo Excel
        try:
            df_combined.to_excel(self.excel_file, index=False, engine='openpyxl')
            print(f"✅ Dados exportados com sucesso para {self.excel_file}")
            print(f"📊 Total de registros: {len(df_combined)}")
            return True
        except Exception as e:
            print(f"❌ Erro ao salvar arquivo Excel: {e}")
            return False
    
    def create_sample_data(self):
        """
        Cria dados de exemplo para demonstração
        """
        sample_data = [
            {
                'service': 'Crédito para INSS',
                'nome': 'João Silva Santos',
                'cpf': '123.456.789-01',
                'idade': '65',
                'whatsapp': '(11) 98765-4321',
                'questionAnswers': {'inssRepresentante': 'nao'}
            },
            {
                'service': 'CLT',
                'nome': 'Maria Oliveira',
                'cpf': '987.654.321-09',
                'idade': '35',
                'whatsapp': '(11) 91234-5678',
                'questionAnswers': {'cltEmprestimo': 'nao'}
            },
            {
                'service': 'SIAPE',
                'nome': 'Carlos Pereira',
                'cpf': '456.789.123-45',
                'idade': '42',
                'whatsapp': '(11) 95555-1234',
                'questionAnswers': {}
            }
        ]
        
        print("📝 Criando dados de exemplo...")
        for data in sample_data:
            self.add_form_data(data)
        
        print("✅ Dados de exemplo criados com sucesso!")
    
    def view_data(self):
        """
        Visualiza os dados do arquivo Excel
        """
        if not os.path.exists(self.excel_file):
            print(f"❌ Arquivo {self.excel_file} não encontrado.")
            return
        
        try:
            df = pd.read_excel(self.excel_file)
            print(f"\n📊 Dados do arquivo {self.excel_file}:")
            print("=" * 80)
            print(df.to_string(index=False))
            print("=" * 80)
            print(f"Total de registros: {len(df)}")
        except Exception as e:
            print(f"❌ Erro ao ler arquivo: {e}")

def main():
    """
    Função principal
    """
    processor = FormDataProcessor()
    
    print("🏢 Processador de Dados do Formulário E CRED")
    print("=" * 50)
    
    while True:
        print("\nOpções:")
        print("1. Criar dados de exemplo")
        print("2. Visualizar dados existentes")
        print("3. Adicionar dados manualmente")
        print("4. Sair")
        
        choice = input("\nEscolha uma opção (1-4): ").strip()
        
        if choice == '1':
            processor.create_sample_data()
        
        elif choice == '2':
            processor.view_data()
        
        elif choice == '3':
            print("\n📝 Adicionar dados manualmente:")
            try:
                nome = input("Nome: ").strip()
                cpf = input("CPF: ").strip()
                idade = input("Idade: ").strip()
                whatsapp = input("WhatsApp: ").strip()
                service = input("Serviço (INSS/SIAPE/CLT/Bolsa Família/FGTS): ").strip()
                
                data = {
                    'service': service,
                    'nome': nome,
                    'cpf': cpf,
                    'idade': idade,
                    'whatsapp': whatsapp,
                    'questionAnswers': {}
                }
                
                processor.add_form_data(data)
                
            except KeyboardInterrupt:
                print("\n❌ Operação cancelada.")
        
        elif choice == '4':
            print("👋 Saindo...")
            break
        
        else:
            print("❌ Opção inválida. Tente novamente.")

if __name__ == "__main__":
    main()

