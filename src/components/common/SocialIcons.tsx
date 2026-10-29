import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  className?: string;
}

/**
 * Facebook Official Vector Icon
 */
export const FacebookIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 320 512"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
  </svg>
);

/**
 * Instagram Official Vector Icon
 */
export const InstagramIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

/**
 * X (Twitter) Official Vector Icon
 */
export const XTwitterIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
export const TwitterIcon = XTwitterIcon;

/**
 * YouTube Official Vector Icon
 */
export const YouTubeIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

/**
 * Chess Knight Vector Icon (Exact FontAwesome 5 & 6 Solid fas fa-chess-knight)
 */
export const ChessKnightIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 384 512"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M19 272.47c-11.2 -4.98 -19 -16.2 -19 -29.24v-0.02v-137.21c0 -0.02 0 -0.04 0 -0.06 0 -6.61 2.68 -12.6 7 -16.94l9 -9l-14.21 -28.42c-1.14 -2.27 -1.79 -4.86 -1.79 -7.57v-0.01c0 -6.62 5.38 -12 12 -12h147.94c106 0 191.92 86 191.92 192v192h-319.86v-14.52c0 -0.01 -0.08 0.03 -0.08 0.02 0 -31.31 18.03 -58.45 44.27 -71.58l57.22 -28.65c15.75 -7.88 26.53 -24.13 26.53 -42.93v-0.01v-50.33l-22.12 11.08c-6.19 3.1 -10.84 8.79 -12.55 15.65l-9.22 30.65c-2.81 9.36 -9.77 16.9 -18.76 20.5l-12.78 5.12c-3.67 1.47 -7.72 2.27 -11.91 2.27c-4.62 0 -9.01 -0.98 -12.97 -2.74zM52 128c-11.04 0 -20 8.96 -20 20s8.96 20 20 20 20 -8.96 20 -20 -8.96 -20 -20 -20zM368 448c8.83 0 16 7.17 16 16v32c0 8.83 -7.17 16 -16 16h-352c-8.83 0 -16 -7.17 -16 -16v-32c0 -8.83 7.17 -16 16 -16h352z" />
  </svg>
);

/**
 * Lichess Vector Icon (Chess Knight)
 */
export const LichessIcon = ChessKnightIcon;

/**
 * Chess Pawn Vector Icon (Exact FontAwesome 5 & 6 Solid fas fa-chess-pawn)
 */
export const ChessPawnIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 320 512"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M105.10 224.00c-29.39 -18.38 -49.10 -50.78 -49.10 -88.00c0.00 -57.40 46.60 -104.00 104.00 -104.00s104.00 46.60 104.00 104.00c0.00 37.22 -19.71 69.62 -49.10 88.00h25.10c8.83 -0.00 16.00 7.17 16.00 16.00v32.00c0.00 8.83 -7.17 16.00 -16.00 16.00h-16.00v5.49c0.00 44.00 4.11 86.60 24.00 122.51h-176.00c19.86 -35.91 24.00 -78.51 24.00 -122.51v-5.49h-16.00c-8.83 -0.00 -16.00 -7.17 -16.00 -16.00v-32.00c0.00 -8.83 7.17 -16.00 16.00 -16.00h25.10zM304.00 448.00c8.83 -0.00 16.00 7.17 16.00 16.00v32.00c0.00 8.83 -7.17 16.00 -16.00 16.00h-288.00c-8.83 -0.00 -16.00 -7.17 -16.00 -16.00v-32.00c0.00 -8.83 7.17 -16.00 16.00 -16.00h288.00z" />
  </svg>
);

/**
 * Chess.com Pawn Vector Icon
 */
export const ChessComIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2a3.5 3.5 0 0 0-3.5 3.5c0 1.25.66 2.34 1.64 2.95C8.36 9.47 7 11.58 7 14.07v1.43c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-1.43c0-2.49-1.36-4.6-3.14-5.62A3.49 3.49 0 0 0 15.5 5.5 3.5 3.5 0 0 0 12 2zm-6 17a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H6z" />
  </svg>
);

/**
 * Paper Plane Vector Icon (Matching FontAwesome fas fa-paper-plane)
 */
export const PaperPlaneIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432c3.2-18.7-14.7-32.7-35.6-24.8z" />
  </svg>
);
export const SendMailIcon = PaperPlaneIcon;

/**
 * GitHub Official Vector Icon
 */
