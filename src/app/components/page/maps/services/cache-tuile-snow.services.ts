import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheTuileSnowServices {

  // tileKey (BBOX) → blob URL
  private cache = new Map<string, string>();

  async getTileUrl(url: string): Promise<string> {
    const key = this.toKey(url);

    if (this.cache.has(key)) {
      console.log('[SnowCache] HIT', key.substring(0, 30));
      return this.cache.get(key)!;
    }

    console.log('[SnowCache] MISS — fetch Sentinel', key.substring(0, 30));
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    this.cache.set(key, blobUrl);
    return blobUrl;
  }

  private toKey(url: string): string {
    const match = url.match(/BBOX=([^&]+)/);
    return match ? match[1] : url;
  }

  clearCache(): void {
    this.cache.forEach(blobUrl => URL.revokeObjectURL(blobUrl));
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}
