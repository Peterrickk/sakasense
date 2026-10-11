/** Path prefix the dashboard is served under (`basePath` in next.config.ts). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a /public asset path; `basePath` is applied to links automatically but not to image `src`. */
export const asset = (path: string) => `${BASE_PATH}${path}`;
