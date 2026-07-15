import {
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

export const genLayerLinks = [
  { label: "Discord", href: "https://discord.gg/genlayerlabs", icon: "discord" },
  { label: "X / Twitter", href: "https://x.com/GenLayer", icon: "x" },
  { label: "GitHub", href: "https://github.com/genlayerlabs", icon: "github" },
  { label: "Documentation", href: "https://docs.genlayer.com", icon: "docs" },
] as const;

type GenLayerLinkIcon = (typeof genLayerLinks)[number]["icon"];

function LinkIcon({ icon }: { icon: GenLayerLinkIcon }) {
  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.8a9.4 9.4 0 0 0-3 18.3c.5.1.6-.2.6-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-4.7 0-1 .4-1.9 1-2.5-.1-.3-.4-1.3.1-2.5 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.2.2 2.2.1 2.5.6.6 1 1.5 1 2.5 0 3.6-2.4 4.4-4.6 4.7.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.4 9.4 0 0 0 12 2.8Z" />
      </svg>
    );
  }

  if (icon === "discord") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.8 5.2A16 16 0 0 0 15 4l-.5 1a13 13 0 0 0-5 0L9 4a16 16 0 0 0-3.8 1.2C2.8 8.8 2.1 12.3 2.4 15.8A15 15 0 0 0 7 18.2l1.1-1.5c-.6-.2-1.2-.5-1.7-.9l.4-.3a11.7 11.7 0 0 0 10.4 0l.4.3c-.5.4-1.1.7-1.7.9l1.1 1.5a15 15 0 0 0 4.6-2.4c.4-4.1-.7-7.6-2.8-10.6ZM8.5 14.2c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
      </svg>
    );
  }

  if (icon === "x") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h3.8l4 5.4L17.4 4H19l-5.5 6.5L19.8 20H16l-4.4-6-5 6H5l5.9-7.1L5 4Zm3 1.4L16.7 18h1.1L9.1 5.4H8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3.5h10.5L19 7v13.5H5v-17Zm2 2v13h10V8h-3V5.5H7Zm2 5h6v1.5H9v-1.5Zm0 3h6V15H9v-1.5Z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M9 2h5v5h-1.5V4.6L7.1 10 6 8.9l5.4-5.4H9V2Z" />
      <path d="M3.5 3.5H8V5H5v6h6V8h1.5v4.5h-9v-9Z" />
    </svg>
  );
}

export function AboutGenLayerMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  }

  function handleMouseLeave(): void {
    if (!rootRef.current?.contains(document.activeElement)) {
      setIsOpen(false);
    }
  }

  function handleTriggerFocus(event: FocusEvent<HTMLButtonElement>): void {
    if (event.currentTarget.matches(":focus-visible")) {
      setIsOpen(true);
    }
  }

  function handleTriggerClick(event: MouseEvent<HTMLButtonElement>): void {
    setIsOpen((currentValue) => (event.detail === 0 ? true : !currentValue));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <div
      className="about-menu"
      ref={rootRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        className="nav-link about-trigger"
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="about-genlayer-menu"
        onFocus={handleTriggerFocus}
        onClick={handleTriggerClick}
      >
        About GenLayer
        <svg className="chevron-icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      <div
        className={`about-dropdown ${isOpen ? "is-open" : ""}`}
        id="about-genlayer-menu"
        aria-hidden={!isOpen}
      >
        <p className="dropdown-label">GenLayer ecosystem</p>
        {genLayerLinks.map((link) => (
          <a
            className="about-link"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label}, opens in a new tab`}
            tabIndex={isOpen ? 0 : -1}
            key={link.href}
          >
            <span className="about-link-icon">
              <LinkIcon icon={link.icon} />
            </span>
            <span>{link.label}</span>
            <span className="external-link-icon">
              <ExternalLinkIcon />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
