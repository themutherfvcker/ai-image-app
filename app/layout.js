import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

export const metadata = {
  title: "Nano Banana - AI Image Editor",
  description: "Generate and edit images with simple text prompts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
