import { cached } from './shared';

/** Lazy evaluated color object using a RGB integer as the root. */
export class Color {
  constructor(readonly value: number) {}

  /** Creates a color object from an rgb integer. */
  static fromValue(value: number): Color {
    return new Color(value);
  }

  /** Creates a color object from a hex code. With or without leading #, and then 3 or 6 hex characters. */
  static fromHex(hex: string): Color {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(c => c + c)
        .join('');
    }
    if (hex.length !== 6) {
      throw new Error('Invalid hex code provided.');
    }
    return new Color(parseInt(hex, 16));
  }

  /** The red component of this color. */
  get red(): number {
    return cached(this, 'red', (this.value >> 16) & 0xff);
  }

  /** The green component of this color. */
  get green(): number {
    return cached(this, 'green', (this.value >> 8) & 0xff);
  }

  /** The blue component of this color. */
  get blue(): number {
    return cached(this, 'blue', this.value & 0xff);
  }

  /** The hex code of this color with the # included. */
  get hex(): string {
    return cached(this, 'hex', `#${this.value.toString(16).padStart(6, '0')}`);
  }

  /** @private Computes The hue, saturation, and lightness of this color. */
  private computeHSL() {
    const r = this.red / 255;
    const g = this.green / 255;
    const b = this.blue / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    cached(this, 'hue', h);
    cached(this, 'saturation', s);
    cached(this, 'lightness', l);
  }

  // The behavior of .cached allows us to run .computeHSL once and *overwrite* the getters in
  // a performant way. Looks like a hack, but in actuality, it still kind of is.

  /** The hue of this color. */
  get hue(): number {
    this.computeHSL();
    return this.hue;
  }

  /** The saturation of this color. */
  get saturation(): number {
    this.computeHSL();
    return this.saturation;
  }

  /** The lightness of this color. */
  get lightness(): number {
    this.computeHSL();
    return this.lightness;
  }
}
