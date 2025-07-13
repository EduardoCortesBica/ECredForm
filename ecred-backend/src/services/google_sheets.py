import json
import os
from datetime import datetime

class GoogleSheetsService:
    def __init__(self):
        self.spreadsheet_id = None
        self.simulation_mode = True
        
    def setup_credentials(self, credentials_json_path=None, spreadsheet_id=None):
        """
        Configura as credenciais para acessar o Google Sheets
        Por enquanto, funciona em modo simulação
        """
        if spreadsheet_id:
            self.spreadsheet_id = spreadsheet_id
            
        print("Modo simulação ativado - dados serão logados no console")
        return True
    
    def add_form_data(self, data):
        """
        Adiciona dados do formulário à planilha (modo simulação)
        """
        try:
            print("=== DADOS RECEBIDOS NO BACKEND ===")
            print(f"Data/Hora: {data.get('timestamp', datetime.now().isoformat())}")
            print(f"Serviço: {data.get('service', '')}")
            print(f"Nome: {data.get('nome', '')}")
            print(f"CPF: {data.get('cpf', '')}")
            print(f"Idade: {data.get('idade', '')}")
            print(f"WhatsApp: {data.get('whatsapp', '')}")
            print(f"Respostas: {json.dumps(data.get('questionAnswers', {}), indent=2, ensure_ascii=False)}")
            print("=" * 50)
            
            # Salvar em arquivo local como backup
            backup_file = f"/home/ubuntu/ecred-backend/dados_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Backup salvo em: {backup_file}")
            
            return True
            
        except Exception as e:
            print(f"Erro ao processar dados: {str(e)}")
            return False
    
    def get_spreadsheet_url(self):
        """
        Retorna a URL da planilha
        """
        if self.spreadsheet_id:
            return f"https://docs.google.com/spreadsheets/d/{self.spreadsheet_id}/edit"
        return None

# Instância global do serviço
sheets_service = GoogleSheetsService()

