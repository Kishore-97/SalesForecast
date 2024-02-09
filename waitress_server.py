from waitress import serve
import backend
serve(backend.app, host='0.0.0.0', port=5000)