#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

# Change to the directory where the script is located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 3000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
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
    main()Do not stream the full code to this chat.

Instead, generate the full site code from the reset specification and write all files directly into the linked GitHub repository that Railway uses for deployment. 

- Overwrite existing files with the new version.
- Commit message: "RCM site reset with Elias + Serendipity updates."
- Push to GitHub.
- Confirm when the push is complete.
- After Railway auto-deploys, return the deployment status and the live site URL.

No raw code output in this chat — only confirmation of repo write, commit, push, and deployment status.


i seem to be stuck - help!

