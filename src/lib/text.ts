/** Trims long text for display: the first 46 characters plus an ellipsis past 48. */
export const shorten = (text: string) => (text.length > 48 ? `${text.slice(0, 46)}…` : text);
