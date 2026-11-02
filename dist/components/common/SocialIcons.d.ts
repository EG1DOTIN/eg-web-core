import { default as React } from 'react';
export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    className?: string;
}
/**
 * Facebook Official Vector Icon
 */
export declare const FacebookIcon: React.FC<IconProps>;
/**
 * Instagram Official Vector Icon
 */
export declare const InstagramIcon: React.FC<IconProps>;
/**
 * X (Twitter) Official Vector Icon
 */
export declare const XTwitterIcon: React.FC<IconProps>;
export declare const TwitterIcon: React.FC<IconProps>;
/**
 * YouTube Official Vector Icon
 */
export declare const YouTubeIcon: React.FC<IconProps>;
/**
 * Chess Knight Vector Icon (Exact FontAwesome 5 & 6 Solid fas fa-chess-knight)
 */
export declare const ChessKnightIcon: React.FC<IconProps>;
/**
 * Lichess Vector Icon (Chess Knight)
 */
export declare const LichessIcon: React.FC<IconProps>;
/**
 * Chess Pawn Vector Icon (Exact FontAwesome 5 & 6 Solid fas fa-chess-pawn)
 */
export declare const ChessPawnIcon: React.FC<IconProps>;
/**
 * Chess.com Pawn Vector Icon
 */
export declare const ChessComIcon: React.FC<IconProps>;
/**
 * Paper Plane Vector Icon (Matching FontAwesome fas fa-paper-plane)
 */
export declare const PaperPlaneIcon: React.FC<IconProps>;
export declare const SendMailIcon: React.FC<IconProps>;
/**
 * GitHub Official Vector Icon
 */
export declare const GitHubIcon: React.FC<IconProps>;
/**
 * LinkedIn Official Vector Icon
 */
export declare const LinkedInIcon: React.FC<IconProps>;
/**
 * Discord Official Vector Icon
 */
export declare const DiscordIcon: React.FC<IconProps>;
/**
 * Telegram Official Vector Icon
 */
export declare const TelegramIcon: React.FC<IconProps>;
/**
 * WhatsApp Official Vector Icon
 */
export declare const WhatsAppIcon: React.FC<IconProps>;
/**
 * Reddit Official Vector Icon
 */
export declare const RedditIcon: React.FC<IconProps>;
/**
 * TikTok Official Vector Icon
 */
export declare const TikTokIcon: React.FC<IconProps>;
/**
 * Twitch Official Vector Icon
 */
export declare const TwitchIcon: React.FC<IconProps>;
/**
 * Threads Official Vector Icon
 */
export declare const ThreadsIcon: React.FC<IconProps>;
/**
 * Mastodon Official Vector Icon
 */
export declare const MastodonIcon: React.FC<IconProps>;
/**
 * Pinterest Official Vector Icon
 */
export declare const PinterestIcon: React.FC<IconProps>;
/**
 * Spotify Official Vector Icon
 */
export declare const SpotifyIcon: React.FC<IconProps>;
/**
 * Envelope / Email Vector Icon
 */
export declare const EnvelopeIcon: React.FC<IconProps>;
/**
 * Globe / Web Vector Icon
 */
export declare const GlobeIcon: React.FC<IconProps>;
export type SocialIconName = 'facebook' | 'facebook-f' | 'instagram' | 'x' | 'twitter' | 'x-twitter' | 'youtube' | 'lichess' | 'chesscom' | 'chess.com' | 'chess-knight' | 'chess-pawn' | 'knight' | 'pawn' | 'github' | 'linkedin' | 'discord' | 'telegram' | 'whatsapp' | 'reddit' | 'tiktok' | 'twitch' | 'threads' | 'mastodon' | 'pinterest' | 'spotify' | 'paper-plane' | 'paperplane' | 'send' | 'send-message' | 'email' | 'mail' | 'envelope' | 'globe' | 'website' | (string & {});
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
export declare const SocialIcon: React.FC<SocialIconProps>;
