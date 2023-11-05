import { html, LitElement, PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { property } from 'lit/decorators.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { litRouletteStyles } from './lit-roulette.styles';

export type Item_t = {
  id: number;
  background: string;
  textColor: string;
  htmlContent: string;
};

export class LitRoulette extends LitElement {
  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.reset();
    const wheelElement = this.renderRoot.querySelector(
      `#wheel-container-${this.randomIdRoulette} .wheel`
    ) as HTMLElement;
    wheelElement.addEventListener('transitionend', () => {
      this.processingLock = false;
      this.dispatchEvent(
        new CustomEvent('wheel-end', { detail: { message: this.itemSelected } })
      );
    });
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
  }

  @property({ type: Array<Item_t> }) items: Array<Item_t> = [
    // { id: 1, background: '#F00', textColor: '#000', htmlContent: 'Text 1' },
    // { id: 2, background: '#0F0', textColor: '#000', htmlContent: 'Text 2' },
    // { id: 3, background: '#00F', textColor: '#000', htmlContent: 'Text 3' },
    // { id: 4, background: '#FFF', textColor: '#000', htmlContent: 'Text 4' }
  ];
  @property({ type: Object }) firstItemIndex = { value: 0 };
  @property({ type: Object }) wheelResultIndex = { value: null };
  @property({ type: Boolean }) centeredIndicator = false;
  @property({ type: String }) indicatorPosition = 'top';
  @property({ type: Number }) size = 300;
  @property({ type: Boolean }) displayShadow = false;
  @property({ type: Number }) duration = 4;
  @property({ type: Number }) resultVariation = 0;
  @property({ type: String }) easing = 'ease';
  @property({ type: Boolean }) counterClockwise = false;
  @property({ type: Boolean }) horizontalContent = false;
  @property({ type: Boolean }) displayBorder = false;
  @property({ type: Boolean }) displayIndicator = true;
  @property({ type: Boolean }) baseDisplay = false;
  @property({ type: Number }) baseSize = 100;
  @property({ type: Boolean }) baseDisplayShadow = false;
  @property({ type: Boolean }) baseDisplayIndicator = false;
  @property({ type: String }) baseBackground = '';

  static styles = [litRouletteStyles];
  private containerRef: Ref<HTMLInputElement> = createRef<HTMLInputElement>();
  private randomIdRoulette = 0;
  private itemSelected: Item_t | null = null;
  private processingLock = false;

  private get itemAngle() {
    return 360 / this.items.length;
  }

  private get startingAngle() {
    if (this.centeredIndicator) {
      return (
        -1 * this.firstItemIndex.value * this.itemAngle - this.itemAngle / 2
      );
    }
    return -1 * this.firstItemIndex.value * this.itemAngle;
  }

  private get degreesVariation() {
    if (!this.resultVariation) {
      return 0;
    }
    const minDegreesVariation =
      (((this.itemAngle / 2) * this.resultVariation) / 100) * -1;
    const maxDegreesVariation =
      ((this.itemAngle / 2) * this.resultVariation) / 100;
    // Return random value between min and max degrees variation
    const num =
      Math.random() * (maxDegreesVariation - minDegreesVariation) +
      minDegreesVariation;
    return Number(num.toFixed(2));
  }

  private get counterClockWiseOperator() {
    return this.counterClockwise ? -1 : 1;
  }

  public launchWheel() {
    if (this.processingLock && this.itemSelected != null) {
      return;
    }
    this.processingLock = true;
    let wheelResult;
    if (this.wheelResultIndex.value !== null) {
      wheelResult = this.wheelResultIndex.value % this.items.length;
    } else {
      wheelResult = Math.floor(Math.random() * this.items.length + 1) - 1;
    }
    const wheelElt = this.renderRoot.querySelector(
      `#wheel-container-${this.randomIdRoulette} .wheel`
    ) as HTMLElement;
    this.itemSelected = this.items[wheelResult];
    const angle =
      this.counterClockWiseOperator * (360 * 3) +
      -wheelResult * this.itemAngle -
      this.itemAngle / 2 +
      this.degreesVariation;
    wheelElt.style.transform = `rotate(${angle}deg)`;
    this.dispatchEvent(
      new CustomEvent('wheel-start', { detail: { message: this.itemSelected } })
    );
  }

  public reset() {
    this.itemSelected = null;
    const wheelElement = this.renderRoot.querySelector(
      `#wheel-container-${this.randomIdRoulette} .wheel`
    ) as HTMLElement;
    wheelElement.style.transform = `rotate(${this.startingAngle}deg)`;
  }

  render() {
    const indicator = this.baseDisplayIndicator
      ? html` <div class="wheel-base-indicator"></div>`
      : '';

    const classMapWheelContainerID = classMap({
      'indicator-top': this.indicatorPosition === 'top',
      'indicator-right': this.indicatorPosition === 'right',
      'indicator-bottom': this.indicatorPosition === 'bottom',
      'indicator-left': this.indicatorPosition === 'left',
      'wheel-container-indicator': this.displayIndicator,
      'wheel-container-shadow': this.displayShadow,
      'wheel-container-border': this.displayBorder,
    });

    const classMapWheelBaseContainer = classMap({
      'wheel-base-container-shadow': this.baseDisplayShadow,
    });
    const styleMapWheelBaseContainer = styleMap({
      width: `${this.baseSize}px`,
      height: `${this.baseSize}px`,
      background: this.baseBackground,
    });

    const classMapWheel = classMap({
      'easing-ease': this.easing === 'ease',
      'easing-bounce': this.easing === 'bounce',
      'wheel-border': this.displayBorder,
    });
    const styleMapWheel = styleMap({
      width: `${this.size}px`,
      height: `${this.size}px`,
      transitionDuration: `${this.duration}s`,
      transform: `rotate(${this.startingAngle}deg)`,
    });

    const styleMapWheelItem = (item: Item_t, index: number) =>
      styleMap({
        transform: `rotate(${this.itemAngle * index}deg) skewY(-${
          90 - this.itemAngle
        }deg)`,
        background: item.background,
      });

    const classMapWheelItemContent = classMap({
      'horizontal-content': this.horizontalContent,
    });
    const styleMapWheelItemContent = styleMap({
      transform: `skewY(${90 - this.itemAngle}deg) rotate(${
        this.itemAngle / 2
      }deg)`,
    });
    const styleMapWheelItemTextColor = (item: Item_t) =>
      styleMap({
        color: item.textColor,
      });

    return html`
      <div
        ${ref(this.containerRef)}
        id="wheel-container-${this.randomIdRoulette}"
        class="wheel-container ${classMapWheelContainerID}"
        aria-hidden="true"
      >
        <!-- BASE WHEEL -->
        ${this.baseDisplay
          ? html` <div
              class="wheel-base-container ${classMapWheelBaseContainer}"
              style=${styleMapWheelBaseContainer}
            >
              <div class="wheel-base">
                <!-- SLOT -->
                <slot></slot>
              </div>
              ${indicator}
            </div>`
          : ''}

        <!-- WHEEL -->
        <div class="wheel ${classMapWheel}" style=${styleMapWheel}>
          ${repeat<Item_t>(
            this.items,
            item => item.id,
            (item, index) =>
              html`
                <div class="wheel-item" style=${styleMapWheelItem(item, index)}>
                  <div
                    class="content ${classMapWheelItemContent}"
                    style=${styleMapWheelItemContent}
                  >
                    <span style=${styleMapWheelItemTextColor(item)}>
                      ${unsafeHTML(item.htmlContent)}
                    </span>
                  </div>
                </div>
              `
          )}
        </div>
      </div>
    `;
  }
}
