from flask import Blueprint, request, jsonify
from datetime import datetime
import json
from src.services.google_sheets import sheets_service

form_bp = Blueprint('form', __name__)

@form_bp.route('/submit_form', methods=['POST'])
def submit_form():
    """
    Endpoint para receber dados do formulário E CRED
    """
    try:
        # Receber dados JSON do formulário
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Nenhum dado recebido'}), 400
        
        # Validar campos obrigatórios
        required_fields = ['service', 'nome', 'cpf', 'idade', 'whatsapp']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Campo obrigatório ausente: {field}'}), 400
        
        # Adicionar timestamp
        data['timestamp'] = datetime.now().isoformat()
        
        # Salvar no Google Sheets
        success = sheets_service.add_form_data(data)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Dados salvos com sucesso!',
                'timestamp': data['timestamp'],
                'spreadsheet_url': sheets_service.get_spreadsheet_url()
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Erro ao salvar dados'
            }), 500
            
    except Exception as e:
        print(f"Erro no endpoint submit_form: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Erro interno do servidor'
        }), 500

@form_bp.route('/setup_sheets', methods=['POST'])
def setup_sheets():
    """
    Endpoint para configurar a integração com Google Sheets
    """
    try:
        data = request.get_json()
        spreadsheet_id = data.get('spreadsheet_id')
        
        if not spreadsheet_id:
            return jsonify({'error': 'spreadsheet_id é obrigatório'}), 400
        
        # Configurar o serviço (por enquanto sem credenciais)
        success = sheets_service.setup_credentials(spreadsheet_id=spreadsheet_id)
        
        return jsonify({
            'success': success,
            'message': 'Configuração realizada' if success else 'Usando modo simulação',
            'spreadsheet_url': sheets_service.get_spreadsheet_url()
        }), 200
        
    except Exception as e:
        print(f"Erro no endpoint setup_sheets: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Erro interno do servidor'
        }), 500

