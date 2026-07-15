import { useState } from "react";

export function BuilderSignature() {
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  return (
    <aside className="builder-signature" aria-label="Creator attribution">
      {imageFailed ? (
        <span className="builder-avatar-fallback" aria-label="0xMamareza profile picture">0x</span>
      ) : (
        <img
          src="/0xmamareza-pfp.png"
          alt="0xMamareza profile picture"
          onError={() => setImageFailed(true)}
        />
      )}
      <span>Built By 0xMamareza</span>
    </aside>
  );
}
