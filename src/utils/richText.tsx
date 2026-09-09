import type { ReactNode } from 'react';

/**
 * The one piece of markup the case-study copy is allowed: `**word**` marks the
 * few words a chapter turns on, so the eye finds them before the sentence.
 *
 * Split into nodes rather than fed to dangerouslySetInnerHTML — the project
 * text stays plain data, and nothing written in it can ever render as markup.
 */
const bold = /\*\*(.+?)\*\*/g;

export const renderRichText = (text: string): ReactNode[] => {
    const nodes: ReactNode[] = [];
    let cursor = 0;

    for (const match of text.matchAll(bold)) {
        const start = match.index ?? 0;
        if (start > cursor) nodes.push(text.slice(cursor, start));
        nodes.push(<strong key={start}>{match[1]}</strong>);
        cursor = start + match[0].length;
    }

    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
};

export default renderRichText;
