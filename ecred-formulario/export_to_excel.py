#!/usr/bin/env python3
import pandas as pd
import json
import sys
import os
from datetime import datetime

def export_to_excel(data):
    """
    Exporta os dados do formulário para um arquivo Excel
    """
    excel_file = 'dados_formulario_ecred.xlsx'
    
    # Preparar os dados para o DataFrame
    row_data = {
        'Data/Hora': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        'Serviço': data.get('service', ''),
        'Nome': data.get('nome', ''),
        'CPF': data.get('cpf', ''),
        'Idade': data.get('idade', ''),
        'WhatsApp': data.get('whatsapp', ''),
        'Respostas': json.dumps(data.get('questionAnswers', {}), ensure_ascii=False)
    }
    
    # Verificar se o arquivo já existe
    if os.path.exists(excel_file):
        # Ler o arquivo existente
        try:
            df_existing = pd.read_excel(excel_file)
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
        df_combined.to_excel(excel_file, index=False, engine='openpyxl')
        print(f"Dados exportados com sucesso para {excel_file}")
        return True
    except Exception as e:
        print(f"Erro ao salvar arquivo Excel: {e}")
        return False

def main():
    """
    Função principal que recebe dados via argumentos da linha de comando
    """
    if len(sys.argv) < 2:
        print("Erro: Dados não fornecidos")
        sys.exit(1)
    
    try:
        # Receber dados JSON como argumento
        data_json = sys.argv[1]
        data = json.loads(data_json)
        
        # Exportar para Excel
        success = export_to_excel(data)
        
        if success:
            print("SUCCESS")
        else:
            print("ERROR")
            
    except json.JSONDecodeError as e:
        print(f"Erro ao decodificar JSON: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Erro geral: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

