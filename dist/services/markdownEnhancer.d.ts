import { marked } from 'marked';
interface MermaidApi {
    initialize: (config: Record<string, unknown>) => void;
    run?: (options: {
        nodes: ArrayLike<HTMLElement>;
    }) => Promise<void>;
    init?: (config?: unknown, nodes?: ArrayLike<HTMLElement>) => void;
    render?: (id: string, text: string) => Promise<{
        svg: string;
    }>;
}
interface PrismApi {
    highlightAllUnder: (container: Element) => void;
    highlightElement: (element: Element) => void;
}
export declare function slugify(text: string): string;
export declare function escapeHtmlEntities(str: string): string;
export declare function ensureMermaidLoaded(): Promise<MermaidApi | null>;
export declare function ensurePrismLoaded(): Promise<PrismApi | null>;
export declare function transformAlertCallouts(html: string): string;
export declare function highlightCode(rawCode: string, lang: string): string;
export declare function createCustomMarkedRenderer(): InstanceType<typeof marked.Renderer>;
export declare function parseMarkdownToHtml(markdown: string): string;
export declare function openMermaidFullscreenModal(svgEl: SVGElement, title?: string): void;
export declare function openImageLightbox(src: string, title?: string): void;
export declare function enhanceMarkdownContainer(container: HTMLElement | null, onOpenDiagramModal?: (svg: SVGElement, title: string) => void): void;
export {};
