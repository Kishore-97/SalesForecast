from waitress import serve
import backend
serve(backend.app, host='192.168.29.72', port=5000)