export const GitHubIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

/**
 * LinkedIn Official Vector Icon
 */
export const LinkedInIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

/**
 * Discord Official Vector Icon
 */
export const DiscordIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

/**
 * Telegram Official Vector Icon
 */
export const TelegramIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

/**
 * WhatsApp Official Vector Icon
 */
export const WhatsAppIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

/**
 * Reddit Official Vector Icon
 */
export const RedditIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm5.5 0c-.688 0-1.25.56-1.25 1.25 0 .688.562 1.25 1.25 1.25.69 0 1.25-.562 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm-5.465 4.417a.364.364 0 0 0-.046.513c.738.868 2.062 1.07 2.76 1.07.7 0 2.023-.202 2.761-1.07a.364.364 0 0 0-.047-.513.364.364 0 0 0-.512.047c-.51.6-.1.498-2.202.732-1.704 0-1.692-.132-2.202-.732a.364.364 0 0 0-.512-.047z" />
  </svg>
);

/**
 * TikTok Official Vector Icon
 */
export const TikTokIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.07 3.25-1.55 3.32-3.36.07-2.61.03-5.23.03-7.85 0-3.33-.02-6.66-.02-9.98z" />
  </svg>
);

/**
 * Twitch Official Vector Icon
 */
export const TwitchIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463zm-3.582-7.343v6.269h-2.149V6.269h2.149zm-5.731 0v6.269H9.851V6.269h2.15z" />
  </svg>
);

/**
 * Threads Official Vector Icon
 */
export const ThreadsIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.26 18.3 1.5 15.342 1.5 11.696c0-3.834.81-6.834 2.408-8.916C5.584.815 8.48 0 12.186 0c3.785 0 6.697.834 8.653 2.48 1.944 1.635 3.011 4.07 3.172 7.237h-3.46c-.15-2.222-.84-3.874-2.05-4.912-1.34-1.148-3.414-1.745-6.166-1.745-2.825 0-4.98.618-6.406 1.837-1.402 1.2-2.144 3.078-2.144 5.799 0 2.766.713 4.67 2.12 5.658 1.34 1.034 3.42 1.558 6.18 1.558 2.05 0 3.73-.34 5.03-1.01.69-.356 1.25-.844 1.67-1.455.45-.65.74-1.46.86-2.418H12.18V9.897h10.32c.11.83.16 1.7.16 2.6 0 3.48-.96 6.37-2.85 8.58C17.96 23.08 15.36 24 12.186 24z" />
  </svg>
);

/**
 * Mastodon Official Vector Icon
 */
export const MastodonIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.511.914 5.086.322 7.702.25 10.993.25 11.45c0 2.222.067 4.444.2 6.666.19 3.056 1.785 5.777 4.887 6.185 2.58.337 5.088-.04 7.42-1.111l-.16-2.217c-2.02.664-4.22.756-6.28.172-.88-.248-1.75-.724-1.92-1.684a4.42 4.42 0 0 1-.08-.916h.05c1.88.75 3.86 1.13 5.86 1.13h.1c2.81 0 5.46-.35 8.16-1.04 2.87-.73 4.49-3.27 4.67-6.23.23-3.79.16-7.14-.07-9.092zm-4.32 8.625h-2.5v-6.5c0-1.37-.58-2.07-1.73-2.07-1.27 0-1.9.82-1.9 2.45v3.52h-2.5v-3.52c0-1.63-.63-2.45-1.9-2.45-1.15 0-1.73.7-1.73 2.07v6.5H6.07v-6.7c0-1.37.35-2.46 1.05-3.26.72-.8 1.66-1.22 2.83-1.22 1.35 0 2.4.52 3.11 1.57l.63 1.06.63-1.06c.71-1.05 1.76-1.57 3.11-1.57 1.17 0 2.11.42 2.83 1.22.7.8 1.05 1.89 1.05 3.26v6.7z" />
  </svg>
);

/**
 * Pinterest Official Vector Icon
 */
export const PinterestIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

/**
 * Spotify Official Vector Icon
 */
