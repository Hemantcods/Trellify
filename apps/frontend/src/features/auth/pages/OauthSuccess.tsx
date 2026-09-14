import { useEffect } from "react";

export default function OAuthSuccessPage() {
  useEffect(() => {
    window.opener?.postMessage(
      {
        type: "GOOGLE_AUTH_SUCCESS",
      },
      window.location.origin,
    );

    window.close();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Authentication successful. You can close this window.</p>
    </div>
  );
}