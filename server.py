#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

# Change to the directory where the script is located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = int(os.environ.get('PORT', 3000))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # Add additional headers for static assets
        if self.path.endswith(('.js', '.css')):
            self.send_header('ETag', '')
            self.send_header('Last-Modified', '')
        super().end_headers()

def main():
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 Rutherford Creative Media website is now running!")
            print(f"📱 Open your browser and visit: http://localhost:{PORT}")
            print(f"🛑 Press Ctrl+C to stop the server")
            print("-" * 50)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped successfully!")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use. Please try a different port or stop the existing server.")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()