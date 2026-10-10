"use client";

type GoogleMapsWindow = Window & {
  google?: {
    maps: {
      importLibrary: (name: string) => Promise<Record<string, unknown>>;
    };
  };
  __sakasenseMapsPromise?: Promise<void>;
};

export function getGoogleMapsApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return key || undefined;
}

/** Loads the Maps JS API once, then callers can `importLibrary("maps3d")`. */
export function loadGoogleMaps(apiKey: string): Promise<void> {
  const w = window as GoogleMapsWindow;
  if (w.google?.maps?.importLibrary) return Promise.resolve();
  if (w.__sakasenseMapsPromise) return w.__sakasenseMapsPromise;

  w.__sakasenseMapsPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-sakasense-maps]",
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Maps script failed")));
      return;
    }

    const script = document.createElement("script");
    script.dataset.sakasenseMaps = "1";
    script.async = true;
    // beta/weekly channel includes Map3DElement (maps3d library)
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps JS API"));
    document.head.appendChild(script);
  });

  return w.__sakasenseMapsPromise;
}

export async function importMaps3d() {
  const w = window as GoogleMapsWindow;
  if (!w.google?.maps?.importLibrary) {
    throw new Error("Google Maps not loaded");
  }
  return w.google.maps.importLibrary("maps3d") as Promise<{
    Map3DElement: new (options: Record<string, unknown>) => HTMLElement & {
      mode: string;
      append: (child: HTMLElement) => void;
      replaceChildren: (...nodes: Node[]) => void;
    };
    Marker3DInteractiveElement: new (options: Record<string, unknown>) => HTMLElement & {
      addEventListener: (type: string, listener: EventListener) => void;
    };
    Marker3DElement: new (options: Record<string, unknown>) => HTMLElement;
  }>;
}