export const SpotifyIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.308a.747.747 0 0 1-1.026.248c-2.809-1.716-6.345-2.105-10.51-1.153a.75.75 0 1 1-.334-1.463c4.561-1.041 8.486-.604 11.622 1.312a.748.748 0 0 1 .248 1.056zm1.47-3.268a.936.936 0 0 1-1.288.308c-3.216-1.977-8.118-2.548-11.922-1.393a.936.936 0 1 1-.548-1.79c4.347-1.319 9.74-.683 13.45 1.597a.936.936 0 0 1 .308 1.278zm.126-3.41c-3.856-2.29-10.222-2.502-13.916-1.381a1.124 1.124 0 1 1-.652-2.152c4.25-1.29 11.28-1.042 15.728 1.594a1.124 1.124 0 0 1-1.16 1.939z" />
  </svg>
);

/**
 * Envelope / Email Vector Icon
 */
export const EnvelopeIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

/**
 * Globe / Web Vector Icon
 */
export const GlobeIcon: React.FC<IconProps> = ({
  size = 18,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

export type SocialIconName =
  | 'facebook'
  | 'facebook-f'
  | 'instagram'
  | 'x'
  | 'twitter'
  | 'x-twitter'
  | 'youtube'
  | 'lichess'
  | 'chesscom'
  | 'chess.com'
  | 'chess-knight'
  | 'chess-pawn'
  | 'knight'
  | 'pawn'
  | 'github'
  | 'linkedin'
  | 'discord'
  | 'telegram'
  | 'whatsapp'
  | 'reddit'
  | 'tiktok'
  | 'twitch'
  | 'threads'
  | 'mastodon'
  | 'pinterest'
  | 'spotify'
  | 'paper-plane'
  | 'paperplane'
  | 'send'
  | 'send-message'
  | 'email'
  | 'mail'
  | 'envelope'
  | 'globe'
  | 'website'
  | (string & {});

export interface SocialIconProps extends IconProps {
  name: SocialIconName;
}

/**
 * Universal Social Media & Platform Icon dispatcher component.
 * Automatically resolves canonical icon vector based on platform name.
 *
 * @example
 * ```tsx
 * <SocialIcon name="x" size={18} />
 * <SocialIcon name="facebook" size={18} />
 * <SocialIcon name="chess-knight" size={18} />
 * ```
 */
export const SocialIcon: React.FC<SocialIconProps> = ({ name, ...props }) => {
  const normalized = (name || '').toLowerCase().trim();

  switch (normalized) {
    case 'facebook':
    case 'facebook-f':
    case 'fb':
      return <FacebookIcon {...props} />;

    case 'instagram':
    case 'ig':
    case 'insta':
      return <InstagramIcon {...props} />;

    case 'x':
    case 'twitter':
    case 'x-twitter':
    case 'x (twitter)':
      return <XTwitterIcon {...props} />;

    case 'youtube':
    case 'yt':
      return <YouTubeIcon {...props} />;

    case 'lichess':
      return <LichessIcon {...props} />;

    case 'chess-knight':
    case 'knight':
      return <ChessKnightIcon {...props} />;

    case 'chess-pawn':
    case 'pawn':
      return <ChessPawnIcon {...props} />;

    case 'chesscom':
    case 'chess.com':
      return <ChessComIcon {...props} />;

    case 'github':
    case 'gh':
      return <GitHubIcon {...props} />;

    case 'linkedin':
      return <LinkedInIcon {...props} />;

    case 'discord':
      return <DiscordIcon {...props} />;

    case 'telegram':
    case 'tg':
      return <TelegramIcon {...props} />;

    case 'whatsapp':
    case 'wa':
      return <WhatsAppIcon {...props} />;

    case 'reddit':
      return <RedditIcon {...props} />;

    case 'tiktok':
      return <TikTokIcon {...props} />;

    case 'twitch':
      return <TwitchIcon {...props} />;

    case 'threads':
      return <ThreadsIcon {...props} />;

    case 'mastodon':
      return <MastodonIcon {...props} />;

    case 'pinterest':
      return <PinterestIcon {...props} />;

    case 'spotify':
      return <SpotifyIcon {...props} />;

    case 'paper-plane':
    case 'paperplane':
    case 'send':
    case 'send-message':
      return <PaperPlaneIcon {...props} />;

    case 'email':
    case 'mail':
    case 'envelope':
      return <EnvelopeIcon {...props} />;

    case 'globe':
    case 'web':
    case 'website':
      return <GlobeIcon {...props} />;

    default:
      // Fallback: If unknown, render capital initial letter or empty
      if (normalized.length > 0) {
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: props.size || 18,
              height: props.size || 18,
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {normalized[0]}
          </span>
        );
      }
      return null;
  }
};